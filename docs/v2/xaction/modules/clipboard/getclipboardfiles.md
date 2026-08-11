---
title: "获取剪贴板文件列表"
description: "获取剪贴板中复制的文件(或文件夹)的路径列表"
slug: "/v2/xaction/modules/getclipboardfiles"
sidebar_label: "获取剪贴板文件列表"
sidebar_position: 40
quickerDocKey: "xaction/module/sys:getClipboardFiles"
comments: true
moduleKey: "sys:getClipboardFiles"
docStatus: "migrated-unreviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 2063810
legacyContentUpdatedAt: "2019-07-08T09:49:04.000Z"
---

# 获取剪贴板文件列表

获取剪贴板中复制的文件(或文件夹)的路径列表

## 当前模块定义

<XActionModuleMeta moduleKey="sys:getClipboardFiles" />

## 概述

返回剪贴板中的文件列表。内容为所有选中文件的路径。

<ModuleParamPreview moduleKey="sys:getClipboardFiles" />

## 参数

### 输入

【失败后中止动作】如果从剪贴板获取内容失败，则停止执行动作。

### 输出

【文件列表】从剪贴板获取的文件路径列表。

【是否成功】操作是否成功。注：如果此参数输出到变量中，则出错时不再提示提示信息。
