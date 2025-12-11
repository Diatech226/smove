// file: app/api/admin/services/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, services });
  } catch (error: any) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching services",
        error: {
          code: error?.code ?? null,
          message: error?.message ?? "Unknown error",
        },
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const { name, slug, description } = (body as Record<string, unknown>) ?? {};

    if (![name, slug, description].every((value) => typeof value === "string" && value.trim().length)) {
      return NextResponse.json(
        { success: false, error: "Name, slug and description are required" },
        { status: 400 },
      );
    }

    const created = await prisma.service.create({
      data: { name, slug, description },
    });

    return NextResponse.json({ success: true, service: created }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating service:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error creating service",
        error: {
          code: error?.code ?? null,
          message: error?.message ?? "Unknown error",
        },
      },
      { status: 500 },
    );
  }
}
