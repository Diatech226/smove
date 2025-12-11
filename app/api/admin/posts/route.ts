// file: app/api/admin/posts/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { publishedAt: "desc" },
    });
    return NextResponse.json({ success: true, posts }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching posts", {
      code: error?.code,
      message: error?.message,
    });
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch posts",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const { slug, title, excerpt, body: content, tags, publishedAt } = (body as Record<string, unknown>) ?? {};

    const requiredFields = [slug, title, excerpt, content, publishedAt];

    if (!requiredFields.every((value) => typeof value === "string" && value.trim().length)) {
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
        tags: Array.isArray(tags)
          ? tags.map((tag) => (typeof tag === "string" ? tag : String(tag))).filter(Boolean)
          : [],
        publishedAt: new Date(publishedAt),
      },
    });

    return NextResponse.json({ success: true, post: created }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating post", {
      code: error?.code,
      message: error?.message,
    });
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create post",
      },
      { status: 500 },
    );
  }
}
