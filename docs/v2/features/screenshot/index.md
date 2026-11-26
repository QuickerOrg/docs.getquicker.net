---
title: 截图与贴图概览
description: Quicker 截图、贴图、长截图与录屏功能入口说明。
sidebar_position: 1
quickerDocKey: v2/features/screenshot
comments: true
---

# 截图与贴图概览

Quicker 提供一套完整的屏幕截取与后续处理能力，可在动作中作为步骤使用，也可配合快捷键随时唤起。完整操作说明在独立页面，点下面的入口查看：

<RelatedDocs
  layout="cards"
  items={[
    {
      href: '/v2/features/screenshot/capture-pro',
      label: 'Quicker 截图',
      description: '全屏选区、控件吸附、标注、OCR、复制 / 保存 / 贴图，并可进入长截图或录屏。',
      featured: true,
    },
    {
      href: '/v2/features/screenshot/ocr',
      label: '文字识别（OCR）与表格识别',
      description: '原图选字、OCR 结果窗、在线表格识别、翻译校对与本地 OCR 保活设置。',
    },
    {
      href: '/v2/features/screenshot/screen-recording',
      label: '桌面录屏与视频编辑',
      description: '区域录屏、系统声音采集、录屏剪辑与智能缩放。',
    },
    {
      href: '/v2/features/screenshot/pin-window',
      label: '贴图窗口',
      description: '桌面贴图移动模式、鼠标穿透、自动折叠、贴图组与渲染清晰度。',
    },
    {
      href: '/v2/features/screenshot/media-history',
      label: '图片、贴图与录屏历史管理',
      description: '采集历史中心、图片标签、桌面贴图分组与保留设置。',
    },
    {
      href: '/v2/features/screenshot/screen-text-selection',
      label: '屏幕拖选文字',
      description: '按住引导键拖选屏幕文字，复制、编辑或翻译；可直接开启 Win＋左键预设。',
    },
    {
      href: '/v2/features/screenshot/image-translate',
      label: '图片翻译',
      description: '截图 / 贴图图到图翻译；配置百度或有道图片翻译 API（本机 Key）。',
    },
    {
      href: '/v2/features/screenshot/toolbar-script',
      label: 'JS 自定义工具栏',
      description: '用脚本给默认工具栏加自定义按钮；进阶才整栏重排。',
    },
    {
      href: '/v2/xaction/modules/screen-capture-pro',
      label: '交互截图步骤参数',
      description: '组合动作里的 交互截图步骤：延迟、剪贴板、贴图、吸附与自定义工具栏。',
    },
    {
      href: '/v2/xaction/modules/long-screenshot',
      label: '长截图',
      description: '在选区内滚动或移动，自动拼接成长图。',
    },
    {
      href: '/v2/xaction/modules/screen-recording-ui',
      label: '屏幕录制',
      description: '选定区域后录制为视频或 GIF。',
    },
    {
      href: '/v2/xaction/modules/showimage',
      label: '贴图（显示图片）',
      description: '将图片浮在屏幕上，支持缩放、透明度、标注与自动 OCR 选字。',
    },
    {
      href: '/v2/xaction/modules/screencapture',
      label: '屏幕截图（经典步骤）',
      description: '更简单的一屏截取：区域 / 全屏 / 窗口 / 固定区域。',
    },
  ]}
/>

## 在动作中使用

按自动化任务选择步骤：

- 需要交互选区、标注、OCR 或录屏入口时，使用[交互截图](/v2/xaction/modules/screen-capture-pro)。
- 需要把图片、文本、HTML、公式或识别结果浮在桌面上时，使用[贴图](/v2/xaction/modules/pinimage)；位置可选自动、截图原位置或自定义坐标。
- 只需截取区域、屏幕或窗口时，使用[屏幕截图](/v2/xaction/modules/screencapture)。

图片整理、贴图组与录屏成品统一在[图片、贴图与录屏历史管理](./media-history.md)中操作。具体功能的历史变化见各使用页末尾，完整发布信息见[更新记录](/release-notes)。
