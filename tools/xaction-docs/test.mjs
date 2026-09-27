import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
import {parseGeneratedCatalog} from './read-generated-catalog.mjs';
import {
  createChangeReport,
  createLandingPage,
  createReference,
  parseArguments,
  isUserModule,
  updateExistingModulePage,
  resolveModulePage,
  updateLandingPage,
} from './sync.mjs';

assert.equal(isUserModule({key: 'sys:test'}), false);
assert.equal(isUserModule({key: 'sys:autocadcontrol'}), true);

const generatedOnly = parseArguments(['--generated', process.cwd()]);
assert.ok(generatedOnly.generated);
assert.equal(generatedOnly.legacy, undefined);
const withLegacy = parseArguments(['--generated', process.cwd(), '--legacy', process.cwd()]);
assert.ok(withLegacy.legacy);
assert.throws(() => parseArguments([]), /--generated/);

const commonModule = {
  key: 'sys:test',
  name: '测试模块',
  slug: 'test',
  legacySlug: 'test',
  description: '旧说明',
  category: 'Basic',
  categoryName: '基础',
  stepType: 'Action',
  isRisky: false,
  isProOnly: false,
  helpLink: '',
  ownsLegacyContent: true,
  inputs: [
    {
      key: 'value',
      name: '值',
      type: 'Text',
      defaultValue: '',
      required: false,
      variableMode: 'Input',
      condition: '',
      description: '',
    },
  ],
  outputs: [],
  selections: {},
};

const previous = {
  generatedAt: '2026-08-01',
  modules: [commonModule, {...commonModule, key: 'sys:removed', name: '被删除模块'}],
};
const next = {
  generatedAt: '2026-08-02',
  modules: [
    {
      ...commonModule,
      name: '测试模块新版',
      inputs: [
        {...commonModule.inputs[0], defaultValue: 'new'},
        {...commonModule.inputs[0], key: 'extra', name: '附加值'},
      ],
    },
    {...commonModule, key: 'sys:added', name: '新增模块'},
  ],
};

const report = createChangeReport(previous, next);
assert.deepEqual(report.summary, {addedModules: 1, removedModules: 1, changedModules: 1});
assert.equal(report.changedModules[0].key, 'sys:test');
assert.deepEqual(report.changedModules[0].changedFields, ['name']);
assert.equal(report.changedModules[0].inputs.added[0].key, 'extra');
assert.equal(report.changedModules[0].inputs.changed[0].key, 'value');

const unchanged = createChangeReport(next, next);
assert.deepEqual(unchanged.summary, {addedModules: 0, removedModules: 0, changedModules: 0});

const baseline = createChangeReport(null, next);
assert.equal(baseline.baselineCreated, true);
assert.deepEqual(baseline.summary, {addedModules: 0, removedModules: 0, changedModules: 0});

const landing = createLandingPage(
  [commonModule, {...commonModule, key: 'sys:text', category: 'Text'}],
  1,
  2,
  '2026-08-03 20:08:03',
);
assert.ok(landing.includes('<XActionLanding'));
assert.ok(landing.includes('moduleCount={2}'));
assert.ok(landing.includes('Basic: 1,'));
assert.ok(landing.includes('Text: 1,'));
assert.ok(landing.includes('hide_table_of_contents: true'));
assert.ok(!landing.includes('| 分类 | 模块数 |'));
const manualLanding = `人工前言\n\n${landing}\n\n人工补充`;
assert.equal(updateLandingPage(manualLanding, landing), manualLanding);
assert.throws(() => updateLandingPage('人工首页', landing), /拒绝覆盖/);

const reference = createReference(commonModule);
assert.ok(reference.includes('<XActionModuleMeta moduleKey="sys:test" />'));
assert.ok(reference.includes('## 当前模块定义'));
assert.ok(!reference.includes('xaction-metadata:'));
assert.ok(!reference.includes('| Key |'));
assert.ok(!reference.includes('## 输入参数'));

const manualPage = '---\ntitle: 手工标题\ndescription: 手工摘要\nmoduleKey: sys:test\nmetadataGeneratedAt: old\n---\n\n## 当前模块定义\n\n<XActionModuleMeta moduleKey="sys:test" />\n\n## 使用说明\n\n保留人工正文。\n';
assert.equal(updateExistingModulePage(manualPage, commonModule, 'new'), manualPage);
assert.equal(updateExistingModulePage(`${manualPage}\n\n人工空行`, commonModule, 'new'), `${manualPage}\n\n人工空行`);
assert.equal(resolveModulePage({...commonModule, category: 'Ai'}, new Map([['sys:test', 'existing-ai.md']])), 'existing-ai.md');
assert.throws(() => resolveModulePage({...commonModule, category: 'Unconfigured'}, new Map()), /新模块分类尚未配置/);

console.log('组合动作模块差异测试通过。');

const originalText = '  `a|b`<br>\r\n第二行  ';
const field = (key, ...values) => ({Kind: 'Field', FieldKey: key, Operator: 'In', Values: values});
const exportFixture = {
  SchemaVersion: 1, GeneratedAt: '2026-09-27T12:00:00', StepCount: 1, ExportErrors: [],
  Steps: [{
    Key: 'sys:probe', Name: '测试', Category: 'Basic', CategoryName: '基础',
    StepType: 'Action', IsRisky: false, IsProOnly: false,
    Inputs: [{Key: 'content', Name: '内容', Type: 'Text', DefaultValue: originalText,
      DefaultValueText: originalText, Description: originalText, IsRequired: false,
      VisibleWhen: {Kind: 'All', Conditions: [field('connection', 'bridge'), field('operation', 'read')]},
      ValidForList: ['wrong-legacy'], SelectionItems: [{Value: 'a|b', Name: '`选项`', Description: '<br>'}]},
    {Key: 'enabled', Name: '启用', Type: 'Boolean', DefaultValue: false, DefaultValueText: 'false'}],
    Outputs: [{Key: 'result', Name: '结果', Type: 'Text', VisibleWhen: field('operation', 'read')}],
  }],
};
const [parsed] = parseGeneratedCatalog(exportFixture);
assert.equal(parsed.inputs[0].defaultValue, originalText);
assert.equal(parsed.inputs[0].description, originalText);
assert.equal(parsed.inputs[1].defaultValueRaw, false);
assert.equal(parsed.selections.content.items[0].description, '<br>');
assert.deepEqual(parsed.inputs[0].visibleWhen.conditions.map((rule) => rule.fieldKey), ['connection', 'operation']);
assert.equal(parsed.outputs[0].visibleWhen.fieldKey, 'operation');
assert.throws(() => parseGeneratedCatalog({...exportFixture, ExportErrors: [{Message: '失败'}]}), /不完整/);
assert.throws(() => parseGeneratedCatalog({...exportFixture, StepCount: 2}), /不完整/);
assert.throws(() => parseGeneratedCatalog({...exportFixture, SchemaVersion: 999}), /SchemaVersion/);
assert.doesNotThrow(() => parseGeneratedCatalog({...exportFixture, SchemaVersion: undefined}));
assert.throws(() => parseGeneratedCatalog({...exportFixture, Steps: [{...exportFixture.Steps[0],
  Inputs: [exportFixture.Steps[0].Inputs[0], exportFixture.Steps[0].Inputs[0]]}]}), /Key 缺失或重复/);

// 直接测试网站使用的函数，避免维护另一份条件判断实现。
const visibilitySource = fs.readFileSync(new URL('../../src/components/xaction/conditionVisibility.ts', import.meta.url), 'utf8');
const visibilityJs = ts.transpileModule(visibilitySource, {compilerOptions: {module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022}}).outputText;
const {isStepParamVisible} = await import(`data:text/javascript;base64,${Buffer.from(visibilityJs).toString('base64')}`);
const nested = parsed.inputs[0];
assert.equal(isStepParamVisible(nested, {connection: 'bridge', operation: 'read'}), true);
assert.equal(isStepParamVisible(nested, {connection: 'other', operation: 'read'}), false);
assert.equal(isStepParamVisible(nested, {connection: 'bridge', operation: 'skip', unrelated: 'read'}), false);
assert.equal(isStepParamVisible(nested, {connection: 'bridge'}), true, '未知控制字段不隐藏');
assert.equal(isStepParamVisible(nested, {connection: 'other'}), false, '已知父条件为假时隐藏');
assert.equal(isStepParamVisible(nested, {connection: 'other'}, true), true);
const inRule = {kind: 'Field', fieldKey: 'enabled', operator: 'In', values: ['1']};
assert.equal(isStepParamVisible({visibleWhen: inRule}, {enabled: 'true'}, false, {inputs: [{key: 'enabled', type: 'Boolean'}]}), true);
assert.equal(isStepParamVisible({visibleWhen: {kind: 'Not', conditions: [inRule]}}, {}), true, '未知取反仍未知');
assert.equal(isStepParamVisible({visibleWhen: {kind: 'Any', conditions: [inRule, {kind: 'Field', fieldKey: 'text', operator: 'IsEmpty'}]}}, {enabled: '0', text: ''}), true);
assert.equal(isStepParamVisible({visibleWhen: {...inRule, operator: 'NotIn'}}, {enabled: '1'}), false);
assert.equal(isStepParamVisible({visibleWhen: {...inRule, operator: 'IsNotEmpty'}}, {enabled: ''}), false);
assert.equal(isStepParamVisible({visibleWhen: inRule}, {enabled: '$=unknown'}), true);
const recording = {inputs: [{key: 'operation', type: 'Enum', isControlField: true}, {key: 'region', type: 'Enum'}],
  selections: {operation: {items: [{value: 'start'}, {value: 'stop'}]}, region: {items: [{value: 'fixed_area'}, {value: 'screen'}]}}};
const oldCondition = {condition: '仅：fixed_area; 排除：stop'};
assert.equal(isStepParamVisible(oldCondition, {operation: 'start', region: 'fixed_area'}, false, recording), true);
assert.equal(isStepParamVisible(oldCondition, {operation: 'stop', region: 'fixed_area'}, false, recording), false);
assert.equal(isStepParamVisible(oldCondition, {operation: 'start', region: 'screen', text: 'fixed_area'}, false, recording), false);
console.log('JSON 参数保真、导出完整性及多级显示条件测试通过。');
