---
title: "重复"
description: "循环指定的次数，或符合某个条件时中止"
slug: "/v2/xaction/modules/repeat"
sidebar_label: "重复"
sidebar_position: 150
quickerDocKey: "xaction/module/sys:repeat"
comments: true
moduleKey: "sys:repeat"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 2134056
legacyContentUpdatedAt: "2023-06-23T14:05:51.000Z"
---

# 重复

按指定次数循环，或在条件成立时提前结束。按列表逐项请用[每个](/v2/xaction/modules/each)。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:repeat" />

## 概述

把要重复的步骤拖进循环槽。循环间隔不要设成 0，除非内部另有等待，否则会占满 CPU。事先设好「停止运行中的动作」快捷键，避免无限循环停不下来。

<PreviewMarks
  marks={[
    {key: 'count', label: '循环次数，-1 表示永久循环'},
    {key: 'stopCondition', label: '可选，成立则中止'},
  ]}
>
  <ModuleParamPreview
    moduleKey="sys:repeat"
    values={{
      count: '-1',
      stopCondition: '$={选择内容} == "退出"',
      startIndex: '0',
    }}
  />
</PreviewMarks>

演示视频：[在组合动作中使用循环](https://www.bilibili.com/video/BV1ty4y1S7AK)

## 参数说明

**次数**：重复次数。除非符合中止条件提前结束。`-1` 表示无限循环。

**计数开始值**：计数序号的起始值，通常为 `0`。若要按日常习惯显示「第几次」，可改成 `1`。

**中止条件**：选填。每次循环开始时检查，成立则停止。也可在循环里用[跳出循环](/v2/xaction/modules/break)。表达式写法见[如果/否则](/v2/xaction/modules/if)。

**循环间隔时间**：两次循环之间的间隔毫秒数，默认 `1`。设为 `0` 时，请确保循环内部有其它等待步骤。

**进度条标题**：填写后循环过程中显示进度条，标题为此值。

## 输出

- **计数**：当前是第几次循环，从「计数开始值」起算。

## 设置要重复的内容

将需要重复执行的步骤拖放到「重复」中间的槽里。

![](./img/repeat-003-9990394c7d.gif)

## 停止循环中的动作

循环时间较长时，可以用下面两种方式中途停掉：

- 在 **Quicker 设置 → 功能快捷键** 里设置「停止运行中的动作」，需要时按下。
- 在托盘右键菜单中停止运行中的动作。

![](./img/repeat-002-9644e73781.png)

## 示例动作

<StepProgramView example="d9eb6be1-6185-4d6e-8459-08db738638c3" />

<ShareLinkCard
  code="d9eb6be1-6185-4d6e-8459-08db738638c3"
  title="重复示例"
  description="重复方式输出列表内容"
  author="CL"
/>

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/each',
      label: '每个',
      description: '按列表逐项，而不是按次数。',
    },
    {
      href: '/v2/xaction/modules/break',
      label: '跳出循环',
      description: '在循环内部提前结束。',
    },
    {
      href: '/v2/xaction/modules/delay',
      label: '等待时间',
      description: '间隔设为 0 时，内部应另有等待。',
    },
  ]}
/>

## 更新历史

- 1.1.1 重复次数为 0 时为无限循环。
- 1.1.2 改为 `-1` 表示无限循环。
