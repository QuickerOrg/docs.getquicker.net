---
title: "后台屏幕录制"
description: "后台录制屏幕区域，用同一会话 ID 跨步骤或跨动作运行开始、暂停、继续和结束录屏。"
slug: "/v2/xaction/modules/screen-recording"
sidebar_label: "后台屏幕录制"
sidebar_position: 20
quickerDocKey: "xaction/module/sys:screenRecording"
comments: true
moduleKey: "sys:screenRecording"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-24 20:01:39"
---

# 后台屏幕录制

后台把一块屏幕录成视频文件。开始后动作可以继续执行；用同一个会话 ID，可以在后续步骤或后一次动作运行中暂停、继续和结束录屏。需要框选界面和录屏工具栏时用 [屏幕录制](/v2/xaction/modules/screen-recording-ui)。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:screenRecording" />

## 概述

本模块没有选区界面和录屏工具栏。开始录制时指定范围，之后通过会话 ID 控制录制。

这里的“后台”指录屏可以持续进行，同时执行后续步骤或其它操作。本模块录制的是屏幕区域，不能据此录到被其它窗口遮挡或最小化窗口中的独立画面。

:::info[跨运行录屏的版本要求]

以下跨运行用法需要客户端支持“动作结束后继续录屏”。旧版本可能在动作结束时自动停止；请使用包含此行为调整的版本，并参考[官网版本记录](https://getquicker.net/V2/Versions)。仅保存会话 ID 不会改变旧版本的行为。

:::

2.1.23 起，录制时可以选择保存文件夹。成品放在自定义目录时，采集历史中心只建立索引，不会为了加入历史再额外复制一份文件。

:::caution[升级后检查默认范围]

2.1.23 起，后台屏幕录制步骤的默认录制范围改为 **主屏幕**。已明确保存录制范围的动作不受影响；其它旧动作升级后请打开步骤确认范围，避免原本依赖旧默认值的动作录到不符合预期的屏幕。

:::

<RelatedDocs
  layout="cards"
  items={[
    {
      href: '/v2/xaction/modules/screen-recording-ui',
      label: '屏幕录制',
      description: '弹出选区界面，可视化开录、停录。',
      featured: true,
    },
    {
      href: '/v2/features/screenshot',
      label: '截图与贴图概览',
      description: '录屏历史与相关功能入口。',
    },
  ]}
/>

<ModuleParamPreview moduleKey="sys:screenRecording" />

## 会话什么时候结束

**动作结束不会自动停止后台录屏。** 组合动作和脚本动作均如此：流程正常返回、报错或被中止后，已开始的录屏仍会继续。

- 通过本模块的 **结束录屏** 操作，或在 **录屏管理** 中点击停止，显式结束录制。
- 在录屏管理中停止动作创建的录屏，也会独立完成编码和历史收尾，不需要原动作继续运行。成功完成后可在录屏历史中查看成品。
- 会话只在当前 Quicker 运行期间有效，不能跨 Quicker 重启继续录制。重启后，即使还保存着原 ID，也不能再用它控制原会话。

如果只想录制本次动作的过程，请在流程末尾显式添加“结束录屏”步骤。**失败后停止** 只决定是否中止动作，不会代替结束录屏；异常退出后可到录屏管理中停止。

## 分两次运行开始和结束

1. **第一次运行**：操作选择“开始录屏”，设置录制范围和输出文件夹；会话 ID 留空可自动生成，将输出的“会话 ID”保存下来。
2. **保存 ID**：同一个动作下次运行时，可用[状态存取](/v2/xaction/modules/statestorage)读取上次保存的 ID。普通动作变量不会自动保留到下次运行；如果由另一个动作结束录屏，需把 ID 传给该动作，或约定共用的状态键。
3. **第二次运行**：操作选择“结束录屏”，传入保存的 ID。需要立即使用成品时，保持“等待编码完成”开启，成功后读取“文件路径”，再清除保存的 ID。

暂停和继续录屏也使用同一个 ID。不要在每次控制录屏时重新生成 ID，也不要重复执行“开始录屏”来尝试结束已有会话；仍在使用的 ID 不能再次用于开始新录屏。

### 脚本动作示例

下面的示例用于同一个**已保存的脚本动作**：第一次传入 `start`，后一次传入 `stop`。通过 [qk.State](/v2/script-action/api/state) 保存 ID，通过 [qk.Steps.Run](/v2/script-action/api/steps) 调用录屏模块。

```csharp
string Main(string operation = "start")
{
    const string stateKey = "recordingSessionId";
    if (operation == "start")
    {
        if (!string.IsNullOrEmpty(qk.State.GetText(stateKey)))
            return "已有保存的会话 ID，请先结束录屏；若会话已失效，请清除旧状态后再开始。";
        var result = qk.Steps.Run("sys:screenRecording", new {
            operation = "start",
            regionType = "primary_screen",
            outputFormat = "mp4",
            exportQuality = "standard",
            encodingStrategy = "encodeWhileRecording"
        });
        string id = (string)result["sessionIdOut"];
        qk.State.SetText(stateKey, id);
        return id;
    }
    if (operation == "stop")
    {
        string id = qk.State.GetText(stateKey);
        if (string.IsNullOrEmpty(id))
            return "没有保存的录屏会话 ID。";
        var result = qk.Steps.Run("sys:screenRecording", new {
            operation = "stop", sessionId = id, waitForCompletion = true
        });
        qk.State.Remove(stateKey);
        return (string)result["filePath"];
    }
    return "operation 仅支持 start 或 stop。";
}
```

开始分支需要显式填写其控制字段；结束分支只提供结束时需要的参数，不要带上录制范围、输出格式等开始分支参数。跨运行录屏不要在 `finally` 中无条件结束。未保存动作的状态不保证跨运行保留；结束失败时，上例保留 ID，方便排查或重试。

## 参数说明

**操作**：开始录屏、暂停录屏、继续录屏、结束录屏。

**会话 ID**：GUID。开始时留空会自动生成，也可指定一个尚未使用的 ID；暂停 / 继续 / 结束时，必须填写开始录屏时使用或输出的同一个 ID。

**失败后停止**：失败是否中止动作。默认开启。

仅「开始录屏」：

**录制范围**：固定区域、主屏幕、所有屏幕。

**录制区域**：仅固定区域。格式 `left,top,right,bottom`。右边和底边像素是否包含，由“包含右下边像素”决定。

**包含右下边像素**：仅固定区域。打开时 `0,0,2,2` 是 3×3；关闭时是 2×2。默认开启。

**输出文件夹路径**：成品保存到指定文件夹，文件名为 `Recording_时间戳`。留空且未指定旧“输出文件路径”时，使用默认位置。

**输出文件路径**：用于兼容旧动作的高级参数，始终按文件路径处理；新动作请优先使用“输出文件夹路径”。同时填写时，以输出文件夹路径为准。

**输出格式**：MP4、GIF、AVI。

**导出画质**：标准、高清、原始。

**帧率**：会规整到 10 / 15 / 24 / 30 / 60。默认 `30`。

**显示鼠标光标**：画面里是否画出鼠标。默认开启。

**编码策略**：实时编码（停录后立即可用，需要 QuickerAvCodec）；或录制结束后再转码（停录后要等 ffmpeg）。

2.2.20 起，开始录屏时可在客户端编辑器中选择编码方案，并填写多行 **FFmpeg 参数**（支持变量），用于自定义编码器、码率或滤镜。使用自定义编码时仍需本机 ffmpeg 路径检测通过；同一次录制会话会固定使用开始时的 ffmpeg 路径和参数，并贯穿实时编码、延后转码、预览保存和音频合成。自定义参数只应描述编码和过滤选项，不要再添加额外输出文件。若当前参数预览暂未显示这些字段，请以客户端步骤编辑器和[官网版本记录](https://getquicker.net/V2/Versions)为准。

**开始后立即返回**：默认开启，请保持开启。开始步骤启动录制后立即返回，后续步骤可以继续执行；它不表示动作结束时自动停止录屏，结束请使用单独的结束操作。

**开始前延迟**：等多少毫秒再开录。

仅「结束录屏」：

**等待编码完成**：是否等文件写完。默认开启。

**结束后删除会话**：成功结束后移除会话 ID，默认开启。这不会删除录制成品；移除后不能再用原 ID 控制该会话。

**加入录屏历史**：是否把成品纳入本机录屏历史。后台录屏默认不加入；2.1.23 起，若成品保存到自定义目录，历史里只建立索引。

本参数控制通过“结束录屏”步骤结束时的行为，需要同时开启“等待编码完成”。在录屏管理中点击停止时，则由管理器完成历史收尾。

## 输出

- **是否成功**：本步是否成功。
- **会话 ID**：给后续暂停 / 继续 / 结束用。
- **文件路径**：录完后的视频路径。
- **录制时长**：秒。
- **录制区域**：实际录到的范围，格式 `left,top,right,bottom`。
- **错误消息**：失败时的说明。

## 常见问题

### 动作已经结束，为什么还在录屏

在支持跨运行会话的版本中，这是预期行为。请在后一次运行中通过同一 ID 结束，或到录屏管理中停止。如果需要跟随本次流程结束，请显式添加结束操作。

### 提示“未找到录屏会话”

确认传入的是开始录屏时的 ID。Quicker 已重启、已经在录屏管理中停止，或结束步骤已删除会话时，保存的旧 ID 就不能再使用。确认会话已经失效后，清除动作状态里的旧 ID，再开始新的录屏。

### 一直显示“正在结束”，或成品还不能使用

停止采集后仍可能需要编码或转码，耗时与时长、分辨率和编码设置有关。需要马上读取成品时，开启“等待编码完成”；关闭时，不应把步骤返回当作文件已经写完。

录屏管理负责处理其中的停止操作，原动作已经结束不应妨碍收尾。如果长时间没有进展，请记录客户端版本、输出位置和编码设置，用于排查；旧版本遗留的会话也应先确认是否仍在编码。

## 相关步骤

<RelatedDocs
  layout="cards"
  items={[
    {
      href: '/v2/xaction/modules/screencapture',
      label: '屏幕截图',
      description: '只要一张静图，不用录视频。',
    },
    {
      href: '/v2/xaction/modules/screen-capture-pro',
      label: '截图 Pro',
      description: '选区界面里也可以进入录屏。',
    },
  ]}
/>
