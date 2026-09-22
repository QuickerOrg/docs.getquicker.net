import {useState, type ReactNode} from 'react';
import {
  type XActionModuleDef,
  type XActionOutput,
  type XActionParam,
  type XActionSelection,
} from '@site/data/xaction/modules-index';
import {useModuleDef} from '@site/src/components/xaction/useModuleDef';
import {isStepParamVisible} from '@site/src/components/xaction/conditionVisibility';
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
  currentValue,
  onChange,
}: {
  selection: XActionSelection;
  defaultValue: string;
  currentValue: string;
  onChange: (value: string) => void;
}): ReactNode {
  const items = selection.items;
  if (items.length === 0) {
    return null;
  }

  const control = (
    <label className={styles.selectionControl}>
      <span className={styles.selectionControlLabel}>当前选择</span>
      <select
        className={styles.selectionSelect}
        value={currentValue}
        onChange={(event) => onChange(event.target.value)}>
        {items.map((item) => (
          <option key={item.value} value={item.value}>
            {cleanOptionLabel(item.name)}
          </option>
        ))}
      </select>
    </label>
  );

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
    return (
      <div className={styles.selectionInline}>
        {control}
        {table}
      </div>
    );
  }

  const preview = items
    .slice(0, 3)
    .map((item) => cleanOptionLabel(item.name))
    .join('、');

  return (
    <div className={styles.selectionDetails}>
      {control}
      <details>
        <summary className={styles.selectionSummary}>
          <span className={styles.selectionCount}>{items.length} 个选项</span>
          <span className={styles.selectionPreview}>
            {preview}
            <span aria-hidden="true">…</span>
          </span>
        </summary>
        {table}
      </details>
    </div>
  );
}

function ParamItem({
  param,
  selection,
  currentValue,
  onValueChange,
}: {
  param: XActionParam;
  selection?: XActionSelection;
  currentValue: string;
  onValueChange: (value: string) => void;
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
        <SelectionOptions
          selection={selection}
          defaultValue={defaultValue}
          currentValue={currentValue}
          onChange={onValueChange}
        />
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
  const [currentValues, setCurrentValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      (module.inputs ?? []).map((param) => [
        param.key,
        param.defaultValue ?? module.selections?.[param.key]?.items[0]?.value ?? '',
      ]),
    ),
  );
  const inputs = module.inputs ?? [];
  const outputs = module.outputs ?? [];
  const visibleInputs = inputs.filter((param) => isStepParamVisible(param, currentValues));
  const visibleOutputs = outputs.filter((output) => isStepParamVisible(output, currentValues));
  const inputCount = inputs.length;
  const outputCount = outputs.length;
  const selectionEntries = Object.entries(module.selections ?? {});
  const summaryParts = [
    `输入 ${visibleInputs.length}/${inputCount}`,
    `输出 ${visibleOutputs.length}/${outputCount}`,
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
                {visibleInputs.map((param) => (
                  <ParamItem
                    key={param.key}
                    param={param}
                    selection={module.selections?.[param.key]}
                    currentValue={currentValues[param.key] ?? ''}
                    onValueChange={(value) =>
                      setCurrentValues((current) => ({...current, [param.key]: value}))
                    }
                  />
                ))}
              </ul>
            </section>
          ) : null}

          {outputCount > 0 ? (
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>输出参数</h3>
              <ul className={styles.list}>
                {visibleOutputs.map((output) => (
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
  const {module, ready} = useModuleDef(moduleKey);

  if (!ready) {
    return (
      <div
        className="qk-docs-preview-fallback"
        data-qk-preview="heavy"
        role="status"
        aria-label="正在加载模块定义"
        data-gallery-skip=""
      />
    );
  }

  if (!module) {
    return (
      <div className={['qk-docs-preview', styles.root].join(' ')} data-gallery-skip="">
        <p className={styles.missing}>
          未找到模块定义 <code>{moduleKey}</code>。请确认已同步{' '}
          <code>data/xaction/catalog.json</code>。
        </p>
      </div>
    );
  }

  return (
    <div className={['qk-docs-preview', styles.root].join(' ')} data-gallery-skip="">
      <ModuleBody module={module} />
    </div>
  );
}
