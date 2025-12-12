// file: app/api/admin/projects/[id]/route.ts
import { NextResponse } from "next/server";
import { safePrisma } from "@/lib/prisma";

type Params = {
  params: { id: string };
};

export async function PUT(request: Request, { params }: Params) {
  try {
    const body = await request.json().catch(() => null);
    const { slug, title, client, sector, summary, body: content, results, category, coverImage } =
      (body as Record<string, unknown>) ?? {};

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

    const updatedResult = await safePrisma((db) =>
      db.project.update({
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
          category: typeof category === "string" ? category : null,
          coverImage: typeof coverImage === "string" ? coverImage : null,
        },
      }),
    );

    if (!updatedResult.ok) {
      const error = updatedResult.error as any;
      if (error?.code === "P2002") {
        return NextResponse.json({ success: false, error: "Un autre projet utilise déjà ce slug." }, { status: 400 });
      }
      return NextResponse.json({ success: false, error: "Failed to update project" }, { status: 503 });
    }

    return NextResponse.json({ success: true, project: updatedResult.data });
  } catch (error: any) {
    console.error("Error updating project", {
      code: error?.code,
      message: error?.message,
    });
    if (error?.code === "P2002") {
      return NextResponse.json({ success: false, error: "Un autre projet utilise déjà ce slug." }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    if (!params.id) {
      return NextResponse.json({ success: false, error: "Project id is required" }, { status: 400 });
    }
    const deleteResult = await safePrisma((db) => db.project.delete({ where: { id: params.id } }));
    if (!deleteResult.ok) {
      return NextResponse.json({ success: false, error: "Failed to delete project" }, { status: 503 });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting project", {
      code: error?.code,
      message: error?.message,
    });
    return NextResponse.json({ success: false, error: "Failed to delete project" }, { status: 500 });
  }
}
