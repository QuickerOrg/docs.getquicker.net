---
title: 新增：发送手机通知模块
description: Quicker 2.x 新增发送手机通知模块，可向已授权的 Android 设备发送通知并接收按钮或文本回复。
sidebar_position: 10
quickerDocKey: v2/what's-new/xaction-steps/new-mobile-notification
comments: true
---

# 新增：发送手机通知模块

1.x 没有对应的组合动作模块。2.x 可以向 Remote 设置中已授权且在线的 Android 设备发送通知。

模块支持发送后等待响应、异步发送、等待已有通知和撤销通知。通知最多可以配置三个操作按钮，按钮也可以允许用户直接输入文字回复；动作可获得通知 ID、处理状态、所选按钮和回复文字，用来继续后续流程。

设备离线、授权失效或通知过期时不会无限等待。需要稍后等待或撤销同一条通知时，应保存发送时返回的通知 ID。
