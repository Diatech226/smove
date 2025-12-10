// file: app/api/admin/posts/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: { id: string };
};

export async function PUT(request: Request, { params }: Params) {
  try {
    const body = await request.json();
    const { slug, title, excerpt, body: content, tags, publishedAt } = body ?? {};

    if (!slug || !title || !excerpt || !content || !publishedAt) {
      return NextResponse.json(
        { success: false, error: "Slug, title, excerpt, body and publishedAt are required" },
        { status: 400 },
      );
    }

    const updated = await prisma.post.update({
      where: { id: params.id },
      data: {
        slug,
        title,
        excerpt,
        body: content,
        tags: Array.isArray(tags) ? tags : [],
        publishedAt: new Date(publishedAt),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating post", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    await prisma.post.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting post", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
