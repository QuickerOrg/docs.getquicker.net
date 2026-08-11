import {useEffect, useRef, useState, type RefObject} from 'react';
import type {StepWire} from './types';

/** Docs demo of WPF StepNodeControl Ctrl+wheel on sys:delay (±50ms). */
export type WheelDelayDemoConfig = {
  /** Top-level step index. Default: first `sys:delay`, else 0. */
  index?: number;
  /** Inclusive start (ms). Default: step `delayMs` or 100. */
  from?: number;
  /** Inclusive end (ms). Default: from + 250. */
  to?: number;
  /** Increment. Default: 50 (WPF). */
  step?: number;
  /** Auto-tick interval. Default: 420. */
  intervalMs?: number;
};

export type WheelDelayTick = {
  index: number;
  ms: number;
  dir: 'up' | 'down';
};

const DELAY_STEP_KEY = 'sys:delay';
const DEFAULT_STEP = 50;
const DEFAULT_INTERVAL_MS = 420;
const DEFAULT_SPAN = 250;
const MANUAL_RESUME_MS = 1600;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

function parseDelayMs(step: StepWire | undefined, fallback: number): number {
  const raw = step?.inputs?.delayMs ?? '';
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
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

export function applyWheelDelayStep(
  steps: readonly StepWire[],
  tick: WheelDelayTick | null,
): StepWire[] {
  if (!tick || tick.index < 0 || tick.index >= steps.length) {
    return [...steps];
  }
  return steps.map((step, i) =>
    i === tick.index
      ? {
          ...step,
          inputs: {...step.inputs, delayMs: String(tick.ms)},
          // WaitTimeStep.GetSummary: "等待 " + delayMs + " ms"
          note: `等待 ${tick.ms} ms`,
        }
      : step,
  );
}

export function useWheelDelayDemo(
  steps: readonly StepWire[],
  config: boolean | WheelDelayDemoConfig | undefined,
  rootRef: RefObject<HTMLElement | null>,
): WheelDelayTick | null {
  const enabled = Boolean(config);
  const opts: WheelDelayDemoConfig = typeof config === 'object' && config ? config : {};
  const index = resolveWheelDelayIndex(steps, opts.index);
  const from = opts.from ?? parseDelayMs(steps[index], 100);
  const to = Math.max(from, opts.to ?? from + DEFAULT_SPAN);
  const step = opts.step && opts.step > 0 ? opts.step : DEFAULT_STEP;
  const intervalMs = opts.intervalMs && opts.intervalMs > 0 ? opts.intervalMs : DEFAULT_INTERVAL_MS;

  const [tick, setTick] = useState<WheelDelayTick>({index, ms: from, dir: 'up'});
  const [visible, setVisible] = useState(true);
  const pauseUntilRef = useRef(0);

  useEffect(() => {
    setTick((prev) =>
      prev.index === index && prev.ms === from ? prev : {index, ms: from, dir: 'up'},
    );
  }, [index, from]);

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
        ms: Math.max(0, prev.ms + delta),
        dir: delta >= 0 ? 'up' : 'down',
      }));
    };
    el.addEventListener('wheel', onWheel, {passive: false});
    return () => el.removeEventListener('wheel', onWheel);
  }, [enabled, index, step, rootRef]);

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
          return {index, ms: to, dir: 'down'};
        }
        if (next <= from) {
          return {index, ms: from, dir: 'up'};
        }
        return {index, ms: next, dir: prev.dir};
      });
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [enabled, visible, from, to, step, intervalMs, index]);

  if (!enabled) {
    return null;
  }
  return tick.index === index ? tick : {...tick, index};
}
