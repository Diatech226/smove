import { jsonError, jsonOk } from "@/lib/api/response";
import { createRequestId } from "@/lib/api/requestId";
import { requireAdmin } from "@/lib/admin/auth";
import { safePrisma } from "@/lib/safePrisma";
import { taxonomySchema } from "@/lib/validation/admin";

export async function GET(request: Request) {
  const authError = requireAdmin();
  if (authError) return authError;
  const requestId = createRequestId();
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") ?? undefined;

  const allowedTypes = [
    "service_sector",
    "service_category",
    "project_sector",
    "project_category",
    "post_category",
  ] as const;

  if (type && !allowedTypes.includes(type as (typeof allowedTypes)[number])) {
    return jsonError("Type de taxonomie invalide", { status: 400, requestId });
  }

  const filter = type ? { where: { type } } : undefined;

  const taxonomiesResult = await safePrisma((db) =>
    db.taxonomy.findMany({
      ...(filter ?? {}),
      orderBy: { order: "asc" },
    }),
  );

  if (!taxonomiesResult.ok) {
    return jsonError("Database unreachable", {
      status: 503,
      requestId,
      data: { detail: taxonomiesResult.message },
    });
  }

  return jsonOk({ taxonomies: taxonomiesResult.data }, { status: 200, requestId });
}

export async function POST(request: Request) {
  const authError = requireAdmin();
  if (authError) return authError;
  const requestId = createRequestId();
  const json = await request.json().catch(() => null);
  const parsed = taxonomySchema.safeParse(json ?? {});

  if (!parsed.success) {
    const message = parsed.error.issues.at(0)?.message ?? "Payload invalide";
    return jsonError(message, { status: 400, requestId });
  }

  const { type, slug, label, order, active } = parsed.data;

  const createdResult = await safePrisma((db) =>
    db.taxonomy.create({
      data: { type, slug, label, order: order ?? 0, active: active ?? true },
    }),
  );

  if (!createdResult.ok) {
    const error = (createdResult.error as any) ?? {};
    if (error?.code === "P2002") {
      return jsonError("Une taxonomie avec ce slug existe déjà pour ce type.", { status: 400, requestId });
    }
    return jsonError("Database unreachable", {
      status: 503,
      requestId,
      data: { detail: createdResult.message },
    });
  }

  return jsonOk({ taxonomy: createdResult.data }, { status: 201, requestId });
}
