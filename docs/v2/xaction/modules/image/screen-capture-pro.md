---
title: "截图 Pro"
description: "渐进式选区截图：全屏 overlay，光标处初始选区，支持控件跟踪，双击确认。Esc 取消。"
slug: "/v2/xaction/modules/screen-capture-pro"
sidebar_label: "截图 Pro"
sidebar_position: 30
quickerDocKey: "xaction/module/sys:screenCapturePro"
comments: true
moduleKey: "sys:screenCapturePro"
docStatus: "generated"
metadataGeneratedAt: "2026-08-03 20:08:03"
metadataHash: "14e2a703e7854c38765bb7d7c4742d9b37aeb9bf5348a2d9773469a2b60fd45b"
---

# 截图 Pro

渐进式选区截图：全屏 overlay，光标处初始选区，支持控件跟踪，双击确认。Esc 取消。

{/* xaction-metadata:start */}
## 当前模块定义

- 模块 Key：`sys:screenCapturePro`
- 分类：图片处理（`Image`）
- 类型：`Action`
- 风险操作：否
- 专业版：否

## 输入参数

| Key | 名称 | 类型 | 默认值 | 必填 | 变量模式 | 条件 | 说明 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `delay` | 截图前延迟时间 | `Integer` | 0 | 是 | `UseVarOrInput` |  | 等待多少毫秒后开始截图 |
| `toClip` | 写入剪贴板 | `Boolean` | false | 否 | `Input` |  | 截屏图片是否写入到剪贴板中 |
| `pinImage` | 截图后贴图 | `Boolean` | false | 否 | `Input` |  | 截图完成后在选区位置显示贴图窗口（浮动显示截取的图片）。保存结束时不贴图。 |
| `showToolbarAfterPin` | 贴图后显示工具栏 | `Boolean` | false | 否 | `Input` |  | 贴图窗口打开后是否自动显示标注工具栏。默认关闭（贴图前通常已标注）；需要时可按空格再显示。 |
| `autoAdsorb` | 自动吸附 | `Boolean` | false | 否 | `Input` |  | 开启后悬停自动吸附到控件元素；关闭时（默认）仅跟随窗口范围，滚轮再触发 UIA 精细选区。 |
| `stopIfFail` | 失败后停止 | `Boolean` | true | 否 | `Input` |  | 失败后是否停止动作 |

## 输出参数

| Key | 名称 | 类型 | 条件 | 说明 |
| --- | --- | --- | --- | --- |
| `isSuccess` | 是否成功 | `Boolean` |  | 操作是否成功 |
| `img` | 图片 | `Image` |  | 截图的图片 |
| `rect` | 截图区域 | `Text` |  | 图片的截取区域(left,top,right,bottom)。 |
| `savedPath` | 保存路径 | `Text` |  | 用户点击保存并写入磁盘后的文件路径；通过确认按钮结束时为空。 |
{/* xaction-metadata:end */}

## 使用说明

本模块与[屏幕截图](/v2/xaction/modules/screencapture)共享基础使用说明；本页上方参数表是当前模块自身的定义。
