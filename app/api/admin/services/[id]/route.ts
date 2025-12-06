// file: app/api/admin/services/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: { id: string };
};

export async function PUT(request: Request, { params }: Params) {
  try {
    const body = await request.json();
    const { name, slug, description } = body ?? {};

    if (!name || !slug || !description) {
      return NextResponse.json(
        { success: false, error: "Name, slug and description are required" },
        { status: 400 },
      );
    }

    const updated = await prisma.service.update({
      where: { id: params.id },
      data: { name, slug, description },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating service", error);
    return NextResponse.json({ success: false, error: "Unable to update service" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    await prisma.service.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting service", error);
    return NextResponse.json({ success: false, error: "Unable to delete service" }, { status: 500 });
  }
}
