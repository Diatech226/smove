import { jsonError, jsonOk } from "@/lib/api/response";
import { createRequestId } from "@/lib/api/requestId";
import { requireAdmin } from "@/lib/admin/auth";
import { findAvailablePostSlug } from "@/lib/admin/slug";
import { safePrisma } from "@/lib/safePrisma";
import { postSchema, postUpdateSchema } from "@/lib/validation/admin";

type Params = {
  params: { id: string };
};

export async function GET(_request: Request, { params }: Params) {
  const authError = await requireAdmin();
  if (authError) return authError;
  const requestId = createRequestId();

  try {
    if (!params.id) {
      return jsonError("Post id is required", { status: 400, requestId });
    }

    const postResult = await safePrisma((db) =>
      db.post.findUnique({
        where: { id: params.id },
        include: {
          cover: true,
          video: true,
        },
      }),
    );
    if (!postResult.ok) {
      console.error("Failed to fetch post", { requestId, detail: postResult.message });
      return jsonError("Failed to fetch post", { status: 503, requestId });
    }
    const post = postResult.data;

    if (!post) {
      return jsonError("Post not found", { status: 404, requestId });
    }

    return jsonOk({ post }, { status: 200, requestId });
  } catch (error: any) {
    console.error("Error fetching post", {
      requestId,
      code: error?.code,
      message: error?.message,
    });
    return jsonError("Failed to fetch post", { status: 500, requestId });
  }
}

export async function PUT(request: Request, { params }: Params) {
  const authError = await requireAdmin();
  if (authError) return authError;
  const requestId = createRequestId();

  try {
    if (!params.id) {
      return jsonError("Post id is required", { status: 400, requestId });
    }

    const json = await request.json().catch(() => null);
    const parsed = postSchema.safeParse(json ?? {});

    if (!parsed.success) {
      const message = parsed.error.issues.at(0)?.message ?? "Payload invalide";
      return jsonError(message, { status: 400, requestId });
    }

    const payload = parsed.data;

    const existingPostResult = await safePrisma((db) => db.post.findUnique({ where: { id: params.id } }));
    if (!existingPostResult.ok) {
      console.error("Failed to fetch post for update", { requestId, detail: existingPostResult.message });
      return jsonError("Failed to update post", { status: 503, requestId });
    }
    const existingPost = existingPostResult.data;
    if (!existingPost) {
      return jsonError("Post not found", { status: 404, requestId });
    }

    const existingWithSlugResult = await safePrisma((db) => db.post.findUnique({ where: { slug: payload.slug } }));
    if (!existingWithSlugResult.ok) {
      console.error("Failed to validate post slug", { requestId, detail: existingWithSlugResult.message });
      return jsonError("Failed to update post", { status: 503, requestId });
    }
    const existingWithSlug = existingWithSlugResult.data;
    if (existingWithSlug && existingWithSlug.id !== params.id) {
      const suggestion = await findAvailablePostSlug(payload.slug, params.id);
      return jsonError("Un autre article utilise déjà ce slug.", {
        status: 400,
        requestId,
        data: { suggestedSlug: suggestion },
      });
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
          coverMediaId: payload.coverMediaId ?? existingPost.coverMediaId,
          galleryMediaIds: payload.galleryMediaIds ?? existingPost.galleryMediaIds,
          videoMediaId: payload.videoMediaId ?? existingPost.videoMediaId,
          status: nextStatus,
          publishedAt,
        },
      }),
    );

    if (!updatedResult.ok) {
      const error = updatedResult.error as any;
      if (error?.code === "P2002") {
        const suggestion = await findAvailablePostSlug(payload.slug, params.id);
        return jsonError("Un autre article utilise déjà ce slug.", {
          status: 400,
          requestId,
          data: { suggestedSlug: suggestion },
        });
      }
      console.error("Failed to update post", { requestId, detail: updatedResult.message });
      return jsonError("Failed to update post", { status: 503, requestId });
    }

    return jsonOk({ post: updatedResult.data }, { status: 200, requestId });
  } catch (error: any) {
    console.error("Error updating post", {
      requestId,
      code: error?.code,
      message: error?.message,
    });
    if (error?.code === "P2002") {
      const suggestion = await findAvailablePostSlug("article", params.id);
      return jsonError("Un autre article utilise déjà ce slug.", {
        status: 400,
        requestId,
        data: { suggestedSlug: suggestion },
      });
    }
    return jsonError("Failed to update post", { status: 500, requestId });
  }
}

export async function PATCH(request: Request, { params }: Params) {
  const authError = await requireAdmin();
  if (authError) return authError;
  const requestId = createRequestId();

  try {
    if (!params.id) {
      return jsonError("Post id is required", { status: 400, requestId });
    }

    const json = await request.json().catch(() => null);
    const parsed = postUpdateSchema.safeParse(json ?? {});

    if (!parsed.success) {
      const message = parsed.error.issues.at(0)?.message ?? "Payload invalide";
      return jsonError(message, { status: 400, requestId });
    }

    const payload = parsed.data;
    if (!Object.keys(payload).length) {
      return jsonError("Aucune donnée à mettre à jour.", { status: 400, requestId });
    }

    const existingPostResult = await safePrisma((db) => db.post.findUnique({ where: { id: params.id } }));
    if (!existingPostResult.ok) {
      console.error("Failed to validate post update", { requestId, detail: existingPostResult.message });
      return jsonError("Failed to update post", { status: 503, requestId });
    }
    const existingPost = existingPostResult.data;
    if (!existingPost) {
      return jsonError("Post not found", { status: 404, requestId });
    }

    if (payload.slug) {
      const existingWithSlugResult = await safePrisma((db) => db.post.findUnique({ where: { slug: payload.slug! } }));
      if (!existingWithSlugResult.ok) {
        console.error("Failed to validate post slug", { requestId, detail: existingWithSlugResult.message });
        return jsonError("Failed to update post", { status: 503, requestId });
      }
      const existingWithSlug = existingWithSlugResult.data;
      if (existingWithSlug && existingWithSlug.id !== params.id) {
        const suggestion = await findAvailablePostSlug(payload.slug, params.id);
        return jsonError("Un autre article utilise déjà ce slug.", {
          status: 400,
          requestId,
          data: { suggestedSlug: suggestion },
        });
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
          coverMediaId: payload.coverMediaId ?? existingPost.coverMediaId,
          galleryMediaIds: payload.galleryMediaIds ?? existingPost.galleryMediaIds,
          videoMediaId: payload.videoMediaId ?? existingPost.videoMediaId,
          status: nextStatus,
          publishedAt,
        },
      }),
    );

    if (!updatedResult.ok) {
      const error = updatedResult.error as any;
      if (error?.code === "P2002") {
        const suggestion = await findAvailablePostSlug(payload.slug ?? existingPost.slug, params.id);
        return jsonError("Un autre article utilise déjà ce slug.", {
          status: 400,
          requestId,
          data: { suggestedSlug: suggestion },
        });
      }
      console.error("Failed to update post", { requestId, detail: updatedResult.message });
      return jsonError("Failed to update post", { status: 503, requestId });
    }

    return jsonOk({ post: updatedResult.data }, { status: 200, requestId });
  } catch (error: any) {
    console.error("Error updating post", {
      requestId,
      code: error?.code,
      message: error?.message,
    });
    return jsonError("Failed to update post", { status: 500, requestId });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const authError = await requireAdmin();
  if (authError) return authError;
  const requestId = createRequestId();

  try {
    if (!params.id) {
      return jsonError("Post id is required", { status: 400, requestId });
    }

    const deleteResult = await safePrisma((db) => db.post.delete({ where: { id: params.id } }));
    if (!deleteResult.ok) {
      console.error("Failed to delete post", { requestId, detail: deleteResult.message });
      return jsonError("Failed to delete post", { status: 503, requestId });
    }

    return jsonOk({}, { status: 200, requestId });
  } catch (error: any) {
    console.error("Error deleting post", {
      requestId,
      code: error?.code,
      message: error?.message,
    });
    return jsonError("Failed to delete post", { status: 500, requestId });
  }
}
