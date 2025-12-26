// file: app/api/admin/posts/route.ts
import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin/auth";
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
    return NextResponse.json(
      { success: false, error: "Database unreachable", detail: postsResult.ok ? countResult.message : postsResult.message },
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
        categorySlug: payload.categorySlug ?? null,
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
}
