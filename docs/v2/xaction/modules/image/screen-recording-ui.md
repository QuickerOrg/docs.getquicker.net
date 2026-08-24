---
title: "屏幕录制"
description: "弹出选区 UI 让用户框选录制范围，打开录屏工具栏进行可视化录制，录完后返回文件路径。"
slug: "/v2/xaction/modules/screen-recording-ui"
sidebar_label: "屏幕录制"
sidebar_position: 60
quickerDocKey: "xaction/module/sys:screenRecordingUI"
comments: true
moduleKey: "sys:screenRecordingUI"
docStatus: "generated"
metadataGeneratedAt: "2026-08-24 20:01:39"
---

# 屏幕录制

弹出选区界面，让用户框出录制范围，再打开录屏工具栏可视化录制。录完返回文件路径。不要选区、要在动作里控制生命周期时，用 [后台屏幕录制](/v2/xaction/modules/screen-recording)。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:screenRecordingUI" />

## 概述

选区操作与「屏幕截图」相近。完整界面说明见下面的入口；本页只写本模块自己的参数。

<RelatedDocs
  layout="cards"
  items={[
    {
      href: '/v2/features/screenshot/capture-pro',
      label: '截图 Pro 功能说明',
      description: '同一套选区界面里也可以进入录屏。',
      featured: true,
    },
    {
      href: '/v2/features/screenshot',
      label: '截图与贴图概览',
      description: '录屏历史与相关功能入口。',
    },
  ]}
/>

<ModuleParamPreview moduleKey="sys:screenRecordingUI" />

## 参数说明

**开始前延迟**：等多少毫秒再弹出选区。

**手动调整选区**：默认关闭：框选完就确认并开录。打开后可以先改选区，再确认开录。

**加入录屏历史**：打开后把成品复制到本机录屏历史。默认关闭，以免旧动作的文件生命周期被改掉。

**失败后停止**：失败或取消是否中止动作。默认开启。

## 输出

- **是否成功**：是否录完。
- **文件路径**：视频路径；用户取消时为空。
- **录制时长**：秒。
- **录制区域**：实际录到的范围，格式 `left,top,right,bottom`。
- **错误消息**：失败时的说明。

## 相关步骤

<RelatedDocs
  layout="cards"
  items={[
    {
      href: '/v2/xaction/modules/screen-recording',
      label: '后台屏幕录制',
      description: '无选区界面，用会话 ID 跨步骤控制。',
    },
    {
      href: '/v2/xaction/modules/screen-capture-pro',
      label: '截图 Pro',
      description: '选区界面里也可以进入录屏。',
    },
    {
      href: '/v2/xaction/modules/screencapture',
      label: '屏幕截图',
      description: '只要一张静图。',
    },
  ]}
/>
