---
title: "虚拟桌面"
description: "查询和管理 Windows 虚拟桌面，移动窗口或将窗口固定到所有桌面。支持范围取决于 Windows 完整版本。"
slug: "/v2/xaction/modules/virtualdesktop"
sidebar_label: "虚拟桌面"
sidebar_position: 190
quickerDocKey: "xaction/module/sys:virtualDesktop"
comments: true
moduleKey: "sys:virtualDesktop"
docStatus: "generated"
metadataGeneratedAt: "2026-09-24 08:30:46"
---

# 虚拟桌面

查询和管理 Windows 虚拟桌面，移动窗口或将窗口固定到所有桌面。支持范围取决于 Windows 完整版本。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:virtualDesktop" />

## 使用说明

可查询、创建、切换、删除、重命名和排序 Windows 虚拟桌面，也可移动窗口或设置窗口固定状态。目标可按标识、从 1 开始的编号或名称查找；同名桌面请改用标识或编号。

删除桌面时必须指定另一个现存桌面接收窗口，不能删除最后一个桌面。创建或移动之后再切换失败，不会撤销已完成的操作。桌面标识在删除桌面或换电脑后可能失效。更多说明见[显示器与虚拟桌面](/v2/features/displays-and-desktops)。

## 历史版本相关变化

以下为与本页相关的重要变化，当前用法以正文为准。

- [2.2.20](/release-notes#2220--显示器录屏与-ai)：提供虚拟桌面查询、切换与管理。

更早记录与完整修复列表见[更新记录](/release-notes)。
