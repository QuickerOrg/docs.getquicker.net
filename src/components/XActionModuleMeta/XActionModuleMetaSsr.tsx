import type {ReactNode} from 'react';

type CompactParam = {
  key: string;
  name: string;
  type: string;
  required?: boolean;
  variableMode?: string;
  defaultValue?: string;
  newStepDefaultValue?: string;
  condition?: string;
  validForList?: string[];
  invalidForList?: string[];
  description?: string;
};

type CompactOutput = {
  key: string;
  name: string;
  type: string;
  condition?: string;
  description?: string;
};

type CompactSelection = {
  name?: string;
  items?: Array<{value: string; name: string}>;
};

type CompactModuleMeta = {
  key: string;
  name: string;
  description?: string;
  categoryName?: string;
  stepType?: string;
  isRisky?: boolean;
  inputs?: CompactParam[];
  outputs?: CompactOutput[];
  selections?: Record<string, CompactSelection>;
};

const VARIABLE_MODE_LABELS: Record<string, string> = {
  Input: '固定输入',
  UseVarOrInput: '输入或变量',
  UseVar: '仅变量',
};

function parseMeta(ssrMetaJson?: string): CompactModuleMeta | null {
  if (!ssrMetaJson) return null;
  try {
    return JSON.parse(ssrMetaJson) as CompactModuleMeta;
  } catch {
    return null;
  }
}

function formatDefault(p: CompactParam): string {
  const hasNew = p.newStepDefaultValue !== undefined && p.newStepDefaultValue !== '';
  const hasDef = p.defaultValue !== undefined && p.defaultValue !== '';
  if (hasNew && hasDef && p.newStepDefaultValue !== p.defaultValue) {
    return `初始: ${p.newStepDefaultValue} / 缺省: ${p.defaultValue}`;
  }
  if (hasNew) return `初始: ${p.newStepDefaultValue}`;
  if (hasDef) return p.defaultValue!;
  return '—';
}

function formatConstraints(
  p: CompactParam,
  selections?: Record<string, CompactSelection>,
): string {
  const parts: string[] = [];
  const items = selections?.[p.key]?.items;
  if (items?.length) {
    const allOptions = items
      .map((it) => `${it.value === '' ? '""' : it.value}(${it.name})`)
      .join(' / ');
    parts.push(`可选：${allOptions}`);
  }
  if (p.condition) parts.push(`条件：${p.condition}`);
  if (p.validForList?.length) parts.push(`仅：${p.validForList.join(', ')}`);
  if (p.invalidForList?.length) parts.push(`排除：${p.invalidForList.join(', ')}`);
  return parts.join('；') || '—';
}

/**
 * 静态模块定义摘要（SSR 与首次水合共用，且有意不加 `.qk-docs-preview`，
 * 使本地搜索索引、搜索引擎与无脚本读取都能抓取模块 Key 与参数契约；
 * 客户端完整交互版就绪后会整体替换本节点，保证页面上只显示一份参数表）。
 */
export function XActionModuleMetaSsr({
  moduleKey,
  ssrMetaJson,
}: {
  moduleKey: string;
  ssrMetaJson?: string;
}): ReactNode {
  const meta = parseMeta(ssrMetaJson);
  if (!meta) {
    return (
      <section
        className="qk-module-meta-ssr"
        id="module-contract"
        data-qk-module={moduleKey}
        data-gallery-skip="">
        <h2 className="qk-module-meta-ssr__heading">
          模块定义：<code>{moduleKey}</code>
        </h2>
      </section>
    );
  }

  const inputs = meta.inputs ?? [];
  const outputs = meta.outputs ?? [];

  return (
    <section
      className="qk-module-meta-ssr"
      id="module-contract"
      data-qk-module={meta.key}
      data-gallery-skip="">
      <div className="qk-module-meta-ssr__header">
        <h2 className="qk-module-meta-ssr__heading">
          <code>{meta.key}</code> · {meta.name}（模块定义）
        </h2>
        <span className="qk-module-meta-ssr__badge">
          {inputs.length} 个输入 · {outputs.length} 个输出
        </span>
      </div>

      {meta.description ? (
        <p className="qk-module-meta-ssr__desc">{meta.description}</p>
      ) : null}

      <details className="qk-module-meta-ssr__details">
        <summary className="qk-module-meta-ssr__summary">
          展开参数与输出静态契约（{inputs.length} 输入 / {outputs.length} 输出，交互版加载中…）
        </summary>
        <div className="qk-module-meta-ssr__tables">
          {inputs.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>参数</th>
                  <th>Key</th>
                  <th>类型</th>
                  <th>模式</th>
                  <th>默认 / 初始值</th>
                  <th>枚举与条件</th>
                  <th>说明</th>
                </tr>
              </thead>
              <tbody>
                {inputs.map((p) => (
                  <tr key={p.key}>
                    <td>
                      {p.name}
                      {p.required ? ' *' : ''}
                    </td>
                    <td>
                      <code>{p.key}</code>
                    </td>
                    <td>{p.type || '—'}</td>
                    <td>
                      {p.variableMode
                        ? VARIABLE_MODE_LABELS[p.variableMode] ?? p.variableMode
                        : '—'}
                    </td>
                    <td>{formatDefault(p)}</td>
                    <td>{formatConstraints(p, meta.selections)}</td>
                    <td>{p.description || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}

          {outputs.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>输出</th>
                  <th>Key</th>
                  <th>类型</th>
                  <th>条件</th>
                  <th>说明</th>
                </tr>
              </thead>
              <tbody>
                {outputs.map((o) => (
                  <tr key={o.key}>
                    <td>{o.name}</td>
                    <td>
                      <code>{o.key}</code>
                    </td>
                    <td>{o.type || '—'}</td>
                    <td>{o.condition || '—'}</td>
                    <td>{o.description || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}
        </div>
      </details>
    </section>
  );
}
