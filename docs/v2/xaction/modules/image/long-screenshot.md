---
title: "长截图"
description: "先用屏幕选区工具框出范围，再在选区内滚动拼接成长图。"
slug: "/v2/xaction/modules/long-screenshot"
sidebar_label: "长截图"
sidebar_position: 140
quickerDocKey: "xaction/module/sys:longScreenshot"
comments: true
moduleKey: "sys:longScreenshot"
docStatus: "generated"
metadataGeneratedAt: "2026-08-03 20:08:03"
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
