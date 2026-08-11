/**
 * Host-free read-only step param form (docs / embeds).
 * Layout + class names mirror Headless Web:
 *   features/steps/paramEditors/StepInputParamField.tsx (packParamRow / bool)
 *   features/steps/paramEditors/StepOutputParamField.tsx
 *   features/steps/paramEditors/StepEditorParamSection.tsx
 * CSS sliced from Quicker.Headless/Web/src/styles.css (step-param-* / step-editor-*).
 * Do not invent parallel field styles — sync from Headless when visuals drift.
 *
 * Enums are interactive so readers can browse options; local state also
 * drives condition visibility (仅：xxx). Inside PreviewMap, value changes
 * are reported on PreviewLive so the runtime pane re-renders.
 */
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type JSX,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import {resolveRunScriptFileExt} from "@site/data/xaction/param-file-ext";
import {
  usePreviewLiveEnabled,
  usePreviewLiveReporter,
} from "@site/src/components/PreviewLive";
import {DocsStepIcon} from "@site/src/components/StepProgramView/DocsStepIcon";
import {
  canBindVariable,
  OutputVarPicker,
  ParamVarOrValueControl,
  resolveBoundVarName,
} from "./paramVarRender";
import "./stepParamForm.css";

export type StepParamFormInputDef = {
  key: string;
  name: string;
  type: string;
  defaultValue?: string;
  variableMode?: string;
  description?: string;
  condition?: string;
  /** Step-runner fileExt for syntax highlight (e.g. `.js`). */
  fileExt?: string;
};

export type StepParamFormOutputDef = {
  key: string;
  name: string;
  type?: string;
  description?: string;
  condition?: string;
};

export type StepParamFormSelectionItem = {
  value: string;
  name: string;
  description?: string;
};

export type StepParamFormModule = {
  key: string;
  name: string;
  description?: string;
  inputs: StepParamFormInputDef[];
  outputs?: StepParamFormOutputDef[];
  selections?: Record<string, { items: StepParamFormSelectionItem[] }>;
};

export type StepParamFormPreviewProps = {
  module: StepParamFormModule;
  values?: Readonly<Record<string, string>>;
  /** Input param key → variable name (whole-field bind, Quicker varKey). */
  inputVars?: Readonly<Record<string, string>>;
  outputVars?: Readonly<Record<string, string>>;
  showHidden?: boolean;
  /**
   * Input/output keys to keep expanded and highlight.
   * Other visible params collapse into「其他参数」when collapseOthers is true.
   */
  focusKeys?: readonly string[];
  /** Default true when focusKeys is set. */
  collapseOthers?: boolean;
  /**
   * Optional header icon (usually the action icon).
   * Exposed as `data-preview-from="actionIcon"` for PreviewMap.
   */
  actionIcon?: string;
  /** Override section body scrolling. Default: scroll when the form is long. */
  scrollBody?: boolean;
  className?: string;
};

function isTruthy(value: string | undefined): boolean {
  const v = String(value ?? "").trim().toLowerCase();
  return v === "true" || v === "1" || v === "yes";
}

function buildInitialValues(
  module: StepParamFormModule,
  values?: Readonly<Record<string, string>>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const param of module.inputs) {
    out[param.key] = values?.[param.key] ?? param.defaultValue ?? "";
  }
  return out;
}

function paramValuesEqual(
  a: Readonly<Record<string, string>>,
  b: Readonly<Record<string, string>>,
): boolean {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const key of keys) {
    if ((a[key] ?? "") !== (b[key] ?? "")) return false;
  }
  return true;
}

/** Catalog `condition` like `仅：custom` / `仅：move, moveTo`. */
export function isStepParamVisible(
  param: { condition?: string },
  currentValues: Readonly<Record<string, string>>,
  showHidden: boolean,
): boolean {
  const raw = param.condition?.trim() ?? "";
  if (!raw || showHidden) return true;
  const only = /^仅[：:]\s*(.+)$/.exec(raw);
  if (!only) return true;
  const wanted = only[1]
    .split(/[,，]/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (wanted.length === 0) return true;
  return Object.values(currentValues).some((v) => wanted.includes(v));
}

function ParamSection({
  title,
  children,
  scrollBody = false,
  defaultExpanded = true,
}: {
  title: string;
  children: ReactNode;
  /** Cap + scroll dense input lists; keep outputs fully visible. */
  scrollBody?: boolean;
  defaultExpanded?: boolean;
}): JSX.Element {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <section
      className={[
        "step-editor-param-section",
        expanded ? "is-expanded" : "is-collapsed",
      ].join(" ")}
    >
      <button
        type="button"
        className="step-editor-param-section__header"
        aria-expanded={expanded}
        onClick={() => setExpanded((v) => !v)}
      >
        <span
          className={[
            "step-editor-param-section__chevron",
            expanded ? "is-expanded" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          aria-hidden
        >
          <span className="qk-sr-param-form__twisty" />
        </span>
        <span className="step-editor-param-section__title">{title}</span>
      </button>
      {expanded ? (
        <div
          className={[
            "step-editor-param-section__body",
            scrollBody ? "step-editor-param-section__body--scroll" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {children}
        </div>
      ) : null}
    </section>
  );
}

function BoolRow({
  param,
  value,
  onChange,
  focused = false,
}: {
  param: StepParamFormInputDef;
  value: string;
  onChange: (next: string) => void;
  focused?: boolean;
}): JSX.Element {
  const desc = (param.description ?? "").trim();
  const id = `qk-sr-bool-${param.key}`;
  return (
    <div
      className={[
        "step-param-row",
        "step-param-row--inline",
        focused ? "step-param-row--focus" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      data-preview-from={param.key}
    >
      <span className="step-param-inline-col1-spacer" aria-hidden />
      <div className="step-param-inline-bool">
        <div className="step-param-inline-bool-head">
          <input
            id={id}
            type="checkbox"
            className="step-param-checkbox"
            checked={isTruthy(value)}
            onChange={(event) => onChange(event.target.checked ? "true" : "false")}
          />
          <label htmlFor={id} className="step-param-inline-bool-title-label">
            <span className="step-param-inline-title">{param.name}</span>
          </label>
        </div>
        {desc ? (
          <label htmlFor={id} className="step-param-inline-bool-desc-label">
            <span className="step-param-hint step-param-hint--below-check">{desc}</span>
          </label>
        ) : null}
      </div>
    </div>
  );
}

function EnumSelect({
  module,
  param,
  value,
  onChange,
}: {
  module: StepParamFormModule;
  param: StepParamFormInputDef;
  value: string;
  onChange: (next: string) => void;
}): JSX.Element {
  const items = useMemo(
    () => module.selections?.[param.key]?.items ?? [],
    [module.selections, param.key],
  );
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<CSSProperties>({});
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const selected = items.find((item) => item.value === value);
  const label = (selected?.name ?? value ?? "").trim() || "-";

  const commit = (next: string): void => {
    onChange(next);
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const selectedIndex = items.findIndex((item) => item.value === value);
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
  }, [open, items, value]);

  useLayoutEffect(() => {
    if (!open) return;
    const update = (): void => {
      const trigger = rootRef.current?.querySelector("button");
      if (!(trigger instanceof HTMLElement)) return;
      const rect = trigger.getBoundingClientRect();
      const menuHeight = Math.min(240, window.innerHeight - 16);
      const spaceBelow = window.innerHeight - rect.bottom - 8;
      const openUp = spaceBelow < Math.min(menuHeight, 160) && rect.top > spaceBelow;
      if (openUp) {
        setMenuStyle({
          left: rect.left,
          width: rect.width,
          bottom: window.innerHeight - rect.top + 4,
          top: "auto",
          maxHeight: Math.min(240, Math.max(120, rect.top - 12)),
        });
      } else {
        setMenuStyle({
          left: rect.left,
          width: rect.width,
          top: rect.bottom + 4,
          bottom: "auto",
          maxHeight: Math.min(240, Math.max(120, spaceBelow)),
        });
      }
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open]);

  // Headless StepInputParamField: after the popup has a max-height, keep the
  // highlighted option in view. Only run on open / activeIndex — not on
  // window scroll (that would fight the page).
  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => {
      const popup = menuRef.current;
      if (!(popup instanceof HTMLElement)) return;
      const selectedEl = popup.querySelector<HTMLElement>(".step-param-enum-option.selected");
      if (!selectedEl) return;
      const popupRect = popup.getBoundingClientRect();
      const itemRect = selectedEl.getBoundingClientRect();
      if (itemRect.top < popupRect.top) {
        popup.scrollTop -= popupRect.top - itemRect.top;
      } else if (itemRect.bottom > popupRect.bottom) {
        popup.scrollTop += itemRect.bottom - popupRect.bottom;
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [open, activeIndex]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent): void => {
      const t = event.target;
      if (!(t instanceof Node)) return;
      if (rootRef.current?.contains(t) || menuRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((idx) => Math.min(idx + 1, Math.max(0, items.length - 1)));
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex((idx) => Math.max(idx - 1, 0));
        return;
      }
      if (event.key === "Enter") {
        event.preventDefault();
        const picked = items[Math.max(0, Math.min(activeIndex, items.length - 1))];
        if (picked) commit(picked.value);
      }
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, items, activeIndex]);

  const menu =
    open && typeof document !== "undefined" ? (
      createPortal(
        <div
          ref={menuRef}
          className="step-param-enum-popup step-param-enum-popup--portal qk-sr-param-form"
          role="listbox"
          aria-label={param.name}
          style={menuStyle}
        >
          {items.length === 0 ? (
            <div className="step-param-enum-empty">无选项</div>
          ) : (
            items.map((item, idx) => {
              const title = item.name.trim() || item.value;
              const selectedOpt = idx === activeIndex;
              return (
                <button
                  key={item.value}
                  type="button"
                  role="option"
                  aria-selected={selectedOpt}
                  className={[
                    "step-param-enum-option",
                    selectedOpt ? "selected" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  title={item.description?.trim() || title}
                  onClick={() => commit(item.value)}
                >
                  <span className="step-param-enum-option-title">{title}</span>
                  {item.value && item.value !== title ? (
                    <span className="step-param-enum-option-key">{item.value}</span>
                  ) : null}
                </button>
              );
            })
          )}
        </div>,
        document.body,
      )
    ) : null;

  return (
    <div
      className={["qk-sr-param-form__enum", open ? "is-open" : ""].filter(Boolean).join(" ")}
      ref={rootRef}
    >
      <button
        type="button"
        className="step-param-control qk-sr-param-form__enum-trigger"
        aria-label={param.name}
        aria-expanded={open}
        aria-haspopup="listbox"
        title={param.description?.trim() || param.name}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="qk-sr-param-form__enum-label">{label}</span>
        <span className="qk-sr-param-form__enum-chevron" aria-hidden />
      </button>
      {menu}
    </div>
  );
}

function isMultilineParam(
  param: StepParamFormInputDef,
  value: string,
): boolean {
  if (value.includes("\n")) return true;
  const type = (param.type || "").toLowerCase();
  if (
    type === "stringlist" ||
    type === "list" ||
    type === "multiline" ||
    type === "textblock"
  ) {
    return true;
  }
  return /^(message|items|customButtons|script|text|content|body)$/i.test(
    param.key,
  );
}

function EditableParamValue({
  param,
  value,
  onChange,
}: {
  param: StepParamFormInputDef;
  value: string;
  onChange: (next: string) => void;
}): JSX.Element {
  const multiline = isMultilineParam(param, value);
  const className = "step-param-control qk-sr-param-form__editable";
  const title = param.description?.trim() || param.name;
  if (multiline) {
    const rows = Math.min(8, Math.max(2, value.split(/\r?\n/).length));
    return (
      <textarea
        className={className}
        value={value}
        rows={rows}
        aria-label={param.name}
        title={title}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  }
  return (
    <input
      type="text"
      className={className}
      value={value}
      aria-label={param.name}
      title={title}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

function resolveRowFileExt(
  module: StepParamFormModule,
  param: StepParamFormInputDef,
  currentValues: Readonly<Record<string, string>>,
): string | undefined {
  if (module.key === "sys:runScript" && param.key === "script") {
    return resolveRunScriptFileExt(currentValues.type, currentValues.ext);
  }
  return param.fileExt;
}

function InputRow({
  module,
  param,
  value,
  onChange,
  inputVars,
  currentValues,
  focused = false,
  editable = false,
}: {
  module: StepParamFormModule;
  param: StepParamFormInputDef;
  value: string;
  onChange: (next: string) => void;
  inputVars?: Readonly<Record<string, string>>;
  currentValues: Readonly<Record<string, string>>;
  focused?: boolean;
  editable?: boolean;
}): JSX.Element {
  const boundVar = resolveBoundVarName(
    param.key,
    value,
    param.variableMode,
    inputVars,
  );
  const type = (param.type || "").toLowerCase();
  const valueIsBooleanLiteral = /^(true|false|1|0|yes|no)$/i.test(value.trim());
  if (
    !boundVar &&
    type === "boolean" &&
    (param.variableMode === "Input" || valueIsBooleanLiteral)
  ) {
    return (
      <BoolRow
        param={param}
        value={value}
        onChange={onChange}
        focused={focused}
      />
    );
  }
  const desc = (param.description ?? "").trim();
  const items = module.selections?.[param.key]?.items ?? [];
  const useSelect = !boundVar && (type === "enum" || items.length > 0);
  const showChevron = Boolean(boundVar) || canBindVariable(param.variableMode);
  return (
    <div
      className={[
        "step-param-row",
        "step-param-row--single",
        focused ? "step-param-row--focus" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      data-preview-from={param.key}
    >
      <div className="step-param-label">{param.name}</div>
      <div className="step-param-field-col" data-preview-handle="from">
        {useSelect ? (
          <EnumSelect module={module} param={param} value={value} onChange={onChange} />
        ) : editable && !boundVar ? (
          <EditableParamValue param={param} value={value} onChange={onChange} />
        ) : (
          <ParamVarOrValueControl
            value={boundVar ? "" : value}
            varName={boundVar}
            varType={param.type}
            fileExt={resolveRowFileExt(module, param, currentValues)}
            showChevron={showChevron}
          />
        )}
        {desc ? <div className="step-param-hint">{desc}</div> : null}
      </div>
    </div>
  );
}

function OutputRow({
  output,
  varName,
  focused = false,
}: {
  output: StepParamFormOutputDef;
  varName: string;
  focused?: boolean;
}): JSX.Element {
  const desc = (output.description ?? "").trim();
  return (
    <div
      className={[
        "step-param-row",
        "step-param-row--single",
        focused ? "step-param-row--focus" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      data-preview-from={output.key}
    >
      <div className="step-param-label">{output.name}</div>
      <div className="step-param-field-col" data-preview-handle="from">
        <div className="step-param-output-picker-row">
          <OutputVarPicker varName={varName.trim()} varType={output.type} />
          {desc ? (
            <div className="step-param-hint step-param-hint--output-inline" title={desc}>
              {desc}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function NoteRow(): JSX.Element {
  return (
    <div className="step-param-row step-param-row--single">
      <div className="step-param-label">步骤注释</div>
      <div className="step-param-field-col">
        <div className="step-param-control">{"\u00a0"}</div>
      </div>
    </div>
  );
}

export function StepParamFormPreview({
  module,
  values,
  inputVars,
  outputVars,
  showHidden = false,
  focusKeys,
  collapseOthers,
  actionIcon,
  scrollBody,
  className,
}: StepParamFormPreviewProps): JSX.Element {
  const initial = useMemo(() => buildInitialValues(module, values), [module, values]);
  const [currentValues, setCurrentValues] = useState(initial);
  const liveEdit = usePreviewLiveEnabled();
  const reportLive = usePreviewLiveReporter();
  useEffect(() => {
    setCurrentValues(buildInitialValues(module, values));
  }, [module, values]);
  useLayoutEffect(() => {
    if (!reportLive) return;
    reportLive({
      values: currentValues,
      extras: {actionIcon},
    });
  }, [reportLive, currentValues, actionIcon]);
  useEffect(() => {
    return () => {
      reportLive?.(null);
    };
  }, [reportLive]);

  const focusSet = useMemo(
    () => new Set((focusKeys ?? []).map((k) => k.trim()).filter(Boolean)),
    [focusKeys],
  );
  const hasFocus = focusSet.size > 0;
  const doCollapseOthers = collapseOthers ?? hasFocus;

  const setValue = (key: string, next: string): void => {
    setCurrentValues((prev) => ({ ...prev, [key]: next }));
  };
  const isAtInitial = paramValuesEqual(currentValues, initial);
  const resetToDefaults = (): void => {
    setCurrentValues(initial);
  };

  const visibleInputs = module.inputs.filter((param) =>
    isStepParamVisible(param, currentValues, showHidden),
  );
  const visibleOutputs = (module.outputs ?? []).filter((output) =>
    isStepParamVisible(output, currentValues, showHidden),
  );

  const focusInputs = hasFocus
    ? visibleInputs.filter((param) => focusSet.has(param.key))
    : visibleInputs;
  const otherInputs = hasFocus
    ? visibleInputs.filter((param) => !focusSet.has(param.key))
    : [];
  const focusOutputs = hasFocus
    ? visibleOutputs.filter((output) => focusSet.has(output.key))
    : visibleOutputs;
  const otherOutputs = hasFocus
    ? visibleOutputs.filter((output) => !focusSet.has(output.key))
    : [];

  const otherCount =
    otherInputs.length + otherOutputs.length + (doCollapseOthers ? 1 : 0);
  const showOthersBucket = doCollapseOthers && otherCount > 0;
  const showStandaloneNote = !doCollapseOthers;

  return (
    <div
      className={[
        "qk-sr-param-form",
        "step-editor-popup",
        hasFocus ? "qk-sr-param-form--focus" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="step-editor-popup-header">
        <div className="qk-sr-param-form__title-wrap">
          <div className="qk-sr-param-form__title-row">
            {actionIcon ? (
              <span data-preview-from="actionIcon" data-preview-handle="from">
                <DocsStepIcon spec={actionIcon} size={18} title="动作图标" />
              </span>
            ) : null}
            <h2>{module.name}</h2>
          </div>
          {module.description ? (
            <div className="qk-sr-param-form__subtitle">{module.description}</div>
          ) : null}
        </div>
        <button
          type="button"
          className="qk-sr-param-form__reset"
          title="重置为默认值"
          aria-label="重置为默认值"
          disabled={isAtInitial}
          onClick={resetToDefaults}
        >
          重置
        </button>
      </div>
      <div className="step-editor-popup-body step-editor-popup-params">
        {focusInputs.length > 0 ? (
          <ParamSection
            title="常规"
            scrollBody={scrollBody ?? (!hasFocus || focusInputs.length > 6)}
          >
            {focusInputs.map((param) => (
              <InputRow
                key={param.key}
                module={module}
                param={param}
                value={currentValues[param.key] ?? ""}
                onChange={(next) => setValue(param.key, next)}
                inputVars={inputVars}
                currentValues={currentValues}
                editable={liveEdit}
              />
            ))}
          </ParamSection>
        ) : null}
        {focusOutputs.length > 0 ? (
          <ParamSection title="输出到变量">
            {focusOutputs.map((output) => (
              <OutputRow
                key={output.key}
                output={output}
                varName={outputVars?.[output.key] ?? ""}
              />
            ))}
          </ParamSection>
        ) : null}
        {showOthersBucket ? (
          <ParamSection
            title={`其他参数 (${otherCount})`}
            defaultExpanded={false}
            scrollBody={otherInputs.length + otherOutputs.length > 6}
          >
            {otherInputs.map((param) => (
              <InputRow
                key={param.key}
                module={module}
                param={param}
                value={currentValues[param.key] ?? ""}
                onChange={(next) => setValue(param.key, next)}
                inputVars={inputVars}
                currentValues={currentValues}
                editable={liveEdit}
              />
            ))}
            {otherOutputs.map((output) => (
              <OutputRow
                key={output.key}
                output={output}
                varName={outputVars?.[output.key] ?? ""}
              />
            ))}
            <NoteRow />
          </ParamSection>
        ) : null}
        {showStandaloneNote ? (
          <ParamSection title="其它">
            <NoteRow />
          </ParamSection>
        ) : null}
      </div>
      <div className="step-editor-popup-footer">
        <div className="step-editor-popup-footer__start">
          <label className="qk-sr-param-form__disable">
            <input type="checkbox" className="step-param-checkbox" checked={false} readOnly tabIndex={-1} />
            <span>停用此步骤</span>
          </label>
        </div>
        <div className="step-editor-popup-footer__end">
          <span className="qk-sr-param-form__delay">
            运行后延迟
            <span className="step-param-control qk-sr-param-form__delay-val">0</span>
          </span>
          <span className="qk-sr-param-form__btn qk-sr-param-form__btn--primary">保存(S)</span>
          <span className="qk-sr-param-form__btn">取消</span>
        </div>
      </div>
    </div>
  );
}
