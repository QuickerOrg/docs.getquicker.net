/**
 * Numbered teaching notes rendered inside a live preview field.
 * Replaces red-text notes drawn on one parameter form.
 */
import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {createPortal} from 'react-dom';
import styles from './styles.module.css';

export type PreviewMark = {
  /** `data-preview-from` key (usually a catalog param key). */
  key: string;
  /** Teaching note shown inside the field. */
  label: string;
};

export type PreviewMarksProps = {
  children: ReactNode;
  marks: readonly PreviewMark[];
  caption?: string;
  className?: string;
};

type PlacedMark = {
  key: string;
  index: number;
  label: string;
  host: HTMLElement;
  empty: boolean;
};

const HOST_ATTR = 'data-preview-mark-host';

function escapeAttrSelector(value: string): string {
  if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') {
    return CSS.escape(value);
  }
  return value.replace(/["\\]/g, '\\$&');
}

function resolveHost(row: Element): HTMLElement | null {
  const host =
    row.querySelector('.qk-sr-param-form__varorvalue-body') ??
    row.querySelector('.step-param-control') ??
    row.querySelector('[data-preview-handle="from"]');
  return host instanceof HTMLElement ? host : null;
}

function isVisuallyEmpty(host: HTMLElement): boolean {
  const parts: string[] = [];
  for (const node of Array.from(host.childNodes)) {
    if (node instanceof HTMLElement && node.hasAttribute('data-preview-in-field')) {
      continue;
    }
    parts.push(node.textContent ?? '');
  }
  return parts.join('').replace(/\u00a0/g, '').trim().length === 0;
}

function visibleInClip(el: Element): boolean {
  const rect = el.getBoundingClientRect();
  if (rect.width < 2 || rect.height < 2) return false;
  let node: HTMLElement | null = el.parentElement;
  while (node) {
    const style = window.getComputedStyle(node);
    const clips =
      style.overflowY === 'auto' ||
      style.overflowY === 'scroll' ||
      style.overflowY === 'hidden';
    if (clips) {
      const clip = node.getBoundingClientRect();
      const overlap =
        Math.min(rect.bottom, clip.bottom) - Math.max(rect.top, clip.top);
      if (overlap < Math.min(12, rect.height * 0.35)) return false;
    }
    node = node.parentElement;
  }
  return true;
}

export default function PreviewMarks({
  children,
  marks,
  caption,
  className,
}: PreviewMarksProps): ReactNode {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const hostsRef = useRef<HTMLElement[]>([]);
  const [placed, setPlaced] = useState<PlacedMark[]>([]);

  const measure = useCallback((): void => {
    const root = rootRef.current;
    if (!root) return;
    const next: PlacedMark[] = [];
    const hosts: HTMLElement[] = [];
    for (const mark of marks) {
      const key = mark.key.trim();
      const label = mark.label.trim();
      if (!key || !label) continue;
      const row = root.querySelector(
        `[data-preview-from="${escapeAttrSelector(key)}"]`,
      );
      if (!row) continue;
      const host = resolveHost(row);
      if (!host || !visibleInClip(host)) continue;
      host.setAttribute(HOST_ATTR, '');
      hosts.push(host);
      next.push({
        key,
        index: next.length + 1,
        label,
        host,
        empty: isVisuallyEmpty(host),
      });
    }
    const stale = hostsRef.current.filter((host) => !hosts.includes(host));
    for (const host of stale) {
      host.removeAttribute(HOST_ATTR);
    }
    hostsRef.current = hosts;
    setPlaced((prev) => {
      if (
        prev.length === next.length &&
        prev.every((item, index) => {
          const other = next[index];
          return (
            item.key === other.key &&
            item.index === other.index &&
            item.label === other.label &&
            item.host === other.host &&
            item.empty === other.empty
          );
        })
      ) {
        return prev;
      }
      return next;
    });
  }, [marks]);

  useLayoutEffect(() => {
    measure();
  }, [measure, children]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(root);
    const onScrollOrResize = (): void => measure();
    root.addEventListener('scroll', onScrollOrResize, true);
    window.addEventListener('resize', onScrollOrResize);
    const fonts = document.fonts;
    void fonts?.ready.then(() => measure());
    return () => {
      ro.disconnect();
      root.removeEventListener('scroll', onScrollOrResize, true);
      window.removeEventListener('resize', onScrollOrResize);
      for (const host of hostsRef.current) {
        host.removeAttribute(HOST_ATTR);
      }
      hostsRef.current = [];
    };
  }, [measure]);

  return (
    <div
      ref={rootRef}
      className={['qk-docs-preview', styles.root, className]
        .filter(Boolean)
        .join(' ')}>
      <div className={styles.stage}>{children}</div>
      {placed.map((item) =>
        createPortal(
          <span
            data-preview-in-field=""
            className={[styles.inField, item.empty ? '' : styles.inFieldEnd]
              .filter(Boolean)
              .join(' ')}
            title={item.label}>
            <span className={styles.badge}>{item.index}</span>
            <span className={styles.chip}>{item.label}</span>
          </span>,
          item.host,
          item.key,
        ),
      )}
      {caption ? <p className={styles.caption}>{caption}</p> : null}
    </div>
  );
}
