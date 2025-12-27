// file: app/api/admin/projects/route.ts
import { createRequestId, jsonWithRequestId } from "@/lib/api/requestId";
import { safePrisma } from "@/lib/safePrisma";
import { projectSchema } from "@/lib/validation/admin";

export async function GET(request: Request) {
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
        select: {
          id: true,
          slug: true,
          title: true,
          client: true,
          sector: true,
          summary: true,
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
    return jsonWithRequestId(
      { success: false, error: "Failed to fetch projects", detail: projectsResult.ok ? countResult.message : projectsResult.message },
      { status: 503, requestId },
    );
  }

  const total = countResult.data;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return jsonWithRequestId(
    { success: true, projects: projectsResult.data, page, total, totalPages, limit },
    { status: 200, requestId },
  );
}

export async function POST(request: Request) {
  try {
    const json = await request.json().catch(() => null);
    const parsed = projectSchema.safeParse(json ?? {});

    if (!parsed.success) {
      const message = parsed.error.issues.at(0)?.message ?? "Payload invalide";
      return jsonWithRequestId({ success: false, error: message }, { status: 400 });
    }

    const { slug, title, client, sector, summary, body: content, results, category, coverImage } = parsed.data;

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
          coverImage: typeof coverImage === "string" ? coverImage : null,
        },
      }),
    );

    if (!createdResult.ok) {
      const error = createdResult.error as any;
      if (error?.code === "P2002") {
        return jsonWithRequestId({ success: false, error: "Un projet utilise déjà ce slug." }, { status: 400 });
      }
      return jsonWithRequestId({ success: false, error: "Failed to create project" }, { status: 503 });
    }

    return jsonWithRequestId({ success: true, project: createdResult.data }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating project", {
      code: error?.code,
      message: error?.message,
    });
    return jsonWithRequestId(
      {
        success: false,
        error: "Failed to create project",
      },
      { status: 500 },
    );
  }
}
