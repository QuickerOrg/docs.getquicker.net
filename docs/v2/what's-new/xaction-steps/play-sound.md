---
title: 播放声音模块
description: Quicker 2.x 播放声音模块的弱提醒音效与独立音量倍率。
sidebar_position: 220
quickerDocKey: v2/what's-new/xaction-steps/play-sound
comments: true
---

# 播放声音模块

2.x 在原有信息、截图、成功、警告和错误提示音之外，增加了“弱提醒”内置音效。

弱提醒适合频繁执行但不需要强烈打断用户的动作，例如后台任务完成、轻量状态变化或短间隔工作流提示。它和其它内置音效一样，不需要准备外部音频文件。

播放本地或网络音频、系统 TTS 朗读以及是否等待播放完成等原有能力保持不变。

参数说明见[播放声音](/v2/xaction/modules/playsound)。

## 2.3.32 · 单独调整播放音量

播放内置音效、本地文件或网络音频时，可设置 **音量倍率**，范围 0～4，支持小数。例如填 `0.5` 可减弱提醒声，填 `2` 可放大；默认 `1` 为原始音量，`0` 为静音。它不改变系统音量，也不影响 TTS 朗读；过度放大可能失真。

脚本动作的 `qk.Sys.PlaySound` 同时支持 `volumeGain` 参数，例如 `qk.Sys.PlaySound("dim", volumeGain: 0.5)`。使用新倍率的动作或脚本需要 2.3.32 或更高版本；完整参数见[脚本 API](/v2/script-action/api/sys#sysplaysound)。
