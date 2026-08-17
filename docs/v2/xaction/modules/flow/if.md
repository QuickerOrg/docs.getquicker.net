---
title: "如果/否则"
description: "依据条件执行操作"
slug: "/v2/xaction/modules/if"
sidebar_label: "如果/否则"
sidebar_position: 50
quickerDocKey: "xaction/module/sys:if"
comments: true
moduleKey: "sys:if"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 1402283
legacyContentUpdatedAt: "2021-08-12T06:37:42.000Z"
---

# 如果/否则

条件成立时执行一组步骤，不成立时执行另一组。只要成立时跑、不成立就跳过，用 [如果](/v2/xaction/modules/simple-if)。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:if" />

## 概述

常见场景：用百度搜选中文字时，成功取到文本就搜这段文字，否则打开百度首页。

<FlowChart
  layout="branch"
  before={['获取选中的文本']}
  decision="获取成功？"
  yes={['拼接搜索网址', '打开搜索页']}
  no={['打开百度首页']}
/>

用步骤写出来是这样（判断条件用 [获取选中的文本](/v2/xaction/modules/get_selected_text) 的 **是否成功**）：

<StepProgramView
  caption="选中文字则搜索，否则打开首页"
  selectedIndexes={[1]}
  data={{
    steps: [
      {
        key: 'sys:getSelectedText',
        outputs: {output: 'selectedText', isSuccess: 'isSelected'},
      },
      {
        key: 'sys:if',
        inputs: {condition: '{isSelected}'},
        ifSteps: [
          {
            key: 'sys:openUrl',
            inputs: {url: '$$https://www.baidu.com/s?wd={selectedText}'},
          },
          {
            key: 'sys:notify',
            inputs: {msg: '已打开搜索'},
          },
        ],
        elseSteps: [
          {
            key: 'sys:openUrl',
            inputs: {url: 'https://www.baidu.com'},
          },
        ],
      },
    ],
  }}
/>

<ModuleParamPreview moduleKey="sys:if" />

### 两个模块的区别

在工具箱 **流程** 分类里可以同时看到这两个模块：

<ActionEditorPreview
  focus="toolbox"
  toolboxTab="flow"
  toolboxSearch="如果"
  toolboxSelected="sys:if"
  caption="「如果」只有一个分支；「如果/否则」有两个分支"
  data={{steps: []}}
/>

Quicker 提供两个模块：

- **如果**：只有一个分支。条件成立就执行组内步骤，不成立就跳过。
- **如果/否则**：两个分支。成立走第一组，不成立走第二组。

「如果/否则」覆盖了「如果」的能力。单独提供「如果」，主要是少占步骤列表空间。两个模块可以在步骤列表里右键互转：

<ElseToggleMenuDemo caption="右键「如果」→ 增加「否则」；再右键 → 隐藏「否则」变回「如果」。悬停可暂停。" />

### 将步骤添加到分支

从模块工具箱拖到「如果」或「否则」分支的槽里松开。悬停可暂停演示。

<ActionEditorPreview
  focus="toolbox"
  toolboxSelected="sys:notify"
  toolboxSearch="提示"
  selectedIndexes={[2]}
  actionTitle="百度搜索"
  actionDescription="选中文字则搜索，否则打开首页"
  caption="拖入「如果」分支槽"
  dragDemo={{
    moduleKey: 'sys:notify',
    targetSlot: '2/if',
    afterData: {
      steps: [
        {
          key: 'sys:getSelectedText',
          outputs: {output: 'selectedText', isSuccess: 'isSelected'},
        },
        {
          key: 'sys:if',
          inputs: {condition: '{isSelected}'},
          ifSteps: [
            {
              key: 'sys:openUrl',
              inputs: {url: '$$https://www.baidu.com/s?wd={selectedText}'},
            },
          ],
          elseSteps: [
            {
              key: 'sys:openUrl',
              inputs: {url: 'https://www.baidu.com'},
            },
          ],
        },
        {
          key: 'sys:simpleIf',
          inputs: {condition: 'true'},
          ifSteps: [{key: 'sys:notify', inputs: {msg: '提示'}}],
        },
      ],
    },
  }}
  data={{
    steps: [
      {
        key: 'sys:getSelectedText',
        outputs: {output: 'selectedText', isSuccess: 'isSelected'},
      },
      {
        key: 'sys:if',
        inputs: {condition: '{isSelected}'},
        ifSteps: [
          {
            key: 'sys:openUrl',
            inputs: {url: '$$https://www.baidu.com/s?wd={selectedText}'},
          },
        ],
        elseSteps: [
          {
            key: 'sys:openUrl',
            inputs: {url: 'https://www.baidu.com'},
          },
        ],
      },
      {
        key: 'sys:simpleIf',
        inputs: {condition: 'true'},
        ifSteps: [],
      },
    ],
  }}
/>

## 参数说明

**如果**：要判断的条件。可以选布尔变量，或以 `$=` 开头写表达式。值为真时走「如果」分支。

### 用变量指定

在 **如果** 里直接选布尔变量。这些值通常来自其它模块的输出，例如 [获取选中的文本](/v2/xaction/modules/get_selected_text) 的 **是否成功**。

<ModuleParamPreview
  moduleKey="sys:if"
  focusKeys={['condition']}
  inputVars={{condition: 'isSelected'}}
/>

<ModuleParamPreview
  moduleKey="sys:getSelectedText"
  focusKeys={['isSuccess', 'output']}
  values={{stopIfFail: 'false'}}
  outputVars={{output: 'selectedText', isSuccess: 'isSelected'}}
/>

### 用表达式指定

在参数框里以 `$=` 开头写判断条件。更完整的写法见 [表达式](/v2/xaction/concepts/expression)。

#### 布尔表达式助手

需要写表达式时，可点输入框后面的铅笔图标，打开布尔表达式助手。

<ExpressionAssistPreview
  variable="count"
  operation="大于"
  paramTitle="比较值"
  paramValue="10"
/>

#### 常用判断语句

**数字**

| 判断 | 表达式 |
| --- | --- |
| 等于 | `$= {数字变量} == 3` |
| 不等于 | `$= {数字变量} != 3` |
| 大于 | `$= {数字变量} > 3` |
| 大于等于 | `$= {数字变量} >= 0` |
| 小于 | `$= {数字变量} < 0` |
| 在两个值之间 | `$= {数字变量} >= 0 && {数字变量} <= 100` |

**文本**

| 判断 | 表达式 |
| --- | --- |
| 为空 | `$= {文本变量} == ""`<br />或 `$= String.IsNullOrEmpty({文本变量})` |
| 不为空 | `$= {文本变量} != ""`<br />或 `$= !String.IsNullOrEmpty({文本变量})` |
| 等于指定内容 | `$= {文本变量} == "值"` |
| 包含指定内容 | `$= {文本变量}.Contains("值")` |
| 长度大于某个值 | `$= {文本变量}.Length > 10` |

**布尔**

| 判断 | 表达式 |
| --- | --- |
| 条件为假 | `$= !{布尔变量}`<br />或 `$= {布尔变量} == false` |

#### 组合多个条件

| 关系 | 表达式 | 含义 |
| --- | --- | --- |
| 并且（AND） | `$= 条件1 && 条件2 && 条件3` | 全部同时成立 |
| 或者（OR） | `$= 条件1 \|\| 条件2 \|\| 条件3` | 任意一个成立 |
| 取反 | `$= !条件` | 条件不成立 |
| 括号分组 | `$= (条件1 && 条件2) \|\| (条件3 && 条件4)` | 先算括号内，再组合 |
| 对组合取反 | `$= !(条件1 && 条件2)` | 两个条件中任一不成立，等价于 `$= !条件1 \|\| !条件2` |

## 输出

本模块没有输出参数。成立与否只决定走哪一组步骤。

## 多分支写法

### 类似 switch

按一个变量的不同取值分别执行时，可以用多个连续的「如果」。每个模块负责一个取值。

<StepProgramView
  caption="按选择项分别提示"
  data={{
    steps: [
      {
        key: 'sys:select',
        inputs: {
          type: 'single',
          prompt: '请选择',
          items: '百度\n谷歌\n有道',
        },
        outputs: {textValue: '选择的项'},
      },
      {
        key: 'sys:simpleIf',
        inputs: {condition: '$= {选择的项} == "百度"'},
        note: '如果选择了「百度」',
        ifSteps: [{key: 'sys:notify', inputs: {msg: '百度'}}],
      },
      {
        key: 'sys:simpleIf',
        inputs: {condition: '$= {选择的项} == "谷歌"'},
        note: '如果选择了「谷歌」',
        ifSteps: [{key: 'sys:notify', inputs: {msg: '谷歌'}}],
      },
      {
        key: 'sys:simpleIf',
        inputs: {condition: '$= {选择的项} == "有道"'},
        note: '如果选择了「有道」',
        ifSteps: [{key: 'sys:notify', inputs: {msg: '有道'}}],
      },
    ],
  }}
/>

### 类似 else if

@治钧分享的方法：[用「重复 1 次」包住多个「如果」](https://mp.weixin.qq.com/s/nR7n21i3gKOxARDgYj32SQ)。命中后用 [跳出循环](/v2/xaction/modules/break) 离开，最后一组相当于 else。

<StepProgramView
  caption="重复 1 次模拟 else if"
  data={{
    steps: [
      {
        key: 'sys:repeat',
        inputs: {count: '1', repeatDelayMs: '1'},
        ifSteps: [
          {
            key: 'sys:simpleIf',
            inputs: {condition: '$= {条件} == 1'},
            ifSteps: [
              {key: 'sys:notify', note: '一些步骤', inputs: {msg: '分支 1'}},
              {key: 'sys:break'},
            ],
          },
          {
            key: 'sys:simpleIf',
            inputs: {condition: '$= {条件} == 2'},
            ifSteps: [
              {key: 'sys:notify', note: '一些步骤', inputs: {msg: '分支 2'}},
              {key: 'sys:break'},
            ],
          },
          {
            key: 'sys:notify',
            note: '不满足所有条件情况下的一些步骤',
            inputs: {msg: '默认分支'},
          },
        ],
      },
    ],
  }}
/>

要点：

1. **重复次数**填 `1`。
2. 每个分支放进一个「如果」模块。
3. 这些「如果」并排放进「重复」里。
4. 所有「如果」后面放 else 部分；前面分支命中并 `break` 后不会跑到这里。
5. 每个分支命中后用「跳出循环」离开「重复」。

## 限制与排障

- **如果** 需要布尔结果。文本、数字请先写成表达式（如 `$= {文本} != ""`），不要直接拿非布尔变量当条件。
- 表达式必须以 `$=` 开头，否则会当成普通文本。
- 空结果不一定等于失败。例如获取选中文本失败时，把 **是否成功** 交给本模块判断。
- 「获取选中的文本」默认失败后中止动作；要走到「否则」分支时，请关掉该步骤的 **失败后停止**。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/simple-if',
      label: '如果',
      description: '只有「如果」分支，不成立就跳过。',
    },
    {
      href: '/v2/xaction/concepts/expression',
      label: '表达式',
      description: '`$=` 判断条件的完整写法。',
    },
    {
      href: '/v2/xaction/modules/get_selected_text',
      label: '获取选中的文本',
      description: '常用「是否成功」作为本模块的条件。',
    },
    {
      href: '/v2/xaction/modules/break',
      label: '跳出循环',
      description: '用「重复 1 次」模拟 else if 时，命中后离开。',
    },
  ]}
/>
