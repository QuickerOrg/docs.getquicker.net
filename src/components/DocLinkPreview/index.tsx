/**
 * Hover preview for in-article internal doc links. Fetches the target page
 * HTML, extracts the markdown body, and shows it in a scrollable popup.
 */
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react';
import {createPortal} from 'react-dom';
import {useHistory, useLocation} from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Link from '@docusaurus/Link';
import {observeResize} from '@site/src/components/observeResize';
import {fetchDocPreview, PREVIEW_ID_PREFIX} from './extract';
import {
  cacheKey,
  canUseHoverPreview,
  isPreviewableAnchor,
  titleFromPath,
  toSitePath,
} from './isPreviewable';
import {computePopupCoords, pickAnchorRect, type PopupCoords} from './position';
import styles from './styles.module.css';

const SHOW_DELAY_MS = 420;
const HIDE_DELAY_MS = 200;
const CACHE_LIMIT = 40;

type CacheEntry =
  | {ok: true; title: string; html: string}
  | {ok: false};

type PreviewState = {
  to: string;
  hash: string;
  title: string;
  html: string;
  status: 'loading' | 'ready' | 'error';
};

const previewCache = new Map<string, CacheEntry>();
const inflight = new Map<string, Promise<CacheEntry>>();

function cacheGet(key: string): CacheEntry | undefined {
  const hit = previewCache.get(key);
  if (!hit) return undefined;
  previewCache.delete(key);
  previewCache.set(key, hit);
  return hit;
}

function cacheSet(key: string, value: CacheEntry): void {
  if (previewCache.has(key)) previewCache.delete(key);
  previewCache.set(key, value);
  while (previewCache.size > CACHE_LIMIT) {
    const oldest = previewCache.keys().next().value;
    if (oldest === undefined) break;
    previewCache.delete(oldest);
  }
}

function loadPreview(href: string, siteTitle: string): Promise<CacheEntry> {
  const key = cacheKey(href);
  const cached = cacheGet(key);
  if (cached) return Promise.resolve(cached);
  const pending = inflight.get(key);
  if (pending) return pending;
  const request = fetchDocPreview(href, siteTitle)
    .then((content): CacheEntry => {
      const entry: CacheEntry = {ok: true, title: content.title, html: content.html};
      cacheSet(key, entry);
      return entry;
    })
    .catch((): CacheEntry => ({ok: false}))
    .finally(() => {
      inflight.delete(key);
    });
  inflight.set(key, request);
  return request;
}

function isInside(node: EventTarget | null, host: Node | null): boolean {
  return Boolean(host && node instanceof Node && host.contains(node));
}

export default function DocLinkPreview(): ReactNode {
  const history = useHistory();
  const location = useLocation();
  const {siteConfig} = useDocusaurusContext();
  const siteTitle = siteConfig.title;

  const [open, setOpen] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [coords, setCoords] = useState<PopupCoords | null>(null);
  const [preview, setPreview] = useState<PreviewState | null>(null);

  const openRef = useRef(false);
  const anchorRef = useRef<HTMLAnchorElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const mouseRef = useRef({x: 0, y: 0});
  const genRef = useRef(0);
  const pendingAnchorRef = useRef<HTMLAnchorElement | null>(null);
  const showTimerRef = useRef(0);
  const hideTimerRef = useRef(0);

  const closeNow = useCallback((): void => {
    window.clearTimeout(showTimerRef.current);
    window.clearTimeout(hideTimerRef.current);
    showTimerRef.current = 0;
    hideTimerRef.current = 0;
    genRef.current += 1;
    pendingAnchorRef.current = null;
    anchorRef.current = null;
    if (!openRef.current) return;
    openRef.current = false;
    setOpen(false);
    setPlaced(false);
    setPreview(null);
  }, []);

  const applyEntry = useCallback(
    (href: string, entry: CacheEntry): void => {
      const path = toSitePath(href);
      if (entry.ok) {
        setPreview({
          to: path.to,
          hash: path.hash,
          title: entry.title,
          html: entry.html,
          status: 'ready',
        });
        return;
      }
      setPreview({
        to: path.to,
        hash: path.hash,
        title: titleFromPath(path.pathname),
        html: '',
        status: 'error',
      });
    },
    [],
  );

  const showFor = useCallback(
    (anchor: HTMLAnchorElement): void => {
      const href = anchor.href;
      const path = toSitePath(href);
      const gen = ++genRef.current;
      anchorRef.current = anchor;
      openRef.current = true;
      setOpen(true);
      setPlaced(false);

      // HTML fetch only. `docusaurus.prefetch` would download the target
      // page's JS graph (heavy preview chunks) and starve this request.

      const cached = cacheGet(cacheKey(href));
      if (cached) {
        applyEntry(href, cached);
        return;
      }

      setPreview({
        to: path.to,
        hash: path.hash,
        title: titleFromPath(path.pathname),
        html: '',
        status: 'loading',
      });

      void loadPreview(href, siteTitle).then((entry) => {
        if (gen !== genRef.current) return;
        applyEntry(href, entry);
      });
    },
    [applyEntry, siteTitle],
  );

  const scheduleShow = useCallback(
    (anchor: HTMLAnchorElement, x: number, y: number): void => {
      mouseRef.current = {x, y};
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = 0;
      if (anchorRef.current === anchor && openRef.current) return;
      if (pendingAnchorRef.current === anchor && showTimerRef.current) return;
      window.clearTimeout(showTimerRef.current);
      pendingAnchorRef.current = anchor;
      void loadPreview(anchor.href, siteTitle);
      const delay = openRef.current ? 80 : SHOW_DELAY_MS;
      showTimerRef.current = window.setTimeout(() => {
        showTimerRef.current = 0;
        pendingAnchorRef.current = null;
        if (!document.contains(anchor)) return;
        showFor(anchor);
      }, delay);
    },
    [showFor, siteTitle],
  );

  const scheduleHide = useCallback((): void => {
    window.clearTimeout(showTimerRef.current);
    showTimerRef.current = 0;
    window.clearTimeout(hideTimerRef.current);
    hideTimerRef.current = window.setTimeout(() => {
      hideTimerRef.current = 0;
      closeNow();
    }, HIDE_DELAY_MS);
  }, [closeNow]);

  useEffect(() => {
    closeNow();
  }, [location.pathname, location.search, location.hash, closeNow]);

  useEffect(() => {
    const onPointerOver = (event: PointerEvent): void => {
      if (event.pointerType && event.pointerType !== 'mouse') return;
      if (!canUseHoverPreview()) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest('a');
      if (anchor instanceof HTMLAnchorElement && isPreviewableAnchor(anchor)) {
        scheduleShow(anchor, event.clientX, event.clientY);
        return;
      }
      if (isInside(target, popupRef.current)) {
        window.clearTimeout(hideTimerRef.current);
        hideTimerRef.current = 0;
      }
    };

    const onPointerOut = (event: PointerEvent): void => {
      const next = event.relatedTarget;
      if (isInside(next, anchorRef.current) || isInside(next, popupRef.current)) {
        return;
      }
      if (next instanceof Element) {
        const nextAnchor = next.closest('a');
        if (
          nextAnchor instanceof HTMLAnchorElement &&
          isPreviewableAnchor(nextAnchor)
        ) {
          return;
        }
      }
      if (openRef.current || showTimerRef.current) {
        scheduleHide();
      }
    };

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape' && openRef.current) {
        closeNow();
      }
    };

    document.addEventListener('pointerover', onPointerOver);
    document.addEventListener('pointerout', onPointerOut);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerover', onPointerOver);
      document.removeEventListener('pointerout', onPointerOut);
      document.removeEventListener('keydown', onKeyDown);
      window.clearTimeout(showTimerRef.current);
      window.clearTimeout(hideTimerRef.current);
    };
  }, [closeNow, scheduleHide, scheduleShow]);

  useEffect(() => {
    if (!open) return;
    const onScroll = (event: Event): void => {
      if (isInside(event.target, popupRef.current)) return;
      closeNow();
    };
    window.addEventListener('scroll', onScroll, true);
    return () => window.removeEventListener('scroll', onScroll, true);
  }, [open, closeNow]);

  useEffect(() => {
    if (!open) return;
    const onWheel = (event: WheelEvent): void => {
      const body = bodyRef.current;
      const anchor = anchorRef.current;
      const popup = popupRef.current;
      const target = event.target;
      if (!(target instanceof Node) || !body) return;
      const overAnchor = isInside(target, anchor);
      const overPopup = isInside(target, popup);
      if (!overAnchor && !overPopup) return;

      if (overPopup) {
        let node: HTMLElement | null =
          target instanceof HTMLElement ? target : target.parentElement;
        while (node && node !== body) {
          if (node.scrollHeight > node.clientHeight + 1) return;
          node = node.parentElement;
        }
        const atTop = body.scrollTop <= 0 && event.deltaY < 0;
        const atBottom =
          body.scrollTop + body.clientHeight >= body.scrollHeight - 1 &&
          event.deltaY > 0;
        if (atTop || atBottom) event.preventDefault();
        return;
      }

      event.preventDefault();
      body.scrollTop += event.deltaY;
    };
    document.addEventListener('wheel', onWheel, {passive: false, capture: true});
    return () => document.removeEventListener('wheel', onWheel, true);
  }, [open]);

  const updatePosition = useCallback((): void => {
    const popup = popupRef.current;
    const anchor = anchorRef.current;
    if (!popup || !anchor || !document.contains(anchor)) return;
    const rect = pickAnchorRect(anchor, mouseRef.current.x, mouseRef.current.y);
    const box = popup.getBoundingClientRect();
    setCoords(computePopupCoords(rect, {width: box.width, height: box.height}));
    setPlaced(true);
  }, []);

  useLayoutEffect(() => {
    if (!open) {
      setPlaced(false);
      return;
    }
    updatePosition();
  }, [open, preview?.status, preview?.html, preview?.title, updatePosition]);

  useEffect(() => {
    if (!open) return;
    return observeResize([popupRef.current], updatePosition);
  }, [open, preview?.html, updatePosition]);

  useLayoutEffect(() => {
    if (!open || preview?.status !== 'ready' || !preview.hash) return;
    const body = bodyRef.current;
    if (!body) return;
    let raw = preview.hash.slice(1);
    try {
      raw = decodeURIComponent(raw);
    } catch {
      /* keep raw hash */
    }
    const targetId = PREVIEW_ID_PREFIX + raw;
    const heading = [...body.querySelectorAll('[id]')].find(
      (node) => node.id === targetId,
    );
    if (heading instanceof HTMLElement) {
      heading.classList.add('qk-link-preview-target');
      heading.scrollIntoView({block: 'start'});
    }
  }, [open, preview?.status, preview?.html, preview?.hash]);

  const onPreviewClick = (event: MouseEvent<HTMLDivElement>): void => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const anchor = target.closest('a');
    if (!(anchor instanceof HTMLAnchorElement)) return;
    const href = anchor.getAttribute('href');
    if (!href) return;
    if (href.startsWith('#')) {
      event.preventDefault();
      const id = href.slice(1);
      const heading = [...(bodyRef.current?.querySelectorAll('[id]') ?? [])].find(
        (node) => node.id === id,
      );
      if (heading instanceof HTMLElement) {
        heading.scrollIntoView({block: 'start'});
      }
      return;
    }
    try {
      const url = new URL(anchor.href);
      if (url.origin === window.location.origin) {
        event.preventDefault();
        history.push(url.pathname + url.search + url.hash);
      }
    } catch {
      /* let the browser handle it */
    }
  };

  if (!open || !preview || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div
      ref={popupRef}
      className={`qk-link-preview ${styles.popup}`}
      data-placement={coords?.placement ?? 'below'}
      data-placed={placed ? 'true' : 'false'}
      style={
        coords
          ? {top: coords.top, left: coords.left}
          : {top: 0, left: 0}
      }
      role="dialog"
      aria-modal="false"
      aria-label={preview.title || '页面预览'}
      aria-busy={preview.status === 'loading'}
    >
      <div className={styles.header}>
        <Link className={styles.title} to={preview.to} title={preview.title}>
          {preview.title}
        </Link>
        <Link className={styles.open} to={preview.to}>
          查看全文
        </Link>
      </div>
      {preview.status === 'loading' ? (
        <div className={styles.skeleton} role="status">
          <span />
          <span />
          <span />
        </div>
      ) : preview.status === 'error' ? (
        <p className={styles.message}>无法加载此页面预览。</p>
      ) : (
        <div
          ref={bodyRef}
          className={`${styles.body} markdown theme-doc-markdown`}
          onClick={onPreviewClick}
          dangerouslySetInnerHTML={{__html: preview.html}}
        />
      )}
    </div>,
    document.body,
  );
}
