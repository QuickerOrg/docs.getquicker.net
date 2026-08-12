/**
 * Interactive Capture Pro selection demo: hover picks deepest UIA-like target,
 * wheel navigates parent / child. On pointer leave, resets and auto-plays hierarchy.
 */
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from 'react';
import styles from './styles.module.css';

export type CaptureTargetId = string;

/** parentId = null means root (e.g. window). */
export type CaptureHierarchy = Record<CaptureTargetId, CaptureTargetId | null>;

type Point = {x: number; y: number};

type MeasuredRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

type CaptureTargetRefs = Record<CaptureTargetId, RefObject<HTMLElement | null>>;

const INITIAL_TARGET: CaptureTargetId = 'btnSave';
const AUTO_SEQUENCE: CaptureTargetId[] = ['btnSave', 'panel', 'window'];
const LEAVE_RESET_MS = 180;
const AUTO_ADVANCE_MS = 1500;
const AUTO_LOOP_GAP_MS = 700;

const TARGET_LABELS: Record<CaptureTargetId, string> = {
  window: '窗口',
  panel: '面板',
  fieldName: '名称输入框',
  fieldDesc: '说明输入框',
  btnCancel: '取消按钮',
  btnSave: '保存按钮',
};

export const CAPTURE_PRO_DEMO_HIERARCHY: CaptureHierarchy = {
  window: null,
  panel: 'window',
  fieldName: 'panel',
  fieldDesc: 'panel',
  btnCancel: 'panel',
  btnSave: 'panel',
};

function getDepth(id: CaptureTargetId, hierarchy: CaptureHierarchy): number {
  let depth = 0;
  let current: CaptureTargetId = id;
  while (true) {
    const parent = hierarchy[current];
    if (!parent) return depth;
    depth += 1;
    current = parent;
  }
}

function isAncestorOf(
  ancestor: CaptureTargetId,
  node: CaptureTargetId,
  hierarchy: CaptureHierarchy,
): boolean {
  let current: CaptureTargetId | null = node;
  while (current) {
    if (current === ancestor) return true;
    current = hierarchy[current] ?? null;
  }
  return false;
}

function getParent(
  id: CaptureTargetId,
  hierarchy: CaptureHierarchy,
): CaptureTargetId | null {
  return hierarchy[id] ?? null;
}

function navigateChild(
  activeId: CaptureTargetId,
  deepestAtPoint: CaptureTargetId,
  hierarchy: CaptureHierarchy,
): CaptureTargetId {
  if (deepestAtPoint === activeId) return activeId;
  if (!isAncestorOf(activeId, deepestAtPoint, hierarchy)) return activeId;

  let current = deepestAtPoint;
  while (hierarchy[current] && hierarchy[current] !== activeId) {
    current = hierarchy[current]!;
  }
  return hierarchy[current] === activeId ? current : activeId;
}

function measureRect(container: HTMLElement, target: HTMLElement): MeasuredRect {
  const containerBox = container.getBoundingClientRect();
  const box = target.getBoundingClientRect();
  return {
    left: box.left - containerBox.left,
    top: box.top - containerBox.top,
    width: box.width,
    height: box.height,
  };
}

function formatSize(rect: MeasuredRect | null): string {
  if (!rect) return '';
  return `${Math.round(rect.width)} × ${Math.round(rect.height)}`;
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export type ScreenshotSelectionDemoProps = {
  hierarchy?: CaptureHierarchy;
  caption?: ReactNode;
};

export default function ScreenshotSelectionDemo({
  hierarchy = CAPTURE_PRO_DEMO_HIERARCHY,
  caption,
}: ScreenshotSelectionDemoProps): ReactNode {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const windowRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const fieldNameRef = useRef<HTMLDivElement | null>(null);
  const fieldDescRef = useRef<HTMLDivElement | null>(null);
  const btnCancelRef = useRef<HTMLSpanElement | null>(null);
  const btnSaveRef = useRef<HTMLSpanElement | null>(null);
  const autoTimersRef = useRef<number[]>([]);
  const wheelHintTimerRef = useRef<number | null>(null);

  const targetRefs: CaptureTargetRefs = useMemo(
    () => ({
      window: windowRef,
      panel: panelRef,
      fieldName: fieldNameRef,
      fieldDesc: fieldDescRef,
      btnCancel: btnCancelRef,
      btnSave: btnSaveRef,
    }),
    [],
  );

  const targetIds = useMemo(
    () => Object.keys(hierarchy) as CaptureTargetId[],
    [hierarchy],
  );

  const [activeId, setActiveId] = useState<CaptureTargetId>(INITIAL_TARGET);
  const [activeRect, setActiveRect] = useState<MeasuredRect | null>(null);
  const [pointer, setPointer] = useState<Point>({x: 0, y: 0});
  const [wheelHint, setWheelHint] = useState(false);
  const [isPointerInside, setIsPointerInside] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [inView, setInView] = useState(true);
  const [motionOk, setMotionOk] = useState(true);
  const pointerRef = useRef<Point>({x: 0, y: 0});
  const isPointerInsideRef = useRef(false);
  const isConfirmedRef = useRef(false);

  const clearAutoTimers = useCallback((): void => {
    for (const id of autoTimersRef.current) {
      window.clearTimeout(id);
    }
    autoTimersRef.current = [];
  }, []);

  const scheduleAuto = useCallback((fn: () => void, ms: number): void => {
    autoTimersRef.current.push(window.setTimeout(fn, ms));
  }, []);

  const getTargetAnchor = useCallback(
    (id: CaptureTargetId): Point => {
      const container = stageRef.current;
      const el = targetRefs[id]?.current;
      if (!container || !el) return {x: 0, y: 0};

      const containerBox = container.getBoundingClientRect();
      const box = el.getBoundingClientRect();
      return {
        x: box.left - containerBox.left + box.width * 0.55,
        y: box.top - containerBox.top + box.height * 0.5,
      };
    },
    [targetRefs],
  );

  const syncActiveRect = useCallback(
    (id: CaptureTargetId) => {
      const container = stageRef.current;
      const el = targetRefs[id]?.current;
      if (!container || !el) return;
      setActiveRect(measureRect(container, el));
    },
    [targetRefs],
  );

  const applySelection = useCallback(
    (id: CaptureTargetId, anchor?: Point) => {
      setActiveId(id);
      syncActiveRect(id);
      if (anchor) {
        pointerRef.current = anchor;
        setPointer(anchor);
      }
    },
    [syncActiveRect],
  );

  const resetToInitial = useCallback(
    (anchorId: CaptureTargetId = INITIAL_TARGET) => {
      const anchor = getTargetAnchor(anchorId);
      applySelection(INITIAL_TARGET, anchor);
      setWheelHint(false);
      setIsConfirmed(false);
      isConfirmedRef.current = false;
    },
    [applySelection, getTargetAnchor],
  );

  const pickDeepestAtPoint = useCallback(
    (point: Point): CaptureTargetId => {
      const container = stageRef.current;
      if (!container) return INITIAL_TARGET;

      const containerBox = container.getBoundingClientRect();
      const hits: CaptureTargetId[] = [];

      for (const id of targetIds) {
        const el = targetRefs[id]?.current;
        if (!el) continue;
        const box = el.getBoundingClientRect();
        const x = containerBox.left + point.x;
        const y = containerBox.top + point.y;
        if (
          x >= box.left &&
          x <= box.right &&
          y >= box.top &&
          y <= box.bottom
        ) {
          hits.push(id);
        }
      }

      if (hits.length === 0) return 'window';

      hits.sort((a, b) => getDepth(b, hierarchy) - getDepth(a, hierarchy));
      return hits[0]!;
    },
    [hierarchy, targetIds, targetRefs],
  );

  const flashWheelHint = useCallback(() => {
    setWheelHint(true);
    if (wheelHintTimerRef.current !== null) {
      window.clearTimeout(wheelHintTimerRef.current);
    }
    wheelHintTimerRef.current = window.setTimeout(() => {
      setWheelHint(false);
      wheelHintTimerRef.current = null;
    }, 1600);
  }, []);

  const handlePointerEnter = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      clearAutoTimers();
      setIsPointerInside(true);
      isPointerInsideRef.current = true;
      setIsConfirmed(false);
      isConfirmedRef.current = false;
      setWheelHint(false);

      const container = stageRef.current;
      if (!container) return;

      const box = container.getBoundingClientRect();
      const point = {
        x: event.clientX - box.left,
        y: event.clientY - box.top,
      };
      pointerRef.current = point;
      setPointer(point);

      const deepest = pickDeepestAtPoint(point);
      applySelection(deepest);
    },
    [applySelection, clearAutoTimers, pickDeepestAtPoint],
  );

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!isPointerInsideRef.current || isConfirmedRef.current) return;

      const container = stageRef.current;
      if (!container) return;

      const box = container.getBoundingClientRect();
      const point = {
        x: event.clientX - box.left,
        y: event.clientY - box.top,
      };
      pointerRef.current = point;
      setPointer(point);

      const deepest = pickDeepestAtPoint(point);
      applySelection(deepest);
    },
    [applySelection, pickDeepestAtPoint],
  );

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.button !== 0 || !isPointerInsideRef.current || isConfirmedRef.current) {
        return;
      }
      event.preventDefault();
      setIsConfirmed(true);
      isConfirmedRef.current = true;
      setWheelHint(false);
    },
    [],
  );

  const handlePointerLeave = useCallback(() => {
    setIsPointerInside(false);
    isPointerInsideRef.current = false;
    clearAutoTimers();
    resetToInitial();
  }, [clearAutoTimers, resetToInitial]);

  const handleWheel = useCallback(
    (event: WheelEvent) => {
      if (!isPointerInsideRef.current) return;
      // After confirm, release wheel so the doc page can scroll.
      if (isConfirmedRef.current) return;

      event.preventDefault();
      event.stopPropagation();
      flashWheelHint();

      setActiveId((current) => {
        let next = current;
        if (event.deltaY < 0) {
          next = getParent(current, hierarchy) ?? current;
        } else if (event.deltaY > 0) {
          const deepest = pickDeepestAtPoint(pointerRef.current);
          next = navigateChild(current, deepest, hierarchy);
        }
        syncActiveRect(next);
        return next;
      });
    },
    [flashWheelHint, hierarchy, pickDeepestAtPoint, syncActiveRect],
  );

  useEffect(() => {
    setMotionOk(!prefersReducedMotion());
  }, []);

  useEffect(() => {
    const container = stageRef.current;
    if (!container) return undefined;

    container.addEventListener('wheel', handleWheel, {passive: false});
    return () => container.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry?.isIntersecting ?? false),
      {threshold: 0.25},
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isPointerInside || !inView || !motionOk) {
      clearAutoTimers();
      return undefined;
    }

    let cancelled = false;
    let step = 0;

    const runStep = (): void => {
      if (cancelled) return;

      const id = AUTO_SEQUENCE[step] ?? INITIAL_TARGET;
      const anchor = getTargetAnchor(INITIAL_TARGET);
      applySelection(id, anchor);
      setWheelHint(id !== INITIAL_TARGET);

      const isLast = step === AUTO_SEQUENCE.length - 1;
      const delay = isLast ? AUTO_LOOP_GAP_MS : AUTO_ADVANCE_MS;
      step = isLast ? 0 : step + 1;

      scheduleAuto(runStep, delay);
    };

    scheduleAuto(runStep, LEAVE_RESET_MS);

    return () => {
      cancelled = true;
      clearAutoTimers();
    };
  }, [
    applySelection,
    clearAutoTimers,
    getTargetAnchor,
    inView,
    isPointerInside,
    motionOk,
    scheduleAuto,
  ]);

  useLayoutEffect(() => {
    const remeasure = (): void => {
      syncActiveRect(activeId);
      if (!isPointerInside) {
        const anchor = getTargetAnchor(INITIAL_TARGET);
        pointerRef.current = anchor;
        setPointer(anchor);
      }
    };
    remeasure();

    const container = stageRef.current;
    if (!container) return undefined;

    const observer = new ResizeObserver(remeasure);
    observer.observe(container);
    for (const id of targetIds) {
      const el = targetRefs[id]?.current;
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [activeId, getTargetAnchor, isPointerInside, syncActiveRect, targetIds, targetRefs]);

  useEffect(() => {
    return () => {
      clearAutoTimers();
      if (wheelHintTimerRef.current !== null) {
        window.clearTimeout(wheelHintTimerRef.current);
      }
    };
  }, [clearAutoTimers]);

  const parentId = getParent(activeId, hierarchy);
  const canWheelUp = parentId !== null;
  const canWheelDown =
    navigateChild(
      activeId,
      pickDeepestAtPoint(pointerRef.current),
      hierarchy,
    ) !== activeId;

  const showWheelCue =
    !isConfirmed &&
    (wheelHint || (!isPointerInside && activeId !== INITIAL_TARGET));
  const wheelCueLeft = Math.min(
    Math.max(pointer.x + 12, 12),
    Math.max((stageRef.current?.clientWidth ?? 0) - 250, 12),
  );
  const wheelCueTop = Math.max(pointer.y - 16, 12);

  return (
    <div className={[styles.root, 'qk-docs-preview'].join(' ')}>
      {caption ? <p className={styles.caption}>{caption}</p> : null}

      <div
        ref={stageRef}
        className={[
          styles.captureStage,
          isPointerInside ? styles.captureStageInteractive : styles.captureStageAuto,
          isConfirmed ? styles.captureStageConfirmed : '',
        ]
          .filter(Boolean)
          .join(' ')}
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        onPointerLeave={handlePointerLeave}
        tabIndex={0}
        role="application"
        aria-label="截图 Pro 自动选区交互演示：移入后滚轮切换父级或子级，移出后自动演示">
        <div className={styles.desktop}>
          <div ref={windowRef} className={styles.mockWindow} data-capture-id="window">
            <div className={styles.mockTitleBar}>
              <span className={styles.mockTitleDot} />
              <span className={styles.mockTitleDot} />
              <span className={styles.mockTitleDot} />
              <span className={styles.mockTitleText}>设置 - 浏览器</span>
            </div>
            <div className={styles.mockBody}>
              <div className={styles.mockSidebar} />
              <div className={styles.mockMain}>
                <div className={styles.mockLineLg} />
                <div className={styles.mockLineSm} />
                <div className={styles.mockCards}>
                  <div className={styles.mockCard} />
                  <div className={styles.mockCard} />
                  <div className={styles.mockCard} />
                </div>
                <div ref={panelRef} className={styles.mockPanel} data-capture-id="panel">
                  <div className={styles.mockPanelTitle}>账号设置</div>
                  <div ref={fieldNameRef} className={styles.mockField} data-capture-id="fieldName">
                    <span>名称</span>
                    <span className={styles.mockInput} />
                  </div>
                  <div ref={fieldDescRef} className={styles.mockField} data-capture-id="fieldDesc">
                    <span>说明</span>
                    <span className={styles.mockInput} />
                  </div>
                  <div className={styles.mockActions}>
                    <span ref={btnCancelRef} className={styles.mockBtnGhost} data-capture-id="btnCancel">
                      取消
                    </span>
                    <span ref={btnSaveRef} className={styles.mockBtnPrimary} data-capture-id="btnSave">
                      保存设置
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.captureOverlay} aria-hidden>
          {activeRect ? (
            <div
              className={[
                styles.selectionFrame,
                isPointerInside ? styles.selectionInteractive : styles.selectionAuto,
              ].join(' ')}
              style={{
                left: activeRect.left,
                top: activeRect.top,
                width: activeRect.width,
                height: activeRect.height,
              }}>
              <div
                className={[
                  styles.selectionBorder,
                  isConfirmed ? styles.selectionBorderConfirmed : '',
                  showWheelCue ? styles.selectionBorderWheel : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              />
              <div className={styles.sizeHint}>
                {isConfirmed ? '已确认' : formatSize(activeRect)}
              </div>
            </div>
          ) : null}

          {!isConfirmed ? (
            <div
              className={styles.crosshair}
              style={{left: pointer.x, top: pointer.y}}
            />
          ) : null}

          {showWheelCue ? (
            <div
              className={styles.wheelCue}
              style={{left: wheelCueLeft, top: wheelCueTop}}
              aria-hidden>
              <div className={styles.wheelCueArrows}>
                <span className={canWheelUp ? styles.wheelArrowUp : styles.wheelArrowMuted}>▲</span>
                <span className={canWheelDown ? styles.wheelArrowDown : styles.wheelArrowMuted}>▼</span>
              </div>
              <div className={styles.wheelCueMouse}>
                <span className={styles.wheelCueWheel} />
              </div>
              <div className={styles.wheelCueCopy}>
                <strong>滚动滚轮</strong>
                <span>向上扩大 / 向下缩小</span>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <p className={styles.hint}>
        {isPointerInside ? (
          isConfirmed ? (
            <>
              选区已确认（{TARGET_LABELS[activeId] ?? activeId}）。现在可以滚动页面继续阅读；移出演示区将重新开始。
            </>
          ) : (
            <>
              移动鼠标吸附控件，滚轮切换父 / 子级，<strong>单击左键确认</strong>当前选区。当前：
              {TARGET_LABELS[activeId] ?? activeId}
              {parentId ? (
                <>
                  {' '}
                  · 父级 {TARGET_LABELS[parentId] ?? parentId}
                </>
              ) : null}
            </>
          )
        ) : (
          <>移入演示区可亲自操作；移出后会自动演示从「保存按钮」滚轮扩大到面板与窗口。</>
        )}
      </p>

      <span className={styles.srOnly} aria-live="polite">
        当前选区 {TARGET_LABELS[activeId] ?? activeId}，{formatSize(activeRect)}
      </span>
    </div>
  );
}
