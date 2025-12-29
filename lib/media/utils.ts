import type { MediaItem, MediaVariants } from "./types";

export const getMediaVariantUrl = (media: MediaItem | null | undefined, variant: keyof MediaVariants | "original") => {
  if (!media) return null;
  if (variant === "original") return media.originalUrl;

  const variants = media.variants as MediaVariants | { poster?: MediaVariants } | null | undefined;
  if (variants && typeof variants === "object") {
    const direct = (variants as MediaVariants)[variant];
    if (typeof direct === "string") return direct;
    const posterVariants = (variants as { poster?: MediaVariants }).poster;
    if (posterVariants && typeof posterVariants[variant] === "string") return posterVariants[variant];
  }

  return media.originalUrl;
};

export const getMediaPosterUrl = (media: MediaItem | null | undefined) => {
  if (!media) return null;
  if (media.posterUrl) return media.posterUrl;
  const variants = media.variants as { poster?: MediaVariants } | null | undefined;
  if (variants?.poster) {
    return variants.poster.lg ?? variants.poster.md ?? variants.poster.sm ?? variants.poster.thumb ?? media.originalUrl;
  }
  return media.originalUrl;
};
