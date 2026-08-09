---
title: "长截图"
description: "先使用屏幕选区工具选择范围，再进行长截图。"
slug: "/v2/xaction/modules/long-screenshot"
sidebar_label: "长截图"
sidebar_position: 140
quickerDocKey: "xaction/module/sys:longScreenshot"
comments: true
moduleKey: "sys:longScreenshot"
docStatus: "generated"
metadataGeneratedAt: "2026-08-03 20:08:03"
metadataHash: "493d2f3551e6e1ba7b03e1a98c079e0e1bdc34f6c33f3ffa0b306878072b0c76"
---

# 长截图

先使用屏幕选区工具选择范围，再进行长截图。

{/* xaction-metadata:start */}
## 当前模块定义

- 模块 Key：`sys:longScreenshot`
- 分类：图片处理（`Image`）
- 类型：`Action`
- 风险操作：否
- 专业版：否

## 输入参数

| Key | 名称 | 类型 | 默认值 | 必填 | 变量模式 | 条件 | 说明 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `toClip` | 写入剪贴板 | `Boolean` | true | 否 | `Input` |  | 长截图结果是否写入到剪贴板中。 |
| `stopIfFail` | 失败后停止 | `Boolean` | true | 否 | `Input` |  | 失败后是否停止动作 |

## 输出参数

| Key | 名称 | 类型 | 条件 | 说明 |
| --- | --- | --- | --- | --- |
| `isSuccess` | 是否成功 | `Boolean` |  | 操作是否成功 |
| `img` | 图片 | `Image` |  | 长截图结果图片。 |
| `rect` | 截图区域 | `Text` |  | 长截图起始选区(left,top,right,bottom)。 |
{/* xaction-metadata:end */}

## 使用说明

本模块与[屏幕截图](/v2/xaction/modules/screencapture)共享基础使用说明；本页上方参数表是当前模块自身的定义。
