---
title: "AI 图片理解"
description: "使用全局 AI 设置理解图片内容并回答问题"
slug: "/v2/xaction/modules/ai-vision"
sidebar_label: "AI 图片理解"
sidebar_position: 150
quickerDocKey: "xaction/module/sys:aiVision"
comments: true
moduleKey: "sys:aiVision"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-12 20:29:09"
---

# AI 图片理解

将图片和问题发送给支持视觉输入的模型，用于识别文字、描述画面、分析截图或提取图片中的信息。

使用前，请先在 Quicker 的 **设置 → AI** 中配置服务、模型和“图片理解”任务场景，并确认候选模型明确支持图片输入。配置方式见[统一 AI 服务与模型设置](/v2/what's-new/ai-services-and-models)。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:aiVision" />

## 基本用法

1. 将截图、剪贴板图片或其它图片变量传给“图片”。
2. 在“问题或任务”中说明希望模型观察或回答的内容。
3. 如有必要，填写辅助文本和系统提示词。
4. 从“回答”输出中取得结果。

例如，把截图步骤的图片输出传给本模块，在“问题或任务”中填写“提取图片中的全部文字，保持原有段落顺序”，即可把识别结果传给后续文本步骤。

## 输出方式

“直接返回”适合自动化流程。“交互调整”会打开 Markdown 对话窗口，流式显示回答并允许基于当前图片继续追问；只有点击“采用当前回答”才会输出结果，关闭或取消窗口会按用户取消结束。

## 图片与模型限制

- 图片不得超过 4000 万像素；转换为 PNG 后不得超过 10 MiB。超过限制时请先缩小或压缩图片。
- 候选模型必须在 AI 设置中明确标记为支持图片输入。能力为未知或不支持的模型不会满足本模块要求。
- 动作只保存任务场景 ID，不保存 API Key。换设备后需要重新填写本机凭据。
- 图片、问题和辅助文本会发送给实际选中的 AI 服务商，请确认内容符合相应的隐私与合规要求。
