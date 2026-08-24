---
title: "跳过后续步骤(continue)"
description: "跳过后续步骤（循环内部），开始下一次循环。在循环内部使用。"
slug: "/v2/xaction/modules/continue"
sidebar_label: "跳过后续步骤(continue)"
sidebar_position: 70
quickerDocKey: "xaction/module/sys:continue"
comments: true
moduleKey: "sys:continue"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-24 20:01:39"
legacyDocId: 2133453
legacyContentUpdatedAt: "2020-02-07T14:40:01.000Z"
---

# 跳过后续步骤(continue)

在循环内部跳过本次剩下的步骤，直接进入下一项。相当于编程里的 `continue`。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:continue" />

## 概述

本模块没有参数。必须放在[每个](/v2/xaction/modules/each)或[重复](/v2/xaction/modules/repeat)里面。

和[跳出循环](/v2/xaction/modules/break)的区别：

- **跳出循环**：整个循环结束，后面的项不再处理。
- **跳过后续步骤**：循环不结束，只跳过本次后面的步骤。

<ModuleParamPreview moduleKey="sys:continue" />

## 示例动作

<StepProgramView example="d0464310-2558-4595-75ba-08d709af9122" />

<ShareLinkCard
  code="d0464310-2558-4595-75ba-08d709af9122"
  title="示例：跳过后续步骤"
  description="符合条件时跳过循环中的后续步骤"
  author="CL"
/>

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/break',
      label: '跳出循环',
      description: '结束整个循环，不再处理后面的项。',
    },
    {
      href: '/v2/xaction/modules/each',
      label: '每个',
      description: '按列表逐项循环。',
    },
    {
      href: '/v2/xaction/modules/repeat',
      label: '重复',
      description: '按次数或条件循环。',
    },
  ]}
/>
