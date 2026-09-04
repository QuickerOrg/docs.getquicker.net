---
title: AI 与 Agent 现状
description: Quicker V2 当前对普通用户开放的 AI 能力，以及尚未普遍开放的 Agent 范围。
sidebar_position: 55
quickerDocKey: v2/features/ai-and-agent
comments: true
---

# AI 与 Agent 现状

这页只说明**现在普通用户能用什么**。不是 Agent、浏览器控制或桌面操控的教程。

## 现在可以用

- **统一 AI 设置**：设置里的「AI 服务」和「用途与模型」，用来管理连接、模型和用途优选。说明见 [统一 AI 服务与模型设置](/v2/what's-new/ai-services-and-models.md)。
- **Quicker AI 写动作预览**：2.2.0 起，可在新版主窗口暂存区点击 **用 AI 写**，让 AI 生成或修改暂存动作；完成后暂存区会自动刷新。2.2.4 起，重复点击 **用 AI 写** 会复用没有草稿的空对话；还没有配置模型时，会直接打开「配置 API」。长对话压缩或重新打开后，已经生效的动作编辑规则仍会保留。生成结果先留在本机暂存区，确认可用后再执行「保留到场景」转为正式动作。功能仍在改进中，AI 可能写错步骤或逻辑，保存前请自行检查、试运行和调试。
- **五个组合动作模块**，共用上面的全局设置，不必在每个步骤里重填地址和 Key：
  - [AI 文本处理](/v2/xaction/modules/ai-text)
  - [AI 图片理解](/v2/xaction/modules/ai-vision)
  - [AI 文本分类](/v2/xaction/modules/ai-classify)
  - [AI 结构化提取](/v2/xaction/modules/ai-extract)
  - [AI 交互对话](/v2/xaction/modules/ai-chat)

首次使用 AI 能力前，需要在「配置 API」中添加服务商、模型和 API Key。多数服务需要自备账号和额度；API Key 只在本机加密保存，不随动作分享，也不随普通设置文件拷到另一台电脑。

## 还没有对普通用户普遍开放

- **Agent**、**隔离的浏览器控制**、**桌面 / Computer Use** 仍处于门控或开发中。
- 设置里看到「Agent 与工具调用」这种**模型用途**，只表示可以给这类用途选模型，**不等于**这些界面已经对普通用户开放。
- 不要把 1.x 的手机遥控或 Android 局域网遥控当成 V2 已有能力。V2 已移除手机 App 遥控器，目前也没有承诺替代方案。见 [不再支持的功能](/v2/what's-new/not-supported.md)。

具体功能是否已经改用统一候选模型，以该功能自己的页面和软件界面为准。
