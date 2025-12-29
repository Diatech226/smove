import crypto from "crypto";
import sharp from "sharp";

import type { MediaItem, MediaVariants } from "./types";
import { getStorageProvider } from "./storage";

const IMAGE_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const VIDEO_MIME_TYPES = new Set(["video/mp4"]);

export type ProcessedMedia = Omit<MediaItem, "id" | "createdAt">;

export type MediaUploadOptions = {
  folder?: string | null;
  posterFile?: File | null;
};

const IMAGE_VARIANTS: { key: keyof MediaVariants; width: number }[] = [
  { key: "thumb", width: 320 },
  { key: "sm", width: 640 },
  { key: "md", width: 1024 },
  { key: "lg", width: 1600 },
];

const sanitizeFolder = (folder?: string | null) => {
  if (!folder) return "";
  return folder
    .trim()
    .replace(/[^a-z0-9/_-]/gi, "")
    .replace(/\/+/g, "/")
    .replace(/^\/|\/$/g, "");
};

const buildKeyBase = (folder?: string | null) => {
  const safeFolder = sanitizeFolder(folder);
  const uniqueId = crypto.randomUUID();
  return safeFolder ? `${safeFolder}/${uniqueId}` : uniqueId;
};

const bufferFromFile = async (file: File) => Buffer.from(await file.arrayBuffer());

const getFileExtension = (file: File) => {
  const name = file.name || "";
  const parts = name.split(".");
  if (parts.length > 1) return parts.at(-1)!.toLowerCase();
  if (file.type === "image/jpeg") return "jpg";
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  if (file.type === "video/mp4") return "mp4";
  return "bin";
};

export const isSupportedMedia = (file: File) => {
  return IMAGE_MIME_TYPES.has(file.type) || VIDEO_MIME_TYPES.has(file.type);
};

export const processMediaFile = async (file: File, options: MediaUploadOptions = {}): Promise<ProcessedMedia> => {
  if (!isSupportedMedia(file)) {
    throw new Error("Type de média non supporté.");
  }

  const storage = getStorageProvider();
  const keyBase = buildKeyBase(options.folder);
  const buffer = await bufferFromFile(file);
  const extension = getFileExtension(file);
  const originalKey = `${keyBase}/original.${extension}`;
  const originalUpload = await storage.upload({ key: originalKey, body: buffer, contentType: file.type });

  if (IMAGE_MIME_TYPES.has(file.type)) {
    const image = sharp(buffer);
    const metadata = await image.metadata();
    const variants: MediaVariants = {};

    for (const variant of IMAGE_VARIANTS) {
      const resized = await image
        .clone()
        .resize({ width: variant.width, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer();
      const variantKey = `${keyBase}/${variant.key}.webp`;
      const uploadResult = await storage.upload({ key: variantKey, body: resized, contentType: "image/webp" });
      variants[variant.key] = uploadResult.url;
    }

    return {
      type: "image",
      folder: options.folder ?? null,
      originalUrl: originalUpload.url,
      variants,
      posterUrl: null,
      mime: file.type,
      size: buffer.length,
      width: metadata.width ?? null,
      height: metadata.height ?? null,
      duration: null,
    };
  }

  const posterFile = options.posterFile;
  let posterUrl: string | null = null;
  let posterVariants: MediaVariants | null = null;
  if (posterFile && IMAGE_MIME_TYPES.has(posterFile.type)) {
    const posterBuffer = await bufferFromFile(posterFile);
    const posterImage = sharp(posterBuffer);
    posterVariants = {};
    for (const variant of IMAGE_VARIANTS) {
      const resized = await posterImage
        .clone()
        .resize({ width: variant.width, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer();
      const variantKey = `${keyBase}/poster-${variant.key}.webp`;
      const uploadResult = await storage.upload({ key: variantKey, body: resized, contentType: "image/webp" });
      posterVariants[variant.key] = uploadResult.url;
    }
    posterUrl = posterVariants.lg ?? posterVariants.md ?? posterVariants.sm ?? posterVariants.thumb ?? null;
  }

  return {
    type: "video",
    folder: options.folder ?? null,
    originalUrl: originalUpload.url,
    variants: posterVariants ? { poster: posterVariants } : null,
    posterUrl,
    mime: file.type,
    size: buffer.length,
    width: null,
    height: null,
    duration: null,
  };
};

export const isImageFile = (file: File) => IMAGE_MIME_TYPES.has(file.type);
export const isVideoFile = (file: File) => VIDEO_MIME_TYPES.has(file.type);
