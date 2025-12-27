import { createRequestId, jsonWithRequestId } from "@/lib/api/requestId";
import { safePrisma } from "@/lib/safePrisma";
import { taxonomySchema } from "@/lib/validation/admin";

export async function GET(request: Request) {
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
    return jsonWithRequestId({ success: false, error: "Type de taxonomie invalide" }, { status: 400, requestId });
  }

  const filter = type ? { where: { type } } : undefined;

  const taxonomiesResult = await safePrisma((db) =>
    db.taxonomy.findMany({
      ...(filter ?? {}),
      orderBy: { order: "asc" },
    }),
  );

  if (!taxonomiesResult.ok) {
    return jsonWithRequestId(
      { success: false, error: "Database unreachable", detail: taxonomiesResult.message },
      { status: 503, requestId },
    );
  }

  return jsonWithRequestId({ success: true, taxonomies: taxonomiesResult.data }, { status: 200, requestId });
}

export async function POST(request: Request) {
  const requestId = createRequestId();
  const json = await request.json().catch(() => null);
  const parsed = taxonomySchema.safeParse(json ?? {});

  if (!parsed.success) {
    const message = parsed.error.issues.at(0)?.message ?? "Payload invalide";
    return jsonWithRequestId({ success: false, error: message }, { status: 400, requestId });
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
      return jsonWithRequestId(
        { success: false, error: "Une taxonomie avec ce slug existe déjà pour ce type." },
        { status: 400, requestId },
      );
    }
    return jsonWithRequestId(
      { success: false, error: "Database unreachable", detail: createdResult.message },
      { status: 503, requestId },
    );
  }

  return jsonWithRequestId({ success: true, taxonomy: createdResult.data }, { status: 201, requestId });
}
