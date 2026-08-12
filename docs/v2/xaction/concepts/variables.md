---
title: "变量"
description: "变量在步骤之间传数据；右侧列表可创建、筛选，对话框里设类型和默认值。"
slug: "/v2/xaction/concepts/variables"
sidebar_position: 50
quickerDocKey: "xaction/concepts/variables"
comments: true
docStatus: reviewed
legacyDocId: 1460429
legacyContentUpdatedAt: "2024-04-29T02:53:17.000Z"
---

# 变量

变量在步骤之间传递数据。前面步骤的输出放进变量，后面步骤再当输入用。

可以把变量看成盒子：名字是标签，类型限制能放什么，默认值是一开始就在盒子里的东西。

下面这条链：获取选中文本 → 文本处理 → 把结果发回窗口。

<StepProgramView
  showVariables
  data={{
    steps: [
      {
        key: 'sys:getSelectedText',
        outputs: {output: 'selectedText', isSuccess: 'ok'},
      },
      {
        key: 'sys:stringProcess',
        inputs: {data: '{selectedText}', method: 'toUpper'},
        outputs: {output: 'resultText'},
      },
      {
        key: 'sys:outputText',
        inputs: {content: '{resultText}'},
      },
    ],
  }}
/>

`stringProcess` 的「待处理内容」应绑 `selectedText`。参数窗里是这样：

<ModuleParamPreview
  moduleKey="sys:stringProcess"
  inputVars={{data: 'selectedText'}}
  values={{method: 'toUpper'}}
  outputVars={{output: 'resultText'}}
  focusKeys={['data', 'method', 'output']}
/>

## 类型

基础类型：文本、图片、布尔、日期时间、数字、数字（整数）。

高级类型：[列表](/v2/xaction/concepts/var-list)、[词典](/v2/xaction/concepts/var-dict)、[动态对象](/v2/xaction/concepts/object)、[表格](/v2/xaction/concepts/tablevar)。

## 输入和输出

输入参数通常可以选变量，或改成固定值 / 插值 / 表达式，见 [选择或输入步骤参数](/v2/xaction/concepts/edit-step-param)。

<ModuleParamPreview
  moduleKey="sys:getSelectedText"
  outputVars={{output: 'context', isSuccess: '选中文本'}}
  focusKeys={['output', 'isSuccess']}
/>

## 变量列表

编辑器右侧是变量列表：添加、删除、清理未使用、排序、筛选。超过约 10 个变量时会出现筛选框。

<ActionEditorPreview
  caption="变量列表"
  focus="variables"
  selectedVar="selectedText"
  varFilter=""
  variables={[
    {name: 'selectedText', type: 'Text'},
    {name: 'selectSuccess', type: 'Boolean'},
    {name: 'resultText', type: 'Text', usage: ['state']},
  ]}
/>

行前可能还有用途图标：子程序输入 / 输出、作为状态使用。鼠标停上去能看到说明。

把变量拖到步骤列表，会自动加一条赋值。按住 `Ctrl` 拖列表类型变量，会自动加「每个」循环。

## 创建和编辑

点列表上的 + ，或在步骤参数窗里点「创建变量」。双击变量名或点铅笔可编辑。

<VariableDefPreview
  name="selectedText"
  typeLabel="文本"
  remark="当前选中的文字"
  defaultValue=""
/>

**变量名**：唯一标识，中英文都可以，不要空格和特殊字符。不要用纯数字。复杂动作可用 `前缀_名字` 方便分组。

插值时按变量顺序替换。不要让前面变量替换后刚好变成 `{后面的变量名}`，否则会被再次替换。

**类型**、**备注**、**默认值**：类型决定能存什么；备注给自己看；默认值是动作开始时的初值。1.12 之后默认值也可以写表达式，但尽量别引用其它变量，更不要引用后面才定义的变量。

**作为状态使用**：动作正常结束后把值存进动作，下次运行再读回来。状态键是 `$var:变量名`。长期挂着、不会正常结束的动作不要勾这项，值可能写不回去。详见 [状态存取](/v2/xaction/modules/statestorage)。

### 默认值写法

| 类型 | 写法 | 示例 |
| --- | --- | --- |
| 文本 | 直接写，可多行 | 你好，欢迎使用 Quicker！ |
| 图片 | 不支持默认值 | — |
| 布尔 | `true` / `1` 为真，`false` / `0` 为假 | `true` |
| 数字 | 小数 | `234.56` |
| 数字（整数） | 整数 | `123` |
| 日期时间 | 日期，或表示相对今天的天数 | `2019-4-1 12:30:00` 或 `5` |
| 列表 | 每行一项 | `北京` / `上海` |
| 词典 | 每行 `键:值`，或 `json:{...}` | `China:中国` |
| 对象 | 任意 C# 对象，在表达式里调方法 | — |

## 限制与排障

- 名字含空格或纯数字时，插值和表达式会解析失败。
- 勾了「作为状态使用」却一直不结束动作，下次运行仍是默认值。
- 列表、词典、表格、对象的专门规则见各子页。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/concepts/var-list',
      label: '列表类型',
      description: '一组字符串，如多选文件路径',
    },
    {
      href: '/v2/xaction/concepts/var-dict',
      label: '词典类型',
      description: '键值对，可和 JSON 互转',
    },
    {
      href: '/v2/xaction/concepts/tablevar',
      label: '表格变量类型',
      description: '二维表，按行列存数据',
    },
    {
      href: '/v2/xaction/concepts/object',
      label: '动态对象变量',
      description: '保存任意 C# 对象',
    },
    {
      href: '/v2/xaction/modules/statestorage',
      label: '状态存取',
      description: '跨次运行保存变量',
    },
  ]}
/>
