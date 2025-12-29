import { z } from "zod";

import { jsonError, jsonOk } from "@/lib/api/response";
import { createRequestId } from "@/lib/api/requestId";
import { requireAdmin } from "@/lib/admin/auth";
import { safePrisma } from "@/lib/safePrisma";
import { processMediaFile, isVideoFile, isSupportedMedia } from "@/lib/media/processing";
import { MEDIA_MAX_BYTES, MEDIA_MAX_FILES } from "@/lib/media/config";
import { getStorageProvider } from "@/lib/media/storage";

export const runtime = "nodejs";

const listQuerySchema = z.object({
  type: z.enum(["image", "video"]).optional(),
  folder: z.string().trim().max(80).optional(),
  search: z.string().trim().max(120).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(24),
});

const deleteSchema = z.object({
  id: z.string().trim().min(1),
});

const uploadSchema = z.object({
  folder: z.string().trim().max(80).optional(),
});

export async function GET(request: Request) {
  const authError = await requireAdmin();
  if (authError) return authError;
  const requestId = createRequestId();

  const url = new URL(request.url);
  const parsed = listQuerySchema.safeParse(Object.fromEntries(url.searchParams.entries()));
  if (!parsed.success) {
    const message = parsed.error.issues.at(0)?.message ?? "Requête invalide";
    return jsonError(message, { status: 400, requestId });
  }

  const { type, folder, search, page, limit } = parsed.data;
  const skip = (page - 1) * limit;

  const where: Record<string, any> = {};
  if (type) where.type = type;
  if (folder) where.folder = folder;
  if (search) {
    where.OR = [
      { originalUrl: { contains: search } },
      { folder: { contains: search } },
    ];
  }

  const [mediaResult, countResult] = await Promise.all([
    safePrisma((db) =>
      db.media.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
    ),
    safePrisma((db) => db.media.count({ where })),
  ]);

  if (!mediaResult.ok || !countResult.ok) {
    console.error("Failed to fetch media", {
      requestId,
      detail: mediaResult.ok ? countResult.message : mediaResult.message,
    });
    return jsonError("Database unreachable", {
      status: 503,
      requestId,
      data: { detail: mediaResult.ok ? countResult.message : mediaResult.message },
    });
  }

  const total = countResult.data;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return jsonOk({ media: mediaResult.data, page, total, totalPages, limit }, { status: 200, requestId });
}

export async function POST(request: Request) {
  const authError = await requireAdmin();
  if (authError) return authError;
  const requestId = createRequestId();

  try {
    const formData = await request.formData();
    const files = formData.getAll("files").filter((item) => item instanceof File) as File[];
    const folder = formData.get("folder");
    const folderParsed = uploadSchema.safeParse({ folder: typeof folder === "string" ? folder : undefined });
    if (!folderParsed.success) {
      const message = folderParsed.error.issues.at(0)?.message ?? "Dossier invalide.";
      return jsonError(message, { status: 400, requestId });
    }
    const poster = formData.get("poster");
    const posterFile = poster instanceof File ? poster : null;

    if (!files.length) {
      return jsonError("Aucun fichier reçu.", { status: 400, requestId });
    }

    if (files.length > MEDIA_MAX_FILES) {
      return jsonError(`Vous pouvez uploader jusqu'à ${MEDIA_MAX_FILES} fichier(s) à la fois.`, { status: 400, requestId });
    }

    if (files.some((file) => !isSupportedMedia(file))) {
      return jsonError("Formats acceptés : jpg, png, webp, mp4.", { status: 400, requestId });
    }

    if (files.some((file) => file.size > MEDIA_MAX_BYTES)) {
      const maxMb = Math.round(MEDIA_MAX_BYTES / (1024 * 1024));
      return jsonError(`Taille maximale par fichier : ${maxMb}MB.`, { status: 400, requestId });
    }

    const parsedFolder = folderParsed.data.folder ?? "";
    const created: any[] = [];

    for (const [index, file] of files.entries()) {
      const processed = await processMediaFile(file, {
        folder: parsedFolder || null,
        posterFile: index === 0 && isVideoFile(file) ? posterFile : null,
      });

      const createResult = await safePrisma((db) =>
        db.media.create({
          data: processed,
        }),
      );

      if (!createResult.ok) {
        console.error("Failed to create media", { requestId, detail: createResult.message });
        return jsonError("Database unreachable", {
          status: 503,
          requestId,
          data: { detail: createResult.message },
        });
      }

      created.push(createResult.data);
    }

    return jsonOk({ media: created, count: created.length }, { status: 201, requestId });
  } catch (error: any) {
    console.error("Failed to upload media", { requestId, message: error?.message });
    return jsonError("Impossible de traiter le média.", { status: 500, requestId });
  }
}

export async function DELETE(request: Request) {
  const authError = await requireAdmin();
  if (authError) return authError;
  const requestId = createRequestId();

  const url = new URL(request.url);
  const parsed = deleteSchema.safeParse({ id: url.searchParams.get("id") ?? "" });
  if (!parsed.success) {
    const message = parsed.error.issues.at(0)?.message ?? "Identifiant invalide";
    return jsonError(message, { status: 400, requestId });
  }

  const mediaResult = await safePrisma((db) => db.media.findUnique({ where: { id: parsed.data.id } }));
  if (!mediaResult.ok) {
    console.error("Failed to find media", { requestId, detail: mediaResult.message });
    return jsonError("Database unreachable", {
      status: 503,
      requestId,
      data: { detail: mediaResult.message },
    });
  }

  const media = mediaResult.data;
  if (!media) {
    return jsonError("Media introuvable.", { status: 404, requestId });
  }

  const storage = getStorageProvider();
  const urls: string[] = [media.originalUrl];
  if (media.posterUrl) urls.push(media.posterUrl);
  if (media.variants && typeof media.variants === "object") {
    const variants = media.variants as Record<string, any>;
    Object.values(variants).forEach((value) => {
      if (typeof value === "string") urls.push(value);
      if (value && typeof value === "object") {
        Object.values(value as Record<string, string>).forEach((nested) => {
          if (typeof nested === "string") urls.push(nested);
        });
      }
    });
  }

  try {
    await Promise.all(urls.map((url) => storage.remove(url)));
  } catch (error: any) {
    console.error("Failed to delete media files", { requestId, message: error?.message });
    return jsonError("Impossible de supprimer les fichiers média.", { status: 500, requestId });
  }

  const deleteResult = await safePrisma((db) => db.media.delete({ where: { id: parsed.data.id } }));
  if (!deleteResult.ok) {
    console.error("Failed to delete media record", { requestId, detail: deleteResult.message });
    return jsonError("Database unreachable", {
      status: 503,
      requestId,
      data: { detail: deleteResult.message },
    });
  }

  return jsonOk({ ok: true }, { status: 200, requestId });
}
