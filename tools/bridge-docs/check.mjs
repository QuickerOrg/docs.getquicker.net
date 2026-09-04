import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, '');
const json = (file) => JSON.parse(read(file));
function files(directory, suffix) {
  return fs.readdirSync(directory, {withFileTypes: true}).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? files(file, suffix) : file.endsWith(suffix) ? [file] : [];
  });
}
const field = (body, key) => body.match(new RegExp(`^${key}:\\s*["']?([^"'\\n\\r]+)`, 'm'))?.[1];

export function validateExample(example, module) {
  assert.equal(example.command, 'bridge.ping', '最小示例必须保持只读连接测试');
  for (const [key, value] of Object.entries(example.inputs)) {
    assert.ok(module.inputs.some((input) => input.key === key), `${module.key}: 不存在输入 ${key}`);
    const selection = module.selections[key];
    if (selection) assert.ok(selection.items.some((item) => item.value === value), `${module.key}: 无效枚举 ${key}=${value}`);
    if (/Json$/.test(key)) assert.equal(typeof JSON.parse(value), 'object');
  }
  assert.ok(module.outputs.some((output) => output.key === example.outputKey), `${module.key}: 不存在输出`);
  const operation = example.inputs.bridgeOperation ?? example.inputs.operation;
  assert.ok(operation === 'bridge.ping' ||
    (operation === 'command.custom' && example.inputs.commandName === 'bridge.ping'), '示例没有调用 ping');
  if (module.key === 'sys:autocadcontrol') assert.equal(example.inputs.connection, 'bridge');
  if (module.key === 'sys:wpscontrol') assert.ok(['wps', 'et', 'wpp'].includes(example.inputs.targetComponent));
}

export function check() {
  const {bridges} = json('data/bridges/catalog.json');
  const catalog = json('data/xaction/catalog.json');
  const {examples} = json('data/bridges/examples.json');
  const source = json('data/bridges/source.json');
  assert.equal(bridges.length, 16, '首批应有 16 个宿主');
  assert.equal(examples.length, bridges.length);
  assert.equal(source.generatedAt, catalog.generatedAt, '导出时间证据与 Catalog 不一致');
  for (const key of ['quickerCommit', 'installerCommit']) assert.match(source[key], /^[0-9a-f]{40}$/);
  const modulePages = files(path.join(root, 'docs/v2/xaction/modules'), '.md').map((file) => ({file, body: fs.readFileSync(file, 'utf8')}));
  const uniqueFields = ['connectionId', 'moduleKey', 'docSlug'];
  for (const key of uniqueFields) assert.equal(new Set(bridges.map((bridge) => bridge[key])).size, bridges.length, `重复 ${key}`);
  const overview = read('docs/v2/features/software-connections/index.md');
  for (const bridge of bridges) {
    assert.deepEqual(Object.keys(bridge).sort(), ['connectionId', 'componentId', 'moduleKey', 'displayName', 'docSlug'].sort(), '映射仅保存稳定关系');
    const guideFile = `docs${bridge.docSlug}.md`;
    const guide = read(guideFile);
    assert.equal(field(guide, 'slug'), bridge.docSlug);
    const module = catalog.modules.find((item) => item.key === bridge.moduleKey);
    assert.ok(module, `Catalog 缺失 ${bridge.moduleKey}`);
    assert.deepEqual(json(`data/xaction/modules/${bridge.moduleKey.replace(/[^A-Za-z0-9_.-]+/g, '_')}.json`), module);
    const pages = modulePages.filter(({body}) => field(body, 'moduleKey') === bridge.moduleKey);
    assert.equal(pages.length, 1, `${bridge.moduleKey} 必须且只能有一篇模块页`);
    const body = pages[0].body;
    assert.equal(field(body, 'quickerDocKey'), `xaction/module/${bridge.moduleKey}`);
    const moduleSlug = `/v2/xaction/modules/${module.slug}`;
    assert.equal(field(body, 'slug'), moduleSlug);
    assert.ok(guide.includes(`](${moduleSlug})`), `${guideFile} 缺少模块链接`);
    assert.ok(body.includes(`](${bridge.docSlug})`), `${bridge.moduleKey} 缺少指南链接`);
    assert.ok(body.includes(`<XActionModuleMeta moduleKey="${bridge.moduleKey}" />`));
    assert.ok(body.includes('临时 session') && body.includes('#动作怎样选择目标'));
    assert.ok(body.includes('## 最小示例：测试连接'));
    assert.ok(overview.includes(`./software/${path.basename(guideFile)}`));
    const example = examples.filter((item) => item.moduleKey === bridge.moduleKey);
    assert.equal(example.length, 1);
    validateExample(example[0], module);
    for (const value of Object.values(example[0].inputs)) assert.ok(body.includes(value), `正文缺少示例值 ${value}`);
    if (bridge.connectionId === 'wps') {
      assert.equal(bridge.componentId, null);
      assert.ok(guide.includes('预览') && guide.includes('尚未完成真机闭环'));
      assert.ok(body.includes('预览') && body.includes('仍待真机验证'));
    } else assert.equal(bridge.componentId, `quicker.bridge.${bridge.connectionId}`);
  }
  assert.ok(!catalog.modules.some((module) => module.key === 'sys:test'));
  for (const home of ['docs/index.md', 'docs/v2/index.md']) assert.ok(read(home).includes('software-connections/index.md'));
  for (const name of ['index', 'install-and-manage', 'command-tool', 'troubleshooting']) read(`docs/v2/features/software-connections/${name}.md`);
  return bridges.length;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  console.log(`Bridge 文档一致性检查通过：${check()} 个宿主、双向链接、元数据及最小示例。`);
}
