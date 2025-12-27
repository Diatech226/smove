import { createRequestId, jsonWithRequestId } from "@/lib/api/requestId";
import { safePrisma } from "@/lib/safePrisma";
import { eventSchema } from "@/lib/validation/admin";

type Params = { params: { id: string } };

export async function PUT(request: Request, { params }: Params) {
  const requestId = createRequestId();
  try {
    const json = await request.json().catch(() => null);
    const parsed = eventSchema.safeParse(json ?? {});

    if (!params.id) {
      return jsonWithRequestId({ success: false, error: "Event id is required" }, { status: 400, requestId });
    }

    if (!parsed.success) {
      const message = parsed.error.issues.at(0)?.message ?? "Payload invalide";
      return jsonWithRequestId({ success: false, error: message }, { status: 400, requestId });
    }

    const { slug, title, date, location, description, category, coverImage } = parsed.data;
    const parsedDate = date instanceof Date ? date : new Date(date);

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
          coverImage: typeof coverImage === "string" ? coverImage : null,
        },
      }),
    );

    if (!updatedResult.ok) {
      if ((updatedResult.error as any)?.code === "P2002") {
        return jsonWithRequestId(
          { success: false, error: "Un autre événement utilise déjà ce slug." },
          { status: 400, requestId },
        );
      }
      return jsonWithRequestId(
        { success: false, error: "Failed to update event", detail: updatedResult.message },
        { status: 503, requestId },
      );
    }

    return jsonWithRequestId({ success: true, event: updatedResult.data }, { status: 200, requestId });
  } catch (error: any) {
    console.error("Error updating event", { requestId, code: error?.code, message: error?.message });
    if (error?.code === "P2002") {
      return jsonWithRequestId(
        { success: false, error: "Un autre événement utilise déjà ce slug." },
        { status: 400, requestId },
      );
    }
    return jsonWithRequestId({ success: false, error: "Failed to update event" }, { status: 500, requestId });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const requestId = createRequestId();
  try {
    if (!params.id) {
      return jsonWithRequestId({ success: false, error: "Event id is required" }, { status: 400, requestId });
    }
    const deleteResult = await safePrisma((db) => db.event.delete({ where: { id: params.id } }));
    if (!deleteResult.ok) {
      return jsonWithRequestId(
        { success: false, error: "Failed to delete event", detail: deleteResult.message },
        { status: 503, requestId },
      );
    }
    return jsonWithRequestId({ success: true }, { status: 200, requestId });
  } catch (error: any) {
    console.error("Error deleting event", { requestId, code: error?.code, message: error?.message });
    return jsonWithRequestId({ success: false, error: "Failed to delete event" }, { status: 500, requestId });
  }
}
