---
title: "后台屏幕录制"
description: "后台录制屏幕区域为视频文件，用会话 ID 跨步骤控制开始、暂停、继续和结束。"
slug: "/v2/xaction/modules/screen-recording"
sidebar_label: "后台屏幕录制"
sidebar_position: 20
quickerDocKey: "xaction/module/sys:screenRecording"
comments: true
moduleKey: "sys:screenRecording"
docStatus: "generated"
metadataGeneratedAt: "2026-08-03 20:08:03"
---

# 后台屏幕录制

后台把一块屏幕录成视频文件。用会话 ID 把「开始 / 暂停 / 继续 / 结束」拆到不同步骤。需要框选界面时用 [屏幕录制](/v2/xaction/modules/screen-recording-ui)。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:screenRecording" />

## 概述

本模块没有选区 UI。开始录制时指定范围；之后用同一个会话 ID 暂停、继续或结束。需要框选界面时请用下面的 **屏幕录制**。

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

## 参数说明

**操作**：开始录屏、暂停录屏、继续录屏、结束录屏。

**会话 ID**：GUID。开始时留空会自动生成；暂停 / 继续 / 结束时必须填。

**失败后停止**：失败是否中止动作。默认开启。

仅「开始录屏」：

**录制范围**：固定区域、主屏幕、所有屏幕。

**录制区域**：仅固定区域。格式 `left,top,right,bottom`。默认不包含右边和底边像素。

**包含右下边像素**：仅固定区域。打开时 `0,0,2,2` 是 3×3；关闭时是 2×2。默认开启。

**输出文件路径**：留空则写到 Quicker 临时目录，文件名带时间戳。

**输出格式**：MP4、GIF、AVI。

**导出画质**：标准、高清、原始。

**帧率**：会规整到 10 / 15 / 24 / 30 / 60。默认 `30`。

**显示鼠标光标**：画面里是否画出鼠标。默认开启。

**编码策略**：实时编码（停录后立即可用，需要 QuickerAvCodec）；或录制结束后再转码（停录后要等 ffmpeg）。

**开始后立即返回**：打开后本步骤启动录制就成功返回；结束请另写一步。默认开启。

**开始前延迟**：等多少毫秒再开录。

仅「结束录屏」：

**等待编码完成**：是否等文件写完。默认开启。

**结束后删除会话**：成功结束后从会话表里删掉。默认开启。

**加入录屏历史**：是否把成品复制到本机录屏历史。后台录屏默认不加入。

## 输出

- **是否成功**：本步是否成功。
- **会话 ID**：给后续暂停 / 继续 / 结束用。
- **文件路径**：录完后的视频路径。
- **录制时长**：秒。
- **录制区域**：实际录到的范围，格式 `left,top,right,bottom`。
- **错误消息**：失败时的说明。

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
