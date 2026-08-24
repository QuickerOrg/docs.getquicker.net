---
title: "组合成文本"
description: "将（多个）变量组合成一段文本。"
slug: "/v2/xaction/modules/formatstring"
sidebar_label: "组合成文本"
sidebar_position: 110
quickerDocKey: "xaction/module/sys:formatString"
comments: true
moduleKey: "sys:formatString"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-24 20:01:39"
legacyDocId: 1499448
legacyContentUpdatedAt: "2020-04-10T07:55:41.000Z"
---

# 组合成文本

把最多 5 个参数按模板拼成一段文本，数字和日期可指定格式。表达式里也可以直接写 `String.Format`。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:formatString" />

## 概述

语法是 C# 的 [String.Format](https://learn.microsoft.com/dotnet/api/system.string.format)。

<ModuleParamPreview
  moduleKey="sys:formatString"
  values={{
    formatString: '当前时间：{0:yyyy-MM-dd HH:mm:ss}\n选择的内容：{1}',
    p0: '{time}',
  }}
/>

## 参数说明

**格式化字符串**：模板。占位符 `{序号,对齐:格式}`，对齐和格式都可省略：

- `{1}`
- `{1,10}`：宽度 10，左侧补空格（右对齐）
- `{1:C3}`
- `{1,-10:C3}`：负宽度表示左侧对齐

例如模板 `你好，{0}!`，参数0 为 `Quicker`，结果是 `你好，Quicker!`。

**参数0**～**参数4**：对应 `{0}`～`{4}`。

## 输出

- **结果**：拼好的文本。

## 对齐

`{序号,宽度}`：正宽度在左侧补空格（右对齐），负宽度在右侧补空格（左对齐）。`{0,10}` 和 `{1,-10}` 分别让内容靠右、靠左。

## 数字与日期格式

数字常用：`C` 货币、`D` 十进制（Quicker 里数字是 decimal，`D` 往往不适用）、`E` 指数、`F` 定点、`G` 常规、`N` 数字、`P` 百分比。

完整列表见微软文档：[标准数字](https://learn.microsoft.com/dotnet/standard/base-types/standard-numeric-format-strings)、[自定义数字](https://learn.microsoft.com/dotnet/standard/base-types/custom-numeric-format-strings)、[标准日期](https://learn.microsoft.com/dotnet/standard/base-types/standard-date-and-time-format-strings)、[自定义日期](https://learn.microsoft.com/dotnet/standard/base-types/custom-date-and-time-format-strings)。

## 限制与排障

序号必须对应已填的参数，否则会失败。需要超过 5 个槽位时，用表达式 `String.Format` 或先拼中间变量。

## 示例动作

<StepProgramView example="345b395f-8f0a-4f35-a01f-08d7636fd69a" />

<ShareLinkCard
  items={[
    {
      code: '345b395f-8f0a-4f35-a01f-08d7636fd69a',
      title: '示例: 格式化数字',
      description: '数字格式指令一览',
      author: 'CL',
    },
    {
      code: 'f6fc9c05-7b95-40f7-b326-08d6756598a8',
      title: '格式化数字',
      description: '格式化选中的数字',
    },
  ]}
/>

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/joinlist',
      label: '列表合并成文本',
      description: '列表项之间插入同一分隔符。',
    },
    {
      href: '/v2/xaction/modules/stringprocess',
      label: '文本处理',
      description: '截取、补齐、环境变量。',
    },
  ]}
/>
