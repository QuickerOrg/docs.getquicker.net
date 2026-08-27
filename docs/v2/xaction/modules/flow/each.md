---
title: "每个"
description: "对列表的每项执行处理"
slug: "/v2/xaction/modules/each"
sidebar_label: "每个"
sidebar_position: 30
quickerDocKey: "xaction/module/sys:each"
comments: true
moduleKey: "sys:each"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-24 20:01:39"
legacyDocId: 2132965
legacyContentUpdatedAt: "2023-08-27T23:42:55.000Z"
---

# 每个

按列表逐项执行内部步骤。按次数循环请用[重复](/v2/xaction/modules/repeat)。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:each" />

## 概述

把要处理的列表交给本模块，再把处理步骤拖进循环槽。每次循环会更新「项」和「计数」。

<ModuleParamPreview moduleKey="sys:each" />

<BilibiliPlayer
  bvid="BV1ty4y1S7AK"
  title="在组合动作中使用循环"
  caption="演示视频：在组合动作中使用循环"
/>

## 参数说明

**列表**：要逐项处理的列表。

**线程模式**：默认 **单线程（顺序执行）**。**多线程（同时执行）** 请先读下面的限制，通常不要选。

**线程启动间隔**：仅多线程。每个线程之间的启动间隔，单位毫秒，默认 `5`。

**同时线程数**：仅多线程。最多同时启动的线程数，默认 `4`。按电脑和任务调整。

**超时毫秒数**：仅多线程。所有线程开启后的等待超时。`-1` 表示不超时。

**WaitAny模式**：仅多线程。任意一个线程结束即可继续后面的步骤。

**WaitAny模式下自动取消其它分支**：仅多线程。启用 WaitAny 时，任一分支完成后请求取消其它未完成分支，并阻止其执行后续步骤。取消是协作式的，不保证立刻停掉正在跑的步骤。

**为线程创建独立上下文**：仅多线程。每个线程有自己的上下文：

- 「项」和「计数」在各线程里都是当时那一项的值。
- 文本、数字等值类型读写的是该线程的副本，不会写回动作变量。
- 词典、列表等按引用传递的对象，改内容会作用到整个动作。
- 此时只能读取变量，不能更新变量（词典、列表等引用传递的除外）。

**进度条标题**：仅单线程。填写后循环过程中显示进度条，标题为此值。

**失败后停止**：失败后是否停止动作。默认开启。

## 输出

每次循环都会更新这些输出，循环内部取到的是**这一项**的值。

- **是否成功**：操作是否成功。
- **项**：当前列表元素。在子步骤里处理这一项。
- **计数**：本次处理到了第几项。

## 限制与排障

多线程时不要同时改同一个变量，否则会冲突。同步执行时调试 log 会关掉，避免格式错乱。停止动作、跳出循环等跳转在多线程里可能失效，需要实测。其它潜在问题也请多测。

未开独立上下文时，子步骤应马上读出「项」；间隔过后循环会改写同一个变量。

## 示例动作

<StepProgramView example="d5470b3f-cae1-4388-75b8-08d709af9122" />

<ShareLinkCard
  items={[
    {
      code: 'd5470b3f-cae1-4388-75b8-08d709af9122',
      title: '示例：每个',
      description: '对列表里的每项进行显示并等待1s',
      author: 'CL',
    },
    {
      code: '1aefbbd1-cca2-42e6-c4e0-08d7f7cf8b53',
      title: '多线程测试',
      description: '步骤组和每个模块的多线程选项',
      author: 'CL',
    },
  ]}
/>

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/repeat',
      label: '重复',
      description: '按次数或条件循环，不是按列表。',
    },
    {
      href: '/v2/xaction/modules/break',
      label: '跳出循环',
      description: '结束整个循环。',
    },
    {
      href: '/v2/xaction/modules/continue',
      label: '跳过后续步骤',
      description: '只跳过本次，继续下一项。',
    },
  ]}
/>

## 更新历史

- 1.7.4 增加多线程。
- 1.39.11 / 20230828 增加「为线程创建独立上下文」。
