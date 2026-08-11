---
title: "读取文件"
description: "将读取的文本或图片内容写入变量。"
slug: "/v2/xaction/modules/readfile"
sidebar_label: "读取文件"
sidebar_position: 10
quickerDocKey: "xaction/module/sys:readFile"
comments: true
moduleKey: "sys:readFile"
docStatus: "migrated-unreviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 2115863
legacyContentUpdatedAt: "2020-10-26T11:03:34.000Z"
---

# 读取文件

将读取的文本或图片内容写入变量。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:readFile" />

读取指定文件的内容。目前支持文本文件和图片文件的读取。

<ModuleParamPreview moduleKey="sys:readFile" />

## 参数

### 输入

【文件路径】要读取文件的完整路径。

【格式】文件内容格式，可选“文本”“图片”。 格式为“图片”时，支持的文件类型：.jpg, .png, .bmp, .tiff。

【文件编码】如果是读取的文本文件，可选文本编码格式。

### 输出

【文本内容】读取的文本文件内容。

【图片内容】读取的图片。
