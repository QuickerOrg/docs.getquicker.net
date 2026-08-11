/**
 * Host-free variable chips + `$=` / `{var}` highlighting for docs param previews.
 * Bound state mirrors Headless VarOrValueParamEditor (IconControl 16px + title).
 * Type icons: shared `VarTypeIcon` (Quicker `Assets/Var/*.png`).
 */
import type {JSX, ReactNode} from 'react';
import {resolvePrismLanguage} from '@site/data/xaction/param-file-ext';
import {
  VarTypeIcon,
  type VarTypeKind,
} from '@site/src/components/VarTypeIcon';
import {ParamCodeText} from './ParamCodeText';

export type ParamVarTypeKind = VarTypeKind;
export {normalizeVarType} from '@site/src/components/VarTypeIcon';

const VAR_IDENT = String.raw`[\p{L}_][\p{L}\p{Nd}_]*`;
const WHOLE_VAR_RE = new RegExp(`^\\{(${VAR_IDENT})\\}$`, 'u');
const PLACEHOLDER_RE = new RegExp(`\\{(${VAR_IDENT})\\}`, 'gu');
const PREFIX_RE = /^(\$\$|\$=)/;
const GLOBALS_RE = /\b(_qk|_context|_eval)\b/g;

type SyntaxKind = 'prefix' | 'variable' | 'global';

type SyntaxRange = {
  from: number;
  to: number;
  kind: SyntaxKind;
  key?: string;
};

export function isValidVarIdent(value: string): boolean {
  return new RegExp(`^${VAR_IDENT}$`, 'u').test(value.trim());
}

/** `{name}` as the entire field → bind that variable. */
export function parseWholeVarRef(value: string): string {
  const match = WHOLE_VAR_RE.exec(value.trim());
  return match?.[1] ?? '';
}

export function resolveBoundVarName(
  paramKey: string,
  value: string,
  variableMode: string | undefined,
  inputVars?: Readonly<Record<string, string>>,
): string {
  const fromProp = (inputVars?.[paramKey] ?? '').trim();
  if (fromProp) return fromProp;
  const whole = parseWholeVarRef(value);
  if (whole) return whole;
  const vm = (variableMode ?? '').trim();
  const trimmed = value.trim();
  if ((vm === 'UseVar' || vm === 'UseVarOnly') && isValidVarIdent(trimmed)) {
    return trimmed;
  }
  return '';
}

export function canBindVariable(variableMode: string | undefined): boolean {
  const vm = (variableMode ?? '').trim();
  return vm === 'UseVarOrInput' || vm === 'UseVar' || vm === 'UseVarOnly';
}

export function ParamVarChip({
  name,
  type,
  remark,
}: {
  name: string;
  type?: string;
  remark?: string;
}): JSX.Element {
  const note = (remark ?? '').trim();
  const showNote = note.length > 0 && note !== name;
  return (
    <span className="step-param-varorvalue-display">
      <VarTypeIcon className="step-param-var-type-icon" type={type} size={16} />
      <span className="step-param-varorvalue-title">{name}</span>
      {showNote ? <span className="step-param-varorvalue-muted">{note}</span> : null}
    </span>
  );
}

function parseExpressionRanges(value: string): SyntaxRange[] {
  const prefix = PREFIX_RE.exec(value);
  if (!prefix) return [];
  const ranges: SyntaxRange[] = [{from: 0, to: prefix[0].length, kind: 'prefix'}];

  PLACEHOLDER_RE.lastIndex = 0;
  let match = PLACEHOLDER_RE.exec(value);
  while (match) {
    ranges.push({
      from: match.index,
      to: match.index + match[0].length,
      kind: 'variable',
      key: match[1],
    });
    match = PLACEHOLDER_RE.exec(value);
  }

  GLOBALS_RE.lastIndex = 0;
  match = GLOBALS_RE.exec(value);
  while (match) {
    ranges.push({
      from: match.index,
      to: match.index + match[0].length,
      kind: 'global',
    });
    match = GLOBALS_RE.exec(value);
  }

  ranges.sort((a, b) => a.from - b.from || a.to - b.to);
  return ranges;
}

/** Highlight `$=` / `$$` and `{var}` the way Headless expression editors do. */
export function ParamExpressionText({value}: {value: string}): ReactNode {
  if (!value) return '\u00a0';
  const ranges = parseExpressionRanges(value);
  if (ranges.length === 0) return value;

  const nodes: ReactNode[] = [];
  let cursor = 0;
  ranges.forEach((range, index) => {
    if (range.from < cursor) return;
    if (range.from > cursor) {
      nodes.push(value.slice(cursor, range.from));
    }
    const text = value.slice(range.from, range.to);
    if (range.kind === 'prefix') {
      nodes.push(
        <span key={`p-${index}`} className="qk-sr-expr-prefix">
          {text}
        </span>,
      );
    } else if (range.kind === 'global') {
      nodes.push(
        <span key={`g-${index}`} className="qk-sr-expr-global">
          {text}
        </span>,
      );
    } else {
      nodes.push(
        <span key={`v-${index}-${range.key ?? ''}`} className="qk-sr-expr-var">
          {text}
        </span>,
      );
    }
    cursor = range.to;
  });
  if (cursor < value.length) {
    nodes.push(value.slice(cursor));
  }
  return nodes;
}

/** Read-only Headless StepVariablePicker (output / UseVarOnly). */
export function OutputVarPicker({
  varName,
  varType,
  remark,
  emptyLabel = '-- 选择变量 --',
}: {
  varName?: string;
  varType?: string;
  remark?: string;
  emptyLabel?: string;
}): JSX.Element {
  const bound = (varName ?? '').trim();
  const note = (remark ?? '').trim();
  const showNote = Boolean(bound) && note.length > 0 && note !== bound;

  return (
    <div className="step-param-variable-picker">
      <div className="step-param-variable-picker-display">
        {bound ? (
          <span className="step-param-variable-picker-item">
            <span className="step-param-variable-picker-item-icon">
              <VarTypeIcon type={varType} size={14} />
            </span>
            <span className="step-param-variable-picker-item-main">
              <span className="step-param-variable-picker-item-title">{bound}</span>
              {showNote ? (
                <span className="step-param-variable-picker-item-desc">{note}</span>
              ) : null}
            </span>
          </span>
        ) : (
          <span className="step-param-variable-picker-placeholder">{emptyLabel}</span>
        )}
      </div>
    </div>
  );
}

export function ParamVarOrValueControl({
  value,
  varName,
  varType,
  fileExt,
  showChevron = false,
  emptyLabel = '\u00a0',
}: {
  value: string;
  varName?: string;
  varType?: string;
  /** Step-runner fileExt (`.js`) or first-line `//.js` for syntax highlight. */
  fileExt?: string;
  showChevron?: boolean;
  emptyLabel?: string;
}): JSX.Element {
  const bound = (varName ?? '').trim();
  const codeLanguage = bound ? undefined : resolvePrismLanguage(fileExt, value);
  const body = bound ? (
    <ParamVarChip name={bound} type={varType} />
  ) : codeLanguage ? (
    <ParamCodeText code={value} language={codeLanguage} />
  ) : value.trim() ? (
    <ParamExpressionText value={value} />
  ) : (
    emptyLabel
  );

  if (!showChevron && !bound) {
    return <div className="step-param-control">{body}</div>;
  }

  return (
    <div
      className={[
        'qk-sr-param-form__varorvalue',
        bound ? 'qk-sr-param-form__varorvalue--bound' : '',
        codeLanguage ? 'qk-sr-param-form__varorvalue--code' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="qk-sr-param-form__varorvalue-shell">
        <div className="qk-sr-param-form__varorvalue-body">{body}</div>
        {showChevron ? (
          <span className="qk-sr-param-form__varorvalue-toggle" aria-hidden />
        ) : null}
      </div>
    </div>
  );
}
