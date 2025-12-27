// file: app/api/admin/events/route.ts
import { createRequestId, jsonWithRequestId } from "@/lib/api/requestId";
import { safePrisma } from "@/lib/safePrisma";
import { eventSchema } from "@/lib/validation/admin";

export async function GET() {
  const requestId = createRequestId();
  const eventsResult = await safePrisma((db) => db.event.findMany({ orderBy: { date: "desc" } }));

  if (!eventsResult.ok) {
    console.error("Failed to fetch events", { requestId, detail: eventsResult.message });
    return jsonWithRequestId(
      { success: false, error: "Failed to fetch events", detail: eventsResult.message },
      { status: 503, requestId },
    );
  }

  return jsonWithRequestId({ success: true, events: eventsResult.data }, { status: 200, requestId });
}

export async function POST(request: Request) {
  const requestId = createRequestId();
  try {
    const json = await request.json().catch(() => null);
    const parsed = eventSchema.safeParse(json ?? {});

    if (!parsed.success) {
      const message = parsed.error.issues.at(0)?.message ?? "Payload invalide";
      return jsonWithRequestId({ success: false, error: message }, { status: 400, requestId });
    }

    const { slug, title, date, location, description, category, coverImage } = parsed.data;
    const parsedDate = date instanceof Date ? date : new Date(date);

    const createdResult = await safePrisma((db) =>
      db.event.create({
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

    if (!createdResult.ok) {
      const error = (createdResult.error as any) ?? {};
      if (error?.code === "P2002") {
        return jsonWithRequestId(
          { success: false, error: "Un événement utilise déjà ce slug." },
          { status: 400, requestId },
        );
      }
      return jsonWithRequestId(
        { success: false, error: "Failed to create event", detail: createdResult.message },
        { status: 503, requestId },
      );
    }

    return jsonWithRequestId({ success: true, event: createdResult.data }, { status: 201, requestId });
  } catch (error: any) {
    console.error("Error creating event", { code: error?.code, message: error?.message });
    if (error?.code === "P2002") {
      return jsonWithRequestId(
        { success: false, error: "Un événement utilise déjà ce slug." },
        { status: 400, requestId },
      );
    }
    return jsonWithRequestId({ success: false, error: "Failed to create event" }, { status: 500, requestId });
  }
}
