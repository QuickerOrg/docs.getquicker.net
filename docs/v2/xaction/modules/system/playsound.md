---
title: "播放声音"
description: "播放声音提示或声音文件。"
slug: "/v2/xaction/modules/playsound"
sidebar_label: "播放声音"
sidebar_position: 20
quickerDocKey: "xaction/module/sys:playSound"
comments: true
moduleKey: "sys:playSound"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-24 20:01:39"
legacyDocId: 1548354
legacyContentUpdatedAt: "2019-04-18T13:55:13.000Z"
---

# 播放声音

播放内置提示音、本地/网络音频，或用系统 TTS 朗读一段文字。要录音或听写，用 [录制声音/语音识别](/v2/xaction/modules/recordsound)。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:playSound" />

## 概述

先选 **类型**，再填该类型需要的声音来源。

<ModuleParamPreview moduleKey="sys:playSound" />

## 参数说明

**类型**：内置声音提示、电脑文件或网络文件、朗读文本（系统 TTS）。

**提示音类型**：仅 **内置声音提示**。信息、截图、成功、警告、错误、弱提醒。（内置音频由网友 Moy 提供。）

**路径或URL**：仅 **电脑文件或网络文件**。本地路径或网址。

**文本内容**：仅 **朗读文本（系统 TTS）**。要朗读的文字。

**等待播放完成**：是否等声音播完再继续后续步骤。

**失败后停止**：播放失败是否中止动作。默认开启。

## 输出

- **是否成功**：是否播放成功。

## 限制与排障

网络文件依赖当前能否访问该 URL。TTS 用的是系统语音，电脑未安装对应语音包时可能无声。切默认播放设备用 [音频设备](/v2/xaction/modules/audiocontrol)。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/recordsound',
      label: '录制声音/语音识别',
      description: '录音或短语音转文字。',
    },
    {
      href: '/v2/xaction/modules/audiocontrol',
      label: '音频设备',
      description: '切换默认输出设备或调音量。',
    },
  ]}
/>
