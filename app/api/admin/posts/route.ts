// file: app/api/admin/posts/route.ts
import crypto from "crypto";
import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin/auth";
import { findAvailablePostSlug } from "@/lib/admin/slug";
import { buildPostOrderBy, buildPostWhere, parsePostQueryParams } from "@/lib/admin/postQueries";
import { safePrisma } from "@/lib/safePrisma";
import { postSchema } from "@/lib/validation/admin";

export async function GET(request: Request) {
  const authError = requireAdmin();
  if (authError) return authError;

  const url = new URL(request.url);
  const params = parsePostQueryParams(Object.fromEntries(url.searchParams.entries()));
  const where = buildPostWhere(params);
  const orderBy = buildPostOrderBy(params);
  const skip = (params.page - 1) * params.limit;

  const [postsResult, countResult] = await Promise.all([
    safePrisma((db) =>
      db.post.findMany({
        where,
        orderBy,
        skip,
        take: params.limit,
      }),
    ),
    safePrisma((db) => db.post.count({ where })),
  ]);

  if (!postsResult.ok || !countResult.ok) {
    const traceId = crypto.randomUUID();
    console.error("Failed to load posts", {
      traceId,
      postError: postsResult.ok ? undefined : postsResult.message,
      countError: countResult.ok ? undefined : countResult.message,
    });
    return NextResponse.json(
      {
        success: false,
        error: "Database unreachable",
        detail: postsResult.ok ? countResult.message : postsResult.message,
        traceId,
      },
      { status: 503 },
    );
  }

  const total = countResult.data;
  const totalPages = Math.max(1, Math.ceil(total / params.limit));

  return NextResponse.json(
    {
      success: true,
      posts: postsResult.data,
      page: params.page,
      total,
      totalPages,
    },
    { status: 200 },
  );
}

export async function POST(request: Request) {
  const authError = requireAdmin();
  if (authError) return authError;

  const json = await request.json().catch(() => null);
  const parsed = postSchema.safeParse(json ?? {});

  if (!parsed.success) {
    const message = parsed.error.issues.at(0)?.message ?? "Payload invalide";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }

  const payload = parsed.data;

  const existingResult = await safePrisma((db) => db.post.findUnique({ where: { slug: payload.slug } }));
  if (!existingResult.ok) {
    const traceId = crypto.randomUUID();
    console.error("Failed to validate post slug", { traceId, detail: existingResult.message });
    return NextResponse.json(
      { success: false, error: "Database unreachable", detail: existingResult.message, traceId },
      { status: 503 },
    );
  }
  if (existingResult.data) {
    const suggestion = await findAvailablePostSlug(payload.slug);
    return NextResponse.json(
      {
        success: false,
        error: "Un article utilise déjà ce slug.",
        suggestedSlug: suggestion,
      },
      { status: 400 },
    );
  }

  const status = payload.status ?? "draft";
  const publishedAt = status === "published" ? new Date() : null;

  const createdResult = await safePrisma((db) =>
    db.post.create({
      data: {
        slug: payload.slug,
        title: payload.title,
        categoryId: payload.categoryId ?? null,
        excerpt: payload.excerpt ?? null,
        body: payload.body ?? null,
        tags: payload.tags ?? [],
        coverImage: payload.coverImage ?? null,
        gallery: payload.gallery?.filter(Boolean) ?? [],
        videoUrl: payload.videoUrl ?? null,
        status,
        publishedAt,
      },
    }),
  );

  if (!createdResult.ok) {
    const error = createdResult.error as any;
    if (error?.code === "P2002") {
      const suggestion = await findAvailablePostSlug(payload.slug);
      return NextResponse.json(
        {
          success: false,
          error: "Un article utilise déjà ce slug.",
          suggestedSlug: suggestion,
        },
        { status: 400 },
      );
    }
    const traceId = crypto.randomUUID();
    console.error("Failed to create post", { traceId, detail: createdResult.message });
    return NextResponse.json(
      { success: false, error: "Database unreachable", detail: createdResult.message, traceId },
      { status: 503 },
    );
  }

  return NextResponse.json({ success: true, post: createdResult.data }, { status: 201 });
}
