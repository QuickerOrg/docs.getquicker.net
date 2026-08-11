---
title: "生成随机数"
description: "在最小值（含）和最大值（不含）之间生成一个整数。"
slug: "/v2/xaction/modules/randomnum"
sidebar_label: "生成随机数"
sidebar_position: 110
quickerDocKey: "xaction/module/sys:randomNum"
comments: true
moduleKey: "sys:randomNum"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 2132854
legacyContentUpdatedAt: "2019-07-17T00:48:53.000Z"
---

# 生成随机数

生成一个随机整数。要唯一 ID 请用 [生成Guid](/v2/xaction/modules/newguid)。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:randomNum" />

## 概述

范围是：最小值 ≤ 随机数 ＜ 最大值。默认 0 到 100，也就是 0～99。

<ModuleParamPreview moduleKey="sys:randomNum" />

## 参数说明

**最小值**：下界，结果可以等于它。默认 `0`。

**最大值**：上界，结果小于它。默认 `100`。

## 输出

- **随机数**：生成的整数。

## 限制与排障

最大值必须大于最小值，否则步骤会失败。这是均匀整数，不是密码学安全随机数。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/newguid',
      label: '生成Guid',
      description: '需要全局唯一文本 ID 时用这个。',
    },
    {
      href: '/v2/xaction/modules/compute',
      label: '计算',
      description: '随机数还要再做运算或判断。',
    },
  ]}
/>
