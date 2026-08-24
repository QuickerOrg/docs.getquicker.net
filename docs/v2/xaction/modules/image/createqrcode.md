---
title: "生成二维码"
description: "将文本转换为二维码"
slug: "/v2/xaction/modules/createqrcode"
sidebar_label: "生成二维码"
sidebar_position: 80
quickerDocKey: "xaction/module/sys:createQrCode"
comments: true
moduleKey: "sys:createQrCode"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-24 20:01:39"
legacyDocId: 2115658
legacyContentUpdatedAt: "2021-03-17T12:26:25.000Z"
---

# 生成二维码

把一段文本做成二维码图片。扫码识别用 [识别二维码](/v2/xaction/modules/readqrcode)。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:createQrCode" />

## 概述

<ModuleParamPreview moduleKey="sys:createQrCode" />

## 参数说明

**文本**：要编进二维码的内容。

**每模块像素数**：每个模块点占多少像素。越大图越大。默认 `4`。

**暗色** / **亮色**：模块点和背景色，格式 `#AARRGGBB`。默认黑字白底。

**图标**：中心图标。可以是图片变量，或本机文件路径（不要填网址）。

**图标占比**：图标相对二维码的百分比，只填数字。默认 `15`。

**图标边框宽度**：图标周围留白，最小为 `1`。默认 `6`。

**绘制外框**：是否在二维码外再画一圈空白。默认开启。

**输出pdf文件**：把二维码另存为 PDF 的完整路径。留空则不写 PDF。旧稿未写。

**失败后停止**：生成失败是否中止动作。默认开启。旧稿未写。

## 输出

- **是否成功**：是否生成成功。旧稿未写。
- **二维码图片**：生成的图片对象。
- **SVG格式结果**：SVG 源码。旧稿未写。
- **Ascii格式结果**：用字符画出来的二维码。旧稿未写。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/readqrcode',
      label: '识别二维码',
      description: '本模块的反向操作。',
    },
    {
      href: '/v2/xaction/modules/writeimagefile',
      label: '写入图片文件',
      description: '把二维码存成 png / jpg。',
    },
    {
      href: '/v2/xaction/modules/showimage',
      label: '显示图片',
      description: '在屏幕上弹出二维码。',
    },
  ]}
/>
