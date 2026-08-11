---
title: "跳出循环(break)"
description: "跳出循环（\"每个\" 或 \"重复\" 模块）"
slug: "/v2/xaction/modules/break"
sidebar_label: "跳出循环(break)"
sidebar_position: 60
quickerDocKey: "xaction/module/sys:break"
comments: true
moduleKey: "sys:break"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 2133164
legacyContentUpdatedAt: "2020-02-07T14:39:25.000Z"
---

# 跳出循环(break)

在[每个](/v2/xaction/modules/each)或[重复](/v2/xaction/modules/repeat)里，跳过后面的步骤并结束整个循环。相当于编程里的 `break`。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:break" />

## 概述

本模块没有参数。放到循环内部即可。例如要循环 100 次，第 10 次跳出，后面 90 次不会再跑。

只要跳过**这一次**、还要继续下一项，用[跳过后续步骤](/v2/xaction/modules/continue)。

<ModuleParamPreview moduleKey="sys:break" />

## 示例

列表有 6 项。循环里判断计数大于 2 时跳出，后面的项不再处理。

<StepProgramView
  caption="跳出循环"
  data={{
    steps: [
      {
        key: 'sys:comment',
        inputs: {note: '列表有 6 项；计数大于 2 时跳出循环'},
      },
      {
        key: 'sys:each',
        inputs: {input: 'list'},
        outputs: {item: 'item', count: 'count'},
        ifSteps: [
          {
            key: 'sys:if',
            inputs: {condition: '$= {count} > 2'},
            ifSteps: [
              {
                key: 'sys:notify',
                inputs: {msg: '计数大于 2，跳出循环'},
              },
              {key: 'sys:break'},
            ],
          },
          {
            key: 'sys:notify',
            inputs: {msg: '$$序号：{count}  值：{item}'},
          },
          {
            key: 'sys:delay',
            inputs: {delayMs: '1000'},
          },
        ],
      },
    ],
  }}
/>

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/continue',
      label: '跳过后续步骤',
      description: '只跳过本次，循环本身继续。',
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
