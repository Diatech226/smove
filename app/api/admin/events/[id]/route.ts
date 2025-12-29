import { jsonError, jsonOk } from "@/lib/api/response";
import { createRequestId } from "@/lib/api/requestId";
import { requireAdmin } from "@/lib/admin/auth";
import { findAvailableSlug } from "@/lib/admin/slug";
import { safePrisma } from "@/lib/safePrisma";
import { contentStatusSchema, eventSchema } from "@/lib/validation/admin";

type Params = { params: { id: string } };

export async function PUT(request: Request, { params }: Params) {
  const authError = await requireAdmin();
  if (authError) return authError;
  const requestId = createRequestId();
  try {
    const json = await request.json().catch(() => null);
    const parsed = eventSchema.safeParse(json ?? {});

    if (!params.id) {
      return jsonError("Event id is required", { status: 400, requestId });
    }

    if (!parsed.success) {
      const message = parsed.error.issues.at(0)?.message ?? "Payload invalide";
      return jsonError(message, { status: 400, requestId });
    }

    const { slug, title, date, location, description, category, coverMediaId, status } = parsed.data;
    const parsedDate = date instanceof Date ? date : new Date(date);

    const existingResult = await safePrisma((db) => db.event.findUnique({ where: { slug }, select: { id: true } }));
    if (!existingResult.ok) {
      console.error("Failed to validate event slug", { requestId, detail: existingResult.message });
      return jsonError("Database unreachable", {
        status: 503,
        requestId,
        data: { detail: existingResult.message },
      });
    }

    if (existingResult.data && existingResult.data.id !== params.id) {
      const suggestion = await findAvailableSlug("event", slug, params.id);
      return jsonError("Un autre événement utilise déjà ce slug.", {
        status: 400,
        requestId,
        data: { suggestedSlug: suggestion },
      });
    }

    const updatedResult = await safePrisma((db) =>
      db.event.update({
        where: { id: params.id },
        data: {
          slug,
          title,
          date: parsedDate,
          location: typeof location === "string" ? location : null,
          description: typeof description === "string" ? description : null,
          category: typeof category === "string" ? category : null,
          coverMediaId,
          status: status ?? "published",
        },
      }),
    );

    if (!updatedResult.ok) {
      if ((updatedResult.error as any)?.code === "P2002") {
        const suggestion = await findAvailableSlug("event", slug, params.id);
        return jsonError("Un autre événement utilise déjà ce slug.", {
          status: 400,
          requestId,
          data: { suggestedSlug: suggestion },
        });
      }
      return jsonError("Failed to update event", {
        status: 503,
        requestId,
        data: { detail: updatedResult.message },
      });
    }

    return jsonOk({ event: updatedResult.data }, { status: 200, requestId });
  } catch (error: any) {
    console.error("Error updating event", { requestId, code: error?.code, message: error?.message });
    if (error?.code === "P2002") {
      return jsonError("Un autre événement utilise déjà ce slug.", { status: 400, requestId });
    }
    return jsonError("Failed to update event", { status: 500, requestId });
  }
}

export async function PATCH(request: Request, { params }: Params) {
  const authError = await requireAdmin();
  if (authError) return authError;
  const requestId = createRequestId();
  try {
    if (!params.id) {
      return jsonError("Event id is required", { status: 400, requestId });
    }
    const json = await request.json().catch(() => null);
    const parsed = contentStatusSchema.safeParse(json?.status);
    if (!parsed.success) {
      const message = parsed.error.issues.at(0)?.message ?? "Statut invalide";
      return jsonError(message, { status: 400, requestId });
    }

    const updatedResult = await safePrisma((db) =>
      db.event.update({
        where: { id: params.id },
        data: { status: parsed.data },
      }),
    );

    if (!updatedResult.ok) {
      return jsonError("Database unreachable", {
        status: 503,
        requestId,
        data: { detail: updatedResult.message },
      });
    }

    return jsonOk({ event: updatedResult.data }, { status: 200, requestId });
  } catch (error: any) {
    console.error("Error updating event status", { requestId, message: error?.message });
    return jsonError("Failed to update event status", { status: 500, requestId });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const authError = await requireAdmin();
  if (authError) return authError;
  const requestId = createRequestId();
  try {
    if (!params.id) {
      return jsonError("Event id is required", { status: 400, requestId });
    }
    const deleteResult = await safePrisma((db) => db.event.delete({ where: { id: params.id } }));
    if (!deleteResult.ok) {
      return jsonError("Failed to delete event", {
        status: 503,
        requestId,
        data: { detail: deleteResult.message },
      });
    }
    return jsonOk({}, { status: 200, requestId });
  } catch (error: any) {
    console.error("Error deleting event", { requestId, code: error?.code, message: error?.message });
    return jsonError("Failed to delete event", { status: 500, requestId });
  }
}
