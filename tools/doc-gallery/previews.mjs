/**
 * Shared helpers: find live preview tags in docs and map them to snapshot files.
 */
import fs from 'node:fs';
import path from 'node:path';

export const PREVIEW_TAGS = [
  'ContextMenuPreview',
  'NotifyToastPreview',
  'MsgBoxPreview',
  'ChoiceListPreview',
  'WaitWinPreview',
  'VariableDefPreview',
  'StepProgramView',
  'TableFieldPreview',
  'TableDataPreview',
  'PreviewCompare',
  'PreviewMap',
  'ShareLinkCard',
];

/** Prefer an explicit cover; skip metadata tables. */
export const GALLERY_SNAPSHOT_SELECTOR =
  '[data-gallery-cover], .qk-docs-preview:not([data-gallery-skip])';

export function snapshotFileName(href) {
  const slug = String(href ?? '')
    .replace(/^\/+/, '')
    .replace(/[^\w]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return `${slug || 'page'}.png`;
}

export function snapshotAbs(repoRoot, href) {
  return path.join(repoRoot, 'data', 'doc-gallery', 'snapshots', snapshotFileName(href));
}

export function findFirstPreview(body) {
  let best = null;
  for (const name of PREVIEW_TAGS) {
    const idx = body.indexOf(`<${name}`);
    if (idx < 0) continue;
    if (best == null || idx < best.index) {
      best = {name, index: idx};
    }
  }
  return best;
}

export function hasLocalMarkdownImage(body) {
  return /!\[[^\]]*]\((?!https?:|data:)[^)]+\)/.test(body);
}

export function listPreviewDocs(docsDir) {
  /** @type {{file: string, href: string, preview: {name: string, index: number}}[]} */
  const out = [];
  const walk = (dir) => {
    for (const name of fs.readdirSync(dir)) {
      if (name.startsWith('.')) continue;
      const full = path.join(dir, name);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        walk(full);
        continue;
      }
      if (!/\.mdx?$/.test(name)) continue;
      const raw = fs.readFileSync(full, 'utf8');
      const preview = findFirstPreview(raw);
      if (!preview) continue;
      const slug = raw.match(/^slug:\s*["']?([^"'\n]+)["']?/m)?.[1]?.trim();
      const rel = path.relative(docsDir, full).replace(/\\/g, '/').replace(/\.mdx?$/, '');
      const href = slug || `/${rel}`;
      out.push({file: full, href, preview});
    }
  };
  walk(docsDir);
  return out;
}
