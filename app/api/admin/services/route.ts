// file: app/api/admin/services/route.ts
import { jsonError, jsonOk } from "@/lib/api/response";
import { createRequestId } from "@/lib/api/requestId";
import { requireAdmin } from "@/lib/admin/auth";
import { safePrisma } from "@/lib/safePrisma";
import { serviceSchema } from "@/lib/validation/admin";

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

  const [servicesResult, countResult] = await Promise.all([
    safePrisma((db) =>
      db.service.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          category: true,
          image: true,
        },
      }),
    ),
    safePrisma((db) => db.service.count()),
  ]);

  if (!servicesResult.ok || !countResult.ok) {
    console.error("Failed to fetch services", {
      requestId,
      detail: servicesResult.ok ? countResult.message : servicesResult.message,
    });
    return jsonError("Database unreachable", {
      status: 503,
      requestId,
      data: { detail: servicesResult.ok ? countResult.message : servicesResult.message },
    });
  }

  const total = countResult.data;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return jsonOk({ services: servicesResult.data, page, total, totalPages, limit }, { status: 200, requestId });
}

export async function POST(request: Request) {
  const authError = await requireAdmin();
  if (authError) return authError;
  const requestId = createRequestId();
  try {
    const json = await request.json().catch(() => null);
    const parsed = serviceSchema.safeParse(json ?? {});

    if (!parsed.success) {
      const message = parsed.error.issues.at(0)?.message ?? "Payload invalide";
      return jsonError(message, { status: 400, requestId });
    }

    const { name, slug, description, category, image } = parsed.data;

    const createdResult = await safePrisma((db) =>
      db.service.create({
        data: {
          name,
          slug,
          description,
          category: typeof category === "string" ? category : null,
          image: typeof image === "string" ? image : null,
        },
      }),
    );

    if (!createdResult.ok) {
      const error = (createdResult.error as any) ?? {};
      if (error?.code === "P2002") {
        return jsonError("Un service utilise déjà ce slug.", { status: 400, requestId });
      }
      return jsonError("Database unreachable", {
        status: 503,
        requestId,
        data: { detail: createdResult.message },
      });
    }

    return jsonOk({ service: createdResult.data }, { status: 201, requestId });
  } catch (error: any) {
    console.error("Error creating service", {
      code: error?.code,
      message: error?.message,
    });
    return jsonError("Failed to create service", { status: 500, requestId });
  }
}
