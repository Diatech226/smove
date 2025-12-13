// file: app/api/admin/posts/[id]/route.ts
import { NextResponse } from "next/server";

import { safePrisma } from "@/lib/safePrisma";
import { postSchema } from "@/lib/validation/admin";

type Params = {
  params: { id: string };
};

export async function GET(_request: Request, { params }: Params) {
  try {
    if (!params.id) {
      return NextResponse.json({ success: false, error: "Post id is required" }, { status: 400 });
    }

    const postResult = await safePrisma((db) => db.post.findUnique({ where: { id: params.id } }));
    if (!postResult.ok) {
      return NextResponse.json({ success: false, error: "Failed to fetch post" }, { status: 503 });
    }
    const post = postResult.data;

    if (!post) {
      return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, post });
  } catch (error: any) {
    console.error("Error fetching post", {
      code: error?.code,
      message: error?.message,
    });
    return NextResponse.json({ success: false, error: "Failed to fetch post" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    if (!params.id) {
      return NextResponse.json({ success: false, error: "Post id is required" }, { status: 400 });
    }

    const json = await request.json().catch(() => null);
    const parsed = postSchema.safeParse(json ?? {});

    if (!parsed.success) {
      const message = parsed.error.issues.at(0)?.message ?? "Payload invalide";
      return NextResponse.json({ success: false, error: message }, { status: 400 });
    }

    const payload = parsed.data;

    const existingPostResult = await safePrisma((db) => db.post.findUnique({ where: { id: params.id } }));
    if (!existingPostResult.ok) {
      return NextResponse.json({ success: false, error: "Failed to update post" }, { status: 503 });
    }
    const existingPost = existingPostResult.data;
    if (!existingPost) {
      return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 });
    }

    const existingWithSlugResult = await safePrisma((db) => db.post.findUnique({ where: { slug: payload.slug } }));
    if (!existingWithSlugResult.ok) {
      return NextResponse.json({ success: false, error: "Failed to update post" }, { status: 503 });
    }
    const existingWithSlug = existingWithSlugResult.data;
    if (existingWithSlug && existingWithSlug.id !== params.id) {
      return NextResponse.json({ success: false, error: "Un autre article utilise déjà ce slug." }, { status: 400 });
    }

    const desiredPublished = payload.published ?? existingPost.published;
    const publishedAt = desiredPublished ? existingPost.publishedAt ?? new Date() : null;

    const updatedResult = await safePrisma((db) =>
      db.post.update({
        where: { id: params.id },
        data: {
          slug: payload.slug,
          title: payload.title,
          excerpt: payload.excerpt ?? null,
          body: payload.body ?? null,
          tags: payload.tags ?? existingPost.tags,
          coverImage: payload.coverImage ?? null,
          gallery: payload.gallery?.filter(Boolean) ?? existingPost.gallery,
          videoUrl: payload.videoUrl ?? null,
          published: desiredPublished,
          publishedAt,
        },
      }),
    );

    if (!updatedResult.ok) {
      const error = updatedResult.error as any;
      if (error?.code === "P2002") {
        return NextResponse.json({ success: false, error: "Un autre article utilise déjà ce slug." }, { status: 400 });
      }
      return NextResponse.json({ success: false, error: "Failed to update post" }, { status: 503 });
    }

    return NextResponse.json({ success: true, post: updatedResult.data });
  } catch (error: any) {
    console.error("Error updating post", {
      code: error?.code,
      message: error?.message,
    });
    if (error?.code === "P2002") {
      return NextResponse.json({ success: false, error: "Un autre article utilise déjà ce slug." }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    if (!params.id) {
      return NextResponse.json({ success: false, error: "Post id is required" }, { status: 400 });
    }
    const deleteResult = await safePrisma((db) => db.post.delete({ where: { id: params.id } }));
    if (!deleteResult.ok) {
      return NextResponse.json({ success: false, error: "Failed to delete post" }, { status: 503 });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting post", {
      code: error?.code,
      message: error?.message,
    });
    return NextResponse.json({ success: false, error: "Failed to delete post" }, { status: 500 });
  }
}
