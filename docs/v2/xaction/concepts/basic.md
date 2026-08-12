---
title: "模块和步骤"
description: "步骤对应模块；输入可绑变量、写固定值，或用 $$ / $= ；输出写入变量。"
slug: "/v2/xaction/concepts/basic"
sidebar_position: 30
quickerDocKey: "xaction/concepts/basic"
comments: true
docStatus: reviewed
legacyDocId: 1402268
legacyContentUpdatedAt: "2024-01-07T02:36:12.000Z"
---

# 模块和步骤

组合动作由一串步骤组成。每一步调用一个模块：从变量或固定值取出输入，处理后把结果写回变量。

从左侧工具箱把模块拖进步骤列表即可添加。完整窗口见 [动作编辑器](/v2/xaction/concepts/xaction-editor)。中间步骤区示意：

<StepProgramView
  data={{
    steps: [
      {
        key: 'sys:getSelectedText',
        outputs: {output: 'selectedText', isSuccess: 'selectSuccess'},
      },
      {
        key: 'sys:if',
        inputs: {condition: '{selectSuccess}'},
        ifSteps: [
          {
            key: 'sys:openUrl',
            inputs: {url: '$$https://www.google.com/search?q={selectedText}'},
          },
        ],
        elseSteps: [
          {key: 'sys:openUrl', inputs: {url: 'https://www.google.com'}},
        ],
      },
    ],
  }}
/>

## 模块

下面这个「文本处理」把待处理内容转成大写，结果写入 `context`。

<ModuleParamPreview
  moduleKey="sys:stringProcess"
  inputVars={{data: 'selectedText'}}
  values={{method: 'toUpper'}}
  outputVars={{output: 'context'}}
  focusKeys={['data', 'method', 'output']}
/>

## 输入参数

输入可以用变量，也可以写固定值、插值或表达式。

**使用变量**：在参数的变量下拉里选一个已有变量。

<ModuleParamPreview
  moduleKey="sys:stringProcess"
  inputVars={{data: 'context'}}
  values={{method: 'toUpper'}}
  focusKeys={['data']}
/>

**固定值 / 插值 / 表达式**：在变量下拉里选「固定值或使用插值、表达式」（旧版叫「不使用变量」），下面出现输入框：

- 直接写要赋给参数的内容。
- 以 `$$` 开头：[文本插值](/v2/xaction/concepts/interpolation)。
- 以 `$=` 开头：[表达式](/v2/xaction/concepts/expression)。

切换这三种写法见 [选择或输入步骤参数](/v2/xaction/concepts/edit-step-param)。

输入框还支持：

- 右键 **在编辑器中修改**：弹出代码窗，适合较长内容。
- 右键 **在外部编辑器中修改**：写入临时文件，用第三方编辑器改。第一行用注释加扩展名（如 `//.js`、`//.cs`、`##.ps1`），方便系统选编辑器和语法高亮。
- 扩展菜单：**插入变量**，以及选取内容的文本工具。

## 输出

一步可能有多个输出，只把要用的写入变量即可。

<ModuleParamPreview
  moduleKey="sys:getSelectedText"
  outputVars={{output: 'selectedText', isSuccess: 'selectSuccess'}}
  focusKeys={['output', 'isSuccess']}
/>

## 限制与排障

步骤失败时，后面的输出是否仍会写入变量并不固定：有的会改掉变量，有的保持原值。后续还要读这些变量时，先用 [赋值](/v2/xaction/modules/assign) 给一个明确初值，并判断「是否成功」。

例如循环找图：循环开头把 `point` 赋成空字符串，避免沿用上一轮找到的点。

<StepProgramView
  data={{
    steps: [
      {
        key: 'sys:repeat',
        inputs: {count: '10'},
        ifSteps: [
          {key: 'sys:assign', inputs: {input: ''}, outputs: {output: 'point'}},
          {
            key: 'sys:searchBmp',
            outputs: {firstPoint: 'point', isSuccess: 'found'},
          },
          {
            key: 'sys:if',
            inputs: {condition: '{found}'},
            ifSteps: [{key: 'sys:break'}],
          },
        ],
      },
    ],
  }}
/>

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/concepts/xaction-editor',
      label: '动作编辑器的使用',
      description: '工具箱、步骤列表和保存',
    },
    {
      href: '/v2/xaction/concepts/edit-step-param',
      label: '选择或输入步骤参数',
      description: 'F1 切换原始值、插值和表达式',
    },
    {
      href: '/v2/xaction/concepts/interpolation',
      label: '文本插值',
      description: '$$ 把变量嵌进文本',
    },
    {
      href: '/v2/xaction/concepts/expression',
      label: '表达式',
      description: '$= 做计算和判断',
    },
    {
      href: '/v2/xaction/modules/stringprocess',
      label: '文本处理',
      description: '上例转大写用的模块',
    },
  ]}
/>
