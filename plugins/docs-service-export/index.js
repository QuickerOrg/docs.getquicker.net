const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const {createRequire} = require('node:module');
const {pathToFileURL} = require('node:url');
const ts = require('typescript');
const {
  aliasedSitePathToRelativePath,
  createSlugger,
  DEFAULT_PARSE_FRONT_MATTER,
  parseMarkdownFile,
} = require('@docusaurus/utils');

const hash = (value) => crypto.createHash('sha256').update(value).digest('hex');
const host = 'https://docs.getquicker.net';
let headingProcessor;
let headingToString;
let markdownReady;
const mdxRequire = createRequire(require.resolve('@docusaurus/mdx-loader'));

function prepareMarkdown() {
  // 使用与 Docusaurus 相同的 Markdown AST 文本语义，保留代码标识符，排除链接地址。
  return markdownReady ??= Promise.all([
    import(pathToFileURL(mdxRequire.resolve('@mdx-js/mdx')).href),
    import(pathToFileURL(mdxRequire.resolve('mdast-util-to-string')).href),
  ]).then(([{createProcessor}, {toString}]) => {
    headingProcessor = createProcessor({format: 'md'});
    headingToString = toString;
  });
}

function moduleDefinitions(siteDir) {
  const dir = path.join(siteDir, 'data', 'xaction', 'modules');
  const definitions = new Map();
  if (!fs.existsSync(dir)) return definitions;
  for (const file of fs.readdirSync(dir).filter((name) => name.endsWith('.json'))) {
    const value = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
    if (value.key) definitions.set(value.key, value);
  }
  return definitions;
}

const cell = (value) => String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;')
  .replace(/>/g, '&gt;').replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>');

const STATIC_VISIBLE_KINDS = new Set(['All', 'Any', 'Field']);
const STATIC_FIELD_OPS = new Set(['In', 'NotIn']);

function isStaticVisibleTree(node) {
  if (!node || typeof node !== 'object') return false;
  if (!STATIC_VISIBLE_KINDS.has(node.kind)) return false;
  if (node.kind === 'Field') {
    return typeof node.fieldKey === 'string' && STATIC_FIELD_OPS.has(node.operator);
  }
  return Array.isArray(node.conditions) && node.conditions.every(isStaticVisibleTree);
}

function formatParamCondition(param) {
  const parts = [];
  if (param.condition) {
    if (param.visibleWhen && !isStaticVisibleTree(param.visibleWhen)) {
      parts.push(`${param.condition}（动态表达式：未求值）`);
    } else if (!param.visibleWhen && /\$\s*=|visibleExpression|表达式/i.test(param.condition)) {
      parts.push(`${param.condition}（动态表达式：未求值）`);
    } else {
      parts.push(param.condition);
    }
  } else if (param.visibleExpression) {
    parts.push(`动态条件（未求值）：${param.visibleExpression}`);
  } else if (param.visibleWhen) {
    parts.push(isStaticVisibleTree(param.visibleWhen) ? '结构化显隐条件（见 schema）' : '动态条件：未求值');
  }
  if (Array.isArray(param.validForList) && param.validForList.length) {
    parts.push(`仅适用于：${param.validForList.join(', ')}`);
  }
  if (Array.isArray(param.invalidForList) && param.invalidForList.length) {
    parts.push(`排除：${param.invalidForList.join(', ')}`);
  }
  return parts.join('；');
}

function formatDefaultInfo(param) {
  const hasNewStep = param.newStepDefaultValue !== undefined && param.newStepDefaultValue !== '';
  const hasRuntime = param.defaultValue !== undefined && param.defaultValue !== '';
  if (hasNewStep && hasRuntime && param.newStepDefaultValue !== param.defaultValue) {
    return `新建初始值: \`${param.newStepDefaultValue}\`；运行时缺省: \`${param.defaultValue}\``;
  }
  if (hasNewStep) return `新建初始值: \`${param.newStepDefaultValue}\``;
  if (hasRuntime) return `${param.defaultValue}`;
  return '';
}

function formatSelectionsForParam(definition, paramKey) {
  const sel = definition.selections?.[paramKey];
  if (!sel?.items?.length) return '';
  return sel.items.map((item) => `\`${item.value === '' ? '""' : item.value}\`(${item.name})`).join(' / ');
}

function moduleMarkdown(definition) {
  const lines = [`**模块定义：${definition.name}（${definition.key}）**`];
  if (definition.description) lines.push(definition.description);
  const inputs = definition.inputs ?? [];
  if (inputs.length) {
    lines.push(
      '',
      '| 参数 | Key | 类型 | 变量模式 | 必填 | 默认/新建初始值 | 可选枚举与条件约束 | 说明 |',
      '| --- | --- | --- | --- | --- | --- | --- | --- |',
    );
    for (const input of inputs) {
      const constraints = [];
      const enumStr = formatSelectionsForParam(definition, input.key);
      if (enumStr) constraints.push(`可选：${enumStr}`);
      const condStr = formatParamCondition(input);
      if (condStr) constraints.push(`条件：${condStr}`);
      lines.push(
        `| ${cell(input.name)} | ${cell(input.key)} | ${cell(input.type)} | ${cell(input.variableMode ?? '')} | ${input.required ? '是' : '否'} | ${cell(formatDefaultInfo(input))} | ${cell(constraints.join('；'))} | ${cell(input.description)} |`,
      );
    }
  }
  if (definition.outputs?.length) {
    lines.push('', '| 输出 | Key | 类型 | 适用约束 | 说明 |', '| --- | --- | --- | --- | --- |');
    for (const output of definition.outputs) {
      lines.push(`| ${cell(output.name)} | ${cell(output.key)} | ${cell(output.type)} | ${cell(formatParamCondition(output))} | ${cell(output.description)} |`);
    }
  }
  return lines.join('\n');
}

function resolvePreviewDefault(param, explicitValues) {
  if (explicitValues && Object.prototype.hasOwnProperty.call(explicitValues, param.key)) {
    return {value: explicitValues[param.key], source: '示例值'};
  }
  if (param.newStepDefaultValue !== undefined) {
    return {value: param.newStepDefaultValue, source: '新建步骤初始值'};
  }
  if (param.defaultValue !== undefined) {
    return {value: param.defaultValue, source: '运行时缺省值'};
  }
  return {value: '', source: '空值'};
}

function renderModuleParamPreview(props, definitions, diagnostics, source) {
  const key = props.moduleKey;
  const definition = definitions.get(key);
  if (!definition) {
    diagnostics.push(`${source}: 未找到模块 ${key}`);
    return `**参数配置示例（模块 ${key} 的结构化定义缺失）**`;
  }
  const explicitValues = props.values && typeof props.values === 'object' ? props.values : {};
  const inputVars = props.inputVars && typeof props.inputVars === 'object' ? props.inputVars : {};
  const outputVars = props.outputVars && typeof props.outputVars === 'object' ? props.outputVars : {};
  const focusSet = new Set(Array.isArray(props.focusKeys) ? props.focusKeys : []);

  const titleSuffix = props.note ? `（${props.note}）` : '';
  const contractUrl = definition.slug ? `${host}/v2/xaction/modules/${definition.slug}` : null;
  const lines = [
    `**参数配置示例：${definition.name}（\`${definition.key}\`）${titleSuffix}**`,
  ];
  if (contractUrl) {
    lines.push(`完整参数与约束契约见 [${definition.name} 模块参考](${contractUrl})。`);
  }

  const inputs = definition.inputs ?? [];
  const relevantInputs = inputs.filter((p) => {
    if (focusSet.has(p.key)) return true;
    if (Object.prototype.hasOwnProperty.call(explicitValues, p.key)) return true;
    if (Object.prototype.hasOwnProperty.call(inputVars, p.key)) return true;
    return p.newStepDefaultValue !== undefined || (p.defaultValue !== undefined && p.defaultValue !== '');
  });
  const selectedInputs = relevantInputs.length ? relevantInputs : inputs.slice(0, 6);
  if (selectedInputs.length) {
    lines.push('', '| 参数 | Key | 生效配置 | 值来源 | 变量绑定 |', '| --- | --- | --- | --- | --- |');
    for (const p of selectedInputs) {
      const resolved = resolvePreviewDefault(p, explicitValues);
      const focusMark = focusSet.has(p.key) ? '★ ' : '';
      const varBind = Object.prototype.hasOwnProperty.call(inputVars, p.key) ? `输入 \`${inputVars[p.key]}\`` : '';
      lines.push(`| ${focusMark}${cell(p.name)} | ${cell(p.key)} | ${cell(resolved.value === '' ? '""' : resolved.value)} | ${resolved.source} | ${cell(varBind)} |`);
    }
  }
  const boundOutputs = (definition.outputs ?? []).filter(
    (o) => focusSet.has(o.key) || Object.prototype.hasOwnProperty.call(outputVars, o.key),
  );
  if (boundOutputs.length) {
    lines.push('', '**示例输出绑定**：' + boundOutputs.map((o) => `\`${o.key}\`(${o.name}) → \`${outputVars[o.key] ?? '未绑定'}\``).join('；'));
  }
  return `\n${lines.join('\n')}\n`;
}

// 只读取 MDX 中的静态字面量属性，不执行表达式或页面脚本。
function literal(node) {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (node.kind === ts.SyntaxKind.NullKeyword) return null;
  if (ts.isIdentifier(node) && node.text === 'undefined') return undefined;
  if (ts.isPrefixUnaryExpression(node) && node.operator === ts.SyntaxKind.MinusToken && ts.isNumericLiteral(node.operand)) {
    return -Number(node.operand.text);
  }
  if (ts.isTemplateExpression(node)) {
    return node.head.text + node.templateSpans.map((s) => '${...}' + s.literal.text).join('');
  }
  if (ts.isParenthesizedExpression(node)) return literal(node.expression);
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(literal);
  if (ts.isObjectLiteralExpression(node)) {
    const value = {};
    for (const property of node.properties) {
      if (!ts.isPropertyAssignment(property) || (!ts.isIdentifier(property.name) && !ts.isStringLiteral(property.name))) {
        throw new Error('非静态对象属性');
      }
      value[property.name.text] = literal(property.initializer);
    }
    return value;
  }
  throw new Error('非静态表达式');
}

function componentProps(tag) {
  const normalized = tag.trim().endsWith('/>') ? tag : tag.replace(/>\s*$/, '/>');
  const file = ts.createSourceFile('component.tsx', `const value = (${normalized});`, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  if (file.parseDiagnostics.length) throw new Error('组件语法不完整');
  const element = file.statements[0]?.declarationList?.declarations[0]?.initializer;
  if (!element || !ts.isParenthesizedExpression(element) || !ts.isJsxSelfClosingElement(element.expression)) {
    throw new Error('不是自闭合组件');
  }
  const props = {};
  for (const attribute of element.expression.attributes.properties) {
    if (!ts.isJsxAttribute(attribute)) throw new Error('不支持展开属性');
    const name = attribute.name.text;
    if (!attribute.initializer) props[name] = true;
    else if (ts.isStringLiteral(attribute.initializer)) props[name] = attribute.initializer.text;
    else if (ts.isJsxExpression(attribute.initializer) && attribute.initializer.expression) {
      props[name] = literal(attribute.initializer.expression);
    } else throw new Error('非静态属性');
  }
  return props;
}

// 查找平衡的 JSX 组件标签（支持多行、嵌套引号与花括号及成对子内容）。
function findNextJsxTag(text, tagNames, fromIndex = 0) {
  const pattern = new RegExp(`<(${tagNames.join('|')})(?=[\\s/>])`, 'g');
  pattern.lastIndex = fromIndex;
  const match = pattern.exec(text);
  if (!match) return null;
  const tagName = match[1];
  const start = match.index;
  let i = start + match[0].length;
  let braceDepth = 0;
  let quote = null;
  let openEnd = -1;
  let selfClosing = false;

  while (i < text.length) {
    const ch = text[i];
    if (quote) {
      if (ch === '\\') { i += 2; continue; }
      if (quote === '`' && ch === '$' && text[i + 1] === '{') {
        braceDepth++;
        i += 2;
        continue;
      }
      if (ch === quote) quote = null;
      i++;
      continue;
    }
    if (ch === "'" || ch === '"' || ch === '`') { quote = ch; i++; continue; }
    if (ch === '{') { braceDepth++; i++; continue; }
    if (ch === '}') {
      if (braceDepth > 0) braceDepth--;
      i++;
      continue;
    }
    if (braceDepth === 0) {
      if (ch === '/' && text[i + 1] === '>') {
        selfClosing = true;
        openEnd = i + 2;
        return {tagName, start, end: openEnd, openTag: text.slice(start, openEnd), inner: ''};
      }
      if (ch === '>') {
        openEnd = i + 1;
        break;
      }
    }
    i++;
  }
  if (openEnd === -1) return null;

  // Paired tag: find matching </tagName>
  const closeRe = new RegExp(`</?${tagName}(?=[\\s>])`, 'g');
  closeRe.lastIndex = openEnd;
  let depth = 1;
  let m;
  while ((m = closeRe.exec(text)) !== null) {
    if (text[m.index + 1] === '/') {
      depth--;
      if (depth === 0) {
        const gt = text.indexOf('>', m.index);
        if (gt === -1) return null;
        return {
          tagName,
          start,
          end: gt + 1,
          openTag: text.slice(start, openEnd - 1) + ' />',
          inner: text.slice(openEnd, m.index),
        };
      }
    } else {
      // Check if nested tag is self-closing
      const nested = findNextJsxTag(text, [tagName], m.index);
      if (nested && nested.start === m.index) {
        closeRe.lastIndex = nested.end;
      } else {
        depth++;
      }
    }
  }
  return null;
}

function replaceJsxTags(prose, tagNames, replacer) {
  let out = '';
  let cursor = 0;
  while (cursor < prose.length) {
    const found = findNextJsxTag(prose, tagNames, cursor);
    if (!found) {
      out += prose.slice(cursor);
      break;
    }
    out += prose.slice(cursor, found.start);
    out += replacer(found);
    cursor = found.end;
  }
  return out;
}

function renderLinkItem(item) {
  if (!item || typeof item !== 'object' || typeof item.title !== 'string') throw new Error('链接缺少标题');
  const href = item.href ?? (item.id ? `https://getquicker.net/subprogram?id=${encodeURIComponent(item.id)}` :
    item.code ? `https://getquicker.net/Sharedaction?code=${encodeURIComponent(item.code)}` : null);
  if (!href || typeof href !== 'string') throw new Error('链接缺少地址');
  return `- [${item.title}](${href.startsWith('/') ? host + href : href})${item.description ? `：${item.description}` : ''}${item.author ? `（${item.author}）` : ''}`;
}

function actionPanelLayoutMarkdown(siteDir) {
  const filename = path.join(siteDir, 'src', 'components', 'ActionPanelLayoutDemo', 'index.tsx');
  const file = ts.createSourceFile(filename, fs.readFileSync(filename, 'utf8'),
    ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const declaration = file.statements.filter(ts.isVariableStatement)
    .flatMap((statement) => [...statement.declarationList.declarations])
    .find((entry) => ts.isIdentifier(entry.name) && entry.name.text === 'HOTSPOTS');
  if (!declaration?.initializer) throw new Error('面板热点定义缺失');
  const hotspots = literal(declaration.initializer);
  if (!Array.isArray(hotspots) || hotspots.length === 0) throw new Error('面板热点列表无效');
  const lines = ['**面板区域及设置位置**'];
  for (const spot of hotspots) {
    if (typeof spot.title !== 'string' || typeof spot.body !== 'string' ||
        typeof spot.settingPath !== 'string') throw new Error('面板热点内容不完整');
    lines.push(`- **${spot.title}**：${spot.body} 设置位置：${spot.settingPath}` +
      (spot.href ? ` [详细说明](${host}${spot.href})` : ''));
  }
  return `\n${lines.join('\n\n')}\n`;
}

function renderMenuItems(items, depth = 0) {
  const lines = [];
  const indent = '  '.repeat(depth);
  for (const item of items ?? []) {
    if (!item || typeof item !== 'object') continue;
    if (item.type === 'separator') { lines.push(`${indent}- ---`); continue; }
    const tip = item.tooltip ? `（${String(item.tooltip).replace(/\s+/g, ' ')}）` : '';
    lines.push(`${indent}- ${item.label ?? '（未命名项）'}${tip}`);
    if (Array.isArray(item.children)) lines.push(...renderMenuItems(item.children, depth + 1));
  }
  return lines;
}

const SIMPLE_DEMO_SUMMARIES = {
  ScreenshotSelectionDemo: '\n> [交互演示] Quicker 截图框选与控件自动高亮预览（实际控件吸附行为见本页选区说明）。\n',
  GestureTriggerDemo: '\n> [交互演示] 鼠标手势轨迹绘制与收笔识别演示。\n',
  CoordDiagram: '\n> [示意图] 屏幕坐标与相对坐标原点示意图。\n',
  ClickIndicatorPreview: '\n> [示意图] 点击位置指示器高亮圆圈预览。\n',
};

function renderPreviewComponent(found, siteDir, diagnostics, source) {
  const {tagName, openTag, inner} = found;
  if (SIMPLE_DEMO_SUMMARIES[tagName]) return SIMPLE_DEMO_SUMMARIES[tagName];

  const props = componentProps(openTag);

  if (tagName === 'ActionPanelLayoutDemo') return actionPanelLayoutMarkdown(siteDir);
  if (tagName === 'PreviewMarks') {
    if (!Array.isArray(props.marks)) throw new Error('标注列表无效');
    const labels = props.marks.map((mark) => `- ${mark.key}：${mark.label}`);
    const expandedInner = inner ? expandKnownComponents(inner, siteDir, diagnostics, source).trim() : '';
    return `\n**预览标注**\n\n${labels.join('\n')}${expandedInner ? `\n\n${expandedInner}` : ''}\n`;
  }
  if (tagName === 'PreviewMap' || tagName === 'PreviewCompare') {
    const expandedInner = inner ? expandKnownComponents(inner, siteDir, diagnostics, source).trim() : '';
    const header = tagName === 'PreviewCompare'
      ? `**参数对比${Array.isArray(props.labels) ? `（${props.labels.join(' vs ')}）` : ''}**`
      : '**参数与效果联动示例**';
    const parts = [header];
    if (props.caption) parts.push(props.caption);
    if (Array.isArray(props.links) && props.links.length) {
      parts.push('对应映射：' + props.links.map((l) => `\`${l.from}\` → \`${l.to}\``).join('、'));
    }
    if (expandedInner) parts.push(expandedInner);
    return `\n${parts.join('\n\n')}\n`;
  }
  if (tagName === 'StepProgramView') {
    let example = props.data;
    if (props.example) {
      if (typeof props.example !== 'string' || !/^[a-f0-9-]{36}$/i.test(props.example)) throw new Error('示例编号无效');
      const filename = path.join(siteDir, 'data', 'step-render', 'examples', `${props.example}.json`);
      example = JSON.parse(fs.readFileSync(filename, 'utf8'));
    }
    if (!example || !Array.isArray(example.steps)) throw new Error('示例步骤缺失');
    const intro = [`**示例步骤${example.title ? `：${example.title}` : ''}**`];
    if (example.description) intro.push(example.description);
    if (example.source) intro.push(`[查看分享动作](${example.source})`);
    return `\n${intro.join('\n\n')}\n\n\`\`\`json\n${JSON.stringify({variables: example.variables ?? [], steps: example.steps}, null, 2)}\n\`\`\`\n`;
  }
  if (tagName === 'ShareLinkCard') {
    const items = props.items ?? [props];
    if (!Array.isArray(items)) throw new Error('链接列表无效');
    return `\n${items.map(renderLinkItem).join('\n')}\n`;
  }
  if (tagName === 'RelatedDocs') {
    if (!Array.isArray(props.items)) throw new Error('相关链接列表无效');
    return `\n${props.title ? `**${props.title}**\n\n` : ''}${props.items.map((item) => renderLinkItem({title: item.label, href: item.href, description: item.description})).join('\n')}\n`;
  }
  if (tagName === 'FlowChart') {
    const sequence = (items) => {
      if (!Array.isArray(items)) throw new Error('流程步骤无效');
      return items.join(' → ');
    };
    const lines = [`**流程${props.caption ? `：${props.caption}` : ''}**`];
    if (props.layout === 'row') lines.push(sequence(props.steps));
    else if (props.layout === 'branch') lines.push(
      sequence([...(props.start ? [props.start] : []), ...(props.before ?? []), props.decision]),
      `- ${props.yesLabel ?? '是'}：${sequence(props.yes)}`,
      `- ${props.noLabel ?? '否'}：${sequence(props.no)}`,
      ...(props.end ? [`汇合：${sequence([props.end])}`] : []));
    else if (props.layout === 'funnel') lines.push(
      `${props.start} → ${props.decision}`,
      ...props.branches.map((branch) => `- ${branch.label}：${sequence(branch.steps)}`),
      `汇合：${sequence([props.merge, ...(props.after ?? [])])}`);
    else throw new Error('流程布局无效');
    return `\n${lines.join('\n\n')}\n`;
  }
  if (tagName === 'ContextMenuPreview') {
    const menuLines = renderMenuItems(props.items);
    const expandedInner = inner ? expandKnownComponents(inner, siteDir, diagnostics, source).trim() : '';
    const parts = ['**右键菜单预览**'];
    if (menuLines.length) parts.push(menuLines.join('\n'));
    if (expandedInner) parts.push(expandedInner);
    return `\n${parts.join('\n\n')}\n`;
  }
  if (tagName === 'ActionEditorPreview') {
    const parts = [`**动作编辑器示例：${props.caption ?? props.actionTitle ?? '示例动作'}**`];
    if (props.actionDescription) parts.push(props.actionDescription);
    if (Array.isArray(props.variables) && props.variables.length) {
      parts.push('变量定义：\n' + props.variables.map((v) => `- \`${v.name}\`（${v.type ?? 'Any'}）${v.remark ? `：${v.remark}` : ''}`).join('\n'));
    }
    if (props.customMenu) parts.push(`自定义菜单配置：\n\`\`\`text\n${props.customMenu}\n\`\`\``);
    if (props.data?.steps?.length) parts.push(`步骤预览：\n\`\`\`json\n${JSON.stringify(props.data.steps, null, 2)}\n\`\`\``);
    return `\n${parts.join('\n\n')}\n`;
  }
  if (tagName === 'VariableDefPreview') {
    const def = props.defaultValue ? `，默认值 \`${props.defaultValue}\`` : '';
    const state = props.asState ? '（保存为状态）' : '';
    return `\n- **变量定义**（${props.title ?? '添加/编辑变量'}）：\`${props.name}\`（类型：${props.typeLabel ?? props.type ?? 'Any'}${def}）${props.remark ? ` — ${props.remark}` : ''}${state}\n`;
  }
  if (tagName === 'TableDataPreview') {
    const cols = Array.isArray(props.columns) ? props.columns : [];
    const rows = Array.isArray(props.rows) ? props.rows : [];
    const header = `| ${cols.map(cell).join(' | ')} |\n| ${cols.map(() => '---').join(' | ')} |`;
    const body = rows.map((row) => `| ${(Array.isArray(row) ? row : []).map((c) => cell(typeof c === 'object' && c ? (c.alt ?? c.image ?? JSON.stringify(c)) : c)).join(' | ')} |`).join('\n');
    return `\n**${props.title ?? '表格数据'}**\n\n${header}\n${body}\n`;
  }
  if (tagName === 'TableFieldPreview') {
    const fields = Array.isArray(props.fields) ? props.fields : (props.field ? [props.field] : []);
    if (!fields.length) return '\n> [表格列定义示例]\n';
    const lines = ['**表格列定义**', '', '| Key | 标题 | 类型 | 说明 |', '| --- | --- | --- | --- |'];
    for (const f of fields) {
      const notes = [f.unique ? '唯一' : '', f.autoIncrement ? '自增' : '', f.inputMode ?? ''].filter(Boolean).join('，');
      lines.push(`| ${cell(f.key)} | ${cell(f.title)} | ${cell(f.type)} | ${cell(notes)} |`);
    }
    return `\n${lines.join('\n')}\n`;
  }
  if (tagName === 'ChoiceListPreview') {
    const opts = (props.options ?? []).map((o) => `- ${typeof o === 'object' ? (o.label ?? o.title ?? JSON.stringify(o)) : o}`);
    return `\n**用户选择示例：${props.title ?? '选择列表'}**${props.hint ? `\n\n${props.hint}` : ''}\n\n${opts.join('\n')}\n`;
  }
  if (tagName === 'NotifyToastPreview') {
    return `\n> **[提示消息预览 · ${props.variant ?? 'info'}]** ${props.message ?? ''}\n`;
  }
  if (tagName === 'TextWindowPreview') {
    return `\n**${props.title ?? '文本窗口'}**\n\n\`\`\`text\n${props.text ?? ''}\n\`\`\`\n`;
  }
  if (tagName === 'UserInputPreview') {
    const val = props.value !== undefined && props.value !== '' ? `，默认内容 \`${props.value}\`` : '';
    const hint = props.hint ? `（提示：${props.hint}）` : '';
    return `\n**用户输入窗口示例（${props.title ?? '用户输入'}）**：${props.prompt ?? ''}${hint}${val}\n`;
  }
  if (tagName === 'SearchBoxPreview') {
    return `\n**全局搜索预览（模式：${props.mode ?? 'pick'}）**：查询 \`${props.query ?? ''}\`${props.selectedAction ? `，选中动作：${props.selectedAction}` : ''}\n`;
  }
  if (tagName === 'MsgBoxPreview') {
    const btns = Array.isArray(props.buttons) ? ` [按钮：${props.buttons.join(' / ')}]` : '';
    return `\n> **[弹窗消息预览 · ${props.title ?? '提示'}]** ${String(props.message ?? '').replace(/\n/g, ' ')}${btns}\n`;
  }
  if (tagName === 'WaitWinPreview') {
    const btns = Array.isArray(props.buttons) ? ` [按钮：${props.buttons.join(' / ')}]` : '';
    return `\n> **[等待窗口预览 · ${props.title ?? '完成后继续'}]** ${props.message ?? ''}${props.progress ? `（进度：${props.progress}）` : ''}${btns}\n`;
  }
  if (tagName === 'ReportProgressPreview') {
    const items = Array.isArray(props.items) ? props.items : [];
    const desc = items.map((it) => `- ${it.title ?? '任务'}：${it.percent ?? 0}% ${it.text ?? ''}`).join('\n');
    return `\n**任务进度提示预览**\n\n${desc || '- 正在执行任务进度示例'}\n`;
  }
  if (tagName === 'MobileNotificationPreview') {
    const actions = [props.action1Title, props.action2Title, props.action3Title].filter(Boolean).join(' / ');
    return `\n> **[手机通知预览 · ${props.appName ?? 'Quicker Remote'}]** ${props.title ?? '要开始录屏吗？'} — ${props.body ?? '等待手机确认'}${actions ? `（操作：${actions}）` : ''}\n`;
  }
  if (tagName === 'ExpressionAssistPreview') {
    return `\n**表达式生成辅助示例**：变量 \`${props.variable ?? 'count'}\` ${props.operation ?? '大于'} ${props.paramValue ?? '10'}\n`;
  }
  if (tagName === 'ElseToggleMenuDemo') {
    return `\n> **[步骤分支切换说明]** ${props.caption ?? '右键「如果」步骤切换是否显示「否则」分支。'}\n`;
  }
  if (tagName === 'BilibiliPlayer') {
    const url = props.bvid ? `https://www.bilibili.com/video/${props.bvid}` : '';
    return `\n- [${props.title ?? props.caption ?? '演示视频'}](${url})${props.caption ? `（${props.caption}）` : ''}\n`;
  }
  if (tagName === 'XActionLanding') {
    return `\n> [组合动作模块目录] 当前共收录 ${props.moduleCount ?? ''} 个内置模块，见下方分类导航或访问 [组合动作模块参考](${host}/v2/xaction/modules)。\n`;
  }
  if (tagName === 'LegacyNoticeRedirect') {
    const count = Array.isArray(props.hashes) ? props.hashes.length : 0;
    return `\n> 早期升级兼容与回退锚点已迁至 [升级与回退指南](${host}/v2/migration/upgrade-and-rollback)（兼容映射条目：${count} 条）。\n`;
  }
  if (tagName === 'HashRedirect') {
    const routes = Array.isArray(props.routes) ? props.routes : [];
    const targets = routes
      .map((r) => `[${r.to}](${host}${r.to})（${(r.hashes ?? []).length} 个锚点）`)
      .join('、');
    return targets
      ? `\n> 已拆分专题锚点自动跳转至：${targets}。\n`
      : '\n> 已拆分专题锚点跳转兼容。\n';
  }
  throw new Error(`未实现组件 ${tagName}`);
}

const EXPANDABLE_TAGS = [
  'PreviewMarks', 'PreviewMap', 'PreviewCompare', 'ContextMenuPreview',
  'StepProgramView', 'ShareLinkCard', 'RelatedDocs', 'FlowChart',
  'ActionPanelLayoutDemo', 'ActionEditorPreview', 'VariableDefPreview',
  'TableDataPreview', 'TableFieldPreview', 'ChoiceListPreview',
  'NotifyToastPreview', 'TextWindowPreview', 'UserInputPreview', 'SearchBoxPreview',
  'MsgBoxPreview', 'WaitWinPreview', 'ReportProgressPreview', 'MobileNotificationPreview',
  'GestureTriggerDemo', 'ExpressionAssistPreview', 'ClickIndicatorPreview',
  'ElseToggleMenuDemo', 'CoordDiagram', 'ScreenshotSelectionDemo',
  'BilibiliPlayer', 'XActionLanding', 'LegacyNoticeRedirect', 'HashRedirect',
];

function expandModules(markdown, definitions, diagnostics, source) {
  return replaceJsxTags(markdown, ['XActionModuleMeta', 'ModuleParamPreview'], (found) => {
    try {
      const props = componentProps(found.openTag);
      if (found.tagName === 'ModuleParamPreview') {
        return renderModuleParamPreview(props, definitions, diagnostics, source);
      }
      const key = props.moduleKey;
      const definition = definitions.get(key);
      if (!definition) {
        diagnostics.push(`${source}: 未找到模块 ${key}`);
        return `**模块 ${key} 的结构化定义缺失**`;
      }
      return moduleMarkdown(definition);
    } catch (error) {
      diagnostics.push(`${source}: ${found.tagName} 未能展开：${error.message}`);
      return markdown.slice(found.start, found.end);
    }
  });
}

function expandKnownComponents(markdown, siteDir, diagnostics, source) {
  return transformProse(markdown, (prose) => replaceJsxTags(prose, EXPANDABLE_TAGS, (found) => {
    try {
      return renderPreviewComponent(found, siteDir, diagnostics, source);
    } catch (error) {
      diagnostics.push(`${source}: ${found.tagName} 未能展开：${error.message}`);
      return prose.slice(found.start, found.end);
    }
  }));
}

function splitSections(markdown, baseUrl) {
  if (!headingProcessor) throw new Error('章节解析器尚未初始化');
  const slugger = createSlugger();
  const sections = [];
  let title = '正文';
  let id = 'body';
  let level = 0;
  let sectionUrl = baseUrl;
  let parentHeadings = [];
  const headingStack = [];
  let lines = [];
  let fenced = false;
  const flush = () => {
    if (lines.some((line) => line.trim())) {
      sections.push({
        id,
        title,
        level,
        parentHeadings: [...parentHeadings],
        url: sectionUrl,
        markdown: lines.join('\n').trim(),
      });
    }
    lines = [];
  };
  for (const line of markdown.split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(line)) fenced = !fenced;
    const heading = !fenced && line.match(/^(#{1,6})[ \t]+(.*)$/);
    if (heading) {
      flush();
      const depth = heading[1].length;
      const explicit = heading[2].match(/\s*\{(?:\/\*\s*#([^\s}]+)\s*\*\/|#([^\s}]+))\}\s*$/);
      const node = headingProcessor.parse(`# ${explicit ? heading[2].slice(0, explicit.index) : heading[2]}`).children[0];
      const textNodes = node.children.filter(({type}) => !['html', 'jsx'].includes(type));
      title = headingToString(textNodes.length ? textNodes : node);
      id = explicit?.[1] ?? explicit?.[2] ?? slugger.slug(title);
      level = depth;
      sectionUrl = depth === 1 ? baseUrl : `${baseUrl}#${id}`;
      while (headingStack.length && headingStack[headingStack.length - 1].depth >= depth) {
        headingStack.pop();
      }
      parentHeadings = headingStack.map((h) => h.title);
      headingStack.push({depth, title});
    }
    lines.push(line);
  }
  flush();
  return sections;
}

// 将结构化块从超长章节中切分为二次分块，保持代码块与 Markdown 表格完整。
function splitStructuralBlocks(markdown) {
  const blocks = [];
  const lines = markdown.split(/\r?\n/);
  let buf = [];
  let mode = null; // 'fence' | 'table' | 'prose'
  let fenceMarker = '';
  const flush = () => {
    const text = buf.join('\n').trim();
    if (text) blocks.push({kind: mode || 'prose', text});
    buf = [];
    mode = null;
  };
  for (const line of lines) {
    if (mode === 'fence') {
      buf.push(line);
      if (new RegExp(`^\\s*${fenceMarker[0]}{3,}\\s*$`).test(line)) flush();
      continue;
    }
    const fenceStart = line.match(/^\s*(```+|~~~+)/);
    if (fenceStart) {
      flush();
      mode = 'fence';
      fenceMarker = fenceStart[1];
      buf.push(line);
      continue;
    }
    const isTableLine = /^\s*\|/.test(line);
    if (mode === 'table') {
      if (isTableLine) { buf.push(line); continue; }
      flush();
    }
    if (isTableLine) {
      flush();
      mode = 'table';
      buf.push(line);
      continue;
    }
    if (line.trim() === '') {
      flush();
      continue;
    }
    mode = 'prose';
    buf.push(line);
  }
  flush();
  return blocks;
}

function chunkSections(sections, {articleId = null, maxChars = 1800} = {}) {
  const chunks = [];
  for (const section of sections) {
    const baseChunk = {
      ...(articleId ? {articleId} : {}),
      sectionId: section.id,
      title: section.title,
      parentHeadings: section.parentHeadings ?? [],
      headingPath: [...(section.parentHeadings ?? []), section.title].filter(Boolean).join(' > '),
      url: section.url,
    };
    if (section.markdown.length <= maxChars) {
      chunks.push({...baseChunk, chunkIndex: 0, markdown: section.markdown, charCount: section.markdown.length});
      continue;
    }
    const blocks = splitStructuralBlocks(section.markdown);
    let current = [];
    let currentLen = 0;
    let idx = 0;
    const emit = () => {
      if (!current.length) return;
      const text = current.join('\n\n');
      chunks.push({...baseChunk, chunkIndex: idx++, markdown: text, charCount: text.length});
      current = [];
      currentLen = 0;
    };
    for (const block of blocks) {
      if (current.length && currentLen + block.text.length + 2 > maxChars) {
        emit();
      }
      current.push(block.text);
      currentLen += block.text.length + 2;
      if (block.text.length >= maxChars) emit();
    }
    emit();
  }
  return chunks;
}

// 摘要只摘录原文中的普通段落；跳过代码、表格和 MDX，避免把示例配置当作事实说明。
function summaryText(markdown, limit = 220) {
  const prose = markdown.replace(/```[\s\S]*?```|~~~[\s\S]*?~~~/g, '');
  const paragraphs = prose.split(/\n\s*\n/).map((paragraph) => paragraph.split('\n')
    .filter((line) => !/^\s*(?:#|\||<|>|[-*]\s|\d+\.|!\[)/.test(line))
    .join(' ').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[`*_~]/g, '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim())
    .filter((paragraph) => paragraph.length >= 12 && !/[{};]/.test(paragraph));
  return paragraphs.slice(0, 2).join(' ').slice(0, limit).trim();
}

const stopWords = new Set([
  '一个', '这个', '可以', '使用', '通过', '如果', '需要', '进行', '或者', '以及',
  '然后', '其中', '默认', '当前', '设置', '说明', '支持', '内容', '操作', '功能',
  '界面', '点击', '选择', '打开', '查看', '以下', '如下', '相关', '常见', '问题',
  '方法', '步骤', '配置', '效果', '方式', '例如', '用于', '注意',
]);
const segmenter = new Intl.Segmenter('zh', {granularity: 'word'});
function searchKeywords(title, summary, markdown, limit = 14) {
  const words = new Map();
  const add = (word, weight = 1) => {
    const value = String(word ?? '').trim().toLowerCase();
    if (value.length < 2 || value.length > 48 || stopWords.has(value) || !/[\p{L}\d]/u.test(value)) return;
    words.set(value, (words.get(value) ?? 0) + weight);
  };
  for (const word of title.split(/[\s/、，：:（）()]+/)) add(word, 2);
  for (const match of markdown.matchAll(/\*\*([^*\n：:]{2,24})\*\*\s*[：:]/g)) add(match[1], 2);
  for (const match of markdown.matchAll(/`?(sys:([\w.-]+))`?/gi)) {
    add(match[1], 3);
    add(match[2], 2);
  }
  for (const {segment, isWordLike} of segmenter.segment(summary)) if (isWordLike) add(segment, 1);
  return [...words].sort((a, b) => b[1] - a[1]).slice(0, limit).map(([word]) => word);
}

function classifyArticle({url = '', frontMatter = {}, moduleDef = null}) {
  let contentType = frontMatter.contentType ?? 'guide';
  if (!frontMatter.contentType) {
    if (url.includes('/v2/xaction/modules/') || url.includes('/v2/script-action/api/') || url.endsWith('/v2/xaction/variables')) {
      contentType = 'reference';
    } else if (url.includes('/release-notes') || url.includes("/v2/what's-new/")) {
      contentType = 'changelog';
    } else if (url.includes('/troubleshooting') || url.includes('/faq')) {
      contentType = 'troubleshooting';
    } else if (url.includes('/v2/xaction/concepts/')) {
      contentType = 'concept';
    }
  }
  const authorityRole = frontMatter.authority
    ?? (url.includes("/v2/what's-new/") ? 'compat-alias'
      : (url.includes('/release-notes/archive-') ? 'archive' : 'canonical'));
  const authority = typeof authorityRole === 'object' && authorityRole
    ? authorityRole
    : {role: authorityRole, isPrimary: authorityRole === 'canonical'};
  const appliesToVersion = frontMatter.appliesToVersion
    ?? ((url.includes('/v2/migration/') || url.includes("/v2/what's-new/")) ? 'V1→V2' : 'V2');
  const verification = {
    status: frontMatter.docStatus ?? 'unmarked',
    basis: frontMatter.docStatus ? 'frontMatter.docStatus' : 'editorial',
  };
  const moduleContract = moduleDef ? {
    moduleKey: moduleDef.key,
    name: moduleDef.name,
    slug: moduleDef.slug ?? '',
    inputCount: (moduleDef.inputs ?? []).length,
    outputCount: (moduleDef.outputs ?? []).length,
  } : null;
  const extraKeywords = [];
  if (moduleDef) {
    extraKeywords.push(moduleDef.key.toLowerCase(), moduleDef.key.replace(/^sys:/i, '').toLowerCase(), moduleDef.name);
    for (const p of moduleDef.inputs ?? []) if (p.key) extraKeywords.push(p.key.toLowerCase());
  }
  return {contentType, authority, appliesToVersion, verification, moduleContract, extraKeywords};
}

function enrichArticle(article, meta = {}) {
  article.contentHash = hash(article.markdown);
  article.sections = splitSections(article.markdown, article.url).map((section) => {
    const summary = summaryText(section.markdown);
    return {
      ...section,
      summary,
      keywords: searchKeywords(section.title, summary, section.markdown),
      summarySourceHash: hash(section.markdown),
    };
  });
  article.chunks = chunkSections(article.sections, {articleId: article.id, maxChars: 1800});
  article.summary = summaryText(article.markdown);
  article.summarySourceHash = article.contentHash;
  if (meta.contentType !== undefined) article.contentType = meta.contentType;
  if (meta.authority !== undefined) article.authority = meta.authority;
  if (meta.appliesToVersion !== undefined) article.appliesToVersion = meta.appliesToVersion;
  if (meta.verification !== undefined) article.verification = meta.verification;
  if (meta.moduleKey !== undefined) article.moduleKey = meta.moduleKey;
  if (meta.moduleContract !== undefined) article.moduleContract = meta.moduleContract;
  const extra = meta.extraKeywords ?? [];
  article.keywords = [...new Set([
    ...extra.map((x) => String(x).trim().toLowerCase()).filter(Boolean),
    ...article.keywords,
    ...searchKeywords(article.title, article.summary, article.markdown, 14),
  ])].slice(0, 24);
  return article;
}

function transformProse(markdown, transform) {
  return markdown.split(/(```[\s\S]*?```|~~~[\s\S]*?~~~)/g)
    .map((part) => part.startsWith('```') || part.startsWith('~~~') ? part : transform(part))
    .join('');
}

function catalogFromSidebar(sidebars, docsById, articlesById) {
  const categories = [];
  const root = {id: 'root', title: '文档', parentId: null, order: 0, articleIds: []};
  categories.push(root);
  let sequence = 0;
  const visit = (items, parent, ancestry) => {
    for (const item of items) {
      if (item.type === 'category') {
        const key = `${ancestry}/${encodeURIComponent(item.label)}`;
        const category = {id: key, title: item.label, parentId: parent.id, order: ++sequence, articleIds: []};
        categories.push(category);
        if (item.link?.type === 'doc') {
          const doc = docsById.get(item.link.id);
          const articleId = doc && (doc.frontMatter?.quickerDocKey || `doc:${doc.id}`);
          if (articlesById.has(articleId)) category.articleIds.push(articleId);
        }
        visit(item.items ?? [], category, key);
      } else if (item.type === 'doc' || item.type === 'link') {
        const doc = docsById.get(item.id ?? item.docId);
        const articleId = doc && (doc.frontMatter?.quickerDocKey || `doc:${doc.id}`);
        if (articlesById.has(articleId) && !parent.articleIds.includes(articleId)) parent.articleIds.push(articleId);
      }
    }
  };
  for (const sidebar of Object.values(sidebars)) visit(sidebar, root, 'root');
  return {categories};
}

module.exports = function docsServiceExport(context) {
  const output = path.join(context.siteDir, '.cache', 'docs-service');
  const sourceById = new Map();
  const writePack = (catalog, articles) => {
    fs.mkdirSync(output, {recursive: true});
    const catalogBytes = Buffer.from(JSON.stringify(catalog));
    const cleanArticles = articles.map(({chunks: _chunks, ...rest}) => rest);
    const chunks = articles.flatMap((article) => article.chunks ?? []);
    const articleBytes = Buffer.from(JSON.stringify({articles: cleanArticles}));
    const chunkBytes = Buffer.from(JSON.stringify({chunks}));
    const manifest = {
      schemaVersion: 1,
      revision: hash(Buffer.concat([catalogBytes, articleBytes, chunkBytes])),
      generatedAt: new Date().toISOString(),
      files: {
        'catalog.json': hash(catalogBytes),
        'articles.json': hash(articleBytes),
        'chunks.json': hash(chunkBytes),
      },
    };
    fs.writeFileSync(path.join(output, 'catalog.json'), catalogBytes);
    fs.writeFileSync(path.join(output, 'articles.json'), articleBytes);
    fs.writeFileSync(path.join(output, 'chunks.json'), chunkBytes);
    fs.writeFileSync(path.join(output, 'manifest.json'), JSON.stringify(manifest));
  };
  return {
    name: 'docs-service-export',
    async allContentLoaded({allContent}) {
      await prepareMarkdown();
      const content = allContent['docusaurus-plugin-content-docs'];
      const definitions = moduleDefinitions(context.siteDir);
      const diagnostics = [];
      const articles = [];
      const allDocs = [];
      const versions = Object.values(content ?? {}).flatMap((entry) => entry.loadedVersions ?? []);
      const docsBySource = new Map();
      for (const version of versions) {
        for (const doc of version.docs) {
          allDocs.push(doc);
          docsBySource.set(aliasedSitePathToRelativePath(doc.source).replace(/\\/g, '/'), doc);
        }
      }
      const seen = new Set();
      for (const doc of allDocs) {
        if (doc.draft || doc.unlisted) continue;
        const source = aliasedSitePathToRelativePath(doc.source).replace(/\\/g, '/');
        if (!/\.(md|mdx)$/i.test(source)) continue;
        const id = doc.frontMatter?.quickerDocKey || `doc:${doc.id}`;
        if (!doc.frontMatter?.quickerDocKey) diagnostics.push(`${source}: 缺少 quickerDocKey，使用 doc ID 回退`);
        if (seen.has(id)) throw new Error(`docs-service-export: 重复文章 ID ${id}`);
        seen.add(id);
        sourceById.set(id, source);
        const raw = fs.readFileSync(path.join(context.siteDir, source), 'utf8');
        const parsed = await parseMarkdownFile({filePath: source, fileContent: raw,
          parseFrontMatter: DEFAULT_PARSE_FRONT_MATTER, removeContentTitle: false});
        let markdown = transformProse(parsed.content, (text) => expandModules(text, definitions, diagnostics, source));
        markdown = expandKnownComponents(markdown, context.siteDir, diagnostics, source);
        markdown = transformProse(markdown, (text) => text.replace(/(!?\[[^\]]*\]\()([^)#]+)(#[^)]*)?(\))/g,
          (match, start, href, fragment = '', end) => {
            if (/^(https?:|mailto:|\/|#|data:)/i.test(href)) return match;
            if (start.startsWith('!')) return match;
            const target = path.posix.normalize(path.posix.join(path.posix.dirname(source), href));
            const resolved = docsBySource.get(target) ?? docsBySource.get(`${target}.md`) ?? docsBySource.get(`${target}.mdx`);
            return resolved ? `${start}${host}${resolved.permalink}${fragment}${end}` : match;
          }));
        const prose = markdown.replace(/```[\s\S]*?```/g, '').replace(/~~~[\s\S]*?~~~/g, '').replace(/`[^`\n]+`/g, '');
        const components = [...prose.matchAll(/<([A-Z][A-Za-z0-9]*)\b/g)].map((match) => match[1]);
        const unknown = [...new Set(components)];
        if (unknown.length) diagnostics.push(`${source}: 原样保留 MDX 组件 ${unknown.join(', ')}`);
        const url = `${host}${doc.permalink}`;
        const moduleKey = doc.frontMatter?.moduleKey ? String(doc.frontMatter.moduleKey) : null;
        const moduleDef = moduleKey ? definitions.get(moduleKey) ?? null : null;
        const meta = classifyArticle({url, frontMatter: doc.frontMatter ?? {}, moduleDef});
        articles.push(enrichArticle({
          id,
          title: doc.title,
          description: doc.description ?? '',
          keywords: Array.isArray(doc.frontMatter?.keywords) ? doc.frontMatter.keywords.map(String) :
            String(doc.frontMatter?.keywords ?? '').split(',').map((x) => x.trim()).filter(Boolean),
          url,
          markdown,
          docStatus: doc.frontMatter?.docStatus ?? null,
          lastUpdatedAt: doc.lastUpdatedAt ?? null,
        }, {...meta, moduleKey}));
      }
      articles.sort((a, b) => a.id.localeCompare(b.id));
      const byId = new Map(allDocs.map((doc) => [doc.id, doc]));
      const articleMap = new Map(articles.map((article) => [article.id, article]));
      const catalog = catalogFromSidebar(versions[0]?.sidebars ?? {}, byId, articleMap);
      writePack(catalog, articles);
      fs.writeFileSync(path.join(output, 'diagnostics.txt'), diagnostics.join('\n'), 'utf8');
      console.log(`[docs-service-export] ${articles.length} articles, ${catalog.categories.length} categories, ${diagnostics.length} diagnostics`);
    },
    async postBuild({outDir}) {
      const imageDir = path.join(outDir, 'assets', 'images');
      const imageFiles = fs.existsSync(imageDir) ? fs.readdirSync(imageDir) : [];
      const catalog = JSON.parse(fs.readFileSync(path.join(output, 'catalog.json'), 'utf8'));
      const articleFile = JSON.parse(fs.readFileSync(path.join(output, 'articles.json'), 'utf8'));
      const diagnostics = fs.readFileSync(path.join(output, 'diagnostics.txt'), 'utf8').split('\n').filter(Boolean);
      const resolveImage = (source, relative) => {
        if (!relative.startsWith('.')) return relative;
        const sourceFile = path.posix.normalize(path.posix.join(path.posix.dirname(source), relative));
        if (!fs.existsSync(path.join(context.siteDir, sourceFile))) {
          diagnostics.push(`${source}: 图片文件不存在 ${relative}`);
          return relative;
        }
        const ext = path.posix.extname(sourceFile);
        const base = path.posix.basename(sourceFile, ext);
        const matches = imageFiles.filter((file) => file.startsWith(`${base}-`) && file.endsWith(ext));
        if (matches.length === 0) {
          // Docusaurus 会把小图片内联为 data URL，因此静态产物中没有对应文件。
          const bytes = fs.readFileSync(path.join(context.siteDir, sourceFile));
          if (bytes.length <= 20 * 1024) {
            const mime = ext === '.svg' ? 'image/svg+xml' : `image/${ext.slice(1).replace('jpg', 'jpeg')}`;
            return `data:${mime};base64,${bytes.toString('base64')}`;
          }
        }
        if (matches.length !== 1) {
          diagnostics.push(`${source}: 图片构建路径不唯一 ${relative} (${matches.length})`);
          return relative;
        }
        return `${host}/assets/images/${matches[0]}`;
      };
      for (const article of articleFile.articles) {
        const source = sourceById.get(article.id);
        if (!source) continue;
        let markdown = article.markdown;
        markdown = transformProse(markdown, (text) => text.replace(/<img\b[\s\S]*?\/?>/gi, (tag) => {
          const pathMatch = tag.match(/src=\{require\(['"]([^'"]+)['"]\)\.default\}/);
          if (!pathMatch) return tag;
          const alt = tag.match(/alt=["']([^"']*)["']/)?.[1] ?? '';
          return `![${alt}](${resolveImage(source, pathMatch[1])})`;
        }));
        markdown = transformProse(markdown, (text) => text.replace(/(!\[[^\]]*\]\()([^)#]+)(\))/g,
          (_match, start, imagePath, end) => `${start}${resolveImage(source, imagePath)}${end}`));
        article.markdown = markdown;
        enrichArticle(article);
      }
      writePack(catalog, articleFile.articles);
      fs.writeFileSync(path.join(output, 'diagnostics.txt'), diagnostics.join('\n'), 'utf8');
    },
  };
};

module.exports.splitSections = splitSections;
module.exports.chunkSections = chunkSections;
module.exports.enrichArticle = enrichArticle;
module.exports.moduleMarkdown = moduleMarkdown;
module.exports.expandModules = expandModules;
module.exports.expandKnownComponents = expandKnownComponents;
module.exports.prepareMarkdown = prepareMarkdown;
module.exports.classifyArticle = classifyArticle;
