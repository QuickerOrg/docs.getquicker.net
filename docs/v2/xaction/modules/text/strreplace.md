---
title: "替换文本"
description: "替换文本中的指定内容"
slug: "/v2/xaction/modules/strreplace"
sidebar_label: "替换文本"
sidebar_position: 60
quickerDocKey: "xaction/module/sys:strReplace"
comments: true
moduleKey: "sys:strReplace"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-24 20:01:39"
legacyDocId: 2114156
legacyContentUpdatedAt: "2024-06-05T02:30:46.000Z"
---

# 替换文本

把文本里的指定内容换成别的。一种内容用普通模式；一次换多种用批量模式。只要截取、去空白、编解码，用 [文本处理](/v2/xaction/modules/stringprocess)。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:strReplace" />

## 概述

<ModuleParamPreview moduleKey="sys:strReplace" />

## 参数说明

**操作类型**：

- **普通（替换一种内容）**：用下面的查找 / 替换为一对。
- **批量（替换多种内容）**：用查找和替换内容，每行一对。

<ModuleParamPreview
  moduleKey="sys:strReplace"
  focusKeys={['type', 'old', 'new', 'batchReplaceData']}
  values={{type: 'single'}}
/>

**输入**：要改的原文。

**查找内容** / **替换为**：仅普通模式。

**查找和替换内容**：仅批量模式。每行一对，用 `|` 或 `|||` 分开（内容里本身有竖线时用三个）。也可以在首行写 `|=分隔符` 自定义分隔（1.5.20+）。

```text
a|A
b|B
cc|||CC|CC
```

会把 `a`→`A`、`b`→`B`、`cc`→`CC|CC`。

**转义“查找内容”**：把查找内容里的 `\r` `\n` `\t` 当成对应字符。开了 **使用正则替换** 时不要勾，正则自己会处理 `\`。

**转义“替换为”**：对替换为做同样转义。默认开启。

**使用正则替换**：查找内容按正则写。

开启正则后可用：

- **忽略大小写**
- **正则：单行**：`.` 也能匹配换行。默认开启。
- **正则：多行**：`^` / `$` 匹配行首行尾。

## 输出

- **结果**：替换后的文本。旧稿未写输出项。

## 限制与排障

正则和「转义查找内容」不要一起开，会双重转义。批量分隔符和要替换的竖线冲突时，改用 `|||` 或首行自定义分隔。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/regexextract',
      label: '正则提取',
      description: '只要取出匹配，不替换。',
    },
    {
      href: '/v2/xaction/modules/stringprocess',
      label: '文本处理',
      description: '截取、去空白、编解码。',
    },
  ]}
/>

## 更新历史

- 1.1.33 增加批量替换。
