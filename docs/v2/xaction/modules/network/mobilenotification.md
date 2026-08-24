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

模块面向 Remote 设置页中已经授权的 Android 设备，支持以下操作：

- **发送并等待响应**：发送通知，并等待用户点击按钮或提交文本回复；
- **异步发送**：发送后立即继续执行动作；
- **等待已有通知**：使用通知 ID 等待之前发送的通知；
- **撤销已有通知**：使用通知 ID 撤销通知。

发送时“通知 ID”可以留空，由 Quicker 自动生成；等待或撤销时必须填写已有通知 ID。最多可以配置三个按钮，每个按钮使用稳定 ID 供后续分支判断，也可以允许用户提交文本回复。

## 输出

“状态”表示通知当前状态；“点击按钮 ID”和“回复文本”用于处理用户响应。异步发送后，应保存输出的“通知 ID”，以便后续等待或撤销同一条通知。

## 当前限制

当前 `dev/v2` 中的手机通知运行实现仅在 Debug 构建启用，Release 构建会返回功能不可用。设备必须已授权且在线；等待操作也会受通知过期时间和动作取消影响。
