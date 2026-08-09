---
title: "后台屏幕录制"
description: "后台录制屏幕区域为视频文件，通过会话 ID 跨步骤控制录制生命周期。"
slug: "/v2/xaction/modules/screen-recording"
sidebar_label: "后台屏幕录制"
sidebar_position: 20
quickerDocKey: "xaction/module/sys:screenRecording"
comments: true
moduleKey: "sys:screenRecording"
docStatus: "generated"
metadataGeneratedAt: "2026-08-03 20:08:03"
metadataHash: "ccfa63656f6e4f568e4beeb49209570d84a00d53ba787787efe336332572777c"
---

# 后台屏幕录制

后台录制屏幕区域为视频文件，通过会话 ID 跨步骤控制录制生命周期。

{/* xaction-metadata:start */}
## 当前模块定义

- 模块 Key：`sys:screenRecording`
- 分类：图片处理（`Image`）
- 类型：`Action`
- 风险操作：否
- 专业版：否

## 输入参数

| Key | 名称 | 类型 | 默认值 | 必填 | 变量模式 | 条件 | 说明 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `operation` | 操作 | `Enum` | start | 是 | `Input` |  | 录屏会话操作类型。 |
| `sessionId` | 会话 ID | `Text` |  | 否 | `UseVarOrInput` |  | 录屏会话标识（GUID）。开始录屏时留空将自动生成；暂停/继续/结束时必须提供。 |
| `stopIfFail` | 失败后停止 | `Boolean` | true | 否 | `Input` |  | 失败后是否停止动作 |
| `regionType` | 录制范围 | `Enum` | fixed_area | 是 | `Input` | 仅：start | 要录制的屏幕区域类型。 |
| `area` | 录制区域 | `Text` |  | 否 | `UseVarOrInput` | 仅：start, fixed_area | 固定区域坐标，格式：left,top,right,bottom。默认不包含右边和底边像素。 |
| `includeRightBottomBorder` | 包含右下边像素 | `Boolean` | true | 否 | `Input` | 仅：start, fixed_area | 包含时，0,0,2,2 表示 3×3 区域；否则为 2×2。 |
| `outputFilePath` | 输出文件路径 | `Text` |  | 否 | `UseVarOrInput` | 仅：start | 留空时使用 Quicker 临时目录下的时间戳文件名。 |
| `outputFormat` | 输出格式 | `Enum` | mp4 | 是 | `Input` | 仅：start | 录屏输出文件格式。 |
| `exportQuality` | 导出画质 | `Enum` | standard | 是 | `Input` | 仅：start | 录屏导出画质：标准、高清或原始。 |
| `framesPerSecond` | 帧率 | `Integer` | 30 | 否 | `UseVarOrInput` | 仅：start | 录制帧率，将自动规整到 10/15/24/30/60。 |
| `showCursor` | 显示鼠标光标 | `Boolean` | true | 否 | `Input` | 仅：start | 是否在录制画面中显示鼠标光标。 |
| `encodingStrategy` | 编码策略 | `Enum` | encodeWhileRecording | 是 | `Input` | 仅：start | 边录边编码：录制时实时生成成品文件，停止后立即可用（需要 QuickerAvCodec）。先录后编码：先录制中间文件，停止后通过 ffmpeg 转码为目标格式，等待时间取决于录制时长和分辨率。 |
| `returnImmediately` | 开始后立即返回 | `Boolean` | true | 否 | `Input` | 仅：start | 启用后步骤在启动录制后立即成功返回；结束录屏请使用单独的结束步骤。 |
| `delay` | 开始前延迟 | `Integer` | 0 | 否 | `UseVarOrInput` | 仅：start | 等待多少毫秒后开始录制。 |
| `waitForCompletion` | 等待编码完成 | `Boolean` | true | 否 | `Input` | 仅：stop | 结束录屏时是否等待文件写入完成。 |
| `removeSessionAfterStop` | 结束后删除会话 | `Boolean` | true | 否 | `Input` | 仅：stop | 结束录屏成功后从会话注册表移除。 |
| `addToHistory` | 加入录屏历史 | `Boolean` | false | 否 | `Input` | 仅：stop | 结束录屏时显式将成品复制到本机录屏历史。后台录屏默认不加入历史。 |

## 输出参数

| Key | 名称 | 类型 | 条件 | 说明 |
| --- | --- | --- | --- | --- |
| `isSuccess` | 是否成功 | `Boolean` |  | 操作是否成功 |
| `sessionIdOut` | 会话 ID | `Text` |  | 录屏会话标识，供后续暂停/继续/结束步骤使用。 |
| `filePath` | 文件路径 | `Text` |  | 录制完成的视频文件路径。 |
| `durationSeconds` | 录制时长 | `Number` |  | 录制时长（秒）。 |
| `rect` | 录制区域 | `Text` |  | 实际录制区域(left,top,right,bottom)。 |
| `errMessage` | 错误消息 | `Text` |  | 步骤执行出错时的消息 |

## 选项值

### `operation` 操作

| Value | 名称 | 说明 |
| --- | --- | --- |
| `start` | 开始录屏 |  |
| `pause` | 暂停录屏 |  |
| `resume` | 继续录屏 |  |
| `stop` | 结束录屏 |  |

### `regionType` 录制范围

| Value | 名称 | 说明 |
| --- | --- | --- |
| `fixed_area` | 固定区域 |  |
| `primary_screen` | 主屏幕 |  |
| `full_screen` | 所有屏幕 |  |

### `outputFormat` 输出格式

| Value | 名称 | 说明 |
| --- | --- | --- |
| `mp4` | MP4 |  |
| `gif` | GIF |  |
| `avi` | AVI |  |

### `exportQuality` 导出画质

| Value | 名称 | 说明 |
| --- | --- | --- |
| `standard` | 标准 |  |
| `high` | 高清 |  |
| `original` | 原始 |  |

### `encodingStrategy` 编码策略

| Value | 名称 | 说明 |
| --- | --- | --- |
| `encodeWhileRecording` | 实时编码 |  |
| `recordThenEncode` | 录制结束后转码 |  |
{/* xaction-metadata:end */}

## 使用说明

本模块与[屏幕截图](/v2/xaction/modules/screencapture)共享基础使用说明；本页上方参数表是当前模块自身的定义。
