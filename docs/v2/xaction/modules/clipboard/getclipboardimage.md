---
title: "获取剪贴板图片"
description: "读取剪贴板中的图片内容输出到图片变量中。"
slug: "/v2/xaction/modules/getclipboardimage"
sidebar_label: "获取剪贴板图片"
sidebar_position: 20
quickerDocKey: "xaction/module/sys:getClipboardImage"
comments: true
moduleKey: "sys:getClipboardImage"
docStatus: "migrated-unreviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 2064749
legacyContentUpdatedAt: "2020-05-28T06:41:20.000Z"
---

# 获取剪贴板图片

读取剪贴板中的图片内容输出到图片变量中。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:getClipboardImage" />

## 概述

读取剪贴板图片并保存到变量中。

一般用于获取截图内容等情况。

![image.png](./img/getclipboardimage-001-f59ad3ef8d.png "image.png")

## 参数

### 输入

【失败后中止动作】如果从剪贴板获取内容失败，则停止执行动作。

### 输出

【结果图片】从剪贴板获取的图片对象。

【是否成功】操作是否成功。注：如果此参数输出到变量中，则出错时不再提示提示信息。
