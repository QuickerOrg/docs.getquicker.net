---
title: "写入图片文件"
description: "将图片内容写入文件"
slug: "/v2/xaction/modules/writeimagefile"
sidebar_label: "写入图片文件"
sidebar_position: 70
quickerDocKey: "xaction/module/sys:WriteImageFile"
comments: true
moduleKey: "sys:WriteImageFile"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-24 20:01:39"
legacyDocId: 2115755
legacyContentUpdatedAt: "2020-10-26T11:02:29.000Z"
---

# 写入图片文件

把图片变量保存成文件。格式由路径后缀决定，支持 `.jpg`、`.png`、`.bmp`、`.tiff`。截屏结果要落盘时，可接在 [屏幕截图](/v2/xaction/modules/screencapture) 后面。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:WriteImageFile" />

## 概述

<ModuleParamPreview moduleKey="sys:WriteImageFile" />

## 参数说明

**图片**：要写入的图片（变量）。

**文件路径**：完整路径，必须包含文件名。Quicker 按后缀判断保存格式。

**图片质量**：仅保存为 JPG 时生效，范围 10–100，默认 95。数字越小，文件越小、画质越差。

**失败后停止**：写入失败是否中止动作。默认开启。

## 输出

- **是否成功**：是否写入成功。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/readfile',
      label: '读取文件',
      description: '把图片文件再读回变量。',
    },
    {
      href: '/v2/xaction/modules/screencapture',
      label: '屏幕截图',
      description: '常见的图片来源。',
    },
  ]}
/>

## 更新历史

- 1.5.7 增加「图片质量」参数。
