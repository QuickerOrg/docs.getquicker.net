---
title: "获取选中的文本"
description: "获取当前选中的文字；也可在开启选项后改用动作参数作为结果。"
slug: "/v2/xaction/modules/get_selected_text"
sidebar_label: "获取选中的文本"
sidebar_position: 50
quickerDocKey: "xaction/module/sys:getSelectedText"
comments: true
moduleKey: "sys:getSelectedText"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 1400233
legacyContentUpdatedAt: "2023-06-17T15:02:36.000Z"
---

# 获取选中的文本

获取当前窗口里选中的文字。同一个动作也可以在开启选项后，改用[动作参数](../../concepts/quicker_in_param.md)作为结果。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:getSelectedText" />

## 概述

默认向当前窗口发送 **Ctrl+C**，等剪贴板变化后再读取内容。也可以勾选 **尝试不通过剪贴板的方式获取**，改用 UI Automation（不改写剪贴板，但兼容性较差）。

<ModuleParamPreview
  moduleKey="sys:getSelectedText"
  outputVars={{output: 'text', isSuccess: 'ok'}}
/>

<StepProgramView
  data={{
    steps: [
      {
        key: 'sys:getSelectedText',
        outputs: {output: 'text', isSuccess: 'ok'},
      },
    ],
  }}
/>

## 输入参数

**文本数据格式**：从剪贴板读取哪一种格式。剪贴板里可能同时存有多种格式。

- **纯文本（默认）**
- **Rtf**
- **Html**
- **逗号分隔的值（csv）**

**等待剪贴板时间**：模拟 **Ctrl+C** 后，等待目标软件写入剪贴板的最长时间（毫秒）。默认 `250`。PDF 等软件或选区很大时，需要加大。

**去除前后的空白**：去掉结果两端的空白（包括空行）。

**失败后中止动作**：获取失败时是否停止后续步骤。默认开启。

**重试次数**：已过时，仅为兼容旧动作保留。新动作不必改这项。

### 不通过剪贴板获取

<ModuleParamPreview
  moduleKey="sys:getSelectedText"
  focusKeys={['tryNoClipboard']}
  values={{tryNoClipboard: 'true'}}
/>

**尝试不通过剪贴板的方式获取**：用 UI Automation 读取选区，不会污染剪贴板。已知限制：

- Word 里选中多个单元格时，往往拿不全
- Chrome 里有的位置会丢掉换行

### 使用动作参数

<ModuleParamPreview
  moduleKey="sys:getSelectedText"
  focusKeys={['useActionParam']}
  values={{useActionParam: 'true'}}
/>

**如果为动作传递了参数，使用参数值作为获取的结果**：动作参数非空时直接把它当作结果，不再去读选区；参数为空时仍按上面的方式获取选中文本。适合同一个动作既处理选中文字，又接受搜索框或其它调用传入的内容。说明见[为动作传递参数](../../concepts/quicker_in_param.md)。

## 输出参数

**内容**：获取到的文本。

**URL 编码的内容**：对内容做 URL 编码后的结果，便于拼进网址。

**来源网址**：从网页复制时，有时能带上页面地址。

**是否成功**：是否成功拿到文本。

**去除封装的 HTML**：仅当 **文本数据格式** 为 **Html** 时出现。剪贴板 HTML 里 `<!--StartFragment-->` 与 `<!--EndFragment-->` 之间的部分。

<ModuleParamPreview
  moduleKey="sys:getSelectedText"
  focusKeys={['format', 'cleanHtml']}
  values={{format: 'Html'}}
  outputVars={{cleanHtml: 'html', output: 'text'}}
/>

## 限制与排障

- 目标窗口要有焦点，并且支持 **Ctrl+C** 复制。部分网页（如百度文库）会禁止复制。
- 不要让安全软件拦截 Quicker 发送的按键。
- 默认靠剪贴板，可能覆盖用户原来的剪贴板内容；需要避免时再开 **尝试不通过剪贴板的方式获取**。
- 失败时步骤返回「获取选中文本失败了。请确认目标位置具有焦点并支持Ctrl+C复制。」
- 更多失败原因见旧版说明：[无法获取选中的文本](https://getquicker.net/kc/help/doc/cannot_get_selected_text)。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/guides/text-process',
      label: '文本的处理',
      description: '获取、处理和输出文本时常用的模块。',
    },
    {
      href: '/v2/xaction/modules/getclipboardtext',
      label: '读取剪贴板文本',
      description: '直接读剪贴板里的文本，不模拟 Ctrl+C。',
    },
    {
      href: '/v2/xaction/concepts/quicker_in_param',
      label: '为动作传递参数',
      description: '让同一动作既能处理选中文本，也能接收传入内容。',
    },
  ]}
/>

## 更改历史

- 1.5.7 增加 URL 编码结果输出。
- 1.8.0 增加读取动作参数。
- 1.38.21 增加不通过剪贴板的获取方式。
