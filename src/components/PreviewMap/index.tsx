/**
 * Numbered highlight boxes from parameter rows (`data-preview-from`)
 * to a floating, draggable runtime preview (`data-preview-to`).
 * Replaces annotated red-arrow teaching screenshots.
 */
import {
  Children,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import styles from './styles.module.css';

export type PreviewMapLink = {
  /** Source `data-preview-from` key (usually a catalog param key). */
  from: string;
  /** Target `data-preview-to` slot on the runtime preview. */
  to: string;
  /** Optional legend text. Defaults to "from → to". */
  label?: string;
};

export type PreviewMapProps = {
  /** Exactly two children: source preview, then runtime preview. */
  children: ReactNode;
  links: readonly PreviewMapLink[];
  labels?: [string, string];
  caption?: string;
  className?: string;
};

type Box = {x: number; y: number; w: number; h: number};

type Connector = {
  id: string;
  index: number;
  fromBadge: {x: number; y: number};
  to: Box;
  toBadge: {x: number; y: number};
};

type Pos = {x: number; y: number};

const FROM_LABEL: Record<string, string> = {
  title: '标题',
  message: '内容',
  icon: '图标',
  customIcon: '图标',
  buttons: '按钮',
  customButtons: '按钮',
  defaultButton: '默认按钮',
  actionIcon: '动作图标',
};

const TO_LABEL: Record<string, string> = {
  title: '标题栏',
  message: '正文',
  icon: '消息图标',
  buttons: '按钮区',
  primaryButton: '默认按钮',
  actionIcon: '标题栏图标',
};

function escapeAttrSelector(value: string): string {
  if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') {
    return CSS.escape(value);
  }
  return value.replace(/["\\]/g, '\\$&');
}

function handleOf(el: Element, side: 'from' | 'to'): Element {
  return el.querySelector(`[data-preview-handle="${side}"]`) ?? el;
}

function visibleInClip(el: Element): boolean {
  const rect = el.getBoundingClientRect();
  if (rect.width < 2 || rect.height < 2) return false;
  let node: HTMLElement | null = el.parentElement;
  while (node) {
    const style = window.getComputedStyle(node);
    const overflowY = style.overflowY;
    const clips =
      overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'hidden';
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

function toBox(
  rect: DOMRect,
  root: DOMRect,
  pad = 4,
  minW = 0,
  minH = 0,
): Box {
  const w = Math.max(minW, rect.width + pad * 2);
  const h = Math.max(minH, rect.height + pad * 2);
  return {
    x: rect.left - root.left + rect.width / 2 - w / 2,
    y: rect.top - root.top + rect.height / 2 - h / 2,
    w,
    h,
  };
}

function targetBox(rect: DOMRect, root: DOMRect, slot: string): Box {
  if (slot === 'icon' || slot === 'actionIcon' || slot === 'primaryButton') {
    return toBox(rect, root, 5, 28, 28);
  }
  if (slot === 'title' || slot === 'message') {
    return toBox(rect, root, 5, 36, 22);
  }
  return toBox(rect, root, 4, 0, 22);
}

function clampPos(next: Pos, stage: HTMLElement, floater: HTMLElement): Pos {
  const maxX = Math.max(0, stage.clientWidth - floater.offsetWidth);
  const maxY = Math.max(0, stage.clientHeight - floater.offsetHeight);
  return {
    x: Math.min(maxX, Math.max(0, next.x)),
    y: Math.min(maxY, Math.max(0, next.y)),
  };
}

function defaultPos(stage: HTMLElement, floater: HTMLElement): Pos {
  return clampPos(
    {
      x: stage.clientWidth - floater.offsetWidth - 16,
      y: 52,
    },
    stage,
    floater,
  );
}

function isDragHandle(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  return Boolean(
    target.closest('[data-preview-drag-handle]') ||
      target.closest('[data-preview-to="title"]') ||
      target.closest('[data-preview-to="actionIcon"]'),
  );
}

function IndexBadge({
  x,
  y,
  index,
  badgeClass,
  textClass,
}: {
  x: number;
  y: number;
  index: number;
  badgeClass: string;
  textClass: string;
}): ReactNode {
  return (
    <g>
      <circle cx={x} cy={y} r={8} className={badgeClass} />
      <text x={x} y={y} className={textClass}>
        {index}
      </text>
    </g>
  );
}

function linkLabel(link: PreviewMapLink): string {
  if (link.label?.trim()) return link.label.trim();
  const from = FROM_LABEL[link.from] ?? link.from;
  const to = TO_LABEL[link.to] ?? link.to;
  return `${from} → ${to}`;
}

export default function PreviewMap({
  children,
  links,
  labels,
  caption,
  className,
}: PreviewMapProps): ReactNode {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const floatRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [pos, setPos] = useState<Pos | null>(null);
  const [dragging, setDragging] = useState(false);
  const panes = Children.toArray(children).filter(Boolean);

  const measure = useCallback((): void => {
    const root = rootRef.current;
    if (!root) return;
    const rootRect = root.getBoundingClientRect();
    const next: Connector[] = [];
    for (const link of links) {
      const fromEl = root.querySelector(
        `[data-preview-from="${escapeAttrSelector(link.from)}"]`,
      );
      const toEl = root.querySelector(
        `[data-preview-to="${escapeAttrSelector(link.to)}"]`,
      );
      if (!fromEl || !toEl) continue;
      const fromHandle = handleOf(fromEl, 'from');
      const toHandle = handleOf(toEl, 'to');
      if (!visibleInClip(fromHandle) || !visibleInClip(toHandle)) continue;
      const fieldRect = fromHandle.getBoundingClientRect();
      const to = targetBox(toHandle.getBoundingClientRect(), rootRect, link.to);
      next.push({
        id: `${link.from}->${link.to}`,
        index: next.length + 1,
        fromBadge: {
          x: fieldRect.left - rootRect.left - 10,
          y: fieldRect.top - rootRect.top + 12,
        },
        to,
        toBadge: {x: to.x + 1, y: to.y + 1},
      });
    }
    setConnectors(next);
  }, [links]);

  const placeDefault = useCallback((): void => {
    const stage = stageRef.current;
    const floater = floatRef.current;
    if (!stage || !floater) return;
    setPos(defaultPos(stage, floater));
  }, []);

  useLayoutEffect(() => {
    if (!pos) placeDefault();
  }, [pos, placeDefault, panes.length]);

  useLayoutEffect(() => {
    measure();
  }, [measure, pos]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const floater = floatRef.current;
    if (!root) return;
    const ro = new ResizeObserver(() => {
      const s = stageRef.current;
      const f = floatRef.current;
      if (s && f) {
        setPos((prev) => {
          const next = clampPos(prev ?? defaultPos(s, f), s, f);
          if (prev && next.x === prev.x && next.y === prev.y) return prev;
          return next;
        });
      }
      measure();
    });
    ro.observe(root);
    if (stage) ro.observe(stage);
    if (floater) ro.observe(floater);
    const onScrollOrResize = (): void => measure();
    root.addEventListener('scroll', onScrollOrResize, true);
    window.addEventListener('resize', onScrollOrResize);
    const fonts = document.fonts;
    void fonts?.ready.then(() => measure());
    return () => {
      ro.disconnect();
      root.removeEventListener('scroll', onScrollOrResize, true);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [measure, panes.length]);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>): void => {
    if (event.button !== 0) return;
    if (!isDragHandle(event.target)) return;
    const stage = stageRef.current;
    const floater = floatRef.current;
    if (!stage || !floater) return;
    const current = pos ?? defaultPos(stage, floater);
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      origX: current.x,
      origY: current.y,
    };
    floater.setPointerCapture(event.pointerId);
    setDragging(true);
    event.preventDefault();
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>): void => {
    const drag = dragRef.current;
    const stage = stageRef.current;
    const floater = floatRef.current;
    if (!drag || drag.pointerId !== event.pointerId || !stage || !floater) return;
    setPos(
      clampPos(
        {
          x: drag.origX + (event.clientX - drag.startX),
          y: drag.origY + (event.clientY - drag.startY),
        },
        stage,
        floater,
      ),
    );
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>): void => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    setDragging(false);
    if (floatRef.current?.hasPointerCapture(event.pointerId)) {
      floatRef.current.releasePointerCapture(event.pointerId);
    }
  };

  if (panes.length !== 2) {
    return (
      <div className={['qk-docs-preview', styles.root, className].filter(Boolean).join(' ')}>
        <p className={styles.error}>
          PreviewMap 需要恰好两个子预览（参数窗 + 运行态），当前为 {panes.length} 个。
        </p>
      </div>
    );
  }

  const sourceLabel = labels?.[0] ?? '参数';
  const targetLabel = labels?.[1] ?? '运行效果';

  return (
    <div
      ref={rootRef}
      className={['qk-docs-preview', styles.root, className].filter(Boolean).join(' ')}>
      <div ref={stageRef} className={styles.stage}>
        <figure className={styles.sourcePane}>
          <figcaption className={styles.srOnly}>{sourceLabel}</figcaption>
          <div className={styles.source}>{panes[0]}</div>
        </figure>
        <div
          ref={floatRef}
          className={[styles.floater, dragging ? styles.floaterDragging : '']
            .filter(Boolean)
            .join(' ')}
          style={pos ? {left: pos.x, top: pos.y} : undefined}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onDoubleClick={placeDefault}
          title="拖动标题栏可移动，双击复位">
          <div className={styles.floaterBar} data-preview-drag-handle>
            <span>{targetLabel}</span>
            <span className={styles.floaterHint}>拖动</span>
          </div>
          <div className={styles.target}>{panes[1]}</div>
        </div>
        <svg className={styles.svg} data-preview-overlay aria-hidden>
          {connectors.map((item) => (
            <g key={item.id}>
              <IndexBadge
                x={item.fromBadge.x}
                y={item.fromBadge.y}
                index={item.index}
                badgeClass={styles.badge}
                textClass={styles.badgeText}
              />
              <rect
                x={item.to.x}
                y={item.to.y}
                width={item.to.w}
                height={item.to.h}
                rx={3}
                className={styles.box}
              />
              <IndexBadge
                x={item.toBadge.x}
                y={item.toBadge.y}
                index={item.index}
                badgeClass={styles.badge}
                textClass={styles.badgeText}
              />
            </g>
          ))}
        </svg>
      </div>
      <ul className={styles.legend}>
        {links.map((link) => (
          <li key={`${link.from}->${link.to}`}>{linkLabel(link)}</li>
        ))}
      </ul>
      {caption ? <p className={styles.caption}>{caption}</p> : null}
    </div>
  );
}
