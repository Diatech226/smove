// file: app/api/admin/posts/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { publishedAt: "desc" },
    });
    return NextResponse.json({ success: true, data: posts });
  } catch (error) {
    console.error("Error fetching posts", error);
    return NextResponse.json({ success: false, error: "Unable to fetch posts" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slug, title, excerpt, body: content, tags, publishedAt } = body ?? {};

    if (!slug || !title || !excerpt || !content || !publishedAt) {
      return NextResponse.json(
        { success: false, error: "Slug, title, excerpt, body and publishedAt are required" },
        { status: 400 },
      );
    }

    const created = await prisma.post.create({
      data: {
        slug,
        title,
        excerpt,
        body: content,
        tags: Array.isArray(tags) ? tags : [],
        publishedAt: new Date(publishedAt),
      },
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error("Error creating post", error);
    return NextResponse.json({ success: false, error: "Unable to create post" }, { status: 500 });
  }
}
