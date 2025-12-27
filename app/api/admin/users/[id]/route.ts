import { jsonError, jsonOk } from "@/lib/api/response";
import { createRequestId } from "@/lib/api/requestId";
import { requireAdmin } from "@/lib/admin/auth";
import { safePrisma } from "@/lib/safePrisma";
import { userUpdateSchema } from "@/lib/validation/admin";

type Params = {
  params: { id: string };
};

export async function GET(_request: Request, { params }: Params) {
  const authError = requireAdmin();
  if (authError) return authError;
  const requestId = createRequestId();

  try {
    if (!params.id) {
      return jsonError("User id is required", { status: 400, requestId });
    }

    const userResult = await safePrisma((db) =>
      db.user.findUnique({
        where: { id: params.id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          lastLoginAt: true,
        },
      }),
    );

    if (!userResult.ok) {
      console.error("Failed to fetch user", { requestId, detail: userResult.message });
      return jsonError("Failed to fetch user", { status: 503, requestId });
    }

    if (!userResult.data) {
      return jsonError("User not found", { status: 404, requestId });
    }

    return jsonOk({ user: userResult.data }, { status: 200, requestId });
  } catch (error: any) {
    console.error("Error fetching user", {
      requestId,
      code: error?.code,
      message: error?.message,
    });
    return jsonError("Failed to fetch user", { status: 500, requestId });
  }
}

export async function PATCH(request: Request, { params }: Params) {
  const authError = requireAdmin();
  if (authError) return authError;
  const requestId = createRequestId();

  try {
    if (!params.id) {
      return jsonError("User id is required", { status: 400, requestId });
    }

    const json = await request.json().catch(() => null);
    const parsed = userUpdateSchema.safeParse(json ?? {});

    if (!parsed.success) {
      const message = parsed.error.issues.at(0)?.message ?? "Payload invalide";
      return jsonError(message, { status: 400, requestId });
    }

    const payload = parsed.data;
    if (!Object.keys(payload).length) {
      return jsonError("Aucune donnée à mettre à jour.", { status: 400, requestId });
    }

    const existingResult = await safePrisma((db) => db.user.findUnique({ where: { id: params.id } }));
    if (!existingResult.ok) {
      console.error("Failed to validate user update", { requestId, detail: existingResult.message });
      return jsonError("Failed to update user", { status: 503, requestId });
    }
    if (!existingResult.data) {
      return jsonError("User not found", { status: 404, requestId });
    }

    const data = {
      email: payload.email ? payload.email.trim().toLowerCase() : undefined,
      name: payload.name === null ? null : payload.name?.trim(),
      role: payload.role,
      status: payload.status,
    };

    const updatedResult = await safePrisma((db) =>
      db.user.update({
        where: { id: params.id },
        data,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          lastLoginAt: true,
        },
      }),
    );

    if (!updatedResult.ok) {
      const error = updatedResult.error as any;
      if (error?.code === "P2002") {
        return jsonError("Un utilisateur utilise déjà cet email.", { status: 400, requestId });
      }
      console.error("Failed to update user", { requestId, detail: updatedResult.message });
      return jsonError("Failed to update user", { status: 503, requestId });
    }

    return jsonOk({ user: updatedResult.data }, { status: 200, requestId });
  } catch (error: any) {
    console.error("Error updating user", {
      requestId,
      code: error?.code,
      message: error?.message,
    });
    return jsonError("Failed to update user", { status: 500, requestId });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const authError = requireAdmin();
  if (authError) return authError;
  const requestId = createRequestId();

  try {
    if (!params.id) {
      return jsonError("User id is required", { status: 400, requestId });
    }

    const existingResult = await safePrisma((db) => db.user.findUnique({ where: { id: params.id } }));
    if (!existingResult.ok) {
      console.error("Failed to validate user deletion", { requestId, detail: existingResult.message });
      return jsonError("Failed to delete user", { status: 503, requestId });
    }
    if (!existingResult.data) {
      return jsonError("User not found", { status: 404, requestId });
    }

    const deleteResult = await safePrisma((db) => db.user.delete({ where: { id: params.id } }));
    if (!deleteResult.ok) {
      console.error("Failed to delete user", { requestId, detail: deleteResult.message });
      return jsonError("Failed to delete user", { status: 503, requestId });
    }

    return jsonOk({}, { status: 200, requestId });
  } catch (error: any) {
    console.error("Error deleting user", {
      requestId,
      code: error?.code,
      message: error?.message,
    });
    return jsonError("Failed to delete user", { status: 500, requestId });
  }
}
