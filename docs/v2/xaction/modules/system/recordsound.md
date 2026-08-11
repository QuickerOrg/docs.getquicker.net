---
title: "录制声音/语音识别"
description: "录制音频到文件或识别语音"
slug: "/v2/xaction/modules/recordsound"
sidebar_label: "录制声音/语音识别"
sidebar_position: 140
quickerDocKey: "xaction/module/sys:recordSound"
comments: true
moduleKey: "sys:recordSound"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 121815477
legacyContentUpdatedAt: "2025-11-16T15:11:27.000Z"
---

# 录制声音/语音识别

录麦克风、录系统正在播放的声音，或做 60 秒内的短语音听写。只要播放提示音，用 [播放声音](/v2/xaction/modules/playsound)。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:recordSound" />

## 概述

录音前请在 Windows 设置里打开麦克风权限：

![](./img/recordsound-001-96a38c9bda.png)

<ModuleParamPreview moduleKey="sys:recordSound" />

## 参数说明

**操作类型**：录制外部声音、录制正在播放的声音、短语音输入。

**失败后停止**：失败是否中止动作。默认开启。

### 录制外部声音

录麦克风，生成 `.wav`。

<ModuleParamPreview
  moduleKey="sys:recordSound"
  focusKeys={['operation', 'waveFormat', 'filePath', 'autoStartSeconds', 'silentStopSeconds', 'helpText']}
  values={{
    operation: 'record',
    waveFormat: '16000|1',
    filePath: '',
    autoStartSeconds: '0',
    silentStopSeconds: '3',
    helpText: '',
  }}
/>

**采样率和声道**：点开下拉看当前全部选项。

**文件保存路径**：

- 留空：存到系统 TEMP，并把实际路径写入输出。
- 目录路径：存在该目录，按时间自动生成文件名。
- 完整文件路径：写入该文件，已存在则覆盖。

**自动开始录音**：倒计时秒数。`0` 立即开始，`-1` 不自动开始。默认 `0`。

**静音停止秒数**：检测到音量较低持续多久后自动停止。小于 `1` 不检测。默认 `3`。

**提示文字**：显示在录音窗口里。

### 录制正在播放的声音

录某个软件正在播放的声音。保存路径、静音停止与上面相同。

<ModuleParamPreview
  moduleKey="sys:recordSound"
  focusKeys={['operation', 'filePath', 'silentStopSeconds', 'volumeGain', 'outputFilePath']}
  values={{operation: 'record_internal', filePath: '', silentStopSeconds: '3', volumeGain: '0'}}
  outputVars={{outputFilePath: 'outputFilePath'}}
/>

**音量增益倍率**：录制时的放大倍数。`1.0` 为原始音量，建议 `1.0`–`5.0`；`0` 或负数不做增益。默认 `0`。

### 短语音输入

使用 [讯飞语音听写（流式版）](https://console.xfyun.cn/services/iat)，把约 60 秒内的语音转成文字。

<ModuleParamPreview
  moduleKey="sys:recordSound"
  focusKeys={['operation', 'silentStopSeconds', 'helpText', 'vendorAccount', 'speechContent']}
  values={{operation: 'short_voice_input', silentStopSeconds: '3', helpText: 'hi，请输入指令。'}}
  outputVars={{speechContent: 'text'}}
/>

**服务商账号**：专业版可留空免费使用。自备账号时，在讯飞后台开通「动态修正」，按下面格式填写（不要多余空格）：

```text
APPID:3e2c9c06
APIKey:cd64XXXXXXXXXXXXXXXXXXXXXXXXXXX
APISecret:MGEXXXXXXXXXXXXXXXXXXXXXXXXX
```

![](./img/recordsound-005-d38bea7c6b.png)

## 输出

- **是否成功**
- **文件保存路径**：仅两种录音。实际写入的音频路径。
- **语音文字内容**：仅短语音输入。
- **错误**：仅短语音输入。失败原因。

## 限制与排障

Windows 未开麦克风权限时录不到外部声音。短语音依赖讯飞服务，账号格式不对或未开通动态修正会失败，看 **错误** 输出。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/playsound',
      label: '播放声音',
      description: '播放提示音或朗读文本。',
    },
    {
      href: '/v2/xaction/modules/audiocontrol',
      label: '音频设备',
      description: '切换默认输入/输出设备。',
    },
  ]}
/>
