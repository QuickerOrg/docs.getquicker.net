---
title: "跳出循环(break)"
description: "跳出循环（\"每个\" 或 \"重复\" 模块）"
slug: "/v2/xaction/modules/break"
sidebar_label: "跳出循环(break)"
sidebar_position: 60
quickerDocKey: "xaction/module/sys:break"
comments: true
moduleKey: "sys:break"
docStatus: "migrated-unreviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 2133164
legacyContentUpdatedAt: "2020-02-07T14:39:25.000Z"
---

# 跳出循环(break)

跳出循环（"每个" 或 "重复" 模块）

## 当前模块定义

<XActionModuleMeta moduleKey="sys:break" />

在循环模块（如“[每个](/v2/xaction/modules/each)”，“[重复](/v2/xaction/modules/repeat)”等）中，**跳过后面的步骤** 并 **结束循环**。

类似于编程语言中的**break**语句。

如：总共需要循环 100 次，在第 10 次时跳出循环，则后面的 90 次不会再执行。

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
