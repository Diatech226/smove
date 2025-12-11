// file: app/api/admin/events/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: { id: string } };

export async function PUT(request: Request, { params }: Params) {
  try {
    const body = await request.json().catch(() => null);
    const { slug, title, date, location, description, category, coverImage } = (body as Record<string, unknown>) ?? {};

    if (!params.id) {
      return NextResponse.json({ success: false, error: "Event id is required" }, { status: 400 });
    }

    if (![slug, title, date].every((value) => typeof value === "string" && value.trim().length)) {
      return NextResponse.json({ success: false, error: "Slug, titre et date sont requis." }, { status: 400 });
    }

    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) {
      return NextResponse.json({ success: false, error: "Date invalide." }, { status: 400 });
    }

    const updated = await prisma.event.update({
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
    });

    return NextResponse.json({ success: true, event: updated });
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
    await prisma.event.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting event", { code: error?.code, message: error?.message });
    return NextResponse.json({ success: false, error: "Failed to delete event" }, { status: 500 });
  }
}
