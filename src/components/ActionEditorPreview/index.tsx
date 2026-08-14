/**
 * Docs-only three-column action editor chrome.
 * Sliced from Headless ActionDesignerPage / TreeActionToolbox / XProgramEditor.
 * Optional `dragDemo` / `historyDemo` teach discrete editor gestures (read-only).
 */
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import stepCatalog from '@site/data/step-render/catalog.json';
import {DocsStepIcon} from '@site/src/components/StepProgramView/DocsStepIcon';
import StepProgramView from '@site/src/components/StepProgramView';
import {VariableListPane} from '@site/src/components/StepProgramView/VariableListPane';
import {collectProgramVars} from '@site/src/components/StepProgramView/collectProgramVars';
import {normalizeStepList} from '@site/src/components/StepProgramView/normalize';
import type {ProgramVar} from '@site/src/components/StepProgramView/types';
import './styles.css';

type ToolboxTabKey =
  | 'all'
  | 'basic'
  | 'input'
  | 'ui'
  | 'text'
  | 'clipboard'
  | 'files'
  | 'system'
  | 'compute'
  | 'flow';

type EditorFocus = 'full' | 'toolbox' | 'steps' | 'variables' | 'appearance';
type RightTab = 'variables' | 'appearance';

type CatalogModule = {
  key: string;
  name: string;
  description?: string;
  category: string;
};

type StepCatalogShape = {
  runners?: Record<string, {icon?: string; name?: string; description?: string}>;
  icons?: Record<string, string>;
};

/** Auto-demo: drag a toolbox module into a branch slot or top-level steps list. */
export type ActionEditorDragDemoConfig = {
  /** Program after the drop. `data` is the before state. */
  afterData: unknown;
  /** Toolbox module being dragged. Defaults to `toolboxSelected`. */
  moduleKey?: string;
  /**
   * Drop target:
   * - Branch slot path, e.g. `2/if` → `[data-qk-branch-slot]`
   * - `steps` / `steps:end` → top-level steps list `[data-qk-drop-slot="steps"]`
   * Default: first empty `[data-qk-branch-empty="1"]` slot.
   */
  targetSlot?: string;
  /** Pause on empty scene before lift. Default 1200. */
  holdBeforeMs?: number;
  /** Ghost flight duration. Default 900. */
  flyMs?: number;
  /** Pause on filled scene after drop. Default 2200. */
  holdAfterMs?: number;
};

function isTopLevelStepsSlot(slot: string | undefined): boolean {
  return slot === 'steps' || slot === 'steps:end';
}

/** Auto-demo: click undo/redo through a short history stack. */
export type ActionEditorHistoryFrame = {
  data: unknown;
  selectedIndexes?: readonly number[];
  /** Nested step path, e.g. `1/if/0` (highlights inside a branch). */
  selectedPath?: string;
  /** Toolbar button being pressed on this frame. */
  action?: 'undo' | 'redo' | 'idle';
};

export type ActionEditorHistoryDemoConfig = {
  frames: ActionEditorHistoryFrame[];
  /** Pause after applying a frame. Default 1100. */
  holdMs?: number;
  /** Flash the toolbar button. Default 280. */
  pressMs?: number;
};

type DragPhase = 'idle' | 'fly' | 'dropped';

type GhostPose = {
  x: number;
  y: number;
  w: number;
  h: number;
  moving: boolean;
};

const STEP_CATALOG = stepCatalog as StepCatalogShape;

let catalogModulesPromise: Promise<CatalogModule[]> | null = null;

/** Full xaction catalog is ~860KB — only load when the toolbox is visible. */
function loadCatalogModules(): Promise<CatalogModule[]> {
  if (!catalogModulesPromise) {
    catalogModulesPromise = import(
      /* webpackChunkName: "qk-xaction-catalog" */
      '@site/data/xaction/catalog.json'
    ).then((mod) => {
      const data = (mod as {default?: {modules: CatalogModule[]}}).default ??
        (mod as {modules: CatalogModule[]});
      return data.modules ?? [];
    });
  }
  return catalogModulesPromise;
}

function needsToolboxModules(
  focus: EditorFocus,
  dragDemo: ActionEditorDragDemoConfig | undefined,
): boolean {
  return focus === 'full' || focus === 'toolbox' || Boolean(dragDemo);
}

const TOOLBOX_TABS: {key: ToolboxTabKey; label: string; icon: string; category?: string}[] =
  [
    {key: 'all', label: '所有', icon: 'fa:Solid_Bars'},
    {key: 'basic', label: '基础', icon: 'fa:Solid_Cog', category: 'Basic'},
    {key: 'input', label: '输入', icon: 'fa:Solid_Keyboard', category: 'Input'},
    {key: 'ui', label: '界面', icon: 'fa:Solid_WindowMaximize', category: 'Ui'},
    {key: 'text', label: '文本', icon: 'fa:Solid_Font', category: 'Text'},
    {key: 'clipboard', label: '剪贴板', icon: 'fa:Solid_Clipboard', category: 'Clipboard'},
    {key: 'files', label: '文件', icon: 'fa:Solid_Folder', category: 'Files'},
    {key: 'system', label: '系统', icon: 'fa:Solid_Desktop', category: 'System'},
    {key: 'compute', label: '计算', icon: 'fa:Solid_Calculator', category: 'Compute'},
    {key: 'flow', label: '流程', icon: 'fa:Solid_CodeBranch', category: 'Flow'},
  ];

const DEFAULT_STEPS = {
  steps: [
    {
      key: 'sys:getSelectedText',
      outputs: {output: 'selectedText', isSuccess: 'selectSuccess'},
    },
    {
      key: 'sys:if',
      inputs: {condition: '{selectSuccess}'},
      ifSteps: [
        {
          key: 'sys:openUrl',
          inputs: {url: '$$https://www.google.com/search?q={selectedText}'},
        },
      ],
      elseSteps: [
        {
          key: 'sys:openUrl',
          inputs: {url: 'https://www.google.com'},
        },
      ],
    },
  ],
};

const DEFAULT_HOLD_BEFORE = 1200;
const DEFAULT_FLY_MS = 900;
const DEFAULT_HOLD_AFTER = 2200;
const DEFAULT_HISTORY_HOLD = 1100;
const DEFAULT_HISTORY_PRESS = 280;

export type ActionEditorPreviewProps = {
  /** Same as StepProgramView `data`. */
  data?: unknown;
  example?: string;
  caption?: ReactNode;
  /** Highlight one column for a local screenshot replacement. */
  focus?: EditorFocus;
  toolboxTab?: ToolboxTabKey;
  toolboxSearch?: string;
  toolboxSelected?: string;
  rightTab?: RightTab;
  varFilter?: string;
  selectedVar?: string;
  actionTitle?: string;
  actionDescription?: string;
  /** Action options: custom right-click menu definition (WPF ActionOptionsControl). */
  customMenu?: string;
  selectedIndexes?: readonly number[];
  variables?: readonly ProgramVar[];
  showRun?: boolean;
  /** Docs demo: animate toolbox → branch drop (respects prefers-reduced-motion). */
  dragDemo?: ActionEditorDragDemoConfig;
  /** Docs demo: animate undo/redo through `frames` (respects prefers-reduced-motion). */
  historyDemo?: ActionEditorHistoryDemoConfig;
  className?: string;
};

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

function ToolbarBtn({
  spec,
  title,
  tone,
  pressed,
  toolbarKey,
}: {
  spec: string;
  title: string;
  tone?: 'run' | 'debug' | 'primary' | 'danger';
  pressed?: boolean;
  toolbarKey?: string;
}): ReactNode {
  const extra =
    tone === 'run'
      ? ' x-program-editor-toolbar-run-btn x-program-editor-toolbar-run-btn--run'
      : tone === 'debug'
        ? ' x-program-editor-toolbar-run-btn x-program-editor-toolbar-run-btn--debug'
        : tone === 'primary'
          ? ' variable-toolbar-btn--primary'
          : tone === 'danger'
            ? ' variable-toolbar-btn--danger'
            : '';
  return (
    <span
      className={`variable-toolbar-btn${extra}${pressed ? ' variable-toolbar-btn--pressed' : ''}`}
      title={title}
      aria-label={title}
      data-qk-toolbar={toolbarKey}>
      <DocsStepIcon spec={spec} size={12} />
    </span>
  );
}

function measureInRoot(
  root: HTMLElement,
  el: Element,
): {x: number; y: number; w: number; h: number} {
  const rr = root.getBoundingClientRect();
  const er = el.getBoundingClientRect();
  return {
    x: er.left - rr.left,
    y: er.top - rr.top,
    w: er.width,
    h: er.height,
  };
}

/**
 * Docs-only three-column action editor (toolbox + steps + variables).
 * Read-only; no Host. Optional dragDemo / historyDemo for gesture teaching.
 */
export default function ActionEditorPreview({
  data,
  example,
  caption,
  focus = 'full',
  toolboxTab = 'all',
  toolboxSearch = '',
  toolboxSelected,
  rightTab = 'variables',
  varFilter = '',
  selectedVar,
  actionTitle = '谷歌搜索',
  actionDescription = '选中文字则搜索，否则打开首页',
  customMenu,
  selectedIndexes,
  variables,
  showRun = true,
  dragDemo,
  historyDemo,
  className,
}: ActionEditorPreviewProps): ReactNode {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [phase, setPhase] = useState<DragPhase>('idle');
  const [ghost, setGhost] = useState<GhostPose | null>(null);
  const [dropSlot, setDropSlot] = useState<string | null>(null);
  const [inView, setInView] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [motionOk, setMotionOk] = useState(false);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [historyPress, setHistoryPress] = useState<'undo' | 'redo' | null>(null);
  const [cursor, setCursor] = useState<{x: number; y: number} | null>(null);
  const timersRef = useRef<number[]>([]);
  const [catalogModules, setCatalogModules] = useState<CatalogModule[]>([]);

  useEffect(() => {
    if (!needsToolboxModules(focus, dragDemo)) {
      setCatalogModules([]);
      return undefined;
    }
    let cancelled = false;
    void loadCatalogModules().then((modules) => {
      if (!cancelled) {
        setCatalogModules(modules);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [focus, dragDemo]);

  const historyFrames = historyDemo?.frames ?? [];
  const historyFrame = historyFrames[historyIndex] ?? historyFrames[0];
  const beforeData =
    historyFrame?.data ?? data ?? (example ? undefined : DEFAULT_STEPS);
  const [rmShowAfter, setRmShowAfter] = useState(false);
  const showFilled = dragDemo
    ? motionOk
      ? phase === 'dropped'
      : rmShowAfter
    : false;
  const activeData = showFilled && dragDemo ? dragDemo.afterData : beforeData;

  const steps = normalizeStepList(activeData ?? {steps: []});
  const programVars = useMemo(
    () => collectProgramVars(steps, variables),
    [steps, variables],
  );
  const tab = TOOLBOX_TABS.find((item) => item.key === toolboxTab) ?? TOOLBOX_TABS[0];
  const query = toolboxSearch.trim().toLowerCase();
  const modules = useMemo(() => {
    const all = catalogModules;
    const byTab = tab.category
      ? all.filter((item) => item.category === tab.category)
      : all;
    const filtered = query
      ? byTab.filter((item) => {
          const hay = `${item.name} ${item.key} ${item.description ?? ''}`.toLowerCase();
          return hay.includes(query);
        })
      : byTab;
    const pinnedKey = dragDemo?.moduleKey ?? toolboxSelected;
    const list = filtered.slice(0, query ? 24 : 14);
    if (pinnedKey && !list.some((item) => item.key === pinnedKey)) {
      const pinned = all.find((item) => item.key === pinnedKey);
      if (pinned) {
        return [pinned, ...list].slice(0, query ? 24 : 14);
      }
    }
    return list;
  }, [
    catalogModules,
    tab.category,
    query,
    dragDemo?.moduleKey,
    toolboxSelected,
  ]);

  const dragModuleKey = dragDemo?.moduleKey ?? toolboxSelected ?? modules[0]?.key;
  const selectedKey = toolboxSelected ?? dragModuleKey ?? modules[0]?.key;
  const dragModule =
    modules.find((m) => m.key === dragModuleKey) ??
    catalogModules.find((m) => m.key === dragModuleKey);
  const dragIcon = dragModuleKey
    ? STEP_CATALOG.runners?.[dragModuleKey]?.icon
    : undefined;
  const activeSelectedIndexes = historyFrame?.selectedIndexes ?? selectedIndexes;
  const showAppearance = focus === 'appearance' || rightTab === 'appearance';

  const clearTimers = useCallback(() => {
    for (const id of timersRef.current) {
      window.clearTimeout(id);
    }
    timersRef.current = [];
  }, []);

  const schedule = useCallback(
    (fn: () => void, ms: number) => {
      const id = window.setTimeout(fn, ms);
      timersRef.current.push(id);
      return id;
    },
    [],
  );

  useEffect(() => {
    setMotionOk(!prefersReducedMotion());
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || (!dragDemo && !historyDemo)) {
      return undefined;
    }
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry?.isIntersecting ?? false),
      {threshold: 0.3},
    );
    io.observe(el);
    return () => io.disconnect();
  }, [dragDemo, historyDemo]);

  // Reduced-motion: crossfade data only.
  useEffect(() => {
    if (!dragDemo || motionOk || !inView || hovered) {
      return undefined;
    }
    const holdBefore = dragDemo.holdBeforeMs ?? DEFAULT_HOLD_BEFORE;
    const holdAfter = dragDemo.holdAfterMs ?? DEFAULT_HOLD_AFTER;
    let cancelled = false;
    const loop = (): void => {
      if (cancelled) return;
      setRmShowAfter(false);
      schedule(() => {
        if (cancelled) return;
        setRmShowAfter(true);
        schedule(loop, holdAfter);
      }, holdBefore);
    };
    loop();
    return () => {
      cancelled = true;
      clearTimers();
    };
  }, [dragDemo, motionOk, inView, hovered, schedule, clearTimers]);

  // Full drag ghost loop.
  useEffect(() => {
    if (!dragDemo || !motionOk || !inView || hovered) {
      return undefined;
    }

    const holdBefore = dragDemo.holdBeforeMs ?? DEFAULT_HOLD_BEFORE;
    const flyMs = dragDemo.flyMs ?? DEFAULT_FLY_MS;
    const holdAfter = dragDemo.holdAfterMs ?? DEFAULT_HOLD_AFTER;
    let cancelled = false;

    const clearDropHighlight = (): void => {
      const root = rootRef.current;
      if (!root) return;
      root
        .querySelectorAll('.branch-box--drop-target, .qk-sr-steps--drop-target')
        .forEach((node) => {
          node.classList.remove('branch-box--drop-target');
          node.classList.remove('qk-sr-steps--drop-target');
        });
    };

    const runCycle = (): void => {
      if (cancelled) return;
      clearTimers();
      clearDropHighlight();
      setPhase('idle');
      setGhost(null);
      setDropSlot(null);

      schedule(() => {
        if (cancelled) return;
        const root = rootRef.current;
        if (!root || !dragModuleKey) {
          schedule(runCycle, holdAfter);
          return;
        }

        const escapeAttr = (value: string): string =>
          typeof CSS !== 'undefined' && typeof CSS.escape === 'function'
            ? CSS.escape(value)
            : value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

        const source = root.querySelector(
          `[data-qk-toolbox-key="${escapeAttr(dragModuleKey)}"]`,
        );
        const wantTopLevel = isTopLevelStepsSlot(dragDemo.targetSlot);
        let target: Element | null = null;
        if (wantTopLevel) {
          target = root.querySelector('[data-qk-drop-slot="steps"]');
        } else if (dragDemo.targetSlot) {
          target = root.querySelector(
            `[data-qk-branch-slot="${escapeAttr(dragDemo.targetSlot)}"]`,
          );
        }
        if (!target && !wantTopLevel) {
          target = root.querySelector('[data-qk-branch-empty="1"]');
        }
        if (!source || !target) {
          schedule(runCycle, holdAfter);
          return;
        }

        const slot =
          target.getAttribute('data-qk-drop-slot') ??
          target.getAttribute('data-qk-branch-slot') ??
          dragDemo.targetSlot ??
          null;
        setDropSlot(slot);
        if (wantTopLevel || target.getAttribute('data-qk-drop-slot') === 'steps') {
          target.classList.add('qk-sr-steps--drop-target');
        } else {
          target.classList.add('branch-box--drop-target');
        }

        const dropHit =
          target.querySelector('.step-listbox-drop-placeholder') ?? target;
        const from = measureInRoot(root, source);
        const to = measureInRoot(root, dropHit);
        const ghostW = Math.min(160, Math.max(96, from.w));
        const ghostH = 28;
        const start: GhostPose = {
          x: from.x + from.w / 2 - ghostW / 2,
          y: from.y + from.h / 2 - ghostH / 2,
          w: ghostW,
          h: ghostH,
          moving: false,
        };
        const end: GhostPose = {
          x: to.x + to.w / 2 - ghostW / 2,
          y: to.y + Math.max(0, (to.h - ghostH) / 2),
          w: ghostW,
          h: ghostH,
          moving: true,
        };

        setPhase('fly');
        setGhost(start);
        // Next frame: enable transition toward the drop slot.
        requestAnimationFrame(() => {
          if (cancelled) return;
          requestAnimationFrame(() => {
            if (cancelled) return;
            setGhost(end);
          });
        });

        schedule(() => {
          if (cancelled) return;
          clearDropHighlight();
          setGhost(null);
          setPhase('dropped');
          schedule(() => {
            if (cancelled) return;
            runCycle();
          }, holdAfter);
        }, flyMs + 40);
      }, holdBefore);
    };

    runCycle();
    return () => {
      cancelled = true;
      clearTimers();
      clearDropHighlight();
    };
  }, [
    dragDemo,
    motionOk,
    inView,
    hovered,
    dragModuleKey,
    schedule,
    clearTimers,
    beforeData,
  ]);

  // Undo/redo history stack loop.
  useEffect(() => {
    if (!historyDemo || dragDemo || !inView || hovered) {
      return undefined;
    }
    const frames = historyDemo.frames;
    if (frames.length === 0) {
      return undefined;
    }
    const holdMs = historyDemo.holdMs ?? DEFAULT_HISTORY_HOLD;
    const pressMs = historyDemo.pressMs ?? DEFAULT_HISTORY_PRESS;
    let cancelled = false;

    const pointAtToolbar = (action: 'undo' | 'redo'): void => {
      const root = rootRef.current;
      if (!root) return;
      const btn = root.querySelector(`[data-qk-toolbar="${action}"]`);
      if (!btn) return;
      const box = measureInRoot(root, btn);
      setCursor({x: box.x + box.w * 0.62, y: box.y + box.h * 0.72});
    };

    const applyFrame = (index: number): void => {
      setHistoryIndex(index);
      setHistoryPress(null);
    };

    const playFrom = (index: number): void => {
      if (cancelled) return;
      const frame = frames[index];
      if (!frame) {
        schedule(() => playFrom(0), holdMs);
        return;
      }
      const action = frame.action ?? (index === 0 ? 'idle' : undefined);
      if (motionOk && (action === 'undo' || action === 'redo')) {
        pointAtToolbar(action);
        setHistoryPress(action);
        schedule(() => {
          if (cancelled) return;
          applyFrame(index);
          schedule(() => {
            if (cancelled) return;
            playFrom((index + 1) % frames.length);
          }, holdMs);
        }, pressMs);
        return;
      }
      applyFrame(index);
      setCursor(null);
      schedule(() => {
        if (cancelled) return;
        playFrom((index + 1) % frames.length);
      }, holdMs);
    };

    applyFrame(0);
    setCursor(null);
    schedule(() => playFrom(1 % frames.length), holdMs);
    return () => {
      cancelled = true;
      clearTimers();
      setHistoryPress(null);
      setCursor(null);
    };
  }, [historyDemo, dragDemo, motionOk, inView, hovered, schedule, clearTimers]);

  const ghostStyle: CSSProperties | undefined = ghost
    ? {
        width: ghost.w,
        height: ghost.h,
        transform: `translate(${ghost.x}px, ${ghost.y}px)`,
        transition: ghost.moving
          ? `transform ${dragDemo?.flyMs ?? DEFAULT_FLY_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`
          : 'none',
      }
    : undefined;

  return (
    <div
      ref={rootRef}
      className={[
        'qk-ad-editor',
        'qk-docs-preview',
        focus !== 'full' ? `qk-ad-editor--focus-${focus}` : '',
        dragDemo ? 'qk-ad-editor--drag-demo' : '',
        historyDemo ? 'qk-ad-editor--history-demo' : '',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
      role="img"
      aria-label="组合动作编辑器（只读示意）"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      {caption ? <div className="qk-ad-editor__caption">{caption}</div> : null}
      <div className="qk-ad-editor__body">
        <section className="qk-ad-editor__toolbox" aria-label="模块工具箱">
          <div className="toolbox-toolbar">
            <input
              className="filter-box"
              readOnly
              value={toolboxSearch}
              placeholder="搜索模块… (Ctrl+F)"
              aria-label="搜索模块"
            />
            <button type="button" className="toolbox-icon-btn" title="折叠全部" tabIndex={-1}>
              <DocsStepIcon spec="fa:Light_CompressAlt" size={14} />
            </button>
          </div>
          <div className="toolbox-body">
            <div className="toolbox-tabs" role="tablist" aria-label="模块分类">
              {TOOLBOX_TABS.map((item) => (
                <span
                  key={item.key}
                  className={`toolbox-tab${item.key === toolboxTab ? ' active' : ''}`}
                  title={item.label}
                  aria-label={item.label}
                  role="tab"
                  aria-selected={item.key === toolboxTab}>
                  <DocsStepIcon spec={item.icon} size={14} className="toolbox-tab-icon" />
                </span>
              ))}
            </div>
            <div className="toolbox-tree" role="tree">
              {modules.length === 0 ? (
                <div className="toolbox-tree-empty">无匹配模块</div>
              ) : (
                modules.map((mod) => {
                  const icon = STEP_CATALOG.runners?.[mod.key]?.icon;
                  const selected = mod.key === selectedKey;
                  return (
                    <div
                      key={mod.key}
                      className={`toolbox-node${selected ? ' selected' : ''}`}
                      role="treeitem"
                      aria-selected={selected}
                      data-qk-toolbox-key={mod.key}
                      title={mod.description ?? mod.name}>
                      <span className="toolbox-expand hidden" aria-hidden="true" />
                      <DocsStepIcon
                        className="toolbox-node-icon"
                        spec={icon}
                        size={13}
                        icons={STEP_CATALOG.icons}
                      />
                      <span className="toolbox-node-name">{mod.name}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </section>

        <div className="x-program-editor qk-ad-editor__program">
          <div className="x-program-editor-toolbar" role="toolbar" aria-label="程序编辑">
            <ToolbarBtn
              spec="fa:Light_Undo"
              title="撤销 (Ctrl+Z)"
              pressed={historyPress === 'undo'}
              toolbarKey="undo"
            />
            <ToolbarBtn
              spec="fa:Light_Redo"
              title="重做 (Ctrl+Y / Ctrl+Shift+Z)"
              pressed={historyPress === 'redo'}
              toolbarKey="redo"
            />
            {showRun ? (
              <div className="x-program-editor-toolbar-run" role="group" aria-label="运行动作">
                <ToolbarBtn spec="fa:Light_Play:#39b54d" title="运行当前动作" tone="run" />
                <ToolbarBtn spec="fa:Light_Bug:#f5b042" title="调试当前动作" tone="debug" />
                <ToolbarBtn spec="fa:Light_Terminal:#39b54d" title="带参数运行" tone="run" />
              </div>
            ) : null}
            <span className="x-program-editor-toolbar-spacer" />
            <span className="x-program-editor-toolbar-save" title="保存到 Quicker (Ctrl+S)">
              <DocsStepIcon spec="fa:Solid_Save" size={12} />
              <span>保存</span>
            </span>
            <ToolbarBtn spec="fa:Light_Cog" title="动作设计器设置" />
            <ToolbarBtn spec="fa:Light_QuestionCircle" title="使用说明 (F1)" />
          </div>
          <div className="x-program-editor-steps">
            <StepProgramView
              className="qk-sr-program--embedded"
              data={activeData}
              example={dragDemo || historyDemo ? undefined : example}
              selectedIndexes={activeSelectedIndexes}
              selectedPath={historyFrame?.selectedPath}
              showVariables={false}
              stepPopup
              density="compact"
            />
          </div>
          <div className="x-program-editor-gutter workspace-gutter" aria-hidden />
          <div className="x-program-editor-variables">
            <div className="variable-editor">
              <div className="variable-toolbar">
                <div className="variable-toolbar-main" role="toolbar" aria-label="变量工具">
                  <div className="variable-toolbar-group">
                    <ToolbarBtn spec="fa:Light_Plus" title="添加变量" tone="primary" />
                    <ToolbarBtn spec="fa:Light_TrashAlt" title="删除变量" tone="danger" />
                  </div>
                  <div className="variable-toolbar-group">
                    <ToolbarBtn spec="fa:Light_Eraser" title="清理未使用的变量" />
                    <ToolbarBtn spec="fa:Light_SortAmountDown" title="排序" />
                  </div>
                  <div className="variable-filter-row">
                    <input
                      className="filter-box variable-filter-box"
                      readOnly
                      value={varFilter}
                      placeholder="筛选变量…"
                      aria-label="筛选变量"
                    />
                  </div>
                </div>
              </div>
              {showAppearance ? (
                <div className="qk-ad-editor__appearance" aria-label="动作外观">
                  <div className="qk-ad-editor__appearance-title">动作外观</div>
                  <div className="qk-ad-editor__appearance-hint">
                    未选中变量时可编辑标题与图标
                  </div>
                  <label className="qk-ad-editor__field">
                    <span>标题</span>
                    <span className="qk-ad-editor__field-value">{actionTitle}</span>
                  </label>
                  <label className="qk-ad-editor__field">
                    <span>说明</span>
                    <span className="qk-ad-editor__field-value qk-ad-editor__field-value--multi">
                      {actionDescription}
                    </span>
                  </label>
                  <label className="qk-ad-editor__field">
                    <span>右键菜单定义</span>
                    <span className="qk-ad-editor__field-value qk-ad-editor__field-value--menu">
                      {customMenu?.trim() || '一行一项。内容多时在框上右键「在文本编辑器中修改」。'}
                    </span>
                  </label>
                </div>
              ) : (
                <VariableListPane variables={programVars} selected={selectedVar} />
              )}
            </div>
          </div>
        </div>
      </div>

      {ghost && dragModule ? (
        <div className="qk-ad-drag-ghost" style={ghostStyle} aria-hidden>
          <DocsStepIcon
            className="qk-ad-drag-ghost__icon"
            spec={dragIcon}
            size={14}
            icons={STEP_CATALOG.icons}
          />
          <span className="qk-ad-drag-ghost__name">{dragModule.name}</span>
          <span className="qk-ad-drag-ghost__plus" title="放入">
            +
          </span>
        </div>
      ) : null}
      {dragDemo && dropSlot && phase === 'fly' ? (
        <span className="qk-ad-drag-demo-sr" aria-live="polite">
          {isTopLevelStepsSlot(dropSlot) || dropSlot === 'steps'
            ? '正在拖入步骤列表'
            : `正在拖入分支槽 ${dropSlot}`}
        </span>
      ) : null}
      {historyDemo && historyPress ? (
        <span className="qk-ad-drag-demo-sr" aria-live="polite">
          {historyPress === 'undo' ? '撤销' : '重做'}
        </span>
      ) : null}
      {historyDemo && cursor ? (
        <svg
          className="qk-ad-history-cursor"
          style={{left: cursor.x, top: cursor.y}}
          width="16"
          height="20"
          viewBox="0 0 16 20"
          aria-hidden
        >
          <path
            d="M1 1 L1 16 L5 12.2 L8.2 19 L11 17.6 L7.7 10.8 L13 10.8 Z"
            fill="#fff"
            stroke="#111"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
    </div>
  );
}
