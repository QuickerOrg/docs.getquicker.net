import assert from 'node:assert/strict';
import {createChangeReport} from './sync.mjs';

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

console.log('组合动作模块差异测试通过。');
