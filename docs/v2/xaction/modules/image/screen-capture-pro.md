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

## 当前模块定义

<XActionModuleMeta moduleKey="sys:screenCapturePro" />

## 概述

选区、标注、OCR、贴图、长截图与录屏入口见 [截图 Pro](/v2/features/screenshot/capture-pro)。本页只写组合动作步骤自己的参数。

<ModuleParamPreview moduleKey="sys:screenCapturePro" />

## 参数说明

**截图前延迟时间**：等多少毫秒再进入截图。从面板或轮盘触发时，可垫一点延时，避免截到 Quicker 自己。

**写入剪贴板**：结果是否写入剪贴板。默认关闭。

**截图后贴图**：截完后在选区位置弹出贴图窗口。走「保存」结束时不贴图。默认关闭。

**贴图后显示工具栏**：贴图窗口打开后是否自动显示标注工具栏。默认关闭；需要时可按空格再显示。

**自动吸附**：开启后悬停自动吸附到控件；关闭时（默认）只跟随窗口范围，滚轮再触发 UIA 精细选区。

**失败后停止**：失败或取消是否中止动作。默认开启。

## 输出

- **是否成功**：是否完成截图。
- **图片**：截到的图。
- **截图区域**：格式 `left,top,right,bottom`。
- **保存路径**：用户点保存并写入磁盘后的路径；用确认按钮结束时为空。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/features/screenshot/capture-pro',
      label: '截图 Pro（功能说明）',
      description: '选区、吸附、标注、OCR 与结束方式。',
    },
    {
      href: '/v2/xaction/modules/screencapture',
      label: '屏幕截图',
      description: '经典截图步骤，可选区域 / 全屏 / 窗口。',
    },
    {
      href: '/v2/xaction/modules/showimage',
      label: '显示图片',
      description: '截完后把图贴在屏幕上。',
    },
  ]}
/>
