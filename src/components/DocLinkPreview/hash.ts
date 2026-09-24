import {observeResize} from '../observeResize';

export const PREVIEW_ID_PREFIX = 'qk-lp-';

const HEADING_SELECTOR = 'h1, h2, h3, h4, h5, h6';

export type SectionPreview = {
  html: string;
  sectionTitle: string | null;
  found: boolean;
};

export function hashVariants(hash: string): string[] {
  const raw = hash.startsWith('#') ? hash.slice(1) : hash;
  if (!raw) return [];
  const variants = new Set<string>();
  const add = (value: string): void => {
    if (value) variants.add(value);
  };
  add(raw);
  try {
    add(decodeURIComponent(raw));
  } catch {
    /* ignore */
  }
  try {
    add(encodeURIComponent(raw));
  } catch {
    /* ignore */
  }
  try {
    const decoded = decodeURIComponent(raw);
    add(encodeURIComponent(decoded));
    try {
      add(decodeURIComponent(decoded));
    } catch {
      /* ignore */
    }
  } catch {
    /* ignore */
  }
  return [...variants];
}

/** Prefix a page fragment so it matches rewritten preview ids. */
export function previewFragmentId(hash: string): string {
  const variants = hashVariants(hash);
  const raw = variants.find((value) => {
    try {
      return decodeURIComponent(value) === value;
    } catch {
      return true;
    }
  }) ?? variants[0] ?? '';
  if (!raw) return '';
  return raw.startsWith(PREVIEW_ID_PREFIX)
    ? raw
    : PREVIEW_ID_PREFIX + raw;
}

function collectWantedIds(hash: string): Set<string> {
  const wanted = new Set<string>();
  for (const variant of hashVariants(hash)) {
    wanted.add(variant);
    if (variant.startsWith(PREVIEW_ID_PREFIX)) {
      wanted.add(variant.slice(PREVIEW_ID_PREFIX.length));
    } else {
      wanted.add(PREVIEW_ID_PREFIX + variant);
    }
  }
  return wanted;
}

function headingLevel(el: Element): number {
  const match = /^H([1-6])$/.exec(el.tagName);
  return match ? Number(match[1]) : 0;
}

function normalizeHeadingText(value: string): string {
  return value.replace(/\s+/g, '').replace(/​/g, '');
}

export function headingText(el: Element): string {
  const clone = el.cloneNode(true) as HTMLElement;
  clone.querySelectorAll('.hash-link').forEach((node) => node.remove());
  return (clone.textContent ?? '').replace(/\s+/g, ' ').trim();
}

export function findHashTarget(
  root: ParentNode,
  hash: string,
): HTMLElement | null {
  const wanted = collectWantedIds(hash);
  if (wanted.size === 0) return null;

  for (const node of root.querySelectorAll('[id]')) {
    if (!(node instanceof HTMLElement)) continue;
    const id = node.id || node.getAttribute('id') || '';
    if (id && wanted.has(id)) return node;
    try {
      if (id && wanted.has(decodeURIComponent(id))) return node;
    } catch {
      /* ignore */
    }
  }

  const texts = new Set<string>();
  for (const id of wanted) {
    const raw = id.startsWith(PREVIEW_ID_PREFIX)
      ? id.slice(PREVIEW_ID_PREFIX.length)
      : id;
    let decoded = raw;
    try {
      decoded = decodeURIComponent(raw);
    } catch {
      /* keep raw */
    }
    const compact = normalizeHeadingText(decoded);
    if (compact) texts.add(compact);
  }

  for (const node of root.querySelectorAll(HEADING_SELECTOR)) {
    if (!(node instanceof HTMLElement)) continue;
    const compact = normalizeHeadingText(node.textContent ?? '');
    if (compact && texts.has(compact)) return node;
  }
  return null;
}

function stripPreviewNoise(root: Element): void {
  root
    .querySelectorAll('.qk-docs-preview-fallback, [data-qk-preview]')
    .forEach((el) => el.remove());
}

/**
 * Slice article HTML from the hashed heading through the next heading of
 * the same or higher level (or the end). Used for hash-anchor hover cards.
 */
export function extractSection(
  articleHtml: string,
  hash: string,
): SectionPreview {
  const root = document.createElement('div');
  root.innerHTML = articleHtml;
  const target = findHashTarget(root, hash);
  if (!target) {
    return {html: articleHtml, sectionTitle: null, found: false};
  }

  const heading = target.matches(HEADING_SELECTOR)
    ? target
    : ((target.closest(HEADING_SELECTOR) as HTMLElement | null) ?? target);
  const level = headingLevel(heading);
  const parent = heading.parentNode ?? root;
  const nodes: Node[] = [];
  let started = false;
  for (const child of [...parent.childNodes]) {
    if (!started) {
      if (
        child === heading ||
        (child instanceof Element && child.contains(heading))
      ) {
        started = true;
      } else {
        continue;
      }
    } else if (child instanceof Element) {
      const nextLevel = headingLevel(child);
      if (nextLevel !== 0 && (level === 0 || nextLevel <= level)) {
        break;
      }
    }
    nodes.push(child);
  }

  const frag = document.createElement('div');
  for (const node of nodes) {
    frag.appendChild(node.cloneNode(true));
  }
  stripPreviewNoise(frag);

  const highlight =
    (frag.querySelector(HEADING_SELECTOR) as HTMLElement | null) ??
    (frag.firstElementChild instanceof HTMLElement
      ? frag.firstElementChild
      : null);
  highlight?.classList.add('qk-link-preview-target');

  const html = frag.innerHTML.trim();
  return {
    html: html || articleHtml,
    sectionTitle: headingText(heading) || null,
    found: true,
  };
}

/** Scroll a node to the top of an overflow:auto preview body. */
export function scrollPreviewToTarget(
  body: HTMLElement,
  target: HTMLElement,
  pad = 6,
): void {
  target.classList.add('qk-link-preview-target');
  const bodyRect = body.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const top = body.scrollTop + (targetRect.top - bodyRect.top) - pad;
  body.scrollTop = Math.max(0, top);
}

export function scrollPreviewToHash(
  body: HTMLElement,
  hash: string,
): HTMLElement | null {
  const target = findHashTarget(body, hash);
  if (!target) return null;
  scrollPreviewToTarget(body, target);
  return target;
}

/**
 * Keep the hashed heading pinned after images/layout. Stops when
 * `isActive` returns false (caller should flip that on user scroll).
 */
export function bindPreviewHashScroll(
  body: HTMLElement,
  hash: string,
  isActive: () => boolean,
): () => void {
  const run = (): void => {
    if (!isActive()) return;
    scrollPreviewToHash(body, hash);
  };

  run();
  const frames: number[] = [];
  frames.push(
    requestAnimationFrame(() => {
      run();
      frames.push(requestAnimationFrame(run));
    }),
  );

  const onMedia = (): void => run();
  const media = [...body.querySelectorAll('img, video')];
  for (const el of media) {
    el.addEventListener('load', onMedia);
    el.addEventListener('error', onMedia);
    el.addEventListener('loadeddata', onMedia);
  }

  const unobserve = observeResize([body, ...body.children], run);
  const later = window.setTimeout(run, 160);
  const late = window.setTimeout(run, 480);

  return () => {
    for (const id of frames) cancelAnimationFrame(id);
    window.clearTimeout(later);
    window.clearTimeout(late);
    unobserve();
    for (const el of media) {
      el.removeEventListener('load', onMedia);
      el.removeEventListener('error', onMedia);
      el.removeEventListener('loadeddata', onMedia);
    }
  };
}
