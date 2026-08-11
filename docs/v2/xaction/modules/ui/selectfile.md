---
title: "选择文件"
description: "弹出打开或保存文件对话框，拿到用户选中的路径。"
slug: "/v2/xaction/modules/selectfile"
sidebar_label: "选择文件"
sidebar_position: 80
quickerDocKey: "xaction/module/sys:selectFile"
comments: true
moduleKey: "sys:selectFile"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 1981266
legacyContentUpdatedAt: "2021-11-15T11:23:11.000Z"
---

# 选择文件

弹出系统文件对话框，让用户选一个（或多个）要打开的文件，或指定保存位置。要选文件夹，用 [选择文件夹](/v2/xaction/modules/selectfolder)。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:selectFile" />

## 概述

0.12.3 起提供。三种操作类型对应不同的对话框和输出。

<ModuleParamPreview moduleKey="sys:selectFile" />

## 参数说明

**操作类型**：

- **打开单个文件**：打开文件对话框，输出一条路径（文本）。
- **打开多个文件**：可多选，输出路径列表。
- **保存文件**：保存文件对话框，输出要写入的路径。

**文件类型筛选器**：限定可选类型。格式为 `类型1|扩展名1|类型2|扩展名2`。多种扩展名用分号：`图片文件|*.jpg;*.png;*.bmp;*.gif`。默认 `文本文件|*.txt|所有文件|*.*`。

**默认扩展名**：对话框预选的扩展名，应是筛选器里的一种，如 `.txt`。

**初始文件名**：预先填进文件名框，可留空。

**初始路径**：对话框打开时的文件夹，可留空。

**对话框标题**：窗口标题，可留空。

**置顶显示**：对话框是否总在最前。默认开启。

**失败后停止**：用户点取消后是否中止动作。默认开启。

## 输出

- **是否成功**：是否选了文件。取消则为 False。若未输出到变量且用户取消，动作会停止。
- **路径**：单个文件路径。仅「打开单个文件」「保存文件」。
- **路径列表**：多条路径。仅「打开多个文件」。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/selectfolder',
      label: '选择文件夹',
      description: '选目录而不是文件。',
    },
    {
      href: '/v2/xaction/modules/readfile',
      label: '读取文件',
      description: '拿到路径后再读内容。',
    },
    {
      href: '/v2/xaction/modules/writetextfile',
      label: '写入文本文件',
      description: '保存对话框选完路径后写入。',
    },
  ]}
/>
