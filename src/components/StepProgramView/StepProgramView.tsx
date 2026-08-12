import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type JSX,
  type ReactNode,
} from 'react';
import {collectProgramVars} from './collectProgramVars';
import {DocsStepIcon} from './DocsStepIcon';
import {normalizeStepCatalog, normalizeStepList} from './normalize';
import {resolveParamLabel} from './resolveParamLabel';
import {resolveStepRowPresentation} from './resolvePresentation';
import {contrastOnHex, parseStepCommentStyle} from './stepCommentTint';
import {StepInspectPopup} from './StepInspectPopup';
import type {ProgramVar, StepCatalog, StepProgramDensity, StepWire} from './types';
import {VariableListPane} from './VariableListPane';
import {
  applyWheelDelayStep,
  useWheelDelayDemo,
  type WheelDelayDemoConfig,
  type WheelDelayTick,
} from './useWheelDelayDemo';

export type StepProgramViewProps = {
  /** Steps JSON / array / `{ steps }` / single step. */
  data: unknown;
  /** Offline catalog object or JSON string. */
  catalog?: unknown;
  /** Extra icon map merged over catalog.icons. */
  icons?: Readonly<Record<string, string>>;
  /** Expand input/output maps under each row (designer itself only shows a note). */
  showParams?: boolean;
  showIndex?: boolean;
  /** Show runner key under the title when catalog resolved a display name. */
  showKey?: boolean;
  /** Optional caption above the list well, e.g. example title. */
  caption?: ReactNode;
  /**
   * Show a narrow variable list beside the steps (Headless XProgramEditor layout).
   * Auto-collects names from step `outputs` unless `variables` is set.
   */
  showVariables?: boolean;
  /** Explicit variable rows; merged over auto-collected outputs when both set. */
  variables?: readonly ProgramVar[];
  /** Variable column width in px. Default 120 (docs-narrow). */
  variablePaneWidth?: number;
  /** Highlight these top-level step indexes (0-based), e.g. a right-click multi-select. */
  selectedIndexes?: readonly number[];
  /** Highlight a nested step by path, e.g. `1/if/0`. */
  selectedPath?: string;
  /**
   * Auto-play Ctrl+wheel delay. On `sys:delay` this is the wait param (±50ms);
   * on other steps it is trailing DelayMs shown at the row end (±20ms).
   * Pass `true` or `{from, to, step}`. Hover+Ctrl+wheel still works.
   */
  wheelDelay?: boolean | WheelDelayDemoConfig;
  /**
   * Double-click a row to open the step param popup (Headless StepEditorPopup).
   * Default true. Nested children are included.
   */
  stepPopup?: boolean;
  density?: StepProgramDensity;
  empty?: ReactNode;
  className?: string;
};

function ExpandTriangle(): JSX.Element {
  return (
    <svg
      className="expand-triangle"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M 2.75 5.583333 L 11.25 5.583333 L 7 9.833333 Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ParamPairs({
  title,
  map,
  labels,
}: {
  title: string;
  map: Record<string, string>;
  labels?: Readonly<Record<string, string>>;
}): JSX.Element {
  return (
    <div className="qk-sr-step-params">
      <div className="qk-sr-step-params__label">{title}</div>
      {Object.entries(map).map(([k, v]) => {
        const label = resolveParamLabel(k, labels);
        return (
          <div key={k} className="qk-sr-step-params__row">
            <span className="qk-sr-step-params__key" title={k}>
              {label}
            </span>
            <span className="qk-sr-step-params__val">{v}</span>
          </div>
        );
      })}
    </div>
  );
}

function branchLabelsForStep(
  step: StepWire,
  catalog: StepCatalog,
): {ifLabel?: string; elseLabel?: string} {
  const stepType = (catalog.runners[step.key]?.stepType ?? '').toLowerCase();
  const key = step.key.toLowerCase();
  if (stepType === 'loop' || key === 'sys:each' || key === 'sys:repeat' || key === 'loop') {
    return {};
  }
  if (key === 'sys:simpleif') {
    return {};
  }
  if (stepType === 'if' || key === 'sys:if' || key === 'if') {
    // WPF StepList shows 否则; Headless lab uses Else — docs follow WPF zh UI.
    return {elseLabel: '否则'};
  }
  return {ifLabel: '子步骤', elseLabel: '否则'};
}

/** Structure steps always expose branch chrome (even with empty child lists). */
function structureChrome(
  step: StepWire,
  catalog: StepCatalog,
): {showIf: boolean; showElse: boolean} {
  const stepType = (catalog.runners[step.key]?.stepType ?? '').toLowerCase();
  const key = step.key.toLowerCase();
  const hasIfData = Boolean(step.ifSteps && step.ifSteps.length > 0);
  const hasElseData = Boolean(step.elseSteps && step.elseSteps.length > 0);
  if (key === 'sys:simpleif') {
    return {showIf: true, showElse: false};
  }
  if (stepType === 'if' || key === 'sys:if' || key === 'if') {
    return {showIf: true, showElse: true};
  }
  if (
    stepType === 'loop' ||
    key === 'sys:each' ||
    key === 'sys:repeat' ||
    key === 'sys:group' ||
    key === 'loop'
  ) {
    return {showIf: true, showElse: false};
  }
  return {showIf: hasIfData, showElse: hasElseData};
}

function StepListInner({
  steps,
  catalog,
  icons,
  showParams,
  showIndex,
  showKey,
  nested,
  pathPrefix,
  selectedIndexes,
  selectedPath,
  inspectPath,
  wheelTick,
  onInspect,
}: {
  steps: StepWire[];
  catalog: StepCatalog;
  icons?: Readonly<Record<string, string>>;
  showParams: boolean;
  showIndex: boolean;
  showKey: boolean;
  nested: boolean;
  pathPrefix: string;
  selectedIndexes?: readonly number[];
  selectedPath?: string | null;
  inspectPath?: string | null;
  wheelTick?: WheelDelayTick | null;
  onInspect?: (step: StepWire, path: string, iconSpec: string) => void;
}): JSX.Element {
  const selected = new Set(selectedIndexes ?? []);
  if (nested && steps.length === 0) {
    return (
      <div className="step-listbox nested">
        <div
          className="step-listbox-drop-placeholder"
          aria-hidden
          title="空分支槽"
        />
      </div>
    );
  }
  return (
    <div className={nested ? 'step-listbox nested' : 'step-listbox root'}>
      {steps.map((step, index) => {
        const path = pathPrefix ? `${pathPrefix}/${index}` : String(index);
        return (
          <StepBlock
            key={`${nested ? 'n' : 'r'}-${index}-${step.key}`}
            step={step}
            index={index}
            path={path}
            catalog={catalog}
            icons={icons}
            showParams={showParams}
            showIndex={showIndex}
            showKey={showKey}
            selected={
              (!nested && selected.has(index)) ||
              inspectPath === path ||
              selectedPath === path
            }
            wheelTick={!nested && wheelTick?.index === index ? wheelTick : null}
            inspectPath={inspectPath}
            selectedPath={selectedPath}
            onInspect={onInspect}
          />
        );
      })}
    </div>
  );
}

function StepBlock({
  step,
  index,
  path,
  catalog,
  icons,
  showParams,
  showIndex,
  showKey,
  selected,
  wheelTick,
  inspectPath,
  selectedPath,
  onInspect,
}: {
  step: StepWire;
  index: number;
  path: string;
  catalog: StepCatalog;
  icons?: Readonly<Record<string, string>>;
  showParams: boolean;
  showIndex: boolean;
  showKey: boolean;
  selected: boolean;
  wheelTick?: WheelDelayTick | null;
  inspectPath?: string | null;
  selectedPath?: string | null;
  onInspect?: (step: StepWire, path: string, iconSpec: string) => void;
}): JSX.Element {
  const presentation = resolveStepRowPresentation(step, catalog);
  const commentStyle = parseStepCommentStyle(
    step.note ?? step.inputs?.note ?? '',
  );
  const rowTint = commentStyle.tint
    ? `var(--qk-step-tint-${commentStyle.tint})`
    : commentStyle.hexBackground;
  const rowTintFg = commentStyle.tint
    ? `var(--qk-step-tint-${commentStyle.tint}-fg)`
    : commentStyle.hexBackground
      ? contrastOnHex(commentStyle.hexBackground)
      : undefined;
  const hasCatalogName = Boolean(catalog.runners[step.key]?.name);
  const hasParams =
    showParams &&
    ((step.inputs && Object.keys(step.inputs).length > 0) ||
      (step.outputs && Object.keys(step.outputs).length > 0));
  const {showIf: hasIf, showElse: hasElse} = structureChrome(step, catalog);
  const hasBranches = hasIf || hasElse;
  const iconMap = icons ?? catalog.icons;
  const runner = catalog.runners[step.key];
  const {ifLabel, elseLabel} = branchLabelsForStep(step, catalog);
  const trailingMs =
    wheelTick?.kind === 'wait-step'
      ? 0
      : wheelTick?.kind === 'trailing'
        ? wheelTick.ms
        : (step.delayMs ?? 0);

  return (
    <div
      className={selected ? 'step-node-block step-node-block--selected' : 'step-node-block'}
    >
      <div className="step-node-rail" aria-hidden="true" />
      <div className={step.disabled ? 'step-node-main step-node-main--disabled' : 'step-node-main'}>
        <div
          className={[
            'step-row',
            'step-row--preview',
            onInspect ? 'step-row--inspectable' : '',
            selected ? 'selected' : '',
            step.disabled ? 'disabled' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          data-comment-tint={
            commentStyle.tint ?? (commentStyle.hexBackground ? 'custom' : undefined)
          }
          style={
            rowTint
              ? ({
                  ['--qk-step-row-tint']: rowTint,
                  ...(rowTintFg ? {['--qk-step-row-tint-fg']: rowTintFg} : {}),
                } as CSSProperties)
              : undefined
          }
          title={
            onInspect
              ? `${presentation.titleAttr}（双击查看参数）`
              : presentation.titleAttr
          }
          aria-selected={selected || undefined}
          onDoubleClick={
            onInspect
              ? (event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onInspect(step, path, presentation.iconSpec);
                }
              : undefined
          }
        >
          {hasBranches ? (
            <span
              className="expand"
              aria-hidden="true"
              onDoubleClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
              }}
            >
              <ExpandTriangle />
            </span>
          ) : null}
          {showIndex ? <span className="step-row-index">{index + 1}</span> : null}
          <DocsStepIcon
            className="icon"
            spec={presentation.iconSpec}
            icons={iconMap}
            size={16}
            title={presentation.titleAttr}
          />
          {step.disabled ? (
            <span className="ban" aria-hidden="true">
              ⛔
            </span>
          ) : null}
          <span className="step-titles">
            <span className="primary">{presentation.primary}</span>
            {wheelTick?.kind === 'wait-step' ? (
              <span className="step-note step-note--wheel" aria-live="polite">
                等待{' '}
                <span
                  key={wheelTick.ms}
                  className={`qk-sr-delay-ms qk-sr-delay-ms--${wheelTick.dir}`}
                >
                  {wheelTick.ms}
                </span>{' '}
                ms
              </span>
            ) : presentation.secondary ? (
              <span className="step-note">{presentation.secondary}</span>
            ) : null}
          </span>
          {trailingMs > 0 || wheelTick ? (
            <span className="step-row-trailing">
              {trailingMs > 0 ? (
                <span
                  className="step-row-delay"
                  title="执行下一步骤前的等待时间（毫秒）。(Ctrl+滚动快速调节)"
                >
                  {wheelTick?.kind === 'trailing' ? (
                    <span
                      key={wheelTick.ms}
                      className={`qk-sr-delay-ms qk-sr-delay-ms--${wheelTick.dir}`}
                    >
                      {trailingMs}
                    </span>
                  ) : (
                    trailingMs
                  )}
                </span>
              ) : null}
              {wheelTick ? (
                <span className="qk-sr-wheel-hint" aria-hidden="true">
                  <kbd>Ctrl</kbd>
                  <span className={`qk-sr-wheel-glyph qk-sr-wheel-glyph--${wheelTick.dir}`} />
                  滚轮
                </span>
              ) : null}
            </span>
          ) : null}
          {showKey && hasCatalogName && presentation.primary !== step.key ? (
            <code className="step-row-key">{step.key}</code>
          ) : null}
          {!hasCatalogName && !step.title ? (
            <code className="step-row-key">{step.key}</code>
          ) : null}
          {onInspect && !wheelTick ? (
            <span className="step-row-inspect-hint" aria-hidden="true">
              双击查看
            </span>
          ) : null}
        </div>
        {hasParams ? (
          <>
            {step.inputs && Object.keys(step.inputs).length > 0 ? (
              <ParamPairs title="输入" map={step.inputs} labels={runner?.inputLabels} />
            ) : null}
            {step.outputs && Object.keys(step.outputs).length > 0 ? (
              <ParamPairs title="输出" map={step.outputs} labels={runner?.outputLabels} />
            ) : null}
          </>
        ) : null}
        {hasBranches ? (
          <div className="step-children">
            {hasIf ? (
              <div
                className="branch-box if-branch"
                data-qk-branch-slot={`${path}/if`}
                data-qk-branch-empty={(step.ifSteps?.length ?? 0) === 0 ? '1' : '0'}>
                {ifLabel ? <div className="branch-title">{ifLabel}</div> : null}
                <StepListInner
                  steps={step.ifSteps ?? []}
                  catalog={catalog}
                  icons={icons}
                  showParams={showParams}
                  showIndex={showIndex}
                  showKey={showKey}
                  nested
                  pathPrefix={`${path}/if`}
                  inspectPath={inspectPath}
                  selectedPath={selectedPath}
                  onInspect={onInspect}
                />
              </div>
            ) : null}
            {hasElse ? (
              <div
                className="branch-box else-branch"
                data-qk-branch-slot={`${path}/else`}
                data-qk-branch-empty={(step.elseSteps?.length ?? 0) === 0 ? '1' : '0'}>
                {elseLabel ? <div className="branch-title">{elseLabel}</div> : null}
                <StepListInner
                  steps={step.elseSteps ?? []}
                  catalog={catalog}
                  icons={icons}
                  showParams={showParams}
                  showIndex={showIndex}
                  showKey={showKey}
                  nested
                  pathPrefix={`${path}/else`}
                  inspectPath={inspectPath}
                  selectedPath={selectedPath}
                  onInspect={onInspect}
                />
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/**
 * Host-free step program renderer for docs.getquicker.net.
 * Layout sliced from Headless StepListEditor / StepListRowPreview (read-only).
 */
export function StepProgramView({
  data,
  catalog,
  icons,
  showParams = false,
  showIndex = false,
  showKey = false,
  caption,
  showVariables = false,
  variables,
  variablePaneWidth = 120,
  selectedIndexes,
  selectedPath,
  wheelDelay,
  stepPopup = true,
  density = 'docs',
  empty,
  className,
}: StepProgramViewProps): JSX.Element {
  const rootRef = useRef<HTMLDivElement>(null);
  const steps = normalizeStepList(data);
  const resolvedCatalog = normalizeStepCatalog(catalog);
  const programVars = useMemo(
    () => (showVariables || variables?.length ? collectProgramVars(steps, variables) : []),
    [showVariables, variables, steps],
  );
  const showVarPane = showVariables || (variables?.length ?? 0) > 0;
  const mergedIcons =
    icons || resolvedCatalog.icons
      ? {...(resolvedCatalog.icons ?? {}), ...(icons ?? {})}
      : undefined;
  const wheelTick = useWheelDelayDemo(steps, wheelDelay, rootRef);
  const displaySteps = applyWheelDelayStep(steps, wheelTick);
  const highlightIndexes =
    selectedIndexes ?? (wheelTick ? [wheelTick.index] : undefined);
  const [inspect, setInspect] = useState<{
    step: StepWire;
    path: string;
    iconSpec: string;
  } | null>(null);
  const closeInspect = useCallback(() => setInspect(null), []);
  const openInspect = useCallback(
    (step: StepWire, path: string, iconSpec: string) => {
      setInspect({step, path, iconSpec});
    },
    [],
  );

  const rootClass = [
    'qk-sr-program',
    'qk-docs-preview',
    `qk-sr-list--${density}`,
    showVarPane ? 'qk-sr-program--with-vars' : '',
    wheelTick ? 'qk-sr-program--wheel-delay' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  if (steps.length === 0) {
    return (
      <div className={`${rootClass} qk-sr-program--empty`}>
        {caption ? <div className="qk-sr-program__caption">{caption}</div> : null}
        {empty ?? <div className="qk-sr-program__empty">无步骤数据</div>}
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className={rootClass}
      style={
        showVarPane
          ? ({'--qk-sr-varpane': `${variablePaneWidth}px`} as CSSProperties)
          : undefined
      }>
      {caption ? <div className="qk-sr-program__caption">{caption}</div> : null}
      <div className="qk-sr-program__body">
        <div className="qk-sr-program__steps">
          <StepListInner
            steps={displaySteps}
            catalog={resolvedCatalog}
            icons={mergedIcons}
            showParams={showParams}
            showIndex={showIndex}
            showKey={showKey}
            nested={false}
            pathPrefix=""
            selectedIndexes={highlightIndexes}
            selectedPath={selectedPath}
            inspectPath={inspect?.path}
            wheelTick={wheelTick}
            onInspect={stepPopup ? openInspect : undefined}
          />
        </div>
        {showVarPane ? (
          <>
            <div className="qk-sr-program__gutter" aria-hidden />
            <VariableListPane variables={programVars} />
          </>
        ) : null}
      </div>
      {stepPopup && inspect ? (
        <StepInspectPopup
          step={inspect.step}
          actionIcon={inspect.iconSpec}
          onClose={closeInspect}
        />
      ) : null}
    </div>
  );
}
