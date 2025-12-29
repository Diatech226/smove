// file: app/api/admin/projects/route.ts
import { jsonError, jsonOk } from "@/lib/api/response";
import { createRequestId } from "@/lib/api/requestId";
import { requireAdmin } from "@/lib/admin/auth";
import { findAvailableSlug } from "@/lib/admin/slug";
import { safePrisma } from "@/lib/safePrisma";
import { projectSchema } from "@/lib/validation/admin";

export async function GET(request: Request) {
  const authError = await requireAdmin();
  if (authError) return authError;
  const requestId = createRequestId();
  const url = new URL(request.url);
  const rawPage = Number(url.searchParams.get("page") ?? "1");
  const rawLimit = Number(url.searchParams.get("limit") ?? "12");
  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;
  const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? Math.min(50, rawLimit) : 12;
  const skip = (page - 1) * limit;

  const [projectsResult, countResult] = await Promise.all([
    safePrisma((db) =>
      db.project.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          cover: true,
        },
      }),
    ),
    safePrisma((db) => db.project.count()),
  ]);

  if (!projectsResult.ok || !countResult.ok) {
    console.error("Failed to fetch projects", {
      requestId,
      detail: projectsResult.ok ? countResult.message : projectsResult.message,
    });
    return jsonError("Failed to fetch projects", {
      status: 503,
      requestId,
      data: { detail: projectsResult.ok ? countResult.message : projectsResult.message },
    });
  }

  const total = countResult.data;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return jsonOk({ projects: projectsResult.data, page, total, totalPages, limit }, { status: 200, requestId });
}

export async function POST(request: Request) {
  const authError = await requireAdmin();
  if (authError) return authError;
  const requestId = createRequestId();
  try {
    const json = await request.json().catch(() => null);
    const parsed = projectSchema.safeParse(json ?? {});

    if (!parsed.success) {
      const message = parsed.error.issues.at(0)?.message ?? "Payload invalide";
      return jsonError(message, { status: 400, requestId });
    }

    const { slug, title, client, sector, summary, body: content, results, category, coverMediaId } = parsed.data;

    const existingResult = await safePrisma((db) => db.project.findUnique({ where: { slug }, select: { id: true } }));
    if (!existingResult.ok) {
      console.error("Failed to validate project slug", { requestId, detail: existingResult.message });
      return jsonError("Database unreachable", {
        status: 503,
        requestId,
        data: { detail: existingResult.message },
      });
    }

    if (existingResult.data) {
      const suggestion = await findAvailableSlug("project", slug);
      return jsonError("Un projet utilise déjà ce slug.", {
        status: 400,
        requestId,
        data: { suggestedSlug: suggestion },
      });
    }

    const createdResult = await safePrisma((db) =>
      db.project.create({
        data: {
          slug,
          title,
          client,
          sector,
          summary,
          body: content ?? null,
          results: Array.isArray(results)
            ? results.map((item) => (typeof item === "string" ? item : String(item))).filter(Boolean)
            : [],
          category: typeof category === "string" ? category : null,
          coverMediaId,
        },
      }),
    );

    if (!createdResult.ok) {
      const error = createdResult.error as any;
      if (error?.code === "P2002") {
        const suggestion = await findAvailableSlug("project", slug);
        return jsonError("Un projet utilise déjà ce slug.", {
          status: 400,
          requestId,
          data: { suggestedSlug: suggestion },
        });
      }
      return jsonError("Failed to create project", { status: 503, requestId });
    }

    return jsonOk({ project: createdResult.data }, { status: 201, requestId });
  } catch (error: any) {
    console.error("Error creating project", {
      code: error?.code,
      message: error?.message,
    });
    return jsonError("Failed to create project", { status: 500, requestId });
  }
}
