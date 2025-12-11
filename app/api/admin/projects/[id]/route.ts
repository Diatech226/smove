// file: app/api/admin/projects/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: { id: string };
};

export async function PUT(request: Request, { params }: Params) {
  try {
    const body = await request.json().catch(() => null);
    const { slug, title, client, sector, summary, body: content, results } = (body as Record<string, unknown>) ?? {};

    if (!params.id) {
      return NextResponse.json({ success: false, error: "Project id is required" }, { status: 400 });
    }

    const requiredFields = [slug, title, client, sector, summary];

    if (!requiredFields.every((value) => typeof value === "string" && value.trim().length)) {
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
        results: Array.isArray(results)
          ? results.map((item) => (typeof item === "string" ? item : String(item))).filter(Boolean)
          : [],
      },
    });

    return NextResponse.json({ success: true, project: updated });
  } catch (error: any) {
    console.error("Error updating project", {
      code: error?.code,
      message: error?.message,
    });
    return NextResponse.json({ success: false, error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    if (!params.id) {
      return NextResponse.json({ success: false, error: "Project id is required" }, { status: 400 });
    }
    await prisma.project.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting project", {
      code: error?.code,
      message: error?.message,
    });
    return NextResponse.json({ success: false, error: "Failed to delete project" }, { status: 500 });
  }
}
