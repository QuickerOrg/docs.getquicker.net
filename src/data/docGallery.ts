import generated from "./docGallery.generated.json";

export type DocGalleryEntry = {
  description?: string;
  covers?: string[];
  excerpt?: string;
  hints?: string[];
};

export const docGallery = generated as Record<string, DocGalleryEntry>;

export function lookupDocGallery(href: string | undefined): DocGalleryEntry | undefined {
  if (!href) return undefined;
  return docGallery[href] ?? docGallery[href.replace(/\/$/, "")] ?? undefined;
}
