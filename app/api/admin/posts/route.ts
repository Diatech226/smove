// file: app/api/admin/posts/route.ts
import { NextResponse } from "next/server";
import { safePrisma } from "@/lib/prisma";

export async function GET() {
  const postsResult = await safePrisma((db) =>
    db.post.findMany({
      orderBy: [
        { publishedAt: "desc" },
        { createdAt: "desc" },
      ],
    }),
  );

  if (!postsResult.ok) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch posts" },
      { status: 503 },
    );
  }

  return NextResponse.json({ success: true, posts: postsResult.data }, { status: 200 });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const { slug, title, excerpt, body: content, published, coverImage, gallery, videoUrl, tags } =
    (body as Record<string, unknown>) ?? {};

  if (![slug, title, content].every((value) => typeof value === "string" && value.trim().length)) {
    return NextResponse.json(
      { success: false, error: "Slug, title and body are required" },
      { status: 400 },
    );
  }

  const existingResult = await safePrisma((db) => db.post.findUnique({ where: { slug } }));
  if (!existingResult.ok) {
    return NextResponse.json({ success: false, error: "Failed to create post" }, { status: 503 });
  }
  if (existingResult.data) {
    return NextResponse.json(
      { success: false, error: "A post with this slug already exists" },
      { status: 400 },
    );
  }

  const isPublished = typeof published === "boolean" ? published : false;

  const createdResult = await safePrisma((db) =>
    db.post.create({
      data: {
        slug,
        title,
        excerpt: typeof excerpt === "string" ? excerpt : null,
        body: typeof content === "string" ? content : null,
        tags: Array.isArray(tags)
          ? tags.map((item) => (typeof item === "string" ? item : String(item))).filter(Boolean)
          : [],
        coverImage: typeof coverImage === "string" ? coverImage : null,
        gallery: Array.isArray(gallery)
          ? gallery.map((item) => (typeof item === "string" ? item : String(item))).filter(Boolean)
          : [],
        videoUrl: typeof videoUrl === "string" ? videoUrl : null,
        published: isPublished,
        publishedAt: isPublished ? new Date() : null,
      },
    }),
  );

  if (!createdResult.ok) {
    const error = createdResult.error as any;
    if (error?.code === "P2002") {
      return NextResponse.json({ success: false, error: "Un article utilise déjà ce slug." }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "Failed to create post" }, { status: 503 });
  }

  return NextResponse.json({ success: true, post: createdResult.data }, { status: 201 });
}
