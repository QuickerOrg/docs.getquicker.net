---
title: "识别二维码"
description: "识别图片中的二维码"
slug: "/v2/xaction/modules/readqrcode"
sidebar_label: "识别二维码"
sidebar_position: 90
quickerDocKey: "xaction/module/sys:readQrCode"
comments: true
moduleKey: "sys:readQrCode"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-24 20:01:39"
legacyDocId: 2115777
legacyContentUpdatedAt: "2025-10-20T12:43:43.000Z"
---

# 识别二维码

识别图片里的二维码或条码。要先把图做成码，用 [生成二维码](/v2/xaction/modules/createqrcode)。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:readQrCode" />

## 概述

本地引擎认不出来时，可以再走在线识别（专业版，频率限制约 2 秒/次）。

<ModuleParamPreview moduleKey="sys:readQrCode" />

## 参数说明

**输入图片**：含二维码或条码的图片变量。

**本地识别失败后尝试在线识别服务**：本地失败后再用 Quicker 在线服务。识别能力更强，仅专业版，有频率限制。默认关闭。

**失败后停止**：识别失败是否中止动作。默认开启。旧稿未写。

## 输出

- **是否成功**：是否识别成功。旧稿未写。
- **值**：识别出的内容。
- **全部二维码值**：一张图里有多个码时，返回全部结果的列表。
- **条码类型**：如 `EAN-13`（1.44.27+）。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/createqrcode',
      label: '生成二维码',
      description: '本模块的反向操作。',
    },
    {
      href: '/v2/xaction/modules/basic-ocr',
      label: '基础OCR',
      description: '认的是图里的字，不是码。',
    },
    {
      href: '/v2/xaction/modules/screencapture',
      label: '屏幕截图',
      description: '先截屏，再识别。',
    },
  ]}
/>

## 更新历史

- 20251020：补充条码类型输出说明。
