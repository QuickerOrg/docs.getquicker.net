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
metadataHash: "bd3b1d250855c94f72fabb547a60007e3a3fd2c7f385fda82c4dcef589266851"
legacyDocId: 2064749
legacyContentUpdatedAt: "2020-05-28T06:41:20.000Z"
---

# 获取剪贴板图片

读取剪贴板中的图片内容输出到图片变量中。

{/* xaction-metadata:start */}
## 当前模块定义

- 模块 Key：`sys:getClipboardImage`
- 分类：剪贴板操作（`Clipboard`）
- 类型：`Action`
- 风险操作：否
- 专业版：否

## 输入参数

| Key | 名称 | 类型 | 默认值 | 必填 | 变量模式 | 条件 | 说明 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `stopIfFail` | 失败后中止动作 | `Boolean` | true | 否 | `Input` |  | 获取失败后，是否停止后续动作的执行。 |

## 输出参数

| Key | 名称 | 类型 | 条件 | 说明 |
| --- | --- | --- | --- | --- |
| `isSuccess` | 是否成功 | `Boolean` |  | 是否成功获得剪贴板图片 |
| `output` | 结果图片 | `Image` |  | 将获得的图片写入到变量 |
| `elapsedMs` | 已更新时间 | `Integer` |  | 剪贴板最后更新是在多少毫秒以前 |
{/* xaction-metadata:end */}

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
