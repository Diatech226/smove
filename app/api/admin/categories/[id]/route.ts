import { jsonError, jsonOk } from "@/lib/api/response";
import { createRequestId } from "@/lib/api/requestId";
import { requireAdmin } from "@/lib/admin/auth";
import { safePrisma } from "@/lib/safePrisma";
import { categorySchema } from "@/lib/validation/admin";

type Params = {
  params: { id: string };
};

export async function PATCH(request: Request, { params }: Params) {
  const authError = requireAdmin();
  if (authError) return authError;
  const requestId = createRequestId();

  const json = await request.json().catch(() => null);
  const parsed = categorySchema.partial().safeParse(json ?? {});

  if (!parsed.success) {
    const message = parsed.error.issues.at(0)?.message ?? "Payload invalide";
    return jsonError(message, { status: 400, requestId });
  }

  if (!params.id) {
    return jsonError("Category id is required", { status: 400, requestId });
  }

  const updatedResult = await safePrisma((db) =>
    db.category.update({
      where: { id: params.id },
      data: parsed.data,
    }),
  );

  if (!updatedResult.ok) {
    const error = updatedResult.error as any;
    const message = error?.code === "P2002" ? "Une catégorie avec ce slug existe déjà pour ce type." : "Database unreachable";
    console.error("Failed to update category", { requestId, detail: updatedResult.message });
    return jsonError(message, {
      status: error?.code === "P2002" ? 400 : 503,
      requestId,
      data: { detail: updatedResult.message },
    });
  }

  return jsonOk({ category: updatedResult.data }, { status: 200, requestId });
}

export async function DELETE(_request: Request, { params }: Params) {
  const authError = requireAdmin();
  if (authError) return authError;
  const requestId = createRequestId();

  if (!params.id) {
    return jsonError("Category id is required", { status: 400, requestId });
  }

  const deleteResult = await safePrisma((db) => db.category.delete({ where: { id: params.id } }));

  if (!deleteResult.ok) {
    console.error("Failed to delete category", { requestId, detail: deleteResult.message });
    return jsonError("Database unreachable", {
      status: 503,
      requestId,
      data: { detail: deleteResult.message },
    });
  }

  return jsonOk({ category: deleteResult.data }, { status: 200, requestId });
}
