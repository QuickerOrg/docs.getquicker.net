---
title: "截图 Pro"
description: "渐进式选区截图：全屏 overlay，光标处初始选区，支持控件跟踪，双击确认。Esc 取消。"
slug: "/v2/xaction/modules/screen-capture-pro"
sidebar_label: "截图 Pro"
sidebar_position: 30
quickerDocKey: "xaction/module/sys:screenCapturePro"
comments: true
moduleKey: "sys:screenCapturePro"
docStatus: "generated"
metadataGeneratedAt: "2026-08-03 20:08:03"
---

# 截图 Pro

渐进式选区截图：进入后出现全屏遮罩，光标附近给出初始选区；可拖拽框选、吸附控件，再复制、保存或贴图。Esc 取消。

选区、标注、OCR、贴图、长截图与录屏入口写在独立功能页，本页只保留步骤参数。请先打开下面的说明：

<RelatedDocs
  layout="cards"
  items={[
    {
      href: '/v2/features/screenshot/capture-pro',
      label: '截图 Pro 功能说明',
      description: '选区、控件吸附、标注、OCR、贴图、快捷键与排障。',
      featured: true,
    },
    {
      href: '/v2/features/screenshot/toolbar-script',
      label: 'JS 自定义工具栏',
      description: '给工具栏加自定义按钮，或在进阶场景下重排整栏。',
    },
    {
      href: '/v2/features/screenshot/image-translate',
      label: '图片翻译',
      description: '截图 / 贴图图到图翻译，配置百度或有道 Key。',
    },
    {
      href: '/v2/features/screenshot',
      label: '截图与贴图概览',
      description: '截图、贴图、长截图、录屏与采集历史入口。',
    },
  ]}
/>

## 当前模块定义

<XActionModuleMeta moduleKey="sys:screenCapturePro" />

## 概述

<ModuleParamPreview moduleKey="sys:screenCapturePro" />

## 参数说明

**截图前延迟时间**：等多少毫秒再进入截图。从面板或轮盘触发时，可垫一点延时，避免截到 Quicker 自己。

**写入剪贴板**：结果是否写入剪贴板。默认关闭。

**截图后贴图**：截完后在选区位置弹出贴图窗口。走「保存」结束时不贴图。默认关闭。

**贴图后显示工具栏**：贴图窗口打开后是否自动显示标注工具栏。默认关闭；需要时可按空格再显示。

**自动吸附**：开启后悬停自动吸附到控件；关闭时（默认）只跟随窗口范围，滚轮再触发 UIA 精细选区。

**自定义工具栏**：给截图 Pro 工具栏添加自定义按钮，或在进阶场景下重排工具栏。可内联填写 JSON / JS，也可外置为动作包内文件。完整写法见上面的 **JS 自定义工具栏**。

**失败后停止**：失败或取消是否中止动作。默认开启。

## 输出

- **是否成功**：是否完成截图。
- **图片**：截到的图。
- **截图区域**：格式 `left,top,right,bottom`。
- **保存路径**：用户点保存并写入磁盘后的路径；用确认按钮结束时为空。

## 相关步骤

<RelatedDocs
  layout="cards"
  items={[
    {
      href: '/v2/xaction/modules/screencapture',
      label: '屏幕截图',
      description: '经典截图步骤，可选区域 / 全屏 / 窗口。',
    },
    {
      href: '/v2/xaction/modules/long-screenshot',
      label: '长截图',
      description: '框选范围后滚动拼接成长图。',
    },
    {
      href: '/v2/xaction/modules/screen-recording-ui',
      label: '屏幕录制',
      description: '弹出选区界面，可视化录制视频。',
    },
    {
      href: '/v2/xaction/modules/showimage',
      label: '显示图片',
      description: '截完后把图贴在屏幕上。',
    },
  ]}
/>
