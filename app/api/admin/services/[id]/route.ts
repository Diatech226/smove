// file: app/api/admin/services/[id]/route.ts
import { jsonError, jsonOk } from "@/lib/api/response";
import { createRequestId } from "@/lib/api/requestId";
import { requireAdmin } from "@/lib/admin/auth";
import { safePrisma } from "@/lib/safePrisma";
import { serviceSchema } from "@/lib/validation/admin";

type Params = {
  params: { id: string };
};

export async function PUT(request: Request, { params }: Params) {
  const authError = await requireAdmin();
  if (authError) return authError;
  const requestId = createRequestId();
  try {
    const json = await request.json().catch(() => null);
    const parsed = serviceSchema.safeParse(json ?? {});

    if (!params.id) {
      return jsonError("Service id is required", { status: 400, requestId });
    }

    if (!parsed.success) {
      const message = parsed.error.issues.at(0)?.message ?? "Payload invalide";
      return jsonError(message, { status: 400, requestId });
    }

    const { name, slug, description, category, image } = parsed.data;

    const updatedResult = await safePrisma((db) =>
      db.service.update({
        where: { id: params.id },
        data: {
          name,
          slug,
          description,
          category: typeof category === "string" ? category : null,
          image: typeof image === "string" ? image : null,
        },
      }),
    );

    if (!updatedResult.ok) {
      const error = updatedResult.error as any;
      if (error?.code === "P2002") {
        return jsonError("Un autre service utilise déjà ce slug.", { status: 400, requestId });
      }
      console.error("Database error updating service", { requestId, detail: updatedResult.message });
      return jsonError("Database unreachable", {
        status: 503,
        requestId,
        data: { detail: updatedResult.message },
      });
    }

    return jsonOk({ service: updatedResult.data }, { status: 200, requestId });
  } catch (error: any) {
    console.error("Error updating service", {
      requestId,
      code: error?.code,
      message: error?.message,
    });
    if (error?.code === "P2002") {
      return jsonError("Un autre service utilise déjà ce slug.", { status: 400, requestId });
    }
    return jsonError("Failed to update service", { status: 500, requestId });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const authError = await requireAdmin();
  if (authError) return authError;
  const requestId = createRequestId();
  try {
    if (!params.id) {
      return jsonError("Service id is required", { status: 400, requestId });
    }
    const deleteResult = await safePrisma((db) => db.service.delete({ where: { id: params.id } }));
    if (!deleteResult.ok) {
      console.error("Database error deleting service", { requestId, detail: deleteResult.message });
      return jsonError("Database unreachable", {
        status: 503,
        requestId,
        data: { detail: deleteResult.message },
      });
    }
    return jsonOk({}, { status: 200, requestId });
  } catch (error: any) {
    console.error("Error deleting service", {
      requestId,
      code: error?.code,
      message: error?.message,
    });
    return jsonError("Failed to delete service", { status: 500, requestId });
  }
}
