import type {JSX, ReactNode} from 'react';
import {DocsStepIcon} from './DocsStepIcon';
import {normalizeStepCatalog, normalizeStepList} from './normalize';
import {resolveParamLabel} from './resolveParamLabel';
import {resolveStepRowPresentation} from './resolvePresentation';
import type {StepCatalog, StepProgramDensity, StepWire} from './types';

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
  /** Highlight these top-level step indexes (0-based), e.g. a right-click multi-select. */
  selectedIndexes?: readonly number[];
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
  if (stepType === 'if' || key === 'sys:if' || key === 'sys:simpleif' || key === 'if') {
    return {elseLabel: 'Else'};
  }
  return {ifLabel: '子步骤', elseLabel: 'Else'};
}

function StepListInner({
  steps,
  catalog,
  icons,
  showParams,
  showIndex,
  showKey,
  nested,
  selectedIndexes,
}: {
  steps: StepWire[];
  catalog: StepCatalog;
  icons?: Readonly<Record<string, string>>;
  showParams: boolean;
  showIndex: boolean;
  showKey: boolean;
  nested: boolean;
  selectedIndexes?: readonly number[];
}): JSX.Element {
  const selected = new Set(selectedIndexes ?? []);
  return (
    <div className={nested ? 'step-listbox nested' : 'step-listbox root'}>
      {steps.map((step, index) => (
        <StepBlock
          key={`${nested ? 'n' : 'r'}-${index}-${step.key}`}
          step={step}
          index={index}
          catalog={catalog}
          icons={icons}
          showParams={showParams}
          showIndex={showIndex}
          showKey={showKey}
          selected={!nested && selected.has(index)}
        />
      ))}
    </div>
  );
}

function StepBlock({
  step,
  index,
  catalog,
  icons,
  showParams,
  showIndex,
  showKey,
  selected,
}: {
  step: StepWire;
  index: number;
  catalog: StepCatalog;
  icons?: Readonly<Record<string, string>>;
  showParams: boolean;
  showIndex: boolean;
  showKey: boolean;
  selected: boolean;
}): JSX.Element {
  const presentation = resolveStepRowPresentation(step, catalog);
  const hasCatalogName = Boolean(catalog.runners[step.key]?.name);
  const hasParams =
    showParams &&
    ((step.inputs && Object.keys(step.inputs).length > 0) ||
      (step.outputs && Object.keys(step.outputs).length > 0));
  const hasIf = Boolean(step.ifSteps && step.ifSteps.length > 0);
  const hasElse = Boolean(step.elseSteps && step.elseSteps.length > 0);
  const hasBranches = hasIf || hasElse;
  const iconMap = icons ?? catalog.icons;
  const runner = catalog.runners[step.key];
  const {ifLabel, elseLabel} = branchLabelsForStep(step, catalog);

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
            selected ? 'selected' : '',
            step.disabled ? 'disabled' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          title={presentation.titleAttr}
          aria-selected={selected || undefined}
        >
          {hasBranches ? (
            <span className="expand" aria-hidden="true">
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
            {presentation.secondary ? (
              <span className="step-note">{presentation.secondary}</span>
            ) : null}
          </span>
          {showKey && hasCatalogName && presentation.primary !== step.key ? (
            <code className="step-row-key">{step.key}</code>
          ) : null}
          {!hasCatalogName && !step.title ? (
            <code className="step-row-key">{step.key}</code>
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
              <div className="branch-box if-branch">
                {ifLabel ? <div className="branch-title">{ifLabel}</div> : null}
                <StepListInner
                  steps={step.ifSteps ?? []}
                  catalog={catalog}
                  icons={icons}
                  showParams={showParams}
                  showIndex={showIndex}
                  showKey={showKey}
                  nested
                />
              </div>
            ) : null}
            {hasElse ? (
              <div className="branch-box else-branch">
                {elseLabel ? <div className="branch-title">{elseLabel}</div> : null}
                <StepListInner
                  steps={step.elseSteps ?? []}
                  catalog={catalog}
                  icons={icons}
                  showParams={showParams}
                  showIndex={showIndex}
                  showKey={showKey}
                  nested
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
  selectedIndexes,
  density = 'docs',
  empty,
  className,
}: StepProgramViewProps): JSX.Element {
  const steps = normalizeStepList(data);
  const resolvedCatalog = normalizeStepCatalog(catalog);
  const mergedIcons =
    icons || resolvedCatalog.icons
      ? {...(resolvedCatalog.icons ?? {}), ...(icons ?? {})}
      : undefined;

  const rootClass = [
    'qk-sr-program',
    'qk-docs-preview',
    `qk-sr-list--${density}`,
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
    <div className={rootClass}>
      {caption ? <div className="qk-sr-program__caption">{caption}</div> : null}
      <StepListInner
        steps={steps}
        catalog={resolvedCatalog}
        icons={mergedIcons}
        showParams={showParams}
        showIndex={showIndex}
        showKey={showKey}
        nested={false}
        selectedIndexes={selectedIndexes}
      />
    </div>
  );
}
