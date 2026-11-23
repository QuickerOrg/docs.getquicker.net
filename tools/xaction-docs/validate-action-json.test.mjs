import test from 'node:test';
import assert from 'node:assert/strict';
import {
  loadCatalog,
  validateActionJson,
  extractMarkdownJsonExamples,
  extractTemplateVarRefs,
} from './validate-action-json.mjs';

const catalog = loadCatalog();

test('ai-action-json-examples.md 中的全部完整示例通过语义校验', () => {
  const examples = extractMarkdownJsonExamples();
  assert.ok(examples.length >= 2);
  for (const example of examples) {
    const res = validateActionJson(example, catalog);
    assert.equal(res.valid, true, res.errors.join('\n'));
  }
});

test('extractTemplateVarRefs 严格区分 $= / $$ 中的变量引用与普通字面量', () => {
  assert.deepEqual(extractTemplateVarRefs('$$共 {count} 项：{title}'), ['count', 'title']);
  assert.deepEqual(extractTemplateVarRefs('$= {ok} && {count} > 0'), ['ok', 'count']);
  assert.deepEqual(extractTemplateVarRefs('{notATemplate}'), []);
});

test('拒绝未知模块 Key、未知参数、Input 使用 VarKey、UseVar 使用字面量与未声明变量', () => {
  const bad = {
    OperationType: 'xAction',
    OperationPayload: {
      PayloadType: 'xAction',
      Variables: [{Key: 'okVar', Type: 0}],
      Steps: [
        {StepRunnerKey: 'sys:nonExistent', InputParams: {}, OutputParams: {}},
        {
          StepRunnerKey: 'sys:notify',
          InputParams: {
            type: {VarKey: 'okVar'},
            placement: {Value: 'InvalidPlace'},
            unknownParam: {Value: 'x'},
            msg: {Value: '$$你好 {missingVar}'},
          },
          OutputParams: {},
        },
        {
          StepRunnerKey: 'sys:writeClipboard',
          InputParams: {
            type: {Value: 'auto'},
            input: {Value: 'shouldNotBeLiteral'},
          },
          OutputParams: {isSuccess: 'undeclaredOut'},
        },
      ],
    },
  };
  const res = validateActionJson(bad, catalog);
  assert.equal(res.valid, false);
  const joined = res.errors.join('\n');
  assert.match(joined, /未知 StepRunnerKey "sys:nonExistent"/);
  assert.match(joined, /Input 模式，禁止使用 VarKey/);
  assert.match(joined, /枚举值 "InvalidPlace" 不在模块可选列表中/);
  assert.match(joined, /不存在输入参数 "unknownParam"/);
  assert.match(joined, /missingVar/);
  assert.match(joined, /UseVar 模式，禁止使用字面量 Value/);
  assert.match(joined, /undeclaredOut/);
});

test('允许带预设选项的自由文本参数输入自定义值（仅 Enum 做封闭枚举限制）', () => {
  const customExt = {
    OperationType: 'xAction',
    OperationPayload: {
      PayloadType: 'xAction',
      Variables: [{Key: 'files', Type: 4}],
      Steps: [
        {
          StepRunnerKey: 'sys:everythingsearch',
          InputParams: {
            search: {Value: 'report'},
            ext: {Value: 'pdf'},
          },
          OutputParams: {
            pathList: 'files',
          },
        },
      ],
    },
  };
  const res = validateActionJson(customExt, catalog);
  assert.equal(res.valid, true, res.errors.join('\n'));
});
