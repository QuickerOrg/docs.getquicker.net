---
title: "生成临时文件路径"
description: "按扩展名生成一个随机的临时文件完整路径，供后续步骤写入。"
slug: "/v2/xaction/modules/gentempfilepath"
sidebar_label: "生成临时文件路径"
sidebar_position: 30
quickerDocKey: "xaction/module/sys:GenTempFilePath"
comments: true
moduleKey: "sys:GenTempFilePath"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 2116960
legacyContentUpdatedAt: "2019-07-15T02:45:21.000Z"
---

# 生成临时文件路径

按指定扩展名生成一个随机的临时文件完整路径，给后面的写入步骤用。路径只是占位，文件本身还没创建。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:GenTempFilePath" />

## 概述

需要先落盘、又不想自己拼文件名时，用本模块拿到一条尚未占用的路径，再交给 [写入文本文件](/v2/xaction/modules/writetextfile) 或 [写入图片文件](/v2/xaction/modules/writeimagefile)。

<ModuleParamPreview moduleKey="sys:GenTempFilePath" />

## 参数说明

**扩展名**：生成路径时使用的后缀，默认 `.txt`。

## 输出

- **文件路径**：生成的临时文件完整路径。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/writetextfile',
      label: '写入文本文件',
      description: '把文本写到这条临时路径。',
    },
    {
      href: '/v2/xaction/modules/writeimagefile',
      label: '写入图片文件',
      description: '把图片写到这条临时路径。',
    },
  ]}
/>
