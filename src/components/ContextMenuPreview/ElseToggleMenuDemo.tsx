/**
 * Docs demo: one scene cycles 如果 ↔ 如果/否则 via context-menu click flash.
 * Mirrors WPF StepListControl “增加/隐藏 「否则」分支(_E)”.
 */
import {useEffect, useRef, useState, type ReactNode} from 'react';
import ContextMenuPreview, {
  type ContextMenuItem,
} from '@site/src/components/ContextMenuPreview';
import StepProgramView from '@site/src/components/StepProgramView';
import styles from './elseToggleMenuDemo.module.css';

export type ElseToggleMenuDemoProps = {
  caption?: ReactNode;
  className?: string;
  /** Pause with menu open before click. Default 1600. */
  holdMs?: number;
  /** Flash picked menu item. Default 420. */
  pickMs?: number;
  /** Brief gap after pick (menu closes). Default 280. */
  gapMs?: number;
};

type Phase = 'add' | 'add-pick' | 'hide' | 'hide-pick';

const ADD_LABEL = '增加 “否则” 分支(_E)';
const HIDE_LABEL = '隐藏 “否则” 分支(_E)';

const PUT_INTO: ContextMenuItem = {
  label: '放入...(_F)',
  icon: 'fa:Light_ObjectGroup:#6aaded',
  children: [
    {label: '步骤组(_G)', icon: 'fa:Light_LayerGroup:#6aaded'},
    {label: '循环：每个(_E)', icon: 'fa:Light_Repeat:#6aaded'},
    {label: '循环：重复(_R)', icon: 'fa:Light_Repeat:#6aaded'},
    {label: '如果/否则 的 “如果” 分支(_I)', icon: 'fa:Light_ProjectDiagram:#6aaded'},
    {label: '如果/否则 的 “否则” 分支(_F)', icon: 'fa:Light_ProjectDiagram:#6aaded'},
    {label: '如果(_S)', icon: 'fa:Light_ProjectDiagram:#6aaded'},
  ],
};

function menuItems(toggleLabel: string): ContextMenuItem[] {
  return [
    {label: '复制(_C)', icon: 'fa:Light_Copy:#6aaded'},
    {label: '剪切(_X)', icon: 'fa:Light_Cut:#6aaded'},
    {label: toggleLabel, icon: 'fa:Light_ArrowAltRight:#6aaded'},
    {label: '插入延时(_T)', icon: 'fa:Light_Clock:#6aaded'},
    PUT_INTO,
  ];
}

const SIMPLE_IF = {
  steps: [
    {
      key: 'sys:simpleIf',
      inputs: {condition: 'true'},
      ifSteps: [],
    },
  ],
};

const IF_ELSE = {
  steps: [
    {
      key: 'sys:if',
      inputs: {condition: 'true'},
      ifSteps: [],
      elseSteps: [],
    },
  ],
};

const DEFAULT_HOLD = 1600;
const DEFAULT_PICK = 420;
const DEFAULT_GAP = 280;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Single-scene animation: right-click toggle between 如果 and 如果/否则.
 */
export default function ElseToggleMenuDemo({
  caption,
  className,
  holdMs = DEFAULT_HOLD,
  pickMs = DEFAULT_PICK,
  gapMs = DEFAULT_GAP,
}: ElseToggleMenuDemoProps): ReactNode {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [phase, setPhase] = useState<Phase>('add');
  const [menuOpen, setMenuOpen] = useState(true);
  const [inView, setInView] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [motionOk, setMotionOk] = useState(false);
  const timersRef = useRef<number[]>([]);

  const isHide = phase === 'hide' || phase === 'hide-pick';
  const isPick = phase === 'add-pick' || phase === 'hide-pick';
  const toggleLabel = isHide ? HIDE_LABEL : ADD_LABEL;
  const openPath = [toggleLabel];
  const pickedPath = isPick ? openPath : null;
  const stepData = isHide ? IF_ELSE : SIMPLE_IF;

  const clearTimers = (): void => {
    for (const id of timersRef.current) {
      window.clearTimeout(id);
    }
    timersRef.current = [];
  };

  const schedule = (fn: () => void, ms: number): void => {
    timersRef.current.push(window.setTimeout(fn, ms));
  };

  useEffect(() => {
    setMotionOk(!prefersReducedMotion());
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry?.isIntersecting ?? false),
      {threshold: 0.3},
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || hovered) {
      return undefined;
    }
    clearTimers();
    let cancelled = false;

    const run = (): void => {
      if (cancelled) return;
      if (!motionOk) {
        setMenuOpen(true);
        setPhase('add');
        schedule(() => {
          if (cancelled) return;
          setPhase('hide');
          schedule(run, holdMs);
        }, holdMs);
        return;
      }

      setMenuOpen(true);
      setPhase('add');
      schedule(() => {
        if (cancelled) return;
        setPhase('add-pick');
        schedule(() => {
          if (cancelled) return;
          setMenuOpen(false);
          setPhase('hide');
          schedule(() => {
            if (cancelled) return;
            setMenuOpen(true);
            schedule(() => {
              if (cancelled) return;
              setPhase('hide-pick');
              schedule(() => {
                if (cancelled) return;
                setMenuOpen(false);
                setPhase('add');
                schedule(run, gapMs);
              }, pickMs);
            }, holdMs);
          }, gapMs);
        }, pickMs);
      }, holdMs);
    };

    run();
    return () => {
      cancelled = true;
      clearTimers();
    };
  }, [inView, hovered, motionOk, holdMs, pickMs, gapMs]);

  return (
    <div
      ref={rootRef}
      className={[styles.root, 'qk-docs-preview', className].filter(Boolean).join(' ')}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      {caption ? <div className={styles.caption}>{caption}</div> : null}
      <ContextMenuPreview
        interactive={false}
        menuVisible={menuOpen}
        openPath={openPath}
        pickedPath={pickedPath}
        items={menuItems(toggleLabel)}>
        <StepProgramView selectedIndexes={[0]} data={stepData} />
      </ContextMenuPreview>
      <span className={styles.srOnly} aria-live="polite">
        {isPick ? `选择 ${toggleLabel}` : isHide ? '如果/否则' : '如果'}
      </span>
    </div>
  );
}
