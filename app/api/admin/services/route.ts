// file: app/api/admin/services/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, services }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching services", {
      code: error?.code,
      message: error?.message,
    });
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch services",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const { name, slug, description, category, image } = (body as Record<string, unknown>) ?? {};

    if (![name, slug, description].every((value) => typeof value === "string" && value.trim().length)) {
      return NextResponse.json({ success: false, error: "Name, slug and description are required" }, { status: 400 });
    }

    const created = await prisma.service.create({
      data: {
        name,
        slug,
        description,
        category: typeof category === "string" ? category : null,
        image: typeof image === "string" ? image : null,
      },
    });

    return NextResponse.json({ success: true, service: created }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating service", {
      code: error?.code,
      message: error?.message,
    });
    if (error?.code === "P2002") {
      return NextResponse.json({ success: false, error: "Un service utilise déjà ce slug." }, { status: 400 });
    }
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create service",
      },
      { status: 500 },
    );
  }
}
