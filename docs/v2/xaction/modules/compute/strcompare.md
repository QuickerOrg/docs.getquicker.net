---
title: "比较文本"
description: "文本比较"
slug: "/v2/xaction/modules/strcompare"
sidebar_label: "比较文本"
sidebar_position: 20
quickerDocKey: "xaction/module/sys:strCompare"
comments: true
moduleKey: "sys:strCompare"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-24 20:01:39"
legacyDocId: 2113504
legacyContentUpdatedAt: "2019-07-14T10:39:54.000Z"
---

# 比较文本

比较两段文本是否符合指定关系。要比数字大小用 [比较数字](/v2/xaction/modules/numcompare)。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:strCompare" />

## 概述

先选 **类型**，再填 **文本1**、**文本2**。结果是真或假，通常交给 [如果](/v2/xaction/modules/if)。

<ModuleParamPreview moduleKey="sys:strCompare" />

## 参数说明

**文本1**：被比较的文本。

**类型**：比较方式。点开下拉看当前全部选项。

| 类型 | 含义 |
| --- | --- |
| `>` / `=` / `<` | 按字母顺序比大小或是否相等 |
| 包含 | 文本1 是否包含文本2，如 `This is China` 包含 `China` |
| 以指定内容开始 | 文本1 是否以文本2 开头 |
| 以指定内容结束 | 文本1 是否以文本2 结尾 |
| 正则匹配 | 文本1 是否匹配文本2 里的正则 |
| 包含指定内容，或匹配拼音、拼音首字母 | 旧稿未写。文本2 可填汉字、拼音或首字母 |

**文本2**：对比文本。拼音匹配时也可填拼音、拼音首字母。

**区分大小写**：比较时是否区分大小写。默认关闭。类型为拼音匹配时不显示。

## 输出

- **值**：比较是否为真。

## 限制与排障

`>` / `<` 按当前区域的文本排序，不是按数字大小：`"12"` 会小于 `"2"`。要比数字请用 [比较数字](/v2/xaction/modules/numcompare)。正则写错会得到假，可先到 [正则提取](/v2/xaction/modules/regexextract) 试表达式。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/numcompare',
      label: '比较数字',
      description: '比数值大小。',
    },
    {
      href: '/v2/xaction/modules/if',
      label: '如果',
      description: '用比较结果走不同分支。',
    },
    {
      href: '/v2/xaction/modules/regexextract',
      label: '正则提取',
      description: '不只判断匹配，还要取出捕获组。',
    },
  ]}
/>
