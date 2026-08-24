---
title: "停止(return)"
description: "停止动作或从子程序中返回"
slug: "/v2/xaction/modules/stop"
sidebar_label: "停止(return)"
sidebar_position: 80
quickerDocKey: "xaction/module/sys:stop"
comments: true
moduleKey: "sys:stop"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-24 20:01:39"
legacyDocId: 2133611
legacyContentUpdatedAt: "2020-02-07T15:07:05.000Z"
---

# 停止(return)

立刻结束当前动作，或从[子程序](/v2/xaction/concepts/subprogram)返回。相当于编程里的 `return`。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:stop" />

## 概述

<ModuleParamPreview moduleKey="sys:stop" />

## 参数说明

**操作类型**：

- **默认：停止动作或从子程序返回**：在主程序里会停掉整个动作；在开启了「忽略错误」的[步骤组](/v2/xaction/modules/group)里，只跳过组内后面的步骤，从组后面继续；在子程序里则结束子程序、回到调用处。
- **停止动作：停止整个动作(即使在子程序中)**：无论在哪一层，都停掉整个动作。

**标记为出错**：用作子程序或被其他动作调用时，返回出错状态。调用方若开了「失败后停止」，当前动作也会停。

**返回值**：被其他动作调用时，作为动作结果传回去。从子程序返回且勾选了「标记为出错」时，这里通常是错误消息。

<PreviewCompare
  labels={['停止(return)', '运行或停止动作']}
  caption="被调用动作里「返回值」会出现在「动作输出」。勾选「标记为出错」时，这里通常是错误消息（需同时勾选等待运行结束）。"
>
  <ModuleParamPreview
    moduleKey="sys:stop"
    focusKeys={['isError', 'return']}
    values={{isError: 'true', return: '未找到目标'}}
  />
  <ModuleParamPreview
    moduleKey="sys:runAction"
    focusKeys={['wait', 'output']}
    values={{type: 'StartAction', actionId: 'tt2020', wait: 'true'}}
    outputVars={{output: 'actionResult'}}
  />
</PreviewCompare>

**提示消息**：停止时显示的提示信息。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/runaction',
      label: '运行或停止动作',
      description: '调用别的动作，并用「动作输出」接收这里的返回值。',
    },
    {
      href: '/v2/xaction/modules/group',
      label: '步骤组',
      description: '组内开了「忽略错误」时，默认停止不会中断组外步骤。',
    },
    {
      href: '/v2/xaction/concepts/subprogram',
      label: '子程序',
      description: '从子程序返回时用本模块。',
    },
  ]}
/>
