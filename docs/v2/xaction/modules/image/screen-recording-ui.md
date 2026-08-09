---
title: "屏幕录制"
description: "弹出选区 UI 让用户框选录制范围，打开录屏工具栏进行可视化录制，录完后返回文件路径。"
slug: "/v2/xaction/modules/screen-recording-ui"
sidebar_label: "屏幕录制"
sidebar_position: 60
quickerDocKey: "xaction/module/sys:screenRecordingUI"
comments: true
moduleKey: "sys:screenRecordingUI"
docStatus: "generated"
metadataGeneratedAt: "2026-08-03 20:08:03"
metadataHash: "1259c03fb8333af424fad61d4663a70b92fbf4a82062583622aec4211769b084"
---

# 屏幕录制

弹出选区 UI 让用户框选录制范围，打开录屏工具栏进行可视化录制，录完后返回文件路径。

{/* xaction-metadata:start */}
## 当前模块定义

- 模块 Key：`sys:screenRecordingUI`
- 分类：图片处理（`Image`）
- 类型：`Action`
- 风险操作：否
- 专业版：否

## 输入参数

| Key | 名称 | 类型 | 默认值 | 必填 | 变量模式 | 条件 | 说明 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `delay` | 开始前延迟 | `Integer` | 0 | 否 | `UseVarOrInput` |  | 等待多少毫秒后弹出选区界面。 |
| `manualAdjustSelection` | 手动调整选区 | `Boolean` | false | 否 | `Input` |  | 默认关闭：框选完成后自动确认并进入录屏。勾选后可先调整选区，再确认开录。 |
| `addToHistory` | 加入录屏历史 | `Boolean` | false | 否 | `Input` |  | 显式启用后，将录制结果复制到本机录屏历史；默认关闭以保持既有动作的文件生命周期。 |
| `stopIfFail` | 失败后停止 | `Boolean` | true | 否 | `Input` |  | 失败后是否停止动作 |

## 输出参数

| Key | 名称 | 类型 | 条件 | 说明 |
| --- | --- | --- | --- | --- |
| `isSuccess` | 是否成功 | `Boolean` |  | 操作是否成功 |
| `filePath` | 文件路径 | `Text` |  | 录制完成的视频文件路径；用户取消时为空。 |
| `durationSeconds` | 录制时长 | `Number` |  | 录制时长（秒）。 |
| `rect` | 录制区域 | `Text` |  | 实际录制区域(left,top,right,bottom)。 |
| `errMessage` | 错误消息 | `Text` |  | 步骤执行出错时的消息 |
{/* xaction-metadata:end */}

## 使用说明

本模块与[屏幕截图](/v2/xaction/modules/screencapture)共享基础使用说明；本页上方参数表是当前模块自身的定义。
