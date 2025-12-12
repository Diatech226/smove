// file: app/api/admin/posts/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: [
        { publishedAt: "desc" },
        { createdAt: "desc" },
      ],
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
    const { slug, title, excerpt, body: content, category, published, coverImage, galleryImages, videoUrl } =
      (body as Record<string, unknown>) ?? {};

    if (![slug, title, content].every((value) => typeof value === "string" && value.trim().length)) {
      return NextResponse.json(
        { success: false, error: "Slug, title and body are required" },
        { status: 400 },
      );
    }

    const existing = await prisma.post.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "A post with this slug already exists" },
        { status: 400 },
      );
    }

    const isPublished = typeof published === "boolean" ? published : true;

    const created = await prisma.post.create({
      data: {
        slug,
        title,
        excerpt: typeof excerpt === "string" ? excerpt : null,
        body: typeof content === "string" ? content : null,
        category: typeof category === "string" ? category : null,
        coverImage: typeof coverImage === "string" ? coverImage : null,
        galleryImages: Array.isArray(galleryImages)
          ? galleryImages.map((item) => (typeof item === "string" ? item : String(item))).filter(Boolean)
          : [],
        videoUrl: typeof videoUrl === "string" ? videoUrl : null,
        published: isPublished,
        publishedAt: isPublished ? new Date() : null,
      },
    });

    return NextResponse.json({ success: true, post: created }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating post", {
      code: error?.code,
      message: error?.message,
    });
    if (error?.code === "P2002") {
      return NextResponse.json({ success: false, error: "Un article utilise déjà ce slug." }, { status: 400 });
    }
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create post",
      },
      { status: 500 },
    );
  }
}
