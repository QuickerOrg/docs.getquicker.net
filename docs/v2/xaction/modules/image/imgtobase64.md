---
title: "图片/Base64 转换"
description: "把图片编成 Base64 文本，或把 Base64 文本还原成图片。"
slug: "/v2/xaction/modules/imgtobase64"
sidebar_label: "图片/Base64 转换"
sidebar_position: 110
quickerDocKey: "xaction/module/sys:imgToBase64"
comments: true
moduleKey: "sys:imgToBase64"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 2115687
legacyContentUpdatedAt: "2019-07-29T14:23:39.000Z"
---

# 图片/Base64 转换

把图片编成 Base64 文本，或把 Base64 文本还原成图片。常见于接口传图、网页内嵌图。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:imgToBase64" />

## 概述

不要把图片 Base64 写进动作（变量默认值、步骤参数等）。Quicker 会把动作加载进内存，Base64 体积大，容易占内存、拖慢同步，也会占用服务器空间。多台电脑共用同一张图时，用网盘同步到相同路径，动作里引用文件即可。讨论见 [论坛主题](https://getquicker.net/Forum/ViewTopic/877)。

<ModuleParamPreview moduleKey="sys:imgToBase64" />

## 参数说明

**操作类型**：

- 图片或文件转 Base64 文本：把图片变量或文件编成文本。
- Base64 文本转图片：把编码文本还原成图片变量。

**图片**：仅「图片或文件转 Base64 文本」。要编码的图片变量或文件路径。

**Base64编码**：仅「Base64 文本转图片」。待解码的文本。

**添加data头**：仅「图片或文件转 Base64 文本」。打开后在结果前加上 `data:image/png;base64,`。默认关闭。旧稿未写。

## 输出

- **Base64编码**：仅「图片或文件转 Base64 文本」。编码结果。
- **图片**：仅「Base64 文本转图片」。解码得到的位图。

## 限制与排障

后期可能会限制单个动作的最大尺寸。需要落盘时用 [写入图片文件](/v2/xaction/modules/writeimagefile)，不要把整段 Base64 塞进动作定义。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/writeimagefile',
      label: '写入图片文件',
      description: '把图片变量存成文件，而不是编进动作。',
    },
    {
      href: '/v2/xaction/modules/readfile',
      label: '读取文件',
      description: '从磁盘再读回图片。',
    },
    {
      href: '/v2/xaction/modules/writeclipboard',
      label: '写入剪贴板',
      description: '把图片交给别的程序，不必走 Base64。',
    },
  ]}
/>

## 更新历史

- 1.0.9：增加 Base64 转图片。
