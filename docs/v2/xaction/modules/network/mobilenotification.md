---
title: "发送手机通知"
description: "向已授权并在线的 Android 设备发送可响应通知。"
slug: "/v2/xaction/modules/mobilenotification"
sidebar_label: "发送手机通知"
sidebar_position: 30
quickerDocKey: "xaction/module/sys:mobileNotification"
comments: true
moduleKey: "sys:mobileNotification"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-24 20:01:39"
---

# 发送手机通知

向已授权并在线的 Android 设备发送可响应通知。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:mobileNotification" />

## 使用方式

:::warning[仅用于维护已有动作]
动作编辑器已隐藏“发送手机通知”的新建入口。本页供检查旧动作和理解已有步骤；不要按下文为新动作添加此模块。
:::

模块面向 Remote 设置页中已经授权的 Android 设备，支持以下操作：

- **发送并等待响应**：发送通知，并等待用户点击按钮或提交文本回复；
- **异步发送**：发送后立即继续执行动作；
- **等待已有通知**：使用通知 ID 等待之前发送的通知；
- **撤销已有通知**：使用通知 ID 撤销通知。

发送时“通知 ID”可以留空，由 Quicker 自动生成；等待或撤销时必须填写已有通知 ID。最多可以配置三个按钮，每个按钮使用稳定 ID 供后续分支判断，也可以允许用户提交文本回复。

## 输出

“状态”表示通知当前状态；“点击按钮 ID”和“回复文本”用于处理用户响应。异步发送后，应保存输出的“通知 ID”，以便后续等待或撤销同一条通知。

## 当前限制

手机通知运行实现仅在 Debug 构建启用，Release 构建会返回功能不可用。设备必须已授权且在线；等待操作也会受通知过期时间和动作取消影响。

## 历史版本相关变化

以下为与本页相关的重要变化，当前用法以正文为准。

- [2.3.17](/release-notes#2317--问问-ai场景合并与截图)：隐藏发送手机通知的新建入口，保留旧动作说明。

更早记录与完整修复列表见[更新记录](/release-notes)。
