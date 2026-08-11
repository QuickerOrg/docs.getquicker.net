import {usePluginData} from "@docusaurus/useGlobalData";

/** Keep in sync with tools/doc-gallery/hints.mjs */
const STRUCTURAL_HINT_HEADINGS = new Set([
  "当前模块定义",
  "概述",
  "参数",
  "参数说明",
  "输入参数",
  "输出",
  "输出参数",
  "通用参数",
  "操作类型",
  "示例",
  "示例动作",
  "相关",
  "相关链接",
  "限制",
  "限制与排障",
  "注意事项",
  "说明",
  "使用场景",
  "应用场景",
  "快速操作",
  "常见问题",
  "更新历史",
  "更改历史",
]);

/** Generic page-skeleton headings — not useful as a DocCard cover. */
export function isStructuralHint(label: string | undefined): boolean {
  return STRUCTURAL_HINT_HEADINGS.has((label ?? "").trim());
}

export type DocGalleryLiveCover = {
  name: string;
  props: Record<string, unknown>;
};

export type DocGalleryEntry = {
  description?: string;
  covers?: string[];
  excerpt?: string;
  hints?: string[];
  liveCover?: DocGalleryLiveCover;
};

export type DocGalleryMap = Record<string, DocGalleryEntry>;

export function lookupDocGallery(
  gallery: DocGalleryMap,
  href: string | undefined,
): DocGalleryEntry | undefined {
  if (!href) return undefined;
  return gallery[href] ?? gallery[href.replace(/\/$/, "")] ?? undefined;
}

/** Gallery map injected by plugins/doc-gallery.js at start/build. */
export function useDocGallery(): DocGalleryMap {
  const data = usePluginData("doc-gallery") as {gallery?: DocGalleryMap};
  return data.gallery ?? {};
}
