/**
 * Narrow variable list beside StepProgramView.
 * Row markup + classes from Headless `VariableEditor` / `variable-listbox`.
 * Type icon: `VarTypeIcon` (`res:Var/{Name}.png`).
 */
import type {JSX} from 'react';
import {VarTypeIcon, varTypeZhLabel} from '@site/src/components/VarTypeIcon';
import {DocsStepIcon} from './DocsStepIcon';
import type {ProgramVar} from './types';

const USAGE_ICON: Record<'in' | 'out' | 'state', {spec: string; title: string}> = {
  in: {spec: 'fa:Solid_ArrowToBottom', title: '子程序输入'},
  out: {spec: 'fa:Solid_ArrowFromBottom', title: '子程序输出'},
  state: {spec: 'fa:Solid_Save', title: '作为状态使用'},
};

function rowTitle(item: ProgramVar): string {
  const type = item.type?.trim();
  const zh = varTypeZhLabel(type);
  const bits = [item.name, type ? `${type} · ${zh}` : zh, item.remark?.trim()].filter(
    Boolean,
  );
  return bits.join(' · ');
}

export function VariableListPane({
  variables,
  selected,
}: {
  variables: readonly ProgramVar[];
  /** Highlight this variable name (docs chrome). */
  selected?: string;
}): JSX.Element {
  return (
    <aside className="qk-sr-varlist" aria-label="变量列表">
      <div className="qk-sr-varlist__head">变量</div>
      <div className="listbox variable-listbox qk-sr-varlist__box" role="listbox">
        {variables.length === 0 ? (
          <div className="qk-sr-varlist__empty">暂无变量</div>
        ) : (
          variables.map((item) => (
            <div
              key={item.name}
              className={[
                'listbox-item',
                'variable-row',
                selected === item.name ? 'variable-row--selected' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              title={rowTitle(item)}
              role="option"
              aria-selected={selected === item.name}>
              <span className="variable-row-leading" aria-hidden="true">
                {(item.usage ?? []).map((flag) => (
                  <DocsStepIcon
                    key={flag}
                    className={`variable-row-icon variable-row-icon--${flag}`}
                    spec={USAGE_ICON[flag].spec}
                    size={10}
                    title={USAGE_ICON[flag].title}
                  />
                ))}
                <VarTypeIcon
                  className="variable-row-type-icon"
                  type={item.type ?? 'Any'}
                  size={14}
                />
              </span>
              <span className="variable-row-body">
                <span className="variable-row-key">{item.name}</span>
              </span>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
