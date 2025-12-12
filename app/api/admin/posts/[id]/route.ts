// file: app/api/admin/posts/[id]/route.ts
import { NextResponse } from "next/server";
import { safePrisma } from "@/lib/safePrisma";

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
    const body = await request.json().catch(() => null);
    const { slug, title, excerpt, body: content, published, coverImage, gallery, videoUrl, tags } =
      (body as Record<string, unknown>) ?? {};

    if (!params.id) {
      return NextResponse.json({ success: false, error: "Post id is required" }, { status: 400 });
    }

    if (![slug, title, content].every((value) => typeof value === "string" && value.trim().length)) {
      return NextResponse.json({ success: false, error: "Slug, title and body are required" }, { status: 400 });
    }

    const existingPostResult = await safePrisma((db) => db.post.findUnique({ where: { id: params.id } }));
    if (!existingPostResult.ok) {
      return NextResponse.json({ success: false, error: "Failed to update post" }, { status: 503 });
    }
    const existingPost = existingPostResult.data;
    if (!existingPost) {
      return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 });
    }

    const existingWithSlugResult = await safePrisma((db) => db.post.findUnique({ where: { slug } }));
    if (!existingWithSlugResult.ok) {
      return NextResponse.json({ success: false, error: "Failed to update post" }, { status: 503 });
    }
    const existingWithSlug = existingWithSlugResult.data;
    if (existingWithSlug && existingWithSlug.id !== params.id) {
      return NextResponse.json({ success: false, error: "Another post already uses this slug" }, { status: 400 });
    }

    const desiredPublished = typeof published === "boolean" ? published : existingPost.published;
    const publishedAt = desiredPublished ? existingPost.publishedAt ?? new Date() : null;

    const updatedResult = await safePrisma((db) =>
      db.post.update({
        where: { id: params.id },
        data: {
          slug,
          title,
          excerpt: typeof excerpt === "string" ? excerpt : null,
          body: typeof content === "string" ? content : null,
          tags: Array.isArray(tags)
            ? tags.map((item) => (typeof item === "string" ? item : String(item))).filter(Boolean)
            : existingPost.tags,
          coverImage: typeof coverImage === "string" ? coverImage : null,
          gallery: Array.isArray(gallery)
            ? gallery.map((item) => (typeof item === "string" ? item : String(item))).filter(Boolean)
            : existingPost.gallery,
          videoUrl: typeof videoUrl === "string" ? videoUrl : null,
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
