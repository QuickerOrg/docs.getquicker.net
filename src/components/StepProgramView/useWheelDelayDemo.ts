import {useEffect, useRef, useState, type RefObject} from 'react';
import type {StepWire} from './types';

/**
 * Docs demo of WPF StepNodeControl Ctrl+wheel:
 * - `wait-step`: sys:delay param ±50ms
 * - `trailing`: step DelayMs after a normal row ±20ms (row-end badge)
 */
export type WheelDelayKind = 'trailing' | 'wait-step';

export type WheelDelayDemoConfig = {
  /** Top-level step index. Default: first `sys:delay`, else 0. */
  index?: number;
  /** Force kind. Default: `wait-step` on sys:delay, else `trailing`. */
  kind?: WheelDelayKind;
  /** Inclusive start (ms). Default: current delay, or 100 for wait-step. */
  from?: number;
  /** Inclusive end (ms). Default: from + 250. */
  to?: number;
  /** Increment. Default: 50 (wait-step) or 20 (trailing), matching WPF. */
  step?: number;
  /** Auto-tick interval. Default 420. */
  intervalMs?: number;
};

export type WheelDelayTick = {
  index: number;
  ms: number;
  dir: 'up' | 'down';
  kind: WheelDelayKind;
};

const DELAY_STEP_KEY = 'sys:delay';
const DEFAULT_WAIT_STEP = 50;
const DEFAULT_TRAILING_STEP = 20;
const DEFAULT_INTERVAL_MS = 420;
const DEFAULT_SPAN = 250;
const MANUAL_RESUME_MS = 1600;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export function resolveWheelDelayKind(
  step: StepWire | undefined,
  configured?: WheelDelayKind,
): WheelDelayKind {
  if (configured) {
    return configured;
  }
  return step?.key === DELAY_STEP_KEY ? 'wait-step' : 'trailing';
}

export function resolveWheelDelayIndex(
  steps: readonly StepWire[],
  configured?: number,
): number {
  if (configured != null && configured >= 0 && configured < steps.length) {
    return configured;
  }
  const found = steps.findIndex((s) => s.key === DELAY_STEP_KEY);
  return found >= 0 ? found : 0;
}

function parseWaitParamMs(step: StepWire | undefined, fallback: number): number {
  const raw = step?.inputs?.delayMs ?? '';
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

function parseTrailingMs(step: StepWire | undefined): number {
  const n = step?.delayMs;
  return typeof n === 'number' && Number.isFinite(n) && n >= 0 ? n : 0;
}

export function applyWheelDelayStep(
  steps: readonly StepWire[],
  tick: WheelDelayTick | null,
): StepWire[] {
  if (!tick || tick.index < 0 || tick.index >= steps.length) {
    return [...steps];
  }
  return steps.map((step, i) => {
    if (i !== tick.index) {
      return step;
    }
    if (tick.kind === 'wait-step') {
      return {
        ...step,
        inputs: {...step.inputs, delayMs: String(tick.ms)},
        // WaitTimeStep.GetSummary: "等待 " + delayMs + " ms"
        note: `等待 ${tick.ms} ms`,
      };
    }
    return {
      ...step,
      delayMs: tick.ms,
    };
  });
}

export function useWheelDelayDemo(
  steps: readonly StepWire[],
  config: boolean | WheelDelayDemoConfig | undefined,
  rootRef: RefObject<HTMLElement | null>,
): WheelDelayTick | null {
  const enabled = Boolean(config);
  const opts: WheelDelayDemoConfig = typeof config === 'object' && config ? config : {};
  const index = resolveWheelDelayIndex(steps, opts.index);
  const kind = resolveWheelDelayKind(steps[index], opts.kind);
  const from =
    opts.from ??
    (kind === 'wait-step' ? parseWaitParamMs(steps[index], 100) : parseTrailingMs(steps[index]));
  const to = Math.max(from, opts.to ?? from + DEFAULT_SPAN);
  const defaultStep = kind === 'wait-step' ? DEFAULT_WAIT_STEP : DEFAULT_TRAILING_STEP;
  const step = opts.step && opts.step > 0 ? opts.step : defaultStep;
  const intervalMs = opts.intervalMs && opts.intervalMs > 0 ? opts.intervalMs : DEFAULT_INTERVAL_MS;

  const [tick, setTick] = useState<WheelDelayTick>({index, ms: from, dir: 'up', kind});
  const [visible, setVisible] = useState(true);
  const pauseUntilRef = useRef(0);

  useEffect(() => {
    setTick((prev) =>
      prev.index === index && prev.ms === from && prev.kind === kind
        ? prev
        : {index, ms: from, dir: 'up', kind},
    );
  }, [index, from, kind]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || !enabled) {
      return undefined;
    }
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry?.isIntersecting ?? false),
      {threshold: 0.35},
    );
    io.observe(el);
    return () => io.disconnect();
  }, [enabled, rootRef]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || !enabled) {
      return undefined;
    }
    const onWheel = (e: WheelEvent): void => {
      if (!e.ctrlKey) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      pauseUntilRef.current = Date.now() + MANUAL_RESUME_MS;
      const speed = e.shiftKey ? 10 : 1;
      const delta = (e.deltaY < 0 ? step : -step) * speed;
      setTick((prev) => ({
        index,
        kind,
        ms: Math.max(0, prev.ms + delta),
        dir: delta >= 0 ? 'up' : 'down',
      }));
    };
    el.addEventListener('wheel', onWheel, {passive: false});
    return () => el.removeEventListener('wheel', onWheel);
  }, [enabled, index, kind, step, rootRef]);

  useEffect(() => {
    if (!enabled || !visible || prefersReducedMotion()) {
      return undefined;
    }
    const id = window.setInterval(() => {
      if (Date.now() < pauseUntilRef.current) {
        return;
      }
      setTick((prev) => {
        const next = prev.ms + (prev.dir === 'up' ? step : -step);
        if (next >= to) {
          return {index, kind, ms: to, dir: 'down'};
        }
        if (next <= from) {
          return {index, kind, ms: from, dir: 'up'};
        }
        return {index, kind, ms: next, dir: prev.dir};
      });
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [enabled, visible, from, to, step, intervalMs, index, kind]);

  if (!enabled) {
    return null;
  }
  return tick.index === index && tick.kind === kind ? tick : {...tick, index, kind};
}
