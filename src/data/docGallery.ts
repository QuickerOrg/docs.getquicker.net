import {usePluginData} from "@docusaurus/useGlobalData";

export type DocGalleryEntry = {
  description?: string;
  covers?: string[];
  excerpt?: string;
  hints?: string[];
};

export type DocGalleryMap = Record<string, DocGalleryEntry>;

export function lookupDocGallery(
  gallery: DocGalleryMap,
  href: string | undefined,
): DocGalleryEntry | undefined {
  if (!href) return undefined;
  return gallery[href] ?? gallery[href.replace(/\/$/, "")] ?? undefined;
}

/** Build-time map from plugins/doc-gallery.js. Do not scan or import docs here. */
export function useDocGallery(): DocGalleryMap {
  const data = usePluginData("doc-gallery") as {gallery?: DocGalleryMap};
  return data.gallery ?? {};
}
