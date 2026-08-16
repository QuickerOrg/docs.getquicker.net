---
title: AI 与 Agent 当前状态
description: Quicker V2 当前面向普通用户开放的 AI 设置、组合动作 AI 模块，以及 Agent 相关功能边界。
sidebar_position: 45
quickerDocKey: v2/features/ai-and-agent
comments: true
---

# AI 与 Agent 当前状态

Quicker V2 已经提供统一 AI 设置和一组组合动作 AI 模块。Agent、隔离浏览器控制、桌面或 computer-use 类能力仍处于开发或发布门控状态，不是普通用户当前可直接使用的完整功能。

## 当前可用

- [统一 AI 服务与模型设置](/v2/what's-new/ai-services-and-models)：配置服务连接、模型能力、用途候选和本机凭据。
- [AI 文本处理](/v2/xaction/modules/ai-text)：总结、改写、翻译、校对和自定义提示词处理。
- [AI 图片理解](/v2/xaction/modules/ai-vision)：让支持图片输入的模型分析截图或图片。
- [AI 文本分类](/v2/xaction/modules/ai-classify)：从预定义分类中返回稳定 Key。
- [AI 结构化提取](/v2/xaction/modules/ai-extract)：按 JSON Schema 从文本提取结构化数据。
- [AI 交互对话](/v2/xaction/modules/ai-chat)：打开流式对话窗口，继续追问并由用户明确采用回答。

这些模块会调用你在 **设置 → AI** 中配置的服务和模型。输入内容会发送给实际选中的服务商，费用、日志、数据保留和隐私政策由对应服务商决定。

## 当前不应这样理解

- 看到“Agent 与工具调用”的模型用途，不代表 Agent UI、工具调用编排或动作助手已经向普通用户完整开放。
- 隔离浏览器控制、桌面自动操作和 computer-use 类能力不是当前用户文档可承诺的通用入口。
- 文档站不会承诺手机遥控、Android 局域网控制或其它未在当前用户界面开放的远程能力。

## 建议做法

先用不含敏感信息的样例测试服务连接、模型能力和模块输出，再把 AI 模块放入会写文件、发请求或控制软件的正式动作中。

<RelatedDocs
  items={[
    {
      href: "/v2/what's-new/ai-services-and-models",
      label: '统一 AI 服务与模型设置',
      description: '服务、模型、用途和凭据保存方式',
    },
    {
      href: '/v2/features/tools',
      label: '内置工具',
      description: '截图、AI、选中文本和更新入口',
    },
    {
      href: '/v2/xaction/modules/ai-text',
      label: 'AI 文本处理',
      description: '组合动作 AI 模块入口',
    },
  ]}
/>
