import {titleFromPath} from './isPreviewable';

export const PREVIEW_ID_PREFIX = 'qk-lp-';

export type PreviewContent = {
  title: string;
  html: string;
};

const ARTICLE_REMOVE = [
  'script',
  'iframe',
  'object',
  'embed',
  'link',
  'style',
  '.hash-link',
  '.theme-edit-this-page',
  '.theme-doc-breadcrumbs',
  '.pagination-nav',
  '.theme-doc-toc-mobile',
  '.theme-doc-version-badge',
  '.theme-doc-version-banner',
  '.theme-doc-footer',
  '.doc-legacy-updated',
].join(',');

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function findSource(doc: Document): Element | null {
  return (
    doc.querySelector('article .theme-doc-markdown') ??
    doc.querySelector('.theme-doc-markdown') ??
    doc.querySelector('[class*="generatedIndexPage"]') ??
    doc.querySelector('main article') ??
    doc.querySelector('main .container')
  );
}

function readTitle(doc: Document, siteTitle: string, fallback: string): string {
  const h1 = doc.querySelector(
    'article h1, .theme-doc-markdown h1, [class*="generatedIndexPage"] h1, h1',
  );
  const fromH1 = h1?.textContent?.replace(/\s+/g, ' ').trim();
  if (fromH1) return fromH1;
  const raw = doc.title.replace(/\s+/g, ' ').trim();
  if (!raw) return fallback;
  const suffix = new RegExp(`\\s*[|·–—-]\\s*${escapeRegExp(siteTitle)}\\s*$`);
  return raw.replace(suffix, '').trim() || raw;
}

function rebaseAttr(
  el: Element,
  attr: string,
  pageUrl: string,
  origin: string,
): void {
  const value = el.getAttribute(attr);
  if (
    value == null ||
    value === '' ||
    value.startsWith('#') ||
    value.startsWith('data:') ||
    value.startsWith('blob:') ||
    value.startsWith('mailto:') ||
    value.startsWith('tel:') ||
    value.startsWith('javascript:')
  ) {
    return;
  }
  try {
    const abs = new URL(value, pageUrl);
    el.setAttribute(
      attr,
      abs.origin === origin ? abs.pathname + abs.search + abs.hash : abs.href,
    );
  } catch {
    el.removeAttribute(attr);
  }
}

function rebaseSrcset(el: Element, pageUrl: string, origin: string): void {
  const srcset = el.getAttribute('srcset');
  if (!srcset) return;
  const next = srcset
    .split(',')
    .map((part) => {
      const trimmed = part.trim();
      if (!trimmed) return trimmed;
      const bits = trimmed.split(/\s+/);
      const url = bits[0] ?? '';
      const desc = bits.slice(1).join(' ');
      try {
        const abs = new URL(url, pageUrl);
        const href = abs.origin === origin ? abs.pathname + abs.search : abs.href;
        return desc ? `${href} ${desc}` : href;
      } catch {
        return trimmed;
      }
    })
    .filter(Boolean)
    .join(', ');
  el.setAttribute('srcset', next);
}

function sanitize(source: Element, pageUrl: string, title: string): string {
  const root = source.cloneNode(true) as HTMLElement;
  root.querySelectorAll(ARTICLE_REMOVE).forEach((el) => el.remove());

  const firstH1 = root.querySelector('h1');
  if (firstH1 && firstH1.textContent?.replace(/\s+/g, ' ').trim() === title) {
    const header = firstH1.closest('header');
    if (header && header.parentElement === root) {
      header.remove();
    } else {
      firstH1.remove();
    }
  }

  const origin = new URL(pageUrl).origin;
  const tree = [root, ...root.querySelectorAll('*')];
  for (const el of tree) {
    for (const attr of [...el.attributes]) {
      if (attr.name.startsWith('on') || attr.name === 'srcdoc') {
        el.removeAttribute(attr.name);
      }
    }
    rebaseAttr(el, 'href', pageUrl, origin);
    rebaseAttr(el, 'src', pageUrl, origin);
    rebaseAttr(el, 'poster', pageUrl, origin);
    rebaseSrcset(el, pageUrl, origin);
  }

  root.querySelectorAll('[id]').forEach((el) => {
    el.id = PREVIEW_ID_PREFIX + el.id;
  });
  root.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    const href = anchor.getAttribute('href');
    if (href && href.length > 1 && !href.startsWith(`#${PREVIEW_ID_PREFIX}`)) {
      anchor.setAttribute('href', `#${PREVIEW_ID_PREFIX}${href.slice(1)}`);
    }
  });

  return root.innerHTML.trim();
}

async function fetchPageHtml(pathname: string, search: string): Promise<string> {
  const paths = [pathname];
  const alt =
    pathname.endsWith('/') && pathname.length > 1
      ? pathname.slice(0, -1)
      : `${pathname}/`;
  if (alt !== pathname) paths.push(alt);

  let lastStatus = 0;
  for (const path of paths) {
    const res = await fetch(`${path}${search}`, {
      headers: {Accept: 'text/html'},
    });
    lastStatus = res.status;
    if (res.ok) return res.text();
  }
  throw new Error(`Preview fetch failed (${lastStatus})`);
}

export async function fetchDocPreview(
  href: string,
  siteTitle: string,
): Promise<PreviewContent> {
  const url = new URL(href, window.location.href);
  const pageUrl = `${url.origin}${url.pathname}${url.search}`;
  const html = await fetchPageHtml(url.pathname, url.search);
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const fallback = titleFromPath(url.pathname);
  const title = readTitle(doc, siteTitle, fallback);
  const source = findSource(doc);
  if (!source) {
    throw new Error('No article in preview HTML');
  }
  const inner = sanitize(source, pageUrl, title);
  if (!inner) {
    throw new Error('Empty preview article');
  }
  return {title, html: inner};
}
