/**
 * Narrow variable list beside StepProgramView.
 * Row markup + classes from Headless `VariableEditor` / `variable-listbox`.
 * Type icon: `VarTypeIcon` (`res:Var/{Name}.png`).
 */
import type {JSX} from 'react';
import {VarTypeIcon, varTypeZhLabel} from '@site/src/components/VarTypeIcon';
import type {ProgramVar} from './types';

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
}: {
  variables: readonly ProgramVar[];
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
              className="listbox-item variable-row"
              title={rowTitle(item)}
              role="option"
              aria-selected="false">
              <span className="variable-row-leading" aria-hidden="true">
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
