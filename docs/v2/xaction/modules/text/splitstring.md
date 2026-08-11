---
title: "拆分文本为列表"
description: "按分隔符把一段文本拆成列表，再交给「每个」逐项处理。"
slug: "/v2/xaction/modules/splitstring"
sidebar_label: "拆分文本为列表"
sidebar_position: 10
quickerDocKey: "xaction/module/sys:splitString"
comments: true
moduleKey: "sys:splitString"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 2113554
legacyContentUpdatedAt: "2022-12-29T05:29:28.000Z"
---

# 拆分文本为列表

把一段文本按分隔符拆成列表。拼回去用 [列表合并成文本](/v2/xaction/modules/joinlist)；拆完逐项处理用 [循环：每个](/v2/xaction/modules/each)。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:splitString" />

## 概述

例如把多行路径拆开，列表每一项是一条路径。`AAA;BBB;CCC;` 用 `;` 拆，得到 `AAA`、`BBB`、`CCC`（开启滤除空值时末尾空项会丢掉）。

<ModuleParamPreview moduleKey="sys:splitString" />

## 参数说明

**输入**：要拆的文本。

**分隔**：按什么切开，默认 `,`。拆多行时可以：

- 在分隔里直接回车；
- 填 `\r\n` 并勾选 **转义分隔符**。

Windows 常见 `\r\n`，也有环境只有 `\n`。拆不开就换一种，或只用 `\n`。

**转义分隔符**：把分隔里的 `\r`、`\n`、`\t` 当成对应字符。默认关闭。

**使用多个分隔符拆分列表**：开启后每行一个分隔符。旧稿未写，当前模块已提供。

**滤除空值**：拆出空项时是否丢掉。默认开启。

## 输出

- **结果**：拆好的文本列表。

## 限制与排障

拆多行失败时，先确认实际换行是 `\r\n` 还是 `\n`，必要时打开转义后再试。

## 示例动作

<StepProgramView example="d59d0507-ad21-4783-a83a-08d6d0f9e36e" />

<ShareLinkCard
  code="d59d0507-ad21-4783-a83a-08d6d0f9e36e"
  title="排序多行"
  description="拆成列表后再排序"
  author="CL"
/>

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/joinlist',
      label: '列表合并成文本',
      description: '本模块的反向操作。',
    },
    {
      href: '/v2/xaction/modules/each',
      label: '循环：每个',
      description: '对拆出的每一项做后续步骤。',
    },
    {
      href: '/v2/xaction/modules/stringprocess',
      label: '文本处理',
      description: '排序多行、去空行等。',
    },
  ]}
/>
