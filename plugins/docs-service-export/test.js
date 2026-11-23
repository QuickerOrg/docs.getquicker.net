const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {
  splitSections,
  chunkSections,
  moduleMarkdown,
  expandModules,
  expandKnownComponents,
  enrichArticle,
  classifyArticle,
  prepareMarkdown,
} = require('./index');

test.before(prepareMarkdown);

test('标题锚点保留代码下划线，只包含链接可见文字并处理结束标记', () => {
  const sections = splitSections('## `_context`：动作上下文\n说明\n' +
    '## 与[插值](/v2/xaction/concepts/interpolation)方式的比较\n说明\n' +
    '## 0x800401E3 / 0x800401E1 (MK_E_UNAVAILABLE)\n说明\n' +
    '## **加粗标题** ##\n说明', 'https://docs.getquicker.net/a');
  assert.equal(sections[0].id, '_context动作上下文');
  assert.equal(sections[1].id, '与插值方式的比较');
  assert.equal(sections[2].id, '0x800401e3--0x800401e1-mk_e_unavailable');
  assert.equal(sections[3].id, '加粗标题');
});

test('摘要摘录原文并记录章节哈希，代码与组件不进入摘要', () => {
  const markdown = '# 屏幕找图\n\n在屏幕上查找目标图片，返回匹配点坐标。\n\n' +
    '## 参数说明\n\n**重试次数**：找不到时再试几次。\n\n' +
    '```js\nconst password = "secret";\n```\n\n<PreviewMarks marks={[]} />';
  const article = enrichArticle({id: 'doc:test', title: '屏幕找图', description: '', keywords: [],
    url: 'https://docs.getquicker.net/test', markdown});
  assert.match(article.summary, /查找目标图片/);
  assert.equal(article.summarySourceHash, article.contentHash);
  assert.equal(article.sections[1].summarySourceHash,
    require('node:crypto').createHash('sha256').update(article.sections[1].markdown).digest('hex'));
  assert.ok(article.sections[1].keywords.includes('重试次数'));
  assert.doesNotMatch(article.sections[1].summary, /password|PreviewMarks/);
});

test('章节保留代码块和显式锚点', () => {
  const sections = splitSections('## 参数 {#params}\n| 名称 | 值 |\n| --- | --- |\n```md\n# 不是标题\n```\n## 输出\n结果', 'https://docs.getquicker.net/a');
  assert.equal(sections.length, 2);
  assert.equal(sections[0].id, 'params');
  assert.match(sections[0].markdown, /# 不是标题/);
  assert.equal(sections[0].url, 'https://docs.getquicker.net/a#params');
});

test('MDX 中文显式锚点与无标题正文链接对应文档站', () => {
  const sections = splitSections('安装前说明。\n\n### 2.1.0 · 数据结构 {/* #从-210-降级 */}\n回退前备份。\n## 后续 {#中文锚点}\n完成。', 'https://docs.getquicker.net/a');
  assert.equal(sections[0].url, 'https://docs.getquicker.net/a');
  assert.equal(sections[1].id, '从-210-降级');
  assert.equal(sections[1].title, '2.1.0 · 数据结构');
  assert.equal(sections[1].url, 'https://docs.getquicker.net/a#从-210-降级');
  assert.equal(sections[2].id, '中文锚点');
  const page = splitSections('# 页面标题\n正文。\n## 页面标题\n章节。', 'https://docs.getquicker.net/a');
  assert.equal(page[0].url, 'https://docs.getquicker.net/a');
  assert.equal(page[1].url, 'https://docs.getquicker.net/a#页面标题-1');
});

test('模块元数据展开为参数与输出表', () => {
  const markdown = moduleMarkdown({key: 'sys:test', name: '测试', inputs: [{name: '目录', key: 'folder', type: 'Text', description: '搜索路径'}], outputs: [{name: '结果', key: 'result', type: 'Text'}]});
  assert.match(markdown, /目录 \| folder \| Text/);
  assert.match(markdown, /结果 \| result \| Text/);
});

test('模块默认值中的标记作为文本导出', () => {
  const markdown = moduleMarkdown({key: 'sys:test', name: '测试', inputs: [
    {name: '界面', key: 'markup', type: 'Text', defaultValue: '<Window a="x&y">'}]});
  assert.match(markdown, /&lt;Window a="x&amp;y"&gt;/);
  assert.doesNotMatch(markdown, /<Window/);
});

test('静态 MDX 组件导出链接与完整步骤，代码块不展开', () => {
  const siteDir = fs.mkdtempSync(path.join(os.tmpdir(), 'docs-export-'));
  try {
    const exampleDir = path.join(siteDir, 'data', 'step-render', 'examples');
    fs.mkdirSync(exampleDir, {recursive: true});
    const id = '0e698f4e-04ac-426d-b3eb-08d6c3be0bea';
    fs.writeFileSync(path.join(exampleDir, `${id}.json`), JSON.stringify({title: '演示',
      steps: [{key: 'sys:if', inputs: {condition: '是'}, ifSteps: [{key: 'sys:notify', inputs: {msg: '你好'}}]}]}));
    const diagnostics = [];
    const result = expandKnownComponents(
      `<StepProgramView example="${id}" />\n<ShareLinkCard code="${id}" title="动作" />\n` +
      '<RelatedDocs items={[{href: "/a", label: "文章", description: "说明"}]} />\n' +
      '<PreviewMarks marks={[{key: "type", label: "内容类型"}]}><span>预览</span></PreviewMarks>\n' +
      '<FlowChart layout="branch" decision="成功？" yes={["继续"]} no={["停止"]} />\n' +
      `\`\`\`md\n<StepProgramView example="${id}" />\n\`\`\``, siteDir, diagnostics, 'test.md');
    assert.match(result, /"ifSteps"/);
    assert.match(result, /你好/);
    assert.match(result, /\[动作\]\(https:\/\/getquicker.net\/Sharedaction\?code=/);
    assert.match(result, /\[文章\]\(https:\/\/docs.getquicker.net\/a\)：说明/);
    assert.match(result, /- type：内容类型/);
    assert.match(result, /成功？\n\n- 是：继续\n\n- 否：停止/);
    assert.match(result, /```md\n<StepProgramView example=/);
    assert.deepEqual(diagnostics, []);
  } finally {
    fs.rmSync(siteDir, {recursive: true, force: true});
  }
});

test('面板布局热点的设置位置从组件静态数据导出', () => {
  const siteDir = fs.mkdtempSync(path.join(os.tmpdir(), 'docs-panel-export-'));
  try {
    const dir = path.join(siteDir, 'src', 'components', 'ActionPanelLayoutDemo');
    fs.mkdirSync(dir, {recursive: true});
    fs.writeFileSync(path.join(dir, 'index.tsx'),
      "const HOTSPOTS: readonly Hotspot[] = [{title: '搜索', body: '打开全局搜索', settingPath: '标题栏 → 搜索', href: '/usage'}];");
    const diagnostics = [];
    const result = expandKnownComponents('<ActionPanelLayoutDemo />', siteDir, diagnostics, 'panel.md');
    assert.match(result, /搜索.*打开全局搜索.*标题栏 → 搜索/);
    assert.match(result, /https:\/\/docs.getquicker.net\/usage/);
    assert.deepEqual(diagnostics, []);
  } finally {
    fs.rmSync(siteDir, {recursive: true, force: true});
  }
});

test('moduleMarkdown 导出完整契约字段、双默认值、枚举与动态未求值条件', () => {
  const md = moduleMarkdown({
    key: 'sys:demo',
    name: '演示模块',
    selections: {
      mode: {name: '模式', items: [{value: 'a', name: '甲'}, {value: 'b', name: '乙'}]},
    },
    inputs: [
      {
        name: '模式',
        key: 'mode',
        type: 'Enum',
        variableMode: 'Input',
        required: true,
        newStepDefaultValue: 'b',
        defaultValue: 'a',
        validForList: ['op1'],
      },
      {
        name: '高级项',
        key: 'adv',
        type: 'Text',
        visibleWhen: {kind: 'Expression', expr: 'foo > 1'},
        condition: '脚本条件',
      },
    ],
    outputs: [{name: '结果', key: 'out', type: 'Text', invalidForList: ['legacy']}],
  });
  assert.match(md, /变量模式/);
  assert.match(md, /新建初始值: `b`；运行时缺省: `a`/);
  assert.match(md, /可选：`a`\(甲\) \/ `b`\(乙\)/);
  assert.match(md, /仅适用于：op1/);
  assert.match(md, /动态表达式：未求值/);
  assert.match(md, /排除：legacy/);
});

test('ModuleParamPreview 按精确优先级展开示例值与初始值并关联契约', () => {
  const definitions = new Map([
    ['sys:sample', {
      key: 'sys:sample',
      name: '示例模块',
      slug: 'sample',
      inputs: [
        {key: 'op', name: '操作', defaultValue: 'read', newStepDefaultValue: 'write'},
        {key: 'flag', name: '开关', defaultValue: 'false'},
        {key: 'target', name: '目标', defaultValue: ''},
      ],
      outputs: [{key: 'res', name: '结果'}],
    }],
  ]);
  const diagnostics = [];
  const mdx = `<ModuleParamPreview
  moduleKey="sys:sample"
  focusKeys={['target']}
  values={{target: 'hello'}}
  inputVars={{target: 'vTarget'}}
  outputVars={{res: 'vOut'}}
/>`;
  const out = expandModules(mdx, definitions, diagnostics, 'guide.md');
  assert.deepEqual(diagnostics, []);
  assert.match(out, /https:\/\/docs\.getquicker\.net\/v2\/xaction\/modules\/sample/);
  assert.match(out, /\| ★ 目标 \| target \| hello \| 示例值 \| 输入 `vTarget` \|/);
  assert.match(out, /\| 操作 \| op \| write \| 新建步骤初始值 \|/);
  assert.match(out, /\| 开关 \| flag \| false \| 运行时缺省值 \|/);
  assert.match(out, /`res`\(结果\) → `vOut`/);
});

test('其余静态预览组件展开且保留 PreviewMap 内部子文本', () => {
  const diagnostics = [];
  const sample = [
    '<NotifyToastPreview message="已完成" variant="success" />',
    '<ContextMenuPreview items={[{label: "复制"}, {type: "separator"}, {label: "粘贴", tooltip: "快捷粘贴"}]} />',
    '<TableDataPreview title="清单" columns={["名称", "分值"]} rows={[["甲", 10]]} />',
    '<VariableDefPreview name="count" typeLabel="数字" defaultValue="0" asState />',
    '<PreviewMap links={[{from: "a", to: "b"}]}><MsgBoxPreview title="提示" message="确认？" buttons={["确定"]} /></PreviewMap>',
    '<XActionLanding moduleCount={176} />',
    '<HashRedirect fromPath="/a" routes={[{to: "/b", hashes: ["x"]}]} />',
  ].join('\n\n');
  const out = expandKnownComponents(sample, process.cwd(), diagnostics, 'comp.md');
  assert.deepEqual(diagnostics, []);
  assert.match(out, /\[提示消息预览 · success\] 完成|已完成/);
  assert.match(out, /- 复制/);
  assert.match(out, /\| 名称 \| 分值 \|/);
  assert.match(out, /保存为状态/);
  assert.match(out, /\[弹窗消息预览 · 提示\]/);
  assert.match(out, /176 个内置模块/);
  assert.match(out, /已拆分专题锚点自动跳转至/);
  assert.doesNotMatch(out, /<HashRedirect/);
  assert.doesNotMatch(out, /<[A-Z][A-Za-z]+Preview/);
});

test('chunkSections 保持表格与代码块完整并附带 parentHeadings，enrichArticle 注入分类与 sys:xxx 关键词', () => {
  const bigTable = ['| 列A | 列B |', '| --- | --- |', ...Array.from({length: 40}, (_, i) => `| 行${i} | 值${'x'.repeat(25)} |`)].join('\n');
  const bigCode = '```csharp\n' + 'var x = 1;\n'.repeat(160) + '```';
  const md = `# 模块页\n\n## 主节\n\n### 子节\n\n前导段落。\n\n${bigTable}\n\n${bigCode}\n\n结尾段落。`;
  const article = enrichArticle({
    id: 'xaction/module/sys:notify',
    title: '提示消息',
    description: '',
    keywords: [],
    url: 'https://docs.getquicker.net/v2/xaction/modules/notify',
    markdown: md,
  }, {
    contentType: 'reference',
    authority: {role: 'canonical', isPrimary: true},
    appliesToVersion: 'V2',
    verification: {status: 'reviewed', basis: 'frontMatter.docStatus'},
    moduleKey: 'sys:notify',
    moduleContract: {moduleKey: 'sys:notify', name: '提示消息', slug: 'notify', inputCount: 9, outputCount: 0},
    extraKeywords: ['sys:notify', 'notify'],
  });
  assert.ok(article.chunks.length >= 2);
  const subChunks = article.chunks.filter((c) => c.sectionId === '子节');
  assert.ok(subChunks.every((c) => JSON.stringify(c.parentHeadings) === JSON.stringify(['模块页', '主节'])));
  assert.ok(subChunks.some((c) => c.markdown.includes('| 行39 |') && c.markdown.includes('| 列A | 列B |')));
  assert.ok(subChunks.some((c) => c.markdown.includes(bigCode)));
  assert.equal(article.contentType, 'reference');
  assert.deepEqual(article.authority, {role: 'canonical', isPrimary: true});
  assert.equal(article.moduleContract.moduleKey, 'sys:notify');
  assert.ok(article.keywords.includes('sys:notify'));
});
