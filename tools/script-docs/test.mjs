import assert from 'node:assert/strict';
import {test} from 'node:test';
import fs from 'node:fs';
import {examples, collect} from './examples.mjs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {replaceGenerated, pages, prose, start, end} from './render.mjs';
const catalog = JSON.parse(fs.readFileSync(new URL('../../data/script-action/catalog.json', import.meta.url), 'utf8'));
test('同步保留人工前言、示例与 front matter', () => {
  const original = `---\ntitle: 人工标题\n---\n\n前言\n${start}\n旧内容\n${end}\n\n完整示例`;
  const result = replaceGenerated(original, '新内容');
  assert.equal(result, `---\ntitle: 人工标题\n---\n\n前言\n${start}\n\n新内容\n\n${end}\n\n完整示例`);
});
test('损坏标记拒绝覆盖', () => {
  for (const text of ['人工正文', `${end}${start}`, `${start}${start}${end}`, `${start}${end}${end}`]) assert.throws(() => replaceGenerated(text, '生成'));
});
test('MDX 转义保留内联代码', () => assert.equal(prose('小于 <x>，{值}，`List<string>`'), '小于 &lt;x>，&#123;值&#125;，`List<string>`'));
test('每个域和类型都有页面，重载共用稳定成员锚点', () => {
  const output = pages(catalog);
  for (const d of catalog.domains) {
    const page = output.get(`api/${d.name.toLowerCase()}.md`);
    for (const m of d.methods) assert.ok(page.body.includes(m.signature));
    const anchors = [...page.body.matchAll(/<a id="([^"]+)"/g)].map(m => m[1]);
    assert.equal(anchors.length, new Set(anchors).size);
  }
  for (const t of catalog.types) assert.ok(output.has(`api/types/${t.name.toLowerCase()}.md`));
});
test('未知能力与重复签名失败，避免默默漏文档', () => {
  const c = structuredClone(catalog);
  c.domains[0].methods[0].capability = 'UnknownCapability';
  assert.throws(() => pages(c));
  const d = structuredClone(catalog);
  d.domains[0].methods.push(d.domains[0].methods[0]);
  assert.throws(() => pages(d));
});
test('每个下载示例与对应教程内嵌源码一致', () => {
  const directory = new URL('../../static/files/script-action/', import.meta.url);
  for (const file of fs.readdirSync(directory).filter(f => f.endsWith('.cs'))) {
    const code = fs.readFileSync(new URL(file, directory), 'utf8').trim();
    const page = fs.readFileSync(new URL(`../../docs/v2/script-action/tutorials/${file.replace('.cs', '.md')}`, import.meta.url), 'utf8');
    assert.ok([...page.matchAll(/```csharp\r?\n([\s\S]*?)```/g)].some(m => m[1].trim() === code), file);
  }
  assert.ok(examples().length >= 7);
});
test('用户页具有唯一身份，完整脚本提取不包含签名片段', () => {
  const keys = new Set();
  for (const file of collect(new URL('../../docs/v2/script-action/', import.meta.url)).filter(f => f.endsWith('.md'))) {
    const text = fs.readFileSync(file, 'utf8');
    const key = text.match(/^quickerDocKey: (.+)$/m)?.[1];
    assert.ok(key, file);
    assert.ok(!keys.has(key), key);
    keys.add(key);
  }
  for (const e of examples()) assert.match(e.code, /\bMain\s*\(/);
});
test('新导出存在契约漂移时 check 失败且不修改文档', () => {
  const root = fileURLToPath(new URL('../../', import.meta.url));
  const temp = path.join(root, 'tools/temp');
  fs.mkdirSync(temp, {recursive: true});
  const file = path.join(temp, `script-drift-${process.pid}.json`);
  const page = path.join(root, 'docs/v2/script-action/api/qk.md');
  const before = fs.readFileSync(page, 'utf8');
  const changed = structuredClone(catalog);
  changed.domains[0].methods[0].description += '（测试契约变化）';
  try {
    fs.writeFileSync(file, JSON.stringify(changed));
    const result = spawnSync(process.execPath, [path.join(root, 'tools/script-docs/sync.mjs'), '--check', '--catalog', file], {encoding: 'utf8'});
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /API 契约与文档目录不一致/);
    assert.equal(fs.readFileSync(page, 'utf8'), before);
  } finally { fs.unlinkSync(file); }
});
