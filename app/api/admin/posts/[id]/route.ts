// file: app/api/admin/posts/[id]/route.ts
import crypto from "crypto";
import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin/auth";
import { findAvailablePostSlug } from "@/lib/admin/slug";
import { safePrisma } from "@/lib/safePrisma";
import { postSchema, postUpdateSchema } from "@/lib/validation/admin";

type Params = {
  params: { id: string };
};

export async function GET(_request: Request, { params }: Params) {
  const authError = requireAdmin();
  if (authError) return authError;

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
    const traceId = crypto.randomUUID();
    console.error("Error fetching post", {
      traceId,
      code: error?.code,
      message: error?.message,
    });
    return NextResponse.json({ success: false, error: "Failed to fetch post", traceId }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Params) {
  const authError = requireAdmin();
  if (authError) return authError;

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
      const traceId = crypto.randomUUID();
      console.error("Failed to validate post slug", { traceId, detail: existingWithSlugResult.message });
      return NextResponse.json({ success: false, error: "Failed to update post", traceId }, { status: 503 });
    }
    const existingWithSlug = existingWithSlugResult.data;
    if (existingWithSlug && existingWithSlug.id !== params.id) {
      const suggestion = await findAvailablePostSlug(payload.slug, params.id);
      return NextResponse.json(
        {
          success: false,
          error: "Un autre article utilise déjà ce slug.",
          suggestedSlug: suggestion,
        },
        { status: 400 },
      );
    }

    const nextStatus = payload.status ?? existingPost.status;
    const publishedAt = nextStatus === "published" ? existingPost.publishedAt ?? new Date() : null;

    const updatedResult = await safePrisma((db) =>
      db.post.update({
        where: { id: params.id },
        data: {
          slug: payload.slug,
          title: payload.title,
          categoryId: payload.categoryId ?? null,
          excerpt: payload.excerpt ?? null,
          body: payload.body ?? null,
          tags: payload.tags ?? existingPost.tags,
          coverImage: payload.coverImage ?? null,
          gallery: payload.gallery?.filter(Boolean) ?? existingPost.gallery,
          videoUrl: payload.videoUrl ?? null,
          status: nextStatus,
          publishedAt,
        },
      }),
    );

    if (!updatedResult.ok) {
      const error = updatedResult.error as any;
      if (error?.code === "P2002") {
        const suggestion = await findAvailablePostSlug(payload.slug, params.id);
        return NextResponse.json(
          {
            success: false,
            error: "Un autre article utilise déjà ce slug.",
            suggestedSlug: suggestion,
          },
          { status: 400 },
        );
      }
      const traceId = crypto.randomUUID();
      console.error("Failed to update post", { traceId, detail: updatedResult.message });
      return NextResponse.json({ success: false, error: "Failed to update post", traceId }, { status: 503 });
    }

    return NextResponse.json({ success: true, post: updatedResult.data });
  } catch (error: any) {
    const traceId = crypto.randomUUID();
    console.error("Error updating post", {
      traceId,
      code: error?.code,
      message: error?.message,
    });
    if (error?.code === "P2002") {
      const suggestion = await findAvailablePostSlug("article", params.id);
      return NextResponse.json(
        {
          success: false,
          error: "Un autre article utilise déjà ce slug.",
          suggestedSlug: suggestion,
          traceId,
        },
        { status: 400 },
      );
    }
    return NextResponse.json({ success: false, error: "Failed to update post", traceId }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: Params) {
  const authError = requireAdmin();
  if (authError) return authError;

  try {
    if (!params.id) {
      return NextResponse.json({ success: false, error: "Post id is required" }, { status: 400 });
    }

    const json = await request.json().catch(() => null);
    const parsed = postUpdateSchema.safeParse(json ?? {});

    if (!parsed.success) {
      const message = parsed.error.issues.at(0)?.message ?? "Payload invalide";
      return NextResponse.json({ success: false, error: message }, { status: 400 });
    }

    const payload = parsed.data;
    if (!Object.keys(payload).length) {
      return NextResponse.json({ success: false, error: "Aucune donnée à mettre à jour." }, { status: 400 });
    }

    const existingPostResult = await safePrisma((db) => db.post.findUnique({ where: { id: params.id } }));
    if (!existingPostResult.ok) {
      const traceId = crypto.randomUUID();
      console.error("Failed to validate post update", { traceId, detail: existingPostResult.message });
      return NextResponse.json({ success: false, error: "Failed to update post", traceId }, { status: 503 });
    }
    const existingPost = existingPostResult.data;
    if (!existingPost) {
      return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 });
    }

    if (payload.slug) {
      const existingWithSlugResult = await safePrisma((db) => db.post.findUnique({ where: { slug: payload.slug! } }));
      if (!existingWithSlugResult.ok) {
        const traceId = crypto.randomUUID();
        console.error("Failed to validate post slug", { traceId, detail: existingWithSlugResult.message });
        return NextResponse.json({ success: false, error: "Failed to update post", traceId }, { status: 503 });
      }
      const existingWithSlug = existingWithSlugResult.data;
      if (existingWithSlug && existingWithSlug.id !== params.id) {
        const suggestion = await findAvailablePostSlug(payload.slug, params.id);
        return NextResponse.json(
          {
            success: false,
            error: "Un autre article utilise déjà ce slug.",
            suggestedSlug: suggestion,
          },
          { status: 400 },
        );
      }
    }

    const nextStatus = payload.status ?? existingPost.status;
    const publishedAt = nextStatus === "published" ? existingPost.publishedAt ?? new Date() : null;

    const updatedResult = await safePrisma((db) =>
      db.post.update({
        where: { id: params.id },
        data: {
          slug: payload.slug ?? existingPost.slug,
          title: payload.title ?? existingPost.title,
          categoryId: payload.categoryId ?? existingPost.categoryId,
          excerpt: payload.excerpt ?? existingPost.excerpt,
          body: payload.body ?? existingPost.body,
          tags: payload.tags ?? existingPost.tags,
          coverImage: payload.coverImage ?? existingPost.coverImage,
          gallery: payload.gallery?.filter(Boolean) ?? existingPost.gallery,
          videoUrl: payload.videoUrl ?? existingPost.videoUrl,
          status: nextStatus,
          publishedAt,
        },
      }),
    );

    if (!updatedResult.ok) {
      const error = updatedResult.error as any;
      if (error?.code === "P2002") {
        const suggestion = await findAvailablePostSlug(payload.slug ?? existingPost.slug, params.id);
        return NextResponse.json(
          {
            success: false,
            error: "Un autre article utilise déjà ce slug.",
            suggestedSlug: suggestion,
          },
          { status: 400 },
        );
      }
      const traceId = crypto.randomUUID();
      console.error("Failed to update post", { traceId, detail: updatedResult.message });
      return NextResponse.json({ success: false, error: "Failed to update post", traceId }, { status: 503 });
    }

    return NextResponse.json({ success: true, post: updatedResult.data });
  } catch (error: any) {
    const traceId = crypto.randomUUID();
    console.error("Error updating post", {
      traceId,
      code: error?.code,
      message: error?.message,
    });
    if (error?.code === "P2002") {
      const suggestion = await findAvailablePostSlug("article", params.id);
      return NextResponse.json(
        {
          success: false,
          error: "Un autre article utilise déjà ce slug.",
          suggestedSlug: suggestion,
          traceId,
        },
        { status: 400 },
      );
    }
    return NextResponse.json({ success: false, error: "Failed to update post", traceId }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const authError = requireAdmin();
  if (authError) return authError;

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
    const traceId = crypto.randomUUID();
    console.error("Error deleting post", {
      traceId,
      code: error?.code,
      message: error?.message,
    });
    return NextResponse.json({ success: false, error: "Failed to delete post", traceId }, { status: 500 });
  }
}
