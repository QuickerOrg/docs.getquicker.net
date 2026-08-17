/**
 * Shared autoplay gate for docs demos (ScreenshotSelectionDemo pattern).
 * Plays when in view, motion is allowed, and pointer is not interacting.
 */
import {useCallback, useEffect, useRef, useState, type RefObject} from 'react';

export type AutoPlayDemoState = {
  inView: boolean;
  motionOk: boolean;
  isPointerInside: boolean;
  setIsPointerInside: (inside: boolean) => void;
  clearAutoTimers: () => void;
  scheduleAuto: (fn: () => void, ms: number) => void;
  /** True when autoplay should run. */
  shouldAutoPlay: boolean;
};

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export function useAutoPlayDemo(
  stageRef: RefObject<HTMLElement | null>,
  options?: {threshold?: number},
): AutoPlayDemoState {
  const threshold = options?.threshold ?? 0.25;
  const [inView, setInView] = useState(true);
  const [motionOk, setMotionOk] = useState(true);
  const [isPointerInside, setIsPointerInside] = useState(false);
  const autoTimersRef = useRef<number[]>([]);

  const clearAutoTimers = useCallback((): void => {
    for (const id of autoTimersRef.current) {
      window.clearTimeout(id);
    }
    autoTimersRef.current = [];
  }, []);

  const scheduleAuto = useCallback((fn: () => void, ms: number): void => {
    autoTimersRef.current.push(window.setTimeout(fn, ms));
  }, []);

  useEffect(() => {
    setMotionOk(!prefersReducedMotion());
  }, []);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry?.isIntersecting ?? false),
      {threshold},
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [stageRef, threshold]);

  useEffect(() => {
    return () => clearAutoTimers();
  }, [clearAutoTimers]);

  const shouldAutoPlay = inView && motionOk && !isPointerInside;

  return {
    inView,
    motionOk,
    isPointerInside,
    setIsPointerInside,
    clearAutoTimers,
    scheduleAuto,
    shouldAutoPlay,
  };
}
