// file: app/api/admin/events/[id]/route.ts
import { NextResponse } from "next/server";

import { safePrisma } from "@/lib/safePrisma";
import { eventSchema } from "@/lib/validation/admin";

type Params = { params: { id: string } };

export async function PUT(request: Request, { params }: Params) {
  try {
    const json = await request.json().catch(() => null);
    const parsed = eventSchema.safeParse(json ?? {});

    if (!params.id) {
      return NextResponse.json({ success: false, error: "Event id is required" }, { status: 400 });
    }

    if (!parsed.success) {
      const message = parsed.error.issues.at(0)?.message ?? "Payload invalide";
      return NextResponse.json({ success: false, error: message }, { status: 400 });
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
        return NextResponse.json({ success: false, error: "Un autre événement utilise déjà ce slug." }, { status: 400 });
      }
      return NextResponse.json(
        { success: false, error: "Failed to update event", detail: updatedResult.message },
        { status: 503 },
      );
    }

    return NextResponse.json({ success: true, event: updatedResult.data });
  } catch (error: any) {
    console.error("Error updating event", { code: error?.code, message: error?.message });
    if (error?.code === "P2002") {
      return NextResponse.json({ success: false, error: "Un autre événement utilise déjà ce slug." }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "Failed to update event" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    if (!params.id) {
      return NextResponse.json({ success: false, error: "Event id is required" }, { status: 400 });
    }
    const deleteResult = await safePrisma((db) => db.event.delete({ where: { id: params.id } }));
    if (!deleteResult.ok) {
      return NextResponse.json(
        { success: false, error: "Failed to delete event", detail: deleteResult.message },
        { status: 503 },
      );
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting event", { code: error?.code, message: error?.message });
    return NextResponse.json({ success: false, error: "Failed to delete event" }, { status: 500 });
  }
}
