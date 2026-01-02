import { Media } from "../payload-types";

export const getMediaUrl = (media: string | Media | null | undefined): string | null => {
  if (!media) return null;
  if (typeof media === "string") return null;
  return media.url || null;
};

export const getMediaAlt = (media: string | Media | null | undefined): string => {
  if (!media || typeof media === "string") return "";
  return media.alt || "";
};