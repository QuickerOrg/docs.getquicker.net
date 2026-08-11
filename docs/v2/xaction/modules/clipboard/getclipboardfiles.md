---
title: "获取剪贴板文件列表"
description: "获取剪贴板中复制的文件(或文件夹)的路径列表"
slug: "/v2/xaction/modules/getclipboardfiles"
sidebar_label: "获取剪贴板文件列表"
sidebar_position: 40
quickerDocKey: "xaction/module/sys:getClipboardFiles"
comments: true
moduleKey: "sys:getClipboardFiles"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 2063810
legacyContentUpdatedAt: "2019-07-08T09:49:04.000Z"
---

# 获取剪贴板文件列表

读取剪贴板里复制的文件或文件夹，得到它们的路径列表。要把文件放进剪贴板，用 [文件放入剪贴板](/v2/xaction/modules/filetoclipboard)。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:getClipboardFiles" />

## 概述

在资源管理器里复制文件后，这一步返回选中项的完整路径列表。剪贴板里是文本或图片时，读不到文件。

<ModuleParamPreview moduleKey="sys:getClipboardFiles" />

## 参数说明

**失败后中止动作**：从剪贴板取文件失败时，是否停止后续步骤。默认开启。

## 输出

- **是否成功**：是否拿到了文件列表。把这项输出到变量后，失败时不再弹出提示，只靠这个值判断。
- **文件列表**：路径列表。
- **已更新时间**：剪贴板最后一次更新距现在多少毫秒。旧稿未写。

## 限制与排障

只认「复制的文件」。复制的是文字、截图，或剪贴板是空的，这一步会失败。需要文本或图片时，改用对应的获取模块。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/filetoclipboard',
      label: '文件放入剪贴板',
      description: '本模块的反向操作。',
    },
    {
      href: '/v2/xaction/modules/getclipboardtext',
      label: '获取剪贴板文本',
      description: '剪贴板里是文字时用这个。',
    },
    {
      href: '/v2/xaction/modules/getclipboardimage',
      label: '获取剪贴板图片',
      description: '剪贴板里是图片时用这个。',
    },
  ]}
/>
