import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import {fileURLToPath, pathToFileURL} from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, '..', '..');
const docsRoot = path.join(repositoryRoot, 'docs', 'v2', 'xaction');
const dataRoot = path.join(repositoryRoot, 'data', 'xaction');

const categoryDefinitions = [
  {key: 'Basic', directory: 'basic', label: '基础', position: 10},
  {key: 'Text', directory: 'text', label: '文本处理', position: 20},
  {key: 'Image', directory: 'image', label: '图片处理', position: 30},
  {key: 'Clipboard', directory: 'clipboard', label: '剪贴板操作', position: 40},
  {key: 'Flow', directory: 'flow', label: '程序流程', position: 50},
  {key: 'System', directory: 'system', label: 'Windows 系统', position: 60},
  {key: 'Files', directory: 'files', label: '文件与系统操作', position: 70},
  {key: 'Compute', directory: 'compute', label: '计算与比较', position: 80},
  {key: 'Network', directory: 'network', label: '网络服务', position: 90},
  {key: 'Ui', directory: 'ui', label: '界面组件', position: 100},
  {key: 'SoftInteraction', directory: 'software', label: '第三方软件交互', position: 110},
  {key: 'Input', directory: 'input', label: '键鼠输入', position: 120},
];

const supportingDocuments = {
  concepts: [
    'xaction-intro',
    'xaction-editor',
    'basic',
    'edit-step-param',
    'variables',
    'var-list',
    'var-dict',
    'tablevar',
    'object',
    'parameters',
    'interpolation',
    'expression',
    'expression-adv',
    'subprogram',
    'quicker_in_param',
    'debug',
    'public-api',
    'standard',
    'visibility-expression',
    'store-settings',
    'use-icon-in-actions',
    'action-custom-context-menu',
    'custom_texttool',
  ],
  guides: [
    'how-to-learn',
    'samples',
    'helloworld',
    'date-time-process',
    'text-process',
    'flaui-xpath-intro',
    'web-page-control',
    'url-links',
    'chrome-ext-settings',
    'browser-multiprofile',
    'scroll-trigger',
    'search-adv',
  ],
};


function parseArguments(argv) {
  const result = {};
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--generated' || argument === '--legacy') {
      const value = argv[index + 1];
      if (!value) {
        throw new Error(`${argument} 缺少目录参数。`);
      }
      result[argument.slice(2)] = path.resolve(value);
      index += 1;
    } else {
      throw new Error(`未知参数：${argument}`);
    }
  }

  if (!result.generated || !result.legacy) {
    throw new Error(
      '必须同时提供 --generated <Quicker 模块文档导出目录> 和 --legacy <1.x help 目录>。',
    );
  }

  return result;
}

function normalizeNewlines(value) {
  return value.replace(/\r\n/g, '\n');
}

function hash(value) {
  return crypto.createHash('sha256').update(normalizeNewlines(value)).digest('hex');
}

function readText(filePath) {
  return normalizeNewlines(fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, ''));
}

function writeText(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), {recursive: true});
  const normalized = normalizeNewlines(content)
    .split('\n')
    .map((line) =>
      line
        .replace(/^[ \t]+/u, (indent) => indent.replaceAll('\t', '  '))
        .replace(/[ \t]+$/u, ''),
    )
    .join('\n')
    .trimEnd();
  fs.writeFileSync(filePath, `${normalized}\n`, 'utf8');
}

function jsonString(value) {
  return JSON.stringify(value ?? '');
}

function stripCode(value) {
  const trimmed = value.trim();
  return trimmed.startsWith('`') && trimmed.endsWith('`')
    ? trimmed.slice(1, -1)
    : trimmed;
}

function decodeMarkdownCell(value) {
  return stripCode(value)
    .replaceAll('<br />', '\n')
    .replaceAll('<br>', '\n')
    .replaceAll('\\|', '|')
    .trim();
}

function splitTableRow(line) {
  const cells = [];
  let current = '';
  let escaped = false;
  const content = line.trim().replace(/^\|/, '').replace(/\|$/, '');
  for (const character of content) {
    if (escaped) {
      current += `\\${character}`;
      escaped = false;
    } else if (character === '\\') {
      escaped = true;
    } else if (character === '|') {
      cells.push(decodeMarkdownCell(current));
      current = '';
    } else {
      current += character;
    }
  }
  cells.push(decodeMarkdownCell(current));
  return cells;
}

function section(markdown, heading) {
  const start = markdown.indexOf(`## ${heading}`);
  if (start < 0) {
    return '';
  }
  const next = markdown.indexOf('\n## ', start + heading.length + 3);
  return next < 0 ? markdown.slice(start) : markdown.slice(start, next);
}

function parseTable(markdown, heading) {
  const body = section(markdown, heading);
  const rows = body.split('\n').filter((line) => line.trim().startsWith('|'));
  if (rows.length < 3) {
    return [];
  }
  const headers = splitTableRow(rows[0]);
  return rows.slice(2).map((line) => {
    const cells = splitTableRow(line);
    return Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? '']));
  });
}

function parseSelections(markdown) {
  const selections = {};
  const body = section(markdown, '选项值');
  if (!body) {
    return selections;
  }
  const matches = [...body.matchAll(/^### `([^`]+)`\s*(.*)$/gm)];
  for (let index = 0; index < matches.length; index += 1) {
    const match = matches[index];
    const start = match.index + match[0].length;
    const end = matches[index + 1]?.index ?? body.length;
    const tableMarkdown = `## 选项\n${body.slice(start, end)}`;
    selections[match[1]] = {
      name: match[2].trim(),
      items: parseTable(tableMarkdown, '选项').map((row) => ({
        value: row.Value,
        name: row['名称'],
        description: row['说明'],
      })),
    };
  }
  return selections;
}

function parseGeneratedModule(filePath) {
  const markdown = readText(filePath);
  const title = markdown.match(/^#\s+(.+)$/m)?.[1]?.trim();
  const key = markdown.match(/^- 模块 Key：`([^`]+)`$/m)?.[1];
  const categoryMatch = markdown.match(/^- 分类：(.+?) \(`([^`]+)`\)$/m);
  const stepType = markdown.match(/^- 类型：`([^`]+)`$/m)?.[1] ?? '';
  const helpLink = markdown.match(/^- 帮助链接：(.+)$/m)?.[1]?.trim() ?? '';
  if (!title || !key || !categoryMatch) {
    throw new Error(`无法解析模块文档：${filePath}`);
  }

  const inputHeading = markdown.indexOf('\n## 输入参数');
  const metadataEnd = markdown.indexOf('\n\n', markdown.indexOf('- 专业版：'));
  const description =
    metadataEnd >= 0 && inputHeading > metadataEnd
      ? markdown.slice(metadataEnd, inputHeading).trim()
      : '';
  const inputs = parseTable(markdown, '输入参数').map((row) => ({
    key: row.Key,
    name: row['名称'],
    type: row['类型'],
    defaultValue: row['默认值'],
    required: row['必填'] === '是',
    variableMode: row['变量模式'],
    condition: row['条件'],
    description: row['说明'],
  }));
  const outputs = parseTable(markdown, '输出参数').map((row) => ({
    key: row.Key,
    name: row['名称'],
    type: row['类型'],
    condition: row['条件'],
    description: row['说明'],
  }));
  const slugFromLink = helpLink.match(/\/([^/?#]+)\/?(?:[?#].*)?$/)?.[1];
  const legacySlug = (slugFromLink || key.replace(/^[^:]+:/, '')).toLowerCase();
  const referenceStart = markdown.indexOf('\n## 输入参数');
  const referenceTables = referenceStart >= 0 ? markdown.slice(referenceStart + 1).trim() : '';

  return {
    key,
    slug: legacySlug,
    legacySlug,
    ownsLegacyContent: true,
    name: title,
    description,
    category: categoryMatch[2],
    categoryName: categoryMatch[1],
    stepType,
    isRisky: markdown.includes('- 风险操作：是'),
    isProOnly: markdown.includes('- 专业版：是'),
    helpLink,
    inputs,
    outputs,
    selections: parseSelections(markdown),
    referenceTables,
    sourceFileName: path.basename(filePath),
  };
}

function toKebabCase(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^A-Za-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

function resolveSharedLegacySlugs(modules) {
  const groups = Map.groupBy(modules, (module) => module.legacySlug);
  for (const [legacySlug, group] of groups) {
    if (group.length === 1) {
      continue;
    }
    const normalizedLegacySlug = legacySlug.replace(/[^a-z0-9]/g, '');
    const primary =
      group.find(
        (module) =>
          module.key.replace(/^[^:]+:/, '').toLowerCase() === normalizedLegacySlug,
      ) ?? group[0];
    for (const module of group) {
      if (module === primary) {
        continue;
      }
      module.slug = toKebabCase(module.key.replace(/^[^:]+:/, ''));
      module.ownsLegacyContent = false;
      module.sharedDocumentationKey = primary.key;
      module.sharedDocumentationSlug = primary.slug;
    }
  }
}

function collectFiles(directory, predicate) {
  const result = [];
  for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      result.push(...collectFiles(fullPath, predicate));
    } else if (predicate(fullPath)) {
      result.push(fullPath);
    }
  }
  return result;
}

function parseLegacyDocument(filePath) {
  const markdown = readText(filePath);
  if (!markdown.startsWith('---\n')) {
    return {frontMatter: {}, body: markdown};
  }
  const end = markdown.indexOf('\n---\n', 4);
  if (end < 0) {
    return {frontMatter: {}, body: markdown};
  }
  const frontMatter = {};
  for (const line of markdown.slice(4, end).split('\n')) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (match) {
      frontMatter[match[1]] = match[2].trim().replace(/^['"]|['"]$/g, '');
    }
  }
  return {frontMatter, body: markdown.slice(end + 5).trim()};
}

function transformOutsideCodeFences(markdown, transform) {
  let inFence = false;
  return markdown
    .split('\n')
    .map((line) => {
      if (/^\s*(```|~~~)/.test(line)) {
        inFence = !inFence;
        return line;
      }
      return inFence ? line : transform(line);
    })
    .join('\n');
}

function transformOutsideInlineCode(line, transform) {
  const parts = line.split(/(`+[^`]*`+)/g);
  return parts.map((part, index) => (index % 2 === 1 ? part : transform(part))).join('');
}

function makeMdxSafe(markdown) {
  return transformOutsideCodeFences(markdown, (line) =>
    transformOutsideInlineCode(line.replaceAll('\\`', '`'), (text) => {
      const breakToken = '\u0000XACTION_BR\u0000';
      return text
        .replace(/<br\s*\/?\s*>/gi, breakToken)
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('{', '&#123;')
        .replaceAll('}', '&#125;')
        .replaceAll(breakToken, '<br />');
    }),
  );
}

function demoteHeadings(markdown) {
  return transformOutsideCodeFences(markdown, (line) =>
    line.replace(/^(#{1,5})(\s+)/, '#$1$2'),
  );
}

function copyReferencedImages(markdown, legacyRoot, destinationDirectory) {
  const names = new Set(
    [...markdown.matchAll(/(?:^|[('"\s])images\/([A-Za-z0-9_.-]+)/g)].map(
      (match) => match[1],
    ),
  );
  if (names.size === 0) {
    return 0;
  }
  fs.mkdirSync(destinationDirectory, {recursive: true});
  let copied = 0;
  for (const name of names) {
    const source = path.join(legacyRoot, 'images', name);
    if (!fs.existsSync(source)) {
      throw new Error(`旧文档引用的图片不存在：${source}`);
    }
    fs.copyFileSync(source, path.join(destinationDirectory, name));
    copied += 1;
  }
  return copied;
}

function rewriteLinks(markdown, routeByLegacySlug) {
  const replace = (fullMatch, slug) => routeByLegacySlug.get(slug.toLowerCase()) ?? fullMatch;
  return markdown
    .replace(
      /\[Region\.Value\]\(https?:\/\/(?:www\.)?yuque\.com\/quicker\/help\/excelrange\/edit\)/gi,
      '`Region.Value`',
    )
    .replace(/\[Upscale\]\([^)]+\.htm\)/gi, '`Upscale`')
    .replace(
      /https?:\/\/(?:www\.)?getquicker\.(?:net|cn)\/kc\/help\/doc\/([A-Za-z0-9_-]+)/gi,
      replace,
    )
    .replace(
      /https?:\/\/(?:www\.)?yuque\.com\/quicker\/help\/([A-Za-z0-9_-]+)(?:\/[^\s)>]*)?/gi,
      replace,
    )
    .replace(/\]\(([A-Za-z0-9_-]+)(#[^)]+)?\)/g, (fullMatch, slug, anchor = '') => {
      const route = routeByLegacySlug.get(slug.toLowerCase());
      return route ? `](${route}${normalizeLegacyAnchor(anchor)})` : fullMatch;
    });
}

function normalizeLegacyAnchor(anchor) {
  return /^#[A-Za-z0-9]{5,12}$/.test(anchor) || anchor.startsWith('#:~:text=') ? '' : anchor;
}

function removeLegacyOpaqueAnchors(markdown) {
  return markdown
    .replace(/\]\(([^)\s]+)#[A-Za-z0-9]{5,12}\)/g, ']($1)')
    .replace(/\]\(([^)\s]+)#:~:text=[^)]+\)/g, ']($1)');
}

function cleanLegacyArtifacts(markdown) {
  return markdown
    .replace(/^#{1,6}\s+\[\]\([^)]+\)\s*$/gm, '')
    .replace(
      /\[https?:\/\/(?:www\.)?getquicker\.(?:net|cn)\/KC\/Help\/Doc\/quicker\\?_in\\?_param\]\(\/v2\/xaction\/concepts\/quicker_in_param\)/gi,
      '[为动作传递参数](/v2/xaction/concepts/quicker_in_param)',
    );
}

function prepareLegacyBody(body, routeByLegacySlug) {
  let result = normalizeNewlines(body).replace(/(^|[('"\s])images\//g, '$1./img/');
  result = rewriteLinks(result, routeByLegacySlug);
  result = removeLegacyOpaqueAnchors(result);
  result = cleanLegacyArtifacts(result);
  result = demoteHeadings(result);
  result = makeMdxSafe(result);
  if (!/^##\s+/m.test(result)) {
    result = `## 使用说明\n\n${result}`;
  }
  return result.trim();
}

function createReference(module) {
  // Page only mounts the UI component; parameter facts live in data/xaction.
  return [
    '## 当前模块定义',
    '',
    `<XActionModuleMeta moduleKey="${module.key}" />`,
  ].join('\n');
}

function ensureModuleMetaComponent(content, moduleKey) {
  const componentLine = `<XActionModuleMeta moduleKey="${moduleKey}" />`;
  if (content.includes(componentLine)) {
    return content;
  }
  // Replace any existing component tag with the correct key.
  if (/<XActionModuleMeta\b[^>]*\/>/.test(content)) {
    return content.replace(/<XActionModuleMeta\b[^>]*\/>/, componentLine);
  }
  // Insert after the first markdown H1 block (title + optional lead paragraph).
  const match = content.match(/^---\n[\s\S]*?\n---\n\n# .+\n(?:\n[^\n#][^\n]*\n)?/);
  if (match) {
    return `${match[0]}\n${createReference({key: moduleKey})}\n${content.slice(match[0].length)}`;
  }
  return `${content.trimEnd()}\n\n${createReference({key: moduleKey})}\n`;
}

function stripLegacyMetadataMarkers(content) {
  return content
    .replaceAll('{/* xaction-metadata:start */}', '')
    .replaceAll('{/* xaction-metadata:end */}', '')
    .replaceAll('<!-- xaction-metadata:start -->', '')
    .replaceAll('<!-- xaction-metadata:end -->', '')
    .replaceAll('&#123;/* xaction-metadata:start */&#125;', '')
    .replaceAll('&#123;/* xaction-metadata:end */&#125;', '')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/([^\n])\n(## 当前模块定义\n)/g, '$1\n\n$2');
}

function writeModulesIndex() {
  // Thin typed wrapper; component loads full defs from catalog.json.
  const content = `/**
 * Build-time index of combo-action modules for docs UI.
 * Prefer catalog.json (full defs) over per-file imports.
 * Kept in sync with docs:xaction:sync (do not hand-edit).
 */
import catalog from './catalog.json';

export type XActionParam = {
  key: string;
  name: string;
  type: string;
  defaultValue?: string;
  required?: boolean;
  variableMode?: string;
  condition?: string;
  description?: string;
};

export type XActionOutput = {
  key: string;
  name: string;
  type: string;
  condition?: string;
  description?: string;
};

export type XActionSelectionItem = {
  value: string;
  name: string;
  description?: string;
};

export type XActionSelection = {
  name: string;
  items: XActionSelectionItem[];
};

export type XActionModuleDef = {
  key: string;
  name: string;
  description?: string;
  category: string;
  categoryName: string;
  stepType: string;
  isRisky: boolean;
  isProOnly: boolean;
  inputs: XActionParam[];
  outputs: XActionOutput[];
  selections?: Record<string, XActionSelection>;
};

type CatalogShape = {
  modules: XActionModuleDef[];
};

const typedCatalog = catalog as CatalogShape;

export const modulesByKey: Record<string, XActionModuleDef> = Object.fromEntries(
  typedCatalog.modules.map((module) => [module.key, module]),
);

export function getModuleDef(moduleKey: string): XActionModuleDef | undefined {
  return modulesByKey[moduleKey];
}
`;
  writeText(path.join(dataRoot, 'modules-index.ts'), content);
}

function moduleFrontMatter(module, legacy, generatedAt, position) {
  const status = legacy ? 'migrated-unreviewed' : 'generated';
  const lines = [
    '---',
    `title: ${jsonString(module.name)}`,
    `description: ${jsonString(module.description || `${module.name}模块的参数、输出与使用说明。`)}`,
    `slug: ${jsonString(`/v2/xaction/modules/${module.slug}`)}`,
    `sidebar_label: ${jsonString(module.name)}`,
    `sidebar_position: ${position}`,
    `quickerDocKey: ${jsonString(`xaction/module/${module.key}`)}`,
    'comments: true',
    `moduleKey: ${jsonString(module.key)}`,
    `docStatus: ${jsonString(status)}`,
    `metadataGeneratedAt: ${jsonString(generatedAt)}`,
  ];
  if (legacy?.frontMatter?.doc_id) {
    lines.push(`legacyDocId: ${legacy.frontMatter.doc_id}`);
  }
  if (legacy?.frontMatter?.content_updated_at) {
    lines.push(`legacyContentUpdatedAt: ${jsonString(legacy.frontMatter.content_updated_at)}`);
  }
  lines.push('---');
  return lines.join('\n');
}

function updateExistingModulePage(content, module, generatedAt) {
  let updated = stripLegacyMetadataMarkers(content);
  updated = ensureModuleMetaComponent(updated, module.key);
  // Drop obsolete page-side hash of the old Markdown metadata block.
  updated = updated.replace(/^metadataHash: .*\n/m, '');
  const replacements = [
    [/^title: .*$/m, `title: ${jsonString(module.name)}`],
    [/^description: .*$/m, `description: ${jsonString(module.description || `${module.name}模块的参数、输出与使用说明。`)}`],
    [/^metadataGeneratedAt: .*$/m, `metadataGeneratedAt: ${jsonString(generatedAt)}`],
  ];
  for (const [pattern, replacement] of replacements) {
    if (!pattern.test(updated)) {
      throw new Error(`模块 ${module.key} 的页面 front matter 不完整，拒绝覆盖。`);
    }
    updated = updated.replace(pattern, replacement);
  }
  return updated;
}

function createCategoryFile(label, position, slug) {
  return `${JSON.stringify(
    {
      label,
      position,
      link: {
        type: 'generated-index',
        slug,
        title: label,
        description: `${label}模块参考。参数表由 Quicker 当前模块元数据生成。`,
      },
    },
    null,
    2,
  )}\n`;
}

function supportingFrontMatter(slug, legacy, section, position) {
  const title = legacy.frontMatter.title || slug;
  return [
    '---',
    `title: ${jsonString(title)}`,
    `description: ${jsonString(`${title}的 Quicker 2.0 使用说明。`)}`,
    `slug: ${jsonString(`/v2/xaction/${section}/${slug}`)}`,
    `sidebar_position: ${position}`,
    `quickerDocKey: ${jsonString(`xaction/${section}/${slug}`)}`,
    'comments: true',
    `docStatus: ${jsonString('migrated-unreviewed')}`,
    ...(legacy.frontMatter.doc_id ? [`legacyDocId: ${legacy.frontMatter.doc_id}`] : []),
    ...(legacy.frontMatter.content_updated_at
      ? [`legacyContentUpdatedAt: ${jsonString(legacy.frontMatter.content_updated_at)}`]
      : []),
    '---',
  ].join('\n');
}

function writeSupportingDocuments(legacyRoot, routeByLegacySlug) {
  let pageCount = 0;
  let imageCount = 0;
  for (const [section, slugs] of Object.entries(supportingDocuments)) {
    const sectionRoot = path.join(docsRoot, section);
    writeText(
      path.join(sectionRoot, '_category_.json'),
      createCategoryFile(
        section === 'concepts' ? '基础与进阶概念' : '教程与实践',
        section === 'concepts' ? 10 : 30,
        `/v2/xaction/${section}`,
      ),
    );
    slugs.forEach((slug, index) => {
      const source = path.join(legacyRoot, `${slug}.md`);
      if (!fs.existsSync(source)) {
        throw new Error(`缺少计划迁移的旧文档：${source}`);
      }
      const legacy = parseLegacyDocument(source);
      imageCount += copyReferencedImages(
        legacy.body,
        legacyRoot,
        path.join(sectionRoot, 'img'),
      );
      const body = prepareLegacyBody(legacy.body, routeByLegacySlug);
      writeText(
        path.join(sectionRoot, `${slug}.md`),
        `${supportingFrontMatter(slug, legacy, section, (index + 1) * 10)}\n\n${body}`,
      );
      pageCount += 1;
    });
  }
  return {pageCount, imageCount};
}

function formatLandingCounts(modules) {
  return categoryDefinitions
    .map((category) => {
      const count = modules.filter((module) => module.category === category.key).length;
      return `    ${category.key}: ${count},`;
    })
    .join('\n');
}

function createLandingPage(modules, _migratedCount, _legacyMappedModuleCount, generatedAt) {
  return `---
title: 组合动作
description: Quicker 2.0 组合动作的入门、模块参考、教程与迁移说明。
slug: /v2/xaction
sidebar_position: 1
quickerDocKey: v2/xaction/index
comments: true
hide_table_of_contents: true
---

# 组合动作

组合动作把多个步骤按顺序执行，用来完成打开网页、处理文本、操作窗口这类自动化。Quicker 2.0 沿用 1.x 的主要模块，并补充了参数、执行和调试能力。

<XActionLanding
  moduleCount={${modules.length}}
  generatedAt=${jsonString(generatedAt)}
  counts={{
${formatLandingCounts(modules)}
  }}
/>
`;
}

function extractGeneratedAt(generatedRoot) {
  const readmePath = path.join(generatedRoot, 'README.md');
  const readme = fs.existsSync(readmePath) ? readText(readmePath) : '';
  return readme.match(/生成时间：([^\n]+)/)?.[1]?.trim() ?? '未知';
}

function summarizeModule(module) {
  return {
    key: module.key,
    name: module.name,
    slug: module.slug,
    category: module.category,
  };
}

function changedFieldNames(before, after, fields) {
  return fields.filter(
    (field) => JSON.stringify(before?.[field] ?? null) !== JSON.stringify(after?.[field] ?? null),
  );
}

function diffKeyedItems(beforeItems = [], afterItems = []) {
  const beforeByKey = new Map(beforeItems.map((item) => [item.key, item]));
  const afterByKey = new Map(afterItems.map((item) => [item.key, item]));
  const added = afterItems.filter((item) => !beforeByKey.has(item.key));
  const removed = beforeItems.filter((item) => !afterByKey.has(item.key));
  const changed = [];
  for (const after of afterItems) {
    const before = beforeByKey.get(after.key);
    if (!before || JSON.stringify(before) === JSON.stringify(after)) {
      continue;
    }
    changed.push({key: after.key, before, after});
  }
  return {added, removed, changed};
}

function createChangeReport(previousCatalog, nextCatalog) {
  if (!previousCatalog?.modules) {
    return {
      schemaVersion: 1,
      baselineCreated: true,
      fromGeneratedAt: null,
      toGeneratedAt: nextCatalog.generatedAt,
      summary: {addedModules: 0, removedModules: 0, changedModules: 0},
      addedModules: [],
      removedModules: [],
      changedModules: [],
    };
  }

  const previousByKey = new Map(previousCatalog.modules.map((module) => [module.key, module]));
  const nextByKey = new Map(nextCatalog.modules.map((module) => [module.key, module]));
  const addedModules = nextCatalog.modules
    .filter((module) => !previousByKey.has(module.key))
    .map(summarizeModule);
  const removedModules = previousCatalog.modules
    .filter((module) => !nextByKey.has(module.key))
    .map(summarizeModule);
  const changedModules = [];
  const moduleFields = [
    'name',
    'slug',
    'legacySlug',
    'description',
    'category',
    'categoryName',
    'stepType',
    'isRisky',
    'isProOnly',
    'helpLink',
    'ownsLegacyContent',
    'sharedDocumentationKey',
  ];
  for (const module of nextCatalog.modules) {
    const before = previousByKey.get(module.key);
    if (!before) {
      continue;
    }
    const fields = changedFieldNames(before, module, moduleFields);
    const inputs = diffKeyedItems(before.inputs, module.inputs);
    const outputs = diffKeyedItems(before.outputs, module.outputs);
    const selectionsChanged =
      JSON.stringify(before.selections ?? {}) !== JSON.stringify(module.selections ?? {});
    if (
      fields.length === 0 &&
      inputs.added.length === 0 &&
      inputs.removed.length === 0 &&
      inputs.changed.length === 0 &&
      outputs.added.length === 0 &&
      outputs.removed.length === 0 &&
      outputs.changed.length === 0 &&
      !selectionsChanged
    ) {
      continue;
    }
    changedModules.push({
      key: module.key,
      name: module.name,
      changedFields: fields,
      inputs,
      outputs,
      selectionsChanged,
      ...(selectionsChanged
        ? {selections: {before: before.selections ?? {}, after: module.selections ?? {}}}
        : {}),
    });
  }
  return {
    schemaVersion: 1,
    baselineCreated: false,
    fromGeneratedAt: previousCatalog.generatedAt ?? null,
    toGeneratedAt: nextCatalog.generatedAt,
    summary: {
      addedModules: addedModules.length,
      removedModules: removedModules.length,
      changedModules: changedModules.length,
    },
    addedModules,
    removedModules,
    changedModules,
  };
}

export {
  createChangeReport,
  createLandingPage,
  createReference,
  ensureModuleMetaComponent,
  stripLegacyMetadataMarkers,
};

function findExistingModulePages() {
  const pages = new Map();
  if (!fs.existsSync(docsRoot)) {
    return pages;
  }
  for (const filePath of collectFiles(docsRoot, (value) => value.endsWith('.md'))) {
    const content = readText(filePath);
    const key = content.match(/^moduleKey:\s*["']?([^"'\n]+)["']?$/m)?.[1];
    if (key) {
      pages.set(key, filePath);
    }
  }
  return pages;
}

function main() {
  const {generated, legacy} = parseArguments(process.argv.slice(2));
  const generatedModulesRoot = path.join(generated, 'modules');
  if (!fs.existsSync(generatedModulesRoot)) {
    throw new Error(`找不到模块目录：${generatedModulesRoot}`);
  }
  if (!fs.existsSync(path.join(legacy, 'images'))) {
    throw new Error(`找不到旧文档图片目录：${path.join(legacy, 'images')}`);
  }

  const modules = collectFiles(generatedModulesRoot, (value) => value.endsWith('.md'))
    .map(parseGeneratedModule)
    .sort((left, right) =>
      left.category === right.category
        ? left.name.localeCompare(right.name, 'zh-Hans-CN')
        : left.category.localeCompare(right.category),
    );
  resolveSharedLegacySlugs(modules);
  const keys = new Set();
  const slugs = new Set();
  for (const module of modules) {
    if (keys.has(module.key)) {
      throw new Error(`模块 Key 重复：${module.key}`);
    }
    if (slugs.has(module.slug)) {
      throw new Error(`模块 slug 重复：${module.slug}`);
    }
    keys.add(module.key);
    slugs.add(module.slug);
  }

  const generatedAt = extractGeneratedAt(generated);
  const legacyFiles = new Map(
    fs
      .readdirSync(legacy, {withFileTypes: true})
      .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
      .map((entry) => [entry.name.slice(0, -3).toLowerCase(), path.join(legacy, entry.name)]),
  );
  const routeByLegacySlug = new Map(
    modules
      .filter((module) => module.ownsLegacyContent)
      .map((module) => [module.legacySlug, `/v2/xaction/modules/${module.slug}`]),
  );
  for (const [section, documentSlugs] of Object.entries(supportingDocuments)) {
    for (const slug of documentSlugs) {
      routeByLegacySlug.set(slug, `/v2/xaction/${section}/${slug}`);
    }
  }

  writeText(
    path.join(docsRoot, '_category_.json'),
    `${JSON.stringify(
      {
        label: '组合动作',
        position: 50,
        link: {type: 'doc', id: 'v2/xaction/index'},
      },
      null,
      2,
    )}\n`,
  );
  writeText(
    path.join(docsRoot, 'modules', '_category_.json'),
    createCategoryFile('模块参考', 20, '/v2/xaction/modules'),
  );
  for (const category of categoryDefinitions) {
    writeText(
      path.join(docsRoot, 'modules', category.directory, '_category_.json'),
      createCategoryFile(
        category.label,
        category.position,
        `/v2/xaction/modules/category/${category.directory}`,
      ),
    );
  }

  const existingPages = findExistingModulePages();
  let migratedCount = 0;
  const legacyMappedModuleCount = modules.filter((module) =>
    legacyFiles.has(module.legacySlug),
  ).length;
  let moduleImageCount = 0;
  for (const category of categoryDefinitions) {
    const categoryModules = modules.filter((module) => module.category === category.key);
    categoryModules.forEach((module, index) => {
      const legacyPath = module.ownsLegacyContent
        ? legacyFiles.get(module.legacySlug)
        : null;
      const legacyDocument = legacyPath ? parseLegacyDocument(legacyPath) : null;
      if (legacyDocument) {
        migratedCount += 1;
        moduleImageCount += copyReferencedImages(
          legacyDocument.body,
          legacy,
          path.join(docsRoot, 'modules', category.directory, 'img'),
        );
      }
      const reference = createReference(module);
      const existingPath = existingPages.get(module.key);
      const destination =
        existingPath ?? path.join(docsRoot, 'modules', category.directory, `${module.slug}.md`);
      if (existingPath) {
        const updated = updateExistingModulePage(
          readText(existingPath),
          module,
          generatedAt,
        );
        writeText(existingPath, updated);
      } else {
        const manualBody = legacyDocument
          ? prepareLegacyBody(legacyDocument.body, routeByLegacySlug)
          : module.sharedDocumentationSlug
            ? `## 使用说明\n\n本模块与[${
                modules.find((item) => item.key === module.sharedDocumentationKey)?.name ??
                '相关模块'
              }](/v2/xaction/modules/${
                module.sharedDocumentationSlug
              })共享基础使用说明；本页上方「当前模块定义」是当前模块自身的参数。`
            : '## 使用说明\n\n这是 Quicker 2.0 新增模块，当前页面已收录模块定义，详细用法与示例待补充。';
        const content = `${moduleFrontMatter(
          module,
          legacyDocument,
          generatedAt,
          (index + 1) * 10,
        )}\n\n# ${module.name}\n\n${module.description}\n\n${reference}\n\n${manualBody}`;
        writeText(destination, content);
      }
    });
  }

  const supportingResult = writeSupportingDocuments(legacy, routeByLegacySlug);
  writeText(
    path.join(docsRoot, 'index.md'),
    createLandingPage(modules, migratedCount, legacyMappedModuleCount, generatedAt),
  );

  const previousCatalogPath = path.join(dataRoot, 'catalog.json');
  const previousCatalog = fs.existsSync(previousCatalogPath)
    ? JSON.parse(readText(previousCatalogPath))
    : null;
  const normalizedModules = modules.map(({referenceTables, sourceFileName, ...module}) => ({
    ...module,
    sourceFileName,
  }));
  const catalog = {
    schemaVersion: 1,
    generatedAt,
    moduleCount: modules.length,
    legacyMappedModuleCount,
    migratedLegacyModuleCount: migratedCount,
    categories: categoryDefinitions.map((category) => ({
      key: category.key,
      name: category.label,
      moduleCount: modules.filter((module) => module.category === category.key).length,
    })),
    modules: normalizedModules,
  };
  const changes = createChangeReport(previousCatalog, catalog);
  writeText(path.join(dataRoot, 'catalog.json'), JSON.stringify(catalog, null, 2));
  writeText(path.join(dataRoot, 'changes.json'), JSON.stringify(changes, null, 2));
  writeModulesIndex();
  for (const module of normalizedModules) {
    writeText(
      path.join(dataRoot, 'modules', `${module.key.replace(/[^A-Za-z0-9_.-]+/g, '_')}.json`),
      JSON.stringify(module, null, 2),
    );
  }
  const aiGuidePath = path.join(generated, 'ai-action-json-guide.md');
  if (fs.existsSync(aiGuidePath)) {
    writeText(path.join(dataRoot, 'ai-action-json-guide.md'), readText(aiGuidePath));
  }

  console.log(`已同步 ${modules.length} 个模块页面。`);
  console.log(
    `其中 ${legacyMappedModuleCount} 个模块可映射旧版说明，共迁入 ${migratedCount} 份去重正文。`,
  );
  console.log(`已迁移 ${supportingResult.pageCount} 篇概念/教程文档。`);
  console.log(`已复制 ${moduleImageCount + supportingResult.imageCount} 个页面图片引用。`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main();
}
