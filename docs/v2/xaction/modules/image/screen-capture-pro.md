---
title: "截图 Pro"
description: "框选截图、标注、贴图或识别。默认自动吸附，可关闭后用滚轮手动调整选区。"
slug: "/v2/xaction/modules/screen-capture-pro"
sidebar_label: "截图 Pro"
sidebar_position: 30
quickerDocKey: "xaction/module/sys:screenCapturePro"
comments: true
moduleKey: "sys:screenCapturePro"
docStatus: "reviewed"
metadataGeneratedAt: "2026-09-20 15:25:17"
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

**操作**（2.2.17 起）：默认“截图”可调整选区、标注并确认；“框选即出图”直接返回图片；“立刻复制 / 立刻贴图”直接完成对应操作。还可选择“识别并复制”、文本 / 表格 / 公式识别、文本 / 图片翻译或“快速保存”。本参数不受全局“直接截图的完成操作”影响，各操作只显示适用的参数与输出。

**加入截图历史**：默认开启，但仍遵循全局截图历史开关；取消勾选可排除本次截图，不能反向打开全局历史。

**截图前延迟时间**：等多少毫秒再进入截图。从面板或轮盘触发时，可垫一点延时，避免截到 Quicker 自己。

**预选截图区域**（2.2.19 起）：填写物理屏幕坐标 `left,top,right,bottom`，右、下边界不包含在区域内。指定后跳过第一次手动框选，直接进入可调整和标注的截图状态；留空时仍正常手动选择。

**写入剪贴板**：仅在默认确认出口（打勾、双击或 `Enter`）结束后，把结果写入剪贴板。复制出口本身会写剪贴板；保存、工具栏直接贴图以及自定义工具栏的 `post.confirm` / `post.pin` 不会再叠加此参数。默认关闭。

**截图后贴图**：仅在默认确认出口结束后，在选区位置弹出贴图窗口。保存、复制、工具栏直接贴图以及自定义工具栏的 `post.confirm` / `post.pin` 不会再叠加此参数。默认关闭。

**贴图后显示工具栏**：贴图窗口打开后是否自动显示标注工具栏。默认关闭；需要时可按空格再显示。

**自动吸附UI元素**：开启后悬停自动吸附到控件；关闭时只跟随窗口范围，用滚轮选择更细的控件。2.2.17 起新建步骤默认开启，已有步骤保留原参数；旧动作未保存该参数时仍按关闭处理。

**自定义工具栏**：给截图 Pro 工具栏添加自定义按钮，或在进阶场景下重排工具栏。可内联填写 JSON / JS，也可外置为动作包内文件。完整写法见上面的 **JS 自定义工具栏**。

**失败后停止**：失败或取消是否中止动作。默认开启。

## 输出

输出以所选“操作”的参数界面为准，下面列出常见截图输出。识别类操作按用途打开结果窗或复制文本；“识别并复制”在识别完成前取消时，不再写入剪贴板。

- **是否成功**：是否完成截图。
- **图片**：截到的图。
- **截图区域**：格式 `left,top,right,bottom`。
- **保存路径**：用户点保存并写入磁盘后的路径；用确认按钮结束时为空。

## 相关步骤

含新版操作的动作请在 2.2.17 或更高版本运行；回退旧版本后可能按普通截图流程执行，不能保证相同效果。

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
