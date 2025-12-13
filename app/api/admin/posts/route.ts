// file: app/api/admin/posts/route.ts
import { NextResponse } from "next/server";

import { safePrisma } from "@/lib/safePrisma";
import { postSchema } from "@/lib/validation/admin";

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
      { success: false, error: "Database unreachable", detail: postsResult.message },
      { status: 503 },
    );
  }

  return NextResponse.json({ success: true, posts: postsResult.data }, { status: 200 });
}

export async function POST(request: Request) {
  try {
    const json = await request.json().catch(() => null);
    const parsed = postSchema.safeParse(json ?? {});

    if (!parsed.success) {
      const message = parsed.error.issues.at(0)?.message ?? "Payload invalide";
      return NextResponse.json({ success: false, error: message }, { status: 400 });
    }

    const payload = parsed.data;

    const existingResult = await safePrisma((db) => db.post.findUnique({ where: { slug: payload.slug } }));
    if (!existingResult.ok) {
      return NextResponse.json(
        { success: false, error: "Database unreachable", detail: existingResult.message },
        { status: 503 },
      );
    }
    if (existingResult.data) {
      return NextResponse.json({ success: false, error: "Un article utilise déjà ce slug." }, { status: 400 });
    }

    const isPublished = payload.published ?? false;

    const createdResult = await safePrisma((db) =>
      db.post.create({
        data: {
          slug: payload.slug,
          title: payload.title,
          excerpt: payload.excerpt ?? null,
          body: payload.body ?? null,
          tags: payload.tags ?? [],
          coverImage: payload.coverImage ?? null,
          gallery: payload.gallery?.filter(Boolean) ?? [],
          videoUrl: payload.videoUrl ?? null,
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
      return NextResponse.json(
        { success: false, error: "Database unreachable", detail: createdResult.message },
        { status: 503 },
      );
    }

    return NextResponse.json({ success: true, post: createdResult.data }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating post", { code: error?.code, message: error?.message });
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create post",
      },
      { status: 500 },
    );
  }
}
