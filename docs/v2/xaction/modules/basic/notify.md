---
title: "提示消息"
description: "显示可以自动消失的消息提示。"
slug: "/v2/xaction/modules/notify"
sidebar_label: "提示消息"
sidebar_position: 90
quickerDocKey: "xaction/module/sys:notify"
comments: true
moduleKey: "sys:notify"
docStatus: "migrated-unreviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 1530071
legacyContentUpdatedAt: "2022-07-01T09:39:34.000Z"
---

# 提示消息

显示可以自动消失的消息提示。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:notify" />

## 概述

提示消息用于显示可以自动隐藏的提示信息。显示在桌面的中部下方位置。

<NotifyToastPreview message="你好，感谢你使用Quicker!" />

## 参数说明

<ModuleParamPreview moduleKey="sys:notify" />

【消息内容】：要显示的文字。

【最大行数】：最大显示的文字行数（以换行字符为准）。

【类型】可选信息、成功、告警、错误等，会使用不同的颜色来显示提示。

【点击命令】

点击后执行的命令。需要可以在Win+R打开的窗口中可以正常执行。一般可用于打开网址。

未设置时，会**自动复制消息内容**。

【风格】

默认风格：显示在屏幕底部。

<NotifyToastPreview
  message={"Hello Quicker!\nHello Quicker!\n..."}
  maxLines={3}
/>

风格2：显示在屏幕右上角。

<NotifyToastPreview
  styleVariant="card"
  message={"Hello Quicker!Hello Quicker!Hello Quicker!\nHello Quicker!Hello Quicker!Hello Quicker!\nHello Quicker!\n..."}
  maxLines={4}
/>

## 注意

由于提示消息组件未知错误，有可能造成一定条件下不显示提示消息，重启quicker后可恢复。

为带来的不便表示歉意，查明原因后将修复这个问题。
