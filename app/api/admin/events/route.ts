// file: app/api/admin/events/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const events = await prisma.event.findMany({ orderBy: { date: "desc" } });
    return NextResponse.json({ success: true, events }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching events", { code: error?.code, message: error?.message });
    return NextResponse.json({ success: false, error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const { slug, title, date, location, description, category, coverImage } = (body as Record<string, unknown>) ?? {};

    if (![slug, title, date].every((value) => typeof value === "string" && value.trim().length)) {
      return NextResponse.json({ success: false, error: "Slug, titre et date sont requis." }, { status: 400 });
    }

    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) {
      return NextResponse.json({ success: false, error: "Date invalide." }, { status: 400 });
    }

    const created = await prisma.event.create({
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

    return NextResponse.json({ success: true, event: created }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating event", { code: error?.code, message: error?.message });
    if (error?.code === "P2002") {
      return NextResponse.json({ success: false, error: "Un événement utilise déjà ce slug." }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "Failed to create event" }, { status: 500 });
  }
}
