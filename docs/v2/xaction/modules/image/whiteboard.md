---
title: "手写板"
description: "手写内容，生成图片对象。"
slug: "/v2/xaction/modules/whiteboard"
sidebar_label: "手写板"
sidebar_position: 100
quickerDocKey: "xaction/module/sys:whiteboard"
comments: true
moduleKey: "sys:whiteboard"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-24 20:01:39"
legacyDocId: 12799039
legacyContentUpdatedAt: "2023-05-24T12:42:58.000Z"
---

# 手写板

弹出一块绘图板，手写或勾画后得到图片对象。1.10.8 起提供。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:whiteboard" />

## 概述

运行态是独立绘图窗口，本页不另做预览组件。画完后可用 [显示图片](/v2/xaction/modules/showimage) 贴到屏幕上，或用 [写入图片文件](/v2/xaction/modules/writeimagefile) 落盘。

<ModuleParamPreview
  moduleKey="sys:whiteboard"
  values={{
    winPosition: '15%,30%,85%,70%',
    bgColor: '#FFFFFFFF',
    penColor: '#FFFF0000',
    enableTransparent: 'false',
    imageWithBackground: 'false',
    stopIfFail: 'true',
  }}
  outputVars={{result: 'img'}}
/>

## 参数说明

**窗口位置**：绘图窗口位置，格式 `left,top,right,bottom`。可用像素，也可用相对屏幕宽高的百分比。默认 `15%,30%,85%,70%`。

**绘图区背景颜色**：格式 `#AARRGGBB`。AA 控制透明度，例如 `#20FFFFFF` 是半透明白。默认不透明白。

**画笔颜色**：格式 `#AARRGGBB`。默认不透明红。

**使用透明无边框窗口**：去掉标题栏和边框，绘图区透明，能看到底下的窗口。默认关闭。

**图片包含背景内容**：透明窗口时，结果图是否把窗口下面的内容一并截进去。默认关闭。

**取消后停止动作**：点取消是否中止动作。默认开启。

## 输出

- **是否成功**：是否得到了图片。
- **结果图片**：画出来的图。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/showimage',
      label: '显示图片',
      description: '把画好的图贴到屏幕上。',
    },
    {
      href: '/v2/xaction/modules/writeimagefile',
      label: '写入图片文件',
      description: '把手写结果存成文件。',
    },
    {
      href: '/v2/xaction/modules/screencapture',
      label: '屏幕截图',
      description: '要的是屏幕画面，不是手绘。',
    },
  ]}
/>

## 更新历史

- 20230524：完善文档。
