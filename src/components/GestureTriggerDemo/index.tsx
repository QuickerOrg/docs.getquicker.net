/**
 * Docs demo: mouse-gesture trail overlay (autoplay + interactive draw).
 *
 * Runtime visual source (WPF):
 * - QuickerPc/Quicker/Domain/Gestures/GestureWindow.xaml(+.cs)
 * - GestureVisualHost.cs / GestureStrokeGeometry.cs
 * Colors from GestureSettings: ValidColor #00BFFF, InvalidColor #808080, StrokeThickness 2
 *
 * Geometry helpers adapted from Headless gestureStrokeGeometry.ts + WPF Catmull-Rom.
 * Does NOT run UniversalRecognizer — interactive strokes show direction arrows only.
 */
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import {useAutoPlayDemo} from '@site/src/components/docs-demo/useAutoPlayDemo';
import {
  deriveGestureDirectionName,
  strokePathLength,
  strokePrefixByFraction,
  strokeToSmoothSvgPath,
  type StrokePoint,
} from './strokeGeometry';
import styles from './styles.module.css';

/** Product defaults from GestureSettings.cs */
const VALID_COLOR = '#00BFFF';
const INVALID_COLOR = '#808080';
const DRAWING_COLOR = '#C0C0C0';
const STROKE_WIDTH = 2.5;
const MIN_STROKE_LENGTH_PX = 40;

const DRAW_MS = 1100;
const HOLD_MS = 1600;
const GAP_MS = 700;
const TICK_MS = 32;

type PresetGesture = {
  id: string;
  /** Normalized 0–1 points in stage space (before mapping to pixels). */
  points: StrokePoint[];
  actionLabel: string;
};

/**
 * Hand-authored short polylines (not PresetGestures library).
 * Coordinates are relative to a 400×280 drawing area inside the stage.
 */
const PRESETS: PresetGesture[] = [
  {
    id: 'right',
    points: [
      {x: 0.22, y: 0.48},
      {x: 0.38, y: 0.48},
      {x: 0.55, y: 0.48},
      {x: 0.72, y: 0.48},
    ],
    actionLabel: '下一页',
  },
  {
    id: 'c-shape',
    points: [
      {x: 0.62, y: 0.28},
      {x: 0.48, y: 0.26},
      {x: 0.36, y: 0.34},
      {x: 0.32, y: 0.48},
      {x: 0.36, y: 0.62},
      {x: 0.48, y: 0.7},
      {x: 0.62, y: 0.68},
    ],
    actionLabel: '复制',
  },
  {
    id: 'down',
    points: [
      {x: 0.5, y: 0.22},
      {x: 0.5, y: 0.38},
      {x: 0.5, y: 0.55},
      {x: 0.5, y: 0.72},
    ],
    actionLabel: '最小化',
  },
];

type TrailState =
  | {mode: 'idle'}
  | {
      mode: 'auto';
      points: StrokePoint[];
      color: string;
      label: string | null;
      done: boolean;
    }
  | {
      mode: 'live';
      points: StrokePoint[];
      color: string;
      label: string | null;
      done: boolean;
    };

export type GestureTriggerDemoProps = {
  caption?: ReactNode;
};

function mapNormalized(
  points: StrokePoint[],
  width: number,
  height: number,
): StrokePoint[] {
  const padX = width * 0.08;
  const padY = height * 0.12;
  const drawW = width - padX * 2;
  const drawH = height - padY * 2;
  return points.map((p) => ({
    x: padX + p.x * drawW,
    y: padY + p.y * drawH,
  }));
}

export default function GestureTriggerDemo({
  caption,
}: GestureTriggerDemoProps): ReactNode {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const drawingRef = useRef(false);
  const livePointsRef = useRef<StrokePoint[]>([]);
  const autoIndexRef = useRef(0);
  const animStartRef = useRef(0);
  const phaseRef = useRef<'draw' | 'hold' | 'gap'>('draw');

  const {
    inView,
    motionOk,
    isPointerInside,
    setIsPointerInside,
    clearAutoTimers,
    scheduleAuto,
    shouldAutoPlay,
  } = useAutoPlayDemo(stageRef);

  const [trail, setTrail] = useState<TrailState>({mode: 'idle'});
  const [stageSize, setStageSize] = useState({w: 640, h: 400});

  const resetTrail = useCallback(() => {
    drawingRef.current = false;
    livePointsRef.current = [];
    setTrail({mode: 'idle'});
  }, []);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return undefined;
    const measure = (): void => {
      setStageSize({w: el.clientWidth, h: el.clientHeight});
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Autoplay loop / reduced-motion static frame
  useEffect(() => {
    if (isPointerInside || !inView) {
      clearAutoTimers();
      return undefined;
    }

    if (!motionOk) {
      // Static final frame of first preset; no loop
      const preset = PRESETS[0]!;
      const mapped = mapNormalized(preset.points, stageSize.w, stageSize.h);
      setTrail({
        mode: 'auto',
        points: mapped,
        color: VALID_COLOR,
        label: preset.actionLabel,
        done: true,
      });
      return undefined;
    }

    if (!shouldAutoPlay) {
      clearAutoTimers();
      return undefined;
    }

    let cancelled = false;
    let raf = 0;

    const runPreset = (index: number): void => {
      if (cancelled) return;
      const preset = PRESETS[index % PRESETS.length]!;
      const mapped = mapNormalized(preset.points, stageSize.w, stageSize.h);
      autoIndexRef.current = index % PRESETS.length;
      phaseRef.current = 'draw';
      animStartRef.current = performance.now();

      const tick = (now: number): void => {
        if (cancelled) return;
        const elapsed = now - animStartRef.current;

        if (phaseRef.current === 'draw') {
          const t = Math.min(1, elapsed / DRAW_MS);
          const prefix = strokePrefixByFraction(mapped, t);
          const done = t >= 1;
          setTrail({
            mode: 'auto',
            points: prefix,
            color: done ? VALID_COLOR : DRAWING_COLOR,
            label: done ? preset.actionLabel : null,
            done,
          });
          if (done) {
            phaseRef.current = 'hold';
            animStartRef.current = now;
          }
          raf = window.requestAnimationFrame(tick);
          return;
        }

        if (phaseRef.current === 'hold') {
          if (elapsed >= HOLD_MS) {
            phaseRef.current = 'gap';
            animStartRef.current = now;
            setTrail({mode: 'idle'});
          }
          raf = window.requestAnimationFrame(tick);
          return;
        }

        // gap
        if (elapsed >= GAP_MS) {
          runPreset(autoIndexRef.current + 1);
          return;
        }
        raf = window.requestAnimationFrame(tick);
      };

      raf = window.requestAnimationFrame(tick);
    };

    scheduleAuto(() => runPreset(autoIndexRef.current), 200);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(raf);
      clearAutoTimers();
    };
  }, [
    shouldAutoPlay,
    motionOk,
    inView,
    isPointerInside,
    stageSize.w,
    stageSize.h,
    clearAutoTimers,
    scheduleAuto,
  ]);

  const pointerToLocal = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>): StrokePoint | null => {
      const el = stageRef.current;
      if (!el) return null;
      const box = el.getBoundingClientRect();
      return {
        x: event.clientX - box.left,
        y: event.clientY - box.top,
      };
    },
    [],
  );

  const handlePointerEnter = useCallback(() => {
    clearAutoTimers();
    setIsPointerInside(true);
    resetTrail();
  }, [clearAutoTimers, resetTrail, setIsPointerInside]);

  const handlePointerLeave = useCallback(() => {
    drawingRef.current = false;
    livePointsRef.current = [];
    setIsPointerInside(false);
    resetTrail();
  }, [resetTrail, setIsPointerInside]);

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.button !== 0) return;
      event.preventDefault();
      const pt = pointerToLocal(event);
      if (!pt) return;
      drawingRef.current = true;
      livePointsRef.current = [pt];
      setTrail({
        mode: 'live',
        points: [pt],
        color: DRAWING_COLOR,
        label: null,
        done: false,
      });
      (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    },
    [pointerToLocal],
  );

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!drawingRef.current) return;
      const pt = pointerToLocal(event);
      if (!pt) return;
      const prev = livePointsRef.current[livePointsRef.current.length - 1];
      if (prev && Math.hypot(pt.x - prev.x, pt.y - prev.y) < 1.5) {
        return;
      }
      livePointsRef.current = [...livePointsRef.current, pt];
      setTrail({
        mode: 'live',
        points: livePointsRef.current,
        color: DRAWING_COLOR,
        label: null,
        done: false,
      });
    },
    [pointerToLocal],
  );

  const finishStroke = useCallback(() => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    const pts = livePointsRef.current;
    const len = strokePathLength(pts);
    if (pts.length < 2 || len < MIN_STROKE_LENGTH_PX) {
      setTrail({
        mode: 'live',
        points: pts,
        color: INVALID_COLOR,
        label: '轨迹过短',
        done: true,
      });
      return;
    }
    const arrows = deriveGestureDirectionName(pts);
    setTrail({
      mode: 'live',
      points: pts,
      color: VALID_COLOR,
      label: arrows ? `方向 ${arrows}` : '已采集',
      done: true,
    });
  }, []);

  const handlePointerUp = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      finishStroke();
    },
    [finishStroke],
  );

  const pathD =
    trail.mode !== 'idle' && trail.points.length >= 2
      ? strokeToSmoothSvgPath(trail.points)
      : '';

  const tip =
    trail.mode !== 'idle' && trail.label
      ? (() => {
          const last = trail.points[trail.points.length - 1];
          return last
            ? {
                x: Math.min(Math.max(last.x + 10, 12), stageSize.w - 140),
                y: Math.max(last.y - 28, 12),
                text: trail.label,
                ok: trail.color === VALID_COLOR,
              }
            : null;
        })()
      : null;

  return (
    <div className={[styles.root, 'qk-docs-preview'].join(' ')}>
      {caption ? <p className={styles.caption}>{caption}</p> : null}

      <div
        ref={stageRef}
        className={[
          styles.stage,
          isPointerInside ? styles.stageInteractive : styles.stageAuto,
        ].join(' ')}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        tabIndex={0}
        role="application"
        aria-label="鼠标手势演示：移入后按住左键绘制轨迹，移出后自动演示">
        <div className={styles.desktop} aria-hidden>
          <div className={styles.mockWindow}>
            <div className={styles.mockTitleBar}>
              <span className={styles.mockTitleDot} />
              <span className={styles.mockTitleDot} />
              <span className={styles.mockTitleDot} />
              <span className={styles.mockTitleText}>文档 - 浏览器</span>
            </div>
            <div className={styles.mockBody}>
              <div className={styles.mockSidebar} />
              <div className={styles.mockMain}>
                <div className={styles.mockLineLg} />
                <div className={styles.mockLineSm} />
                <div className={styles.mockLineMd} />
                <div className={styles.mockCards}>
                  <div className={styles.mockCard} />
                  <div className={styles.mockCard} />
                  <div className={styles.mockCard} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <svg
          ref={svgRef}
          className={styles.overlay}
          width={stageSize.w}
          height={stageSize.h}
          aria-hidden>
          {pathD ? (
            <path
              d={pathD}
              fill="none"
              stroke={trail.mode !== 'idle' ? trail.color : DRAWING_COLOR}
              strokeWidth={STROKE_WIDTH}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : null}
        </svg>

        {tip ? (
          <div
            className={[
              styles.resultTip,
              tip.ok ? styles.resultTipOk : styles.resultTipBad,
            ].join(' ')}
            style={{left: tip.x, top: tip.y}}
            aria-hidden>
            {tip.ok && trail.mode === 'auto' ? (
              <>
                <strong>识别成功</strong>
                <span>{tip.text}</span>
              </>
            ) : (
              <span>{tip.text}</span>
            )}
          </div>
        ) : null}
      </div>

      <p className={styles.hint}>
        {isPointerInside ? (
          trail.mode === 'live' && trail.done ? (
            <>
              {trail.color === VALID_COLOR ? (
                <>
                  演示已采集轨迹
                  {trail.label ? `（${trail.label}）` : ''}
                  。此页<strong>不真正识别</strong>
                  手势模板；Quicker 会匹配最相似的已保存手势。再画一次或移出演示区继续自动演示。
                </>
              ) : (
                <>轨迹过短，请按住左键画出更长的连续轨迹。</>
              )}
            </>
          ) : (
            <>按住左键绘制一条连续轨迹；松开后显示方向示意。</>
          )
        ) : motionOk ? (
          <>移入演示区可亲自绘制；移出后会自动演示向右、C 形、向下等常见手势。</>
        ) : (
          <>已按系统「减少动态效果」设置停在静态示意；移入后仍可手动绘制。</>
        )}
      </p>

      <span className={styles.srOnly} aria-live="polite">
        {trail.mode !== 'idle' && trail.label
          ? `手势结果：${trail.label}`
          : '手势演示就绪'}
      </span>
    </div>
  );
}
