export type MediaType = "image" | "video";

export type MediaVariants = Record<string, string>;

export type MediaItem = {
  id: string;
  type: MediaType;
  folder?: string | null;
  originalUrl: string;
  variants?: MediaVariants | { poster?: MediaVariants } | null;
  posterUrl?: string | null;
  mime: string;
  size: number;
  width?: number | null;
  height?: number | null;
  duration?: number | null;
  createdAt: string | Date;
};
