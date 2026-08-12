---
title: "参数传递"
description: "步骤参数先取变量或计算 $$ / $= ，再转成目标类型；输出写入变量。"
slug: "/v2/xaction/concepts/parameters"
sidebar_position: 100
quickerDocKey: "xaction/concepts/parameters"
comments: true
docStatus: reviewed
legacyDocId: 1462164
legacyContentUpdatedAt: "2025-12-05T02:03:20.000Z"
---

# 参数传递

模块先收输入，做完操作再把结果写到输出。窗口里通常分成「（输入）参数」和「输出」。

<FlowChart
  layout="row"
  steps={['变量或输入框', '计算中间结果', '转成参数类型', '模块执行', '写入输出变量']}
/>

<ModuleParamPreview
  moduleKey="sys:openUrl"
  values={{url: '$$https://www.google.com/search?q={selectedText}'}}
  outputVars={{isSuccess: 'ok'}}
  focusKeys={['url', 'isSuccess']}
/>

## 输入

两种指定方式：

- **变量**：在下拉里选。
- **输入框**：固定值，或 [$$ 插值](/v2/xaction/concepts/interpolation)、[$= 表达式](/v2/xaction/concepts/expression)。F1 切换见 [选择或输入步骤参数](/v2/xaction/concepts/edit-step-param)。

<ModuleParamPreview
  moduleKey="sys:openUrl"
  inputVars={{url: 'homeUrl'}}
  focusKeys={['url']}
/>

### 计算顺序（1.4.22+）

1. 用了变量：取变量的值。
2. 用了输入框：
   - 以 `$$` 开头：先插值。若结果仍以 `$$` 或 `$=` 开头，再做一次插值或表达式，得到中间结果。
   - 以 `$=` 开头：做表达式，得到中间结果。
   - 都不是：框里的内容就是中间结果。
3. 布尔（如「如果」）和数字（如「重复」次数）必要时把中间结果再当公式解析。
4. 转成目标参数类型后交给模块。

<FlowChart
  layout="funnel"
  start="输入框内容"
  decision="看前缀"
  branches={[
    {label: '$$', steps: ['插值', '必要时再处理一次']},
    {label: '$=', steps: ['表达式']},
    {label: '都不是', steps: ['原文']},
  ]}
  merge="中间结果"
  after={['转成参数类型']}
/>

`$$` 得到的中间结果是文本；`$=` 可以是任意类型。

## 输出

选一个变量接收结果。不需要的输出可以不选。

带「失败后中止动作」的模块通常还有「是否成功」。要自己处理失败、不要弹错，可关掉中止，改看这个布尔输出。

## 限制与排障

- `$$` 必须写在整段最前面，不是每一行前面。
- 插值结果若还以 `$$` / `$=` 开头，只会再处理一次。
- 布尔/数字参数里写了「看起来像公式」的中间结果，会被再解析一遍。只想当纯文本时不要用这类参数。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/concepts/edit-step-param',
      label: '选择或输入步骤参数',
      description: 'F1 切换三种输入模式',
    },
    {
      href: '/v2/xaction/concepts/interpolation',
      label: '文本插值',
      description: '$$ 替换规则',
    },
    {
      href: '/v2/xaction/concepts/expression',
      label: '表达式',
      description: '$= 计算和比较',
    },
  ]}
/>
