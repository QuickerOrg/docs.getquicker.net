const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const ts = require('typescript');
const {
  aliasedSitePathToRelativePath,
  createSlugger,
  DEFAULT_PARSE_FRONT_MATTER,
  parseMarkdownFile,
} = require('@docusaurus/utils');

const hash = (value) => crypto.createHash('sha256').update(value).digest('hex');
const host = 'https://docs.getquicker.net';

function moduleDefinitions(siteDir) {
  const dir = path.join(siteDir, 'data', 'xaction', 'modules');
  const definitions = new Map();
  for (const file of fs.readdirSync(dir).filter((name) => name.endsWith('.json'))) {
    const value = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
    if (value.key) definitions.set(value.key, value);
  }
  return definitions;
}

function moduleMarkdown(definition) {
  const cell = (value) => String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>');
  const lines = [`**模块定义：${definition.name}（${definition.key}）**`];
  if (definition.description) lines.push(definition.description);
  lines.push('', '| 参数 | Key | 类型 | 必填 | 默认值 | 说明 |', '| --- | --- | --- | --- | --- | --- |');
  for (const input of definition.inputs ?? []) {
    lines.push(`| ${cell(input.name)} | ${cell(input.key)} | ${cell(input.type)} | ${input.required ? '是' : '否'} | ${cell(input.defaultValue)} | ${cell(input.description)} |`);
  }
  if (definition.outputs?.length) {
    lines.push('', '| 输出 | Key | 类型 | 说明 |', '| --- | --- | --- | --- |');
    for (const output of definition.outputs) {
      lines.push(`| ${cell(output.name)} | ${cell(output.key)} | ${cell(output.type)} | ${cell(output.description)} |`);
    }
  }
  return lines.join('\n');
}

function expandModules(markdown, definitions, diagnostics, source) {
  return markdown.replace(/<(XActionModuleMeta|ModuleParamPreview)\s+moduleKey="([^"]+)"\s*\/>/g,
    (_match, _component, key) => {
      const definition = definitions.get(key);
      if (!definition) {
        diagnostics.push(`${source}: 未找到模块 ${key}`);
        return `**模块 ${key} 的结构化定义缺失**`;
      }
      return moduleMarkdown(definition);
    });
}

// 只读取 MDX 中的静态字面量属性，不执行表达式或页面脚本。
function literal(node) {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (ts.isParenthesizedExpression(node)) return literal(node.expression);
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(literal);
  if (ts.isObjectLiteralExpression(node)) {
    const value = {};
    for (const property of node.properties) {
      if (!ts.isPropertyAssignment(property) || !ts.isIdentifier(property.name) && !ts.isStringLiteral(property.name))
        throw new Error('非静态对象属性');
      value[property.name.text] = literal(property.initializer);
    }
    return value;
  }
  throw new Error('非静态表达式');
}

function componentProps(tag) {
  const file = ts.createSourceFile('component.tsx', `const value = (${tag});`, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  if (file.parseDiagnostics.length) throw new Error('组件语法不完整');
  const element = file.statements[0]?.declarationList?.declarations[0]?.initializer;
  if (!element || !ts.isParenthesizedExpression(element) || !ts.isJsxSelfClosingElement(element.expression))
    throw new Error('不是自闭合组件');
  const props = {};
  for (const attribute of element.expression.attributes.properties) {
    if (!ts.isJsxAttribute(attribute)) throw new Error('不支持展开属性');
    const name = attribute.name.text;
    if (!attribute.initializer) props[name] = true;
    else if (ts.isStringLiteral(attribute.initializer)) props[name] = attribute.initializer.text;
    else if (ts.isJsxExpression(attribute.initializer) && attribute.initializer.expression)
      props[name] = literal(attribute.initializer.expression);
    else throw new Error('非静态属性');
  }
  return props;
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

function expandKnownComponents(markdown, siteDir, diagnostics, source) {
  return transformProse(markdown, (prose) => prose.replace(/<PreviewMarks\b[\s\S]*?\]\}[\s\S]*?>/g, (tag) => {
    try {
      const props = componentProps(tag.replace(/>$/, '/>'));
      if (!Array.isArray(props.marks)) throw new Error('标注列表无效');
      const labels = props.marks.map((mark) => `- ${mark.key}：${mark.label}`);
      return `\n**预览标注**\n\n${labels.join('\n')}\n\n${tag}`;
    } catch (error) {
      diagnostics.push(`${source}: PreviewMarks 标注未能展开：${error.message}`);
      return tag;
    }
  }).replace(/<(StepProgramView|ShareLinkCard|RelatedDocs|FlowChart|ActionPanelLayoutDemo)\b[\s\S]*?\/>/g,
    (tag, name) => {
      try {
        const props = componentProps(tag);
        if (name === 'ActionPanelLayoutDemo') return actionPanelLayoutMarkdown(siteDir);
        if (name === 'StepProgramView') {
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
          // 保留完整步骤、参数、输出及分支，防止摘要遗漏动作语义。
          return `\n${intro.join('\n\n')}\n\n\`\`\`json\n${JSON.stringify({variables: example.variables ?? [], steps: example.steps}, null, 2)}\n\`\`\`\n`;
        }
        if (name === 'ShareLinkCard') {
          const items = props.items ?? [props];
          if (!Array.isArray(items)) throw new Error('链接列表无效');
          return `\n${items.map(renderLinkItem).join('\n')}\n`;
        }
        if (name === 'FlowChart') {
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
            ...(props.end ? [`汇合：${props.end}`] : []));
          else if (props.layout === 'funnel') lines.push(
            `${props.start} → ${props.decision}`,
            ...props.branches.map((branch) => `- ${branch.label}：${sequence(branch.steps)}`),
            `汇合：${sequence([props.merge, ...(props.after ?? [])])}`);
          else throw new Error('流程布局无效');
          return `\n${lines.join('\n\n')}\n`;
        }
        if (!Array.isArray(props.items)) throw new Error('相关链接列表无效');
        return `\n${props.title ? `**${props.title}**\n\n` : ''}${props.items.map((item) =>
          renderLinkItem({title: item.label, href: item.href, description: item.description})).join('\n')}\n`;
      } catch (error) {
        diagnostics.push(`${source}: ${name} 未能展开：${error.message}`);
        return tag;
      }
    }));
}

function splitSections(markdown, baseUrl) {
  const slugger = createSlugger();
  const sections = [];
  let title = '正文';
  let id = 'body';
  let sectionUrl = baseUrl;
  let lines = [];
  let fenced = false;
  const flush = () => {
    if (lines.some((line) => line.trim()))
      sections.push({id, title, url: sectionUrl, markdown: lines.join('\n').trim()});
    lines = [];
  };
  for (const line of markdown.split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(line)) fenced = !fenced;
    const heading = !fenced && line.match(/^(#{1,6})\s+(.+?)\s*$/);
    if (heading) {
      flush();
      // MDX 使用注释形式的显式 ID；支持中文锚点，与文档站生成的链接保持一致。
      const explicit = heading[2].match(/\s*\{(?:\/\*\s*#([^\s}]+)\s*\*\/|#([^\s}]+))\}\s*$/);
      title = (explicit ? heading[2].slice(0, explicit.index) : heading[2]).replace(/[`*_]/g, '').trim();
      id = explicit?.[1] ?? explicit?.[2] ?? slugger.slug(title);
      // Docusaurus 将一级标题作为页头渲染，不生成可跳转的标题 ID。
      sectionUrl = heading[1].length === 1 ? baseUrl : `${baseUrl}#${id}`;
    }
    lines.push(line);
  }
  flush();
  return sections;
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

const stopWords = new Set(['一个', '这个', '可以', '使用', '通过', '如果', '需要', '进行', '或者', '以及', '然后', '其中', '默认', '当前', '设置', '说明', '支持', '内容']);
const segmenter = new Intl.Segmenter('zh', {granularity: 'word'});
function searchKeywords(title, summary, markdown, limit = 10) {
  const words = new Map();
  const add = (word) => {
    const value = word.trim().toLowerCase();
    if (value.length < 2 || value.length > 40 || stopWords.has(value) || !/[\p{L}\d]/u.test(value)) return;
    words.set(value, (words.get(value) ?? 0) + 1);
  };
  for (const word of title.split(/[\s/、，：:（）()]+/)) add(word);
  for (const match of markdown.matchAll(/\*\*([^*\n：:]{2,24})\*\*\s*[：:]/g)) add(match[1]);
  for (const match of markdown.matchAll(/`(sys:[\w.-]+)`/g)) add(match[1]);
  for (const {segment, isWordLike} of segmenter.segment(summary)) if (isWordLike) add(segment);
  return [...words].sort((a, b) => b[1] - a[1]).slice(0, limit).map(([word]) => word);
}

function enrichArticle(article) {
  article.contentHash = hash(article.markdown);
  article.sections = splitSections(article.markdown, article.url).map((section) => {
    const summary = summaryText(section.markdown);
    return {...section, summary, keywords: searchKeywords(section.title, summary, section.markdown),
      summarySourceHash: hash(section.markdown)};
  });
  article.summary = summaryText(article.markdown);
  article.summarySourceHash = article.contentHash;
  article.keywords = [...new Set([...article.keywords,
    ...searchKeywords(article.title, article.summary, '', 12)])].slice(0, 20);
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
    const articleBytes = Buffer.from(JSON.stringify({articles}));
    const manifest = {schemaVersion: 1, revision: hash(Buffer.concat([catalogBytes, articleBytes])),
      generatedAt: new Date().toISOString(),
      files: {'catalog.json': hash(catalogBytes), 'articles.json': hash(articleBytes)}};
    fs.writeFileSync(path.join(output, 'catalog.json'), catalogBytes);
    fs.writeFileSync(path.join(output, 'articles.json'), articleBytes);
    fs.writeFileSync(path.join(output, 'manifest.json'), JSON.stringify(manifest));
  };
  return {
    name: 'docs-service-export',
    async allContentLoaded({allContent}) {
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
        // 未解析组件保留原始 MDX，避免静默丢失事实内容。
        const prose = markdown.replace(/```[\s\S]*?```/g, '').replace(/~~~[\s\S]*?~~~/g, '').replace(/`[^`\n]+`/g, '');
        const components = [...prose.matchAll(/<([A-Z][A-Za-z0-9]*)\b/g)].map((match) => match[1]);
        const unknown = [...new Set(components.filter((name) => !['XActionModuleMeta', 'ModuleParamPreview'].includes(name)))];
        if (unknown.length) diagnostics.push(`${source}: 原样保留 MDX 组件 ${unknown.join(', ')}`);
        const url = `${host}${doc.permalink}`;
        articles.push(enrichArticle({id, title: doc.title, description: doc.description ?? '',
          keywords: Array.isArray(doc.frontMatter?.keywords) ? doc.frontMatter.keywords.map(String) :
            String(doc.frontMatter?.keywords ?? '').split(',').map((x) => x.trim()).filter(Boolean),
          url, markdown, docStatus: doc.frontMatter?.docStatus ?? null,
          lastUpdatedAt: doc.lastUpdatedAt ?? null}));
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
module.exports.enrichArticle = enrichArticle;
module.exports.moduleMarkdown = moduleMarkdown;
module.exports.expandKnownComponents = expandKnownComponents;
