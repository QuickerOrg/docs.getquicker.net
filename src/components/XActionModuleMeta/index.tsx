import type {ReactNode} from 'react';
import {
  getModuleDef,
  type XActionModuleDef,
  type XActionOutput,
  type XActionParam,
  type XActionSelection,
} from '@site/data/xaction/modules-index';
import styles from './styles.module.css';

type Props = {
  moduleKey: string;
};

const LONG_DEFAULT_CHARS = 80;
const INLINE_SELECTION_LIMIT = 3;

const VARIABLE_MODE_LABEL: Record<string, string> = {
  Input: '固定输入',
  UseVarOrInput: '输入或变量',
  UseVar: '仅变量',
};

function truncateOneLine(value: string): string {
  const compact = value.replace(/\s+/g, ' ').trim();
  if (compact.length <= LONG_DEFAULT_CHARS) {
    return compact;
  }
  return `${compact.slice(0, LONG_DEFAULT_CHARS)}…`;
}

function isLongDefault(value: string): boolean {
  return value.includes('\n') || value.length > LONG_DEFAULT_CHARS;
}

function formatVariableMode(mode?: string): string | null {
  if (!mode) {
    return null;
  }
  return VARIABLE_MODE_LABEL[mode] ?? mode;
}

function cleanOptionLabel(name: string): string {
  return name.replace(/^\*+|\*+$/g, '').replace(/^\(|\)$/g, '').trim() || name;
}

function SelectionOptions({
  selection,
  defaultValue,
}: {
  selection: XActionSelection;
  defaultValue: string;
}): ReactNode {
  const items = selection.items;
  if (items.length === 0) {
    return null;
  }

  const table = (
    <div className={styles.optionTable} role="list">
      {items.map((item) => {
        const isDefault = defaultValue.length > 0 && item.value === defaultValue;
        const label = cleanOptionLabel(item.name);
        return (
          <div
            key={item.value}
            role="listitem"
            className={`${styles.optionRow}${isDefault ? ` ${styles.optionRowDefault}` : ''}`}
            title={item.description || undefined}>
            <span className={styles.optionLabel}>
              {label}
              {isDefault ? <span className={styles.optionDefaultMark}>默认</span> : null}
            </span>
            <code className={styles.optionValue}>{item.value}</code>
          </div>
        );
      })}
    </div>
  );

  if (items.length <= INLINE_SELECTION_LIMIT) {
    return <div className={styles.selectionInline}>{table}</div>;
  }

  const preview = items
    .slice(0, 3)
    .map((item) => cleanOptionLabel(item.name))
    .join('、');

  return (
    <details className={styles.selectionDetails}>
      <summary className={styles.selectionSummary}>
        <span className={styles.selectionCount}>{items.length} 个选项</span>
        <span className={styles.selectionPreview}>
          {preview}
          <span aria-hidden="true">…</span>
        </span>
      </summary>
      {table}
    </details>
  );
}

function ParamItem({
  param,
  selection,
}: {
  param: XActionParam;
  selection?: XActionSelection;
}): ReactNode {
  const defaultValue = param.defaultValue?.trim() ?? '';
  const hasDefault = defaultValue.length > 0;
  const variableModeLabel = formatVariableMode(param.variableMode);
  const showMeta =
    Boolean(variableModeLabel) || Boolean(param.condition) || (hasDefault && !isLongDefault(defaultValue));

  return (
    <li className={styles.item}>
      <div className={styles.itemHead}>
        <span className={styles.itemName}>{param.name}</span>
        <code className={`${styles.badge} ${styles.badgeKey}`}>{param.key}</code>
        <span className={`${styles.badge} ${styles.badgeType}`}>{param.type}</span>
        <span
          className={`${styles.badge} ${param.required ? styles.badgeReq : styles.badgeOpt}`}>
          {param.required ? '必填' : '可选'}
        </span>
      </div>
      {param.description ? <p className={styles.desc}>{param.description}</p> : null}
      {showMeta ? (
        <div className={styles.metaLine}>
          {variableModeLabel ? (
            <span>
              <span className={styles.metaLabel}>填写</span> {variableModeLabel}
            </span>
          ) : null}
          {param.condition ? (
            <span>
              <span className={styles.metaLabel}>条件</span> {param.condition}
            </span>
          ) : null}
          {hasDefault && !isLongDefault(defaultValue) ? (
            <span>
              <span className={styles.metaLabel}>默认</span>{' '}
              <span className={styles.defaultInline}>{truncateOneLine(defaultValue)}</span>
            </span>
          ) : null}
        </div>
      ) : null}
      {hasDefault && isLongDefault(defaultValue) ? (
        <details className={styles.defaultDetails}>
          <summary className={styles.defaultSummary}>查看默认值</summary>
          <pre className={styles.defaultPre}>{defaultValue}</pre>
        </details>
      ) : null}
      {selection ? (
        <SelectionOptions selection={selection} defaultValue={defaultValue} />
      ) : null}
    </li>
  );
}

function OutputItem({output}: {output: XActionOutput}): ReactNode {
  return (
    <li className={styles.item}>
      <div className={styles.itemHead}>
        <span className={styles.itemName}>{output.name}</span>
        <code className={`${styles.badge} ${styles.badgeKey}`}>{output.key}</code>
        <span className={`${styles.badge} ${styles.badgeType}`}>{output.type}</span>
      </div>
      {output.description ? <p className={styles.desc}>{output.description}</p> : null}
      {output.condition ? (
        <div className={styles.metaLine}>
          <span>
            <span className={styles.metaLabel}>条件</span> {output.condition}
          </span>
        </div>
      ) : null}
    </li>
  );
}

function ModuleBody({module}: {module: XActionModuleDef}): ReactNode {
  const inputCount = module.inputs?.length ?? 0;
  const outputCount = module.outputs?.length ?? 0;
  const selectionEntries = Object.entries(module.selections ?? {});
  const summaryParts = [
    `输入 ${inputCount}`,
    `输出 ${outputCount}`,
    selectionEntries.length > 0 ? `枚举 ${selectionEntries.length}` : null,
  ].filter(Boolean);

  return (
    <>
      <div className={styles.identity}>
        <code className={styles.key}>{module.key}</code>
        <span className={styles.metaText}>
          {module.categoryName}
          <span aria-hidden="true"> · </span>
          {module.stepType}
        </span>
        <div className={styles.tags}>
          {module.isRisky ? <span className={`${styles.tag} ${styles.tagRisk}`}>风险操作</span> : null}
          {module.isProOnly ? <span className={`${styles.tag} ${styles.tagPro}`}>专业版</span> : null}
          {!module.isRisky && !module.isProOnly ? (
            <span className={styles.tag}>标准模块</span>
          ) : null}
        </div>
      </div>

      <details className={styles.paramsBlock}>
        <summary className={styles.paramsSummary}>{summaryParts.join(' · ')}</summary>
        <div className={styles.paramsBody}>
          {inputCount > 0 ? (
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>输入参数</h3>
              <ul className={styles.list}>
                {module.inputs.map((param) => (
                  <ParamItem
                    key={param.key}
                    param={param}
                    selection={module.selections?.[param.key]}
                  />
                ))}
              </ul>
            </section>
          ) : null}

          {outputCount > 0 ? (
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>输出参数</h3>
              <ul className={styles.list}>
                {module.outputs.map((output) => (
                  <OutputItem key={output.key} output={output} />
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </details>
    </>
  );
}

export default function XActionModuleMeta({moduleKey}: Props): ReactNode {
  const module = getModuleDef(moduleKey);

  if (!module) {
    return (
      <div className={styles.root}>
        <p className={styles.missing}>
          未找到模块定义 <code>{moduleKey}</code>。请确认已同步{' '}
          <code>data/xaction/catalog.json</code>。
        </p>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <ModuleBody module={module} />
    </div>
  );
}
