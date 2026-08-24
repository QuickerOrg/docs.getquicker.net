---
title: "比较数字"
description: "比较数字大小。"
slug: "/v2/xaction/modules/numcompare"
sidebar_label: "比较数字"
sidebar_position: 10
quickerDocKey: "xaction/module/sys:numCompare"
comments: true
moduleKey: "sys:numCompare"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-24 20:01:39"
legacyDocId: 2131885
legacyContentUpdatedAt: "2019-07-16T13:50:22.000Z"
---

# 比较数字

比较两个数字的大小，结果是真或假。分支里也可以直接在 [如果](/v2/xaction/modules/if) 的条件框写表达式，不必单独加这一步。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:numCompare" />

## 概述

例如数字 1 为 `5`、数字 2 为 `6`：选 `<` 得到真，选 `=` 得到假。

<ModuleParamPreview moduleKey="sys:numCompare" />

## 参数说明

**数字1**：左侧的数字。

**类型**：比较方式。点开下拉看当前全部选项：`>`、`>=`、`=`、`<`、`<=`。

<ModuleParamPreview
  moduleKey="sys:numCompare"
  focusKeys={['type']}
/>

**数字2**：右侧的数字。

## 输出

- **值**：比较是否为真。

## 限制与排障

两边都要是数字。文本里夹了单位或空格会失败，先用 [数字转换与处理](/v2/xaction/modules/numberprocess) 或 [计算](/v2/xaction/modules/compute) 转成数字。要比文本用 [比较文本](/v2/xaction/modules/strcompare)。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/strcompare',
      label: '比较文本',
      description: '比包含、开头、正则，不是比大小。',
    },
    {
      href: '/v2/xaction/modules/if',
      label: '如果',
      description: '用比较结果走不同分支。',
    },
    {
      href: '/v2/xaction/modules/compute',
      label: '计算',
      description: '条件里直接写 `a > 5 and a < 20`。',
    },
  ]}
/>
