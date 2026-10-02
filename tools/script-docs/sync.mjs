import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {isDeepStrictEqual} from 'node:util';
import {pages, freshPage, replaceGenerated, contract, hash} from './render.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const data = path.join(root, 'data/script-action/catalog.json');
const docs = path.join(root, 'docs/v2/script-action');
const check = process.argv.includes('--check');
const at = process.argv.indexOf('--catalog');
if (at >= 0 && !process.argv[at + 1]) throw new Error('--catalog 后需要 JSON 文件路径');
const incoming = at < 0 ? data : path.resolve(process.argv[at + 1]);
const catalog = JSON.parse(fs.readFileSync(incoming, 'utf8').replace(/^\uFEFF/, ''));
const rendered = pages(catalog);
const errors = [];
if (check && incoming !== data && !isDeepStrictEqual(contract(catalog), contract(JSON.parse(fs.readFileSync(data, 'utf8'))))) errors.push('当前代码导出的 API 契约与文档目录不一致，请先审查变化并同步');
const outputs = [];
for (const [relative, page] of rendered) {
  const file = path.join(docs, relative);
  const exists = fs.existsSync(file);
  const original = exists ? fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n') : freshPage(page.title, `${page.title}的成员、参数和使用约定。`, `v2/script-action/${relative.replace(/\.md$/, '')}`, relative.endsWith('index.md') ? 1 : 10);
  const next = replaceGenerated(original, page.body);
  if (check && (!exists || original !== next)) errors.push(`生成内容过期或缺失：${relative}`);
  outputs.push([file, next]);
}
function walk(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, {withFileTypes: true}).flatMap(e => e.isDirectory() ? walk(path.join(directory, e.name)) : [path.join(directory, e.name)]);
}
for (const file of walk(path.join(docs, 'api')).filter(f => f.endsWith('.md'))) {
  const relative = path.relative(docs, file).replaceAll('\\', '/');
  if (!rendered.has(relative)) errors.push(`API 页已不在目录中，需人工确认保留或迁移：${relative}`);
}
const report = {schemaVersion: 1, sourceCommit: catalog.sourceCommit, contractHash: hash(contract(catalog)),
  domainCount: catalog.domains.length - 1, methodCount: catalog.domains.reduce((n, d) => n + d.methods.length, 0),
  typeCount: catalog.types.length, errorCount: catalog.errors.length, generatedPageCount: rendered.size,
  missingMethodDescriptions: catalog.domains.flatMap(d => d.methods.filter(m => !m.description).map(m => m.key)),
  missingTypeDescriptions: catalog.types.filter(t => !t.description).map(t => t.name),
  missingDescriptions: catalog.missingDescriptions};
const reportPath = path.join(root, 'data/script-action/coverage.json');
const reportText = JSON.stringify(report, null, 2) + '\n';
if (check && (!fs.existsSync(reportPath) || fs.readFileSync(reportPath, 'utf8') !== reportText)) errors.push('覆盖报告过期');
if (errors.length) throw new Error(errors.join('\n'));
if (!check) {
  // 先验证所有页面标记与目录，再写入；失败时不留下部分覆盖的正文。
  for (const [file, text] of outputs) {fs.mkdirSync(path.dirname(file), {recursive: true}); fs.writeFileSync(file, text);}
  fs.mkdirSync(path.dirname(data), {recursive: true});
  fs.writeFileSync(data, JSON.stringify(catalog, null, 2) + '\n');
  fs.writeFileSync(reportPath, reportText);
}
console.log(`${check ? '检查通过' : '已生成'}：${report.generatedPageCount} 页，${report.methodCount} 个根/域方法，${report.typeCount} 个类型。中文说明缺项 ${report.missingDescriptions.length} 项，见 data/script-action/coverage.json。`);
