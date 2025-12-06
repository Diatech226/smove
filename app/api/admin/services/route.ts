// file: app/api/admin/services/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: services });
  } catch (error) {
    console.error("Error fetching services", error);
    return NextResponse.json({ success: false, error: "Unable to fetch services" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug, description } = body ?? {};

    if (!name || !slug || !description) {
      return NextResponse.json(
        { success: false, error: "Name, slug and description are required" },
        { status: 400 },
      );
    }

    const created = await prisma.service.create({
      data: { name, slug, description },
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error("Error creating service", error);
    return NextResponse.json({ success: false, error: "Unable to create service" }, { status: 500 });
  }
}
