// file: app/api/admin/projects/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: { id: string };
};

export async function PUT(request: Request, { params }: Params) {
  try {
    const body = await request.json();
    const { slug, title, client, sector, summary, body: content, results } = body ?? {};

    if (!slug || !title || !client || !sector || !summary) {
      return NextResponse.json(
        { success: false, error: "Slug, title, client, sector and summary are required" },
        { status: 400 },
      );
    }

    const updated = await prisma.project.update({
      where: { id: params.id },
      data: {
        slug,
        title,
        client,
        sector,
        summary,
        body: content ?? null,
        results: Array.isArray(results) ? results : [],
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating project", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    await prisma.project.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting project", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
