---
title: "手写板"
description: "手写内容，生成图片对象。"
slug: "/v2/xaction/modules/whiteboard"
sidebar_label: "手写板"
sidebar_position: 100
quickerDocKey: "xaction/module/sys:whiteboard"
comments: true
moduleKey: "sys:whiteboard"
docStatus: "migrated-unreviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
metadataHash: "debddf436375235b9cb021a0efd5a23d61e9aebcb1b4e8210f401c205fde4df1"
legacyDocId: 12799039
legacyContentUpdatedAt: "2023-05-24T12:42:58.000Z"
---

# 手写板

手写内容，生成图片对象。

{/* xaction-metadata:start */}
## 当前模块定义

- 模块 Key：`sys:whiteboard`
- 分类：图片处理（`Image`）
- 类型：`Action`
- 风险操作：否
- 专业版：否

## 输入参数

| Key | 名称 | 类型 | 默认值 | 必填 | 变量模式 | 条件 | 说明 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `winPosition` | 窗口位置 | `Text` | 15%,30%,85%,70% | 否 | `UseVarOrInput` |  | 可选。指定显示位置，格式为：left,top,right,bottom。支持像素数值或屏幕宽高百分比。 |
| `bgColor` | 绘图区背景颜色 | `Text` | #FFFFFFFF | 否 | `UseVarOrInput` |  | 绘图窗口的背景颜色。格式为#AARRGGBB |
| `penColor` | 画笔颜色 | `Text` | #FFFF0000 | 否 | `UseVarOrInput` |  | 画笔颜色。格式为#AARRGGBB |
| `enableTransparent` | 使用透明无边框窗口 | `Boolean` | false | 否 | `Input` |  | 不显示窗口标题栏，绘图区透明，可以看到底层窗口内容。 |
| `imageWithBackground` | 图片包含背景内容 | `Boolean` | false | 否 | `Input` |  | 使用透明窗口时，结果图片是否包含背景内容。 |
| `stopIfFail` | 取消后停止动作 | `Boolean` | true | 否 | `Input` |  |  |

## 输出参数

| Key | 名称 | 类型 | 条件 | 说明 |
| --- | --- | --- | --- | --- |
| `isSuccess` | 是否成功 | `Boolean` |  | 操作是否成功 |
| `result` | 结果图片 | `Image` |  |  |
{/* xaction-metadata:end */}

1.10.8版本提供。

绘制简单图形并获得图片对象。

![](./img/whiteboard-001-6f4a61285f.png)



## 参数

![](./img/whiteboard-002-cb2a8248f7.png)

**输入**

【窗口位置】指定手写笔的显示位置。

【绘图区背景颜色】指定绘图区的背景颜色，格式为#AARRGGBB（可以通过AA控制透明度，如#20FFFFFF绘制半透明的白色背景）

【画笔颜色】设定画笔颜色，格式为#AARRGGBB。

【使用透明无边框窗口】是否去除窗口的标题栏和边框。

【图片包含背景内容】输出结果图片时，如果绘图区为具有透明度的背景色，是否截取窗口下面的内容。

【取消后停止动作】点击取消按钮时是否停止动作。

**输出**

【结果图片】绘制的内容图片。

## 更新历史

-   20230524 完善文档。
