const SKIP_CLOSEST = [
  '.navbar',
  '.navbar-sidebar',
  '.theme-doc-sidebar-container',
  '.footer',
  '.table-of-contents',
  '.theme-doc-toc-desktop',
  '.theme-doc-toc-mobile',
  '.hash-link',
  '.theme-edit-this-page',
  '.theme-doc-card--gallery',
  '.card',
  '.qk-link-preview',
].join(',');

const HOST_CLOSEST = [
  'article',
  '.markdown',
  '.theme-doc-markdown',
  '.pagination-nav',
].join(',');

const FILE_EXT =
  /\.(?:png|jpe?g|gif|webp|svg|ico|pdf|zip|7z|rar|gz|tgz|exe|mp4|mp3|wav|woff2?|ttf|otf)$/i;

export function canUseHoverPreview(): boolean {
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

export function normalizePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1);
  }
  return pathname || '/';
}

export function isPreviewableAnchor(anchor: HTMLAnchorElement): boolean {
  if (anchor.hasAttribute('download')) return false;
  if (anchor.classList.contains('hash-link')) return false;
  const raw = anchor.getAttribute('href');
  if (!raw || raw === '#' || raw.startsWith('javascript:')) return false;

  let url: URL;
  try {
    url = new URL(anchor.href);
  } catch {
    return false;
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;
  if (url.origin !== window.location.origin) return false;
  if (FILE_EXT.test(url.pathname)) return false;
  if (
    normalizePath(url.pathname) === normalizePath(window.location.pathname) &&
    url.search === window.location.search
  ) {
    return false;
  }
  if (anchor.closest(SKIP_CLOSEST)) return false;
  if (!anchor.closest(HOST_CLOSEST)) return false;
  return true;
}

export function toSitePath(href: string): {
  pathname: string;
  search: string;
  hash: string;
  to: string;
} {
  const url = new URL(href, window.location.href);
  return {
    pathname: url.pathname,
    search: url.search,
    hash: url.hash,
    to: url.pathname + url.search + url.hash,
  };
}

export function cacheKey(href: string): string {
  const url = new URL(href, window.location.href);
  return normalizePath(url.pathname) + url.search;
}

export function titleFromPath(pathname: string): string {
  const part = pathname.split('/').filter(Boolean).pop();
  if (!part) return '页面预览';
  try {
    return decodeURIComponent(part);
  } catch {
    return part;
  }
}
