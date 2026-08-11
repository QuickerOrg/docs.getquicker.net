---
title: "列表合并成文本"
description: "把列表各项拼成一段文本，中间可插入分隔符。"
slug: "/v2/xaction/modules/joinlist"
sidebar_label: "列表合并成文本"
sidebar_position: 40
quickerDocKey: "xaction/module/sys:joinList"
comments: true
moduleKey: "sys:joinList"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 2113748
legacyContentUpdatedAt: "2020-04-02T03:01:27.000Z"
---

# 列表合并成文本

把列表里的各项拼成一段文本。要把一段文本拆回列表，用 [拆分文本为列表](/v2/xaction/modules/splitstring)。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:joinList" />

## 概述

列表 `AAA`、`BBB`、`CCC`，分隔文本为 `，`，结果是 `AAA，BBB，CCC`。要每项一行，分隔文本里直接回车即可。

<ModuleParamPreview moduleKey="sys:joinList" />

## 参数说明

**输入**：要拼接的列表。

**分隔文本**：两项中间插入的内容，默认 `,`。

**转义“分隔文本”**：把分隔文本里的 `\r`、`\n`、`\t` 当成换行和 Tab。默认关闭。

## 输出

- **结果**：拼接后的文本。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/splitstring',
      label: '拆分文本为列表',
      description: '本模块的反向操作。',
    },
    {
      href: '/v2/xaction/modules/each',
      label: '循环：每个',
      description: '拆开之后逐项处理。',
    },
  ]}
/>

## 更新历史

- 1.5.7 增加「转义“分隔文本”」参数。
