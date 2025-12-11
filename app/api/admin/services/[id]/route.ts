// file: app/api/admin/services/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: { id: string };
};

export async function PUT(request: Request, { params }: Params) {
  try {
    const body = await request.json().catch(() => null);
    const { name, slug, description } = (body as Record<string, unknown>) ?? {};

    if (!params.id) {
      return NextResponse.json({ success: false, error: "Service id is required" }, { status: 400 });
    }

    if (![name, slug, description].every((value) => typeof value === "string" && value.trim().length)) {
      return NextResponse.json(
        { success: false, error: "Name, slug and description are required" },
        { status: 400 },
      );
    }

    const updated = await prisma.service.update({
      where: { id: params.id },
      data: { name, slug, description },
    });

    return NextResponse.json({ success: true, service: updated });
  } catch (error: any) {
    console.error("Error updating service", {
      code: error?.code,
      message: error?.message,
    });
    return NextResponse.json({ success: false, error: "Failed to update service" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    if (!params.id) {
      return NextResponse.json({ success: false, error: "Service id is required" }, { status: 400 });
    }
    await prisma.service.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting service", {
      code: error?.code,
      message: error?.message,
    });
    return NextResponse.json({ success: false, error: "Failed to delete service" }, { status: 500 });
  }
}
