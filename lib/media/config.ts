export type MediaStorageType = "local" | "s3";

const normalizeBaseUrl = (value?: string | null) => {
  if (!value) return "";
  return value.endsWith("/") ? value.slice(0, -1) : value;
};

export const MEDIA_STORAGE = (process.env.MEDIA_STORAGE?.toLowerCase() as MediaStorageType) || "local";
export const MEDIA_PUBLIC_BASE_URL = normalizeBaseUrl(process.env.MEDIA_PUBLIC_BASE_URL);
export const S3_PUBLIC_BASE_URL = normalizeBaseUrl(process.env.S3_PUBLIC_BASE_URL);
export const MEDIA_MAX_BYTES = Number(process.env.MEDIA_MAX_BYTES) || 20 * 1024 * 1024;
export const MEDIA_MAX_FILES = Number(process.env.MEDIA_MAX_FILES) || 6;

export const getMediaPublicBaseUrl = (storageType: MediaStorageType) => {
  return storageType === "s3" ? S3_PUBLIC_BASE_URL : MEDIA_PUBLIC_BASE_URL;
};

export const buildPublicUrl = (path: string, baseUrl?: string) => {
  const normalizedBase = normalizeBaseUrl(baseUrl);
  if (!normalizedBase) return path;
  if (path.startsWith("/")) {
    return `${normalizedBase}${path}`;
  }
  return `${normalizedBase}/${path}`;
};

export const getStorageKeyFromUrl = (url: string, baseUrl?: string) => {
  const normalizedBase = normalizeBaseUrl(baseUrl);
  if (normalizedBase && url.startsWith(normalizedBase)) {
    return url.slice(normalizedBase.length).replace(/^\/+/, "");
  }
  if (url.startsWith("/uploads/")) {
    return url.replace(/^\/uploads\//, "");
  }
  return url.replace(/^\/+/, "");
};
