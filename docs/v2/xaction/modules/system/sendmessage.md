---
title: "向窗口发送消息"
description: "使用SendMessage Win32Api向窗口发送消息。使用方法请搜索SendMessage Win32 API接口。"
slug: "/v2/xaction/modules/sendmessage"
sidebar_label: "向窗口发送消息"
sidebar_position: 170
quickerDocKey: "xaction/module/sys:sendMessage"
comments: true
moduleKey: "sys:sendMessage"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-24 20:01:39"
legacyDocId: 1627562
legacyContentUpdatedAt: "2024-08-09T13:50:24.000Z"
---

# 向窗口发送消息

向指定窗口发送 Win32 消息。需要了解 [SendMessage](https://learn.microsoft.com/windows/win32/api/winuser/nf-winuser-sendmessage) 才能正确选用消息和参数。只要移动、关闭、置顶窗口，优先用 [窗口操作](/v2/xaction/modules/windowoperations)。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:sendMessage" />

## 概述

0.11.4 起提供。默认的 SendMessage 要求 lParam 为数字；需要传文本 lParam，或不等待返回时，换操作类型。

<ModuleParamPreview moduleKey="sys:sendMessage" />

## 参数说明

**操作类型**：

- SendMessage（等待返回，LParam 为数字）
- SendMessage（等待返回，LParam 为文本）
- PostMessage（不等待返回）

**窗口句柄hWnd**：目标窗口。留空或 `0` 表示前台窗口。

**消息**：十进制（如 `1234`）或十六进制（如 `0x0112`）。

**wParam参数**：十进制或十六进制。

**lParam参数**：仅数字 lParam 的两种操作。十进制或十六进制。

**lParam参数(文本)**：仅 LParam 为文本的 SendMessage。

**失败后停止**：失败是否中止动作。默认开启。

## 输出

- **是否成功**：是否发送成功。
- **返回值**：仅两种 SendMessage。含义随消息而变，见对应 API 文档。

## 示例

用窗口消息把窗口最大化：

<StepProgramView example="ef1a10ef-bbb2-4dcf-5f17-08d6cebc3090" />

<ShareLinkCard
  code="ef1a10ef-bbb2-4dcf-5f17-08d6cebc3090"
  title="示例：发送窗口消息"
  description="使用发送消息到窗口实现最大化窗口功能。"
  author="CL"
/>

## 限制与排障

发错消息可能导致目标程序异常。先确认句柄来自 [获取窗口信息/查找窗口](/v2/xaction/modules/getwindowtitle)。常用 `WM_SYSCOMMAND` 见 [WM_SYSCOMMAND](https://learn.microsoft.com/windows/win32/menurc/wm-syscommand)。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/getwindowtitle',
      label: '获取窗口信息/查找窗口',
      description: '先拿到窗口句柄。',
    },
    {
      href: '/v2/xaction/modules/windowoperations',
      label: '窗口操作',
      description: '常见窗口动作不必自己发消息。',
    },
  ]}
/>
