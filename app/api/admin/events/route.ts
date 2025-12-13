// file: app/api/admin/events/route.ts
import { NextResponse } from "next/server";

import { safePrisma } from "@/lib/safePrisma";
import { eventSchema } from "@/lib/validation/admin";

export async function GET() {
  const eventsResult = await safePrisma((db) => db.event.findMany({ orderBy: { date: "desc" } }));

  if (!eventsResult.ok) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch events", detail: eventsResult.message },
      { status: 503 },
    );
  }

  return NextResponse.json({ success: true, events: eventsResult.data }, { status: 200 });
}

export async function POST(request: Request) {
  try {
    const json = await request.json().catch(() => null);
    const parsed = eventSchema.safeParse(json ?? {});

    if (!parsed.success) {
      const message = parsed.error.issues.at(0)?.message ?? "Payload invalide";
      return NextResponse.json({ success: false, error: message }, { status: 400 });
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
        return NextResponse.json({ success: false, error: "Un événement utilise déjà ce slug." }, { status: 400 });
      }
      return NextResponse.json(
        { success: false, error: "Failed to create event", detail: createdResult.message },
        { status: 503 },
      );
    }

    return NextResponse.json({ success: true, event: createdResult.data }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating event", { code: error?.code, message: error?.message });
    if (error?.code === "P2002") {
      return NextResponse.json({ success: false, error: "Un événement utilise déjà ce slug." }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "Failed to create event" }, { status: 500 });
  }
}
