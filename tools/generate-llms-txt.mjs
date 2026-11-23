import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import {fileURLToPath} from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');
const docsDir = path.join(repoRoot, 'docs');
const host = 'https://docs.getquicker.net';

function parseFrontMatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return {};
  const fm = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z0-9_]+):\s*(.+)$/);
    if (!kv) continue;
    let val = kv[2].trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    } else if (val === 'true') {
      val = true;
    } else if (val === 'false') {
      val = false;
    }
    fm[kv[1]] = val;
  }
  return fm;
}

function docUrlFromRel(rel, fm) {
  if (typeof fm.slug === 'string' && fm.slug) {
    return `${host}${fm.slug.startsWith('/') ? fm.slug : '/' + fm.slug}`;
  }
  let p = rel.replace(/\\/g, '/').replace(/\.(md|mdx)$/i, '');
  if (p === 'index') return `${host}/`;
  if (p.endsWith('/index')) p = p.slice(0, -'/index'.length);
  return `${host}/${p}`;
}

function collectDocs(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectDocs(full));
    } else if (/\.(md|mdx)$/i.test(entry.name)) {
      const rel = path.relative(docsDir, full).replace(/\\/g, '/');
      const raw = fs.readFileSync(full, 'utf8');
      const fm = parseFrontMatter(raw);
      if (fm.unlisted === true || fm.draft === true) continue;
      if (rel.startsWith("v2/what's-new/") || rel.startsWith('release-notes/archive-')) continue;
      results.push({
        rel,
        title: String(fm.title ?? path.basename(rel, path.extname(rel))),
        description: String(fm.description ?? '').replace(/\s+/g, ' ').trim(),
        url: docUrlFromRel(rel, fm),
        moduleKey: fm.moduleKey ? String(fm.moduleKey) : null,
      });
    }
  }
  return results.sort((a, b) => a.rel.localeCompare(b.rel));
}

export function generateLlmsTxt() {
  const docs = collectDocs(docsDir);
  const groups = [
    {
      heading: '开始、安装与从 1.x 迁移',
      match: (d) =>
        d.rel === 'index.md' ||
        d.rel === 'important-notice.md' ||
        d.rel === 'v2/index.md' ||
        d.rel === 'v2/getting-started.md' ||
        d.rel === 'v2/troubleshooting.md' ||
        d.rel.startsWith('v2/install/') ||
        d.rel.startsWith('v2/migration/'),
    },
    {
      heading: '核心功能使用',
      match: (d) => d.rel.startsWith('v2/features/'),
    },
    {
      heading: '组合动作概念与入门教程',
      match: (d) =>
        d.rel.startsWith('v2/xaction/') && !d.rel.startsWith('v2/xaction/modules/'),
    },
    {
      heading: '脚本动作（C# / qk API）',
      match: (d) => d.rel.startsWith('v2/script-action/'),
    },
    {
      heading: '版本更新记录与其它参考',
      match: (d) => d.rel.startsWith('release-notes/'),
    },
    {
      heading: '组合动作系统模块参考（全部）',
      match: (d) => d.rel.startsWith('v2/xaction/modules/'),
    },
  ];

  const lines = [
    '# Quicker V2 官方文档',
    '',
    '> Quicker V2 中文帮助文档、组合动作模块契约、C# 脚本动作 API 参考与 1.x 迁移说明（自动跳过归档与未列出旧兼容页）。',
    '',
    '## 站点关键资源',
    `- [文档首页](${host}/)`,
    `- [站点地图](${host}/sitemap.xml)`,
    `- [组合动作模块参考目录](${host}/v2/xaction/modules)`,
    `- [组合动作结构化元数据（catalog.json）](https://github.com/QuickerOrg/docs.getquicker.net/blob/main/data/xaction/catalog.json)`,
    '',
  ];

  const assigned = new Set();
  for (const g of groups) {
    const items = docs.filter((d) => !assigned.has(d.rel) && g.match(d));
    if (!items.length) continue;
    lines.push(`## ${g.heading}`, '');
    for (const item of items) {
      assigned.add(item.rel);
      const keyTag = item.moduleKey ? `（\`${item.moduleKey}\`）` : '';
      const desc = item.description ? `: ${item.description.slice(0, 120)}` : '';
      lines.push(`- [${item.title}${keyTag}](${item.url})${desc}`);
    }
    lines.push('');
  }

  return {content: lines.join('\n'), count: docs.length};
}

export function writeLlmsTxt() {
  const {content, count} = generateLlmsTxt();
  const outPath = path.join(repoRoot, 'static', 'llms.txt');
  fs.writeFileSync(outPath, content, 'utf8');
  return {outPath, count};
}

if (
  process.argv[1] &&
  fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url))
) {
  const outPath = path.join(repoRoot, 'static', 'llms.txt');
  if (process.argv.includes('--check')) {
    if (!fs.existsSync(outPath)) {
      console.error('缺少 static/llms.txt，请运行 npm run docs:llms:gen。');
      process.exit(1);
    }
    const {content, count} = generateLlmsTxt();
    const actual = fs.readFileSync(outPath, 'utf8').replace(/\r\n/g, '\n');
    if (actual !== content) {
      console.error('static/llms.txt 与当前 docs/ 文档不一致，请运行 npm run docs:llms:gen。');
      process.exit(1);
    }
    console.log(`llms.txt 校验通过：共 ${count} 篇权威文档。`);
  } else {
    const res = writeLlmsTxt();
    console.log(`已生成 static/llms.txt：收录 ${res.count} 篇权威文档。`);
  }
}
