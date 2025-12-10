// file: app/api/admin/posts/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: { id: string };
};

export async function PUT(request: Request, { params }: Params) {
  try {
    const body = await request.json().catch(() => null);
    const { slug, title, excerpt, body: content, tags, publishedAt } = (body as Record<string, unknown>) ?? {};

    if (!params.id) {
      return NextResponse.json({ success: false, error: "Post id is required" }, { status: 400 });
    }

    const requiredFields = [slug, title, excerpt, content, publishedAt];

    if (!requiredFields.every((value) => typeof value === "string" && value.trim().length)) {
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
        tags: Array.isArray(tags)
          ? tags.map((tag) => (typeof tag === "string" ? tag : String(tag))).filter(Boolean)
          : [],
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
    if (!params.id) {
      return NextResponse.json({ success: false, error: "Post id is required" }, { status: 400 });
    }
    await prisma.post.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting post", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
