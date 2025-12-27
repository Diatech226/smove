import { jsonError, jsonOk } from "@/lib/api/response";
import { createRequestId } from "@/lib/api/requestId";
import { requireAdmin } from "@/lib/admin/auth";
import { safePrisma } from "@/lib/safePrisma";
import { taxonomySchema } from "@/lib/validation/admin";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const authError = await requireAdmin();
  if (authError) return authError;
  const requestId = createRequestId();
  const json = await request.json().catch(() => null);
  const parsed = taxonomySchema.safeParse(json ?? {});

  if (!parsed.success) {
    const message = parsed.error.issues.at(0)?.message ?? "Payload invalide";
    return jsonError(message, { status: 400, requestId });
  }

  const updateResult = await safePrisma((db) =>
    db.taxonomy.update({
      where: { id: params.id },
      data: parsed.data,
    }),
  );

  if (!updateResult.ok) {
    const error = (updateResult.error as any) ?? {};
    if (error?.code === "P2025") {
      return jsonError("Taxonomie introuvable.", { status: 404, requestId });
    }
    if (error?.code === "P2002") {
      return jsonError("Une taxonomie avec ce slug existe déjà pour ce type.", { status: 400, requestId });
    }
    return jsonError("Database unreachable", {
      status: 503,
      requestId,
      data: { detail: updateResult.message },
    });
  }

  return jsonOk({ taxonomy: updateResult.data }, { status: 200, requestId });
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const authError = await requireAdmin();
  if (authError) return authError;
  const requestId = createRequestId();
  const deleteResult = await safePrisma((db) => db.taxonomy.delete({ where: { id: params.id } }));

  if (!deleteResult.ok) {
    const error = (deleteResult.error as any) ?? {};
    if (error?.code === "P2025") {
      return jsonError("Taxonomie introuvable.", { status: 404, requestId });
    }
    return jsonError("Database unreachable", {
      status: 503,
      requestId,
      data: { detail: deleteResult.message },
    });
  }

  return jsonOk({ taxonomy: deleteResult.data }, { status: 200, requestId });
}
