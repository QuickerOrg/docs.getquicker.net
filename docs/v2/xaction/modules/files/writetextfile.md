---
title: "写入文本文件"
description: "把文本写入指定路径，可选择编码、追加和换行处理。"
slug: "/v2/xaction/modules/writetextfile"
sidebar_label: "写入文本文件"
sidebar_position: 80
quickerDocKey: "xaction/module/sys:WriteTextFile"
comments: true
moduleKey: "sys:WriteTextFile"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 2117245
legacyContentUpdatedAt: "2019-12-20T02:52:44.000Z"
---

# 写入文本文件

把一段文本写入指定文件。路径还不存在时，可先用 [生成临时文件路径](/v2/xaction/modules/gentempfilepath) 拿到一条可用路径。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:WriteTextFile" />

## 概述

<ModuleParamPreview moduleKey="sys:WriteTextFile" />

## 参数说明

**内容**：要写入文件的文本。

**文件路径**：目标文件的完整路径，必须包含文件名。

**文件编码**：UTF8、UTF-16 LE / BE、ASCII、UTF7、UTF32，或系统默认(gb2312)。默认 UTF8。

**添加UTF-BOM**：UTF-8 文件是否写入 BOM。默认关闭。

**添加到文件末尾**：文件已存在时追加，而不是覆盖。默认关闭。

**添加空行**：在文件末尾再写一个空行。默认关闭。

**统一换行字符**：是否把换行统一成某一种。默认（不处理）、`\r\n`（Windows）、`\r`（Mac）、`\n`（Linux）。

**失败后停止**：写入失败是否中止动作。默认开启。

## 输出

- **是否成功**：是否写入成功。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/readfile',
      label: '读取文件',
      description: '把刚写入的文本再读回来。',
    },
    {
      href: '/v2/xaction/modules/gentempfilepath',
      label: '生成临时文件路径',
      description: '先拿到一条临时路径再写。',
    },
  ]}
/>
