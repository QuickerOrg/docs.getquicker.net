---
title: "读取文件"
description: "将读取的文本或图片内容写入变量。"
slug: "/v2/xaction/modules/readfile"
sidebar_label: "读取文件"
sidebar_position: 10
quickerDocKey: "xaction/module/sys:readFile"
comments: true
moduleKey: "sys:readFile"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-24 20:01:39"
legacyDocId: 2115863
legacyContentUpdatedAt: "2020-10-26T11:03:34.000Z"
---

# 读取文件

读取指定文件，把文本或图片写入变量。路径可手填，也可先用 [选择文件](/v2/xaction/modules/selectfile) 让用户挑。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:readFile" />

## 概述

目前支持文本和图片。图片格式：`.jpg`、`.png`、`.bmp`、`.tiff`。

<ModuleParamPreview moduleKey="sys:readFile" />

## 参数说明

**文件路径**：要读取的完整路径。

**格式**：文本或图片。默认文本。

<ModuleParamPreview
  moduleKey="sys:readFile"
  focusKeys={['type', 'encoding', 'txt', 'image']}
  values={{type: 'image'}}
/>

**文件编码**：仅 **文本**。UTF8、UTF-16 LE / BE、ASCII、UTF7、UTF32、系统默认(gb2312)，或自动（BOM/UTF/ANSI）。默认 UTF8。

**失败后停止**：读取失败是否中止动作。默认开启。

## 输出

- **是否成功**：是否读取成功。
- **文本内容**：仅格式为 **文本**。
- **图片内容**：仅格式为 **图片**。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/writetextfile',
      label: '写入文本文件',
      description: '本模块读文本的反向操作。',
    },
    {
      href: '/v2/xaction/modules/writeimagefile',
      label: '写入图片文件',
      description: '本模块读图片的反向操作。',
    },
    {
      href: '/v2/xaction/modules/selectfile',
      label: '选择文件',
      description: '先让用户挑路径再读。',
    },
  ]}
/>
