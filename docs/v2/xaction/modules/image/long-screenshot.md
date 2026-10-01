---
title: "长截图"
description: "先使用屏幕选区工具选择范围，再进行长截图。"
slug: "/v2/xaction/modules/long-screenshot"
sidebar_label: "长截图"
sidebar_position: 140
quickerDocKey: "xaction/module/sys:longScreenshot"
comments: true
moduleKey: "sys:longScreenshot"
docStatus: "generated"
metadataGeneratedAt: "2026-08-24 20:01:39"
---

# 长截图

先用屏幕选区工具框出范围，再在选区内滚动或移动，自动拼接成长图。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:longScreenshot" />

## 概述

选区操作与「屏幕截图」的「选择区域」相同。完整界面说明见下面的入口；本页只写本模块自己的参数。

<RelatedDocs
  layout="cards"
  items={[
    {
      href: '/v2/features/screenshot/capture-pro',
      label: '截图 Pro 功能说明',
      description: '同一套选区界面里也可以进入长截图。',
      featured: true,
    },
    {
      href: '/v2/features/screenshot',
      label: '截图与贴图概览',
      description: '截图、贴图、长截图与录屏入口。',
    },
  ]}
/>

<ModuleParamPreview moduleKey="sys:longScreenshot" />

## 开发版：自动滚动采集

2026-10-01 核对的开发版可在进入长截图后，从工具栏开启自动滚动、调节速度，并查看选区外的状态提示；尚未包含在 2.2.26 中。这些是采集界面操作，不是新增步骤参数。用法和中断处理见 [长截图自动滚动](/v2/features/screenshot/capture-pro#开发版长截图自动滚动)。

## 参数说明

**写入剪贴板**：结果是否同时写入剪贴板。默认开启。

**失败后停止**：失败是否中止动作。默认开启。

## 输出

- **是否成功**：是否截到了长图。
- **图片**：拼接后的长图。
- **截图区域**：起始选区，格式 `left,top,right,bottom`。

## 相关步骤

<RelatedDocs
  layout="cards"
  items={[
    {
      href: '/v2/xaction/modules/screen-capture-pro',
      label: '截图 Pro',
      description: '同一套选区界面里也可以进入长截图。',
    },
    {
      href: '/v2/xaction/modules/screencapture',
      label: '屏幕截图',
      description: '普通一屏截图；选区操作与本模块相同。',
    },
  ]}
/>
