---
title: "获取窗口信息/查找窗口"
description: "获取指定窗口的标题等信息。"
slug: "/v2/xaction/modules/getwindowtitle"
sidebar_label: "获取窗口信息/查找窗口"
sidebar_position: 50
quickerDocKey: "xaction/module/sys:getWindowTitle"
comments: true
moduleKey: "sys:getWindowTitle"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-29 16:36:01"
legacyDocId: 2118011
legacyContentUpdatedAt: "2023-02-04T13:19:28.000Z"
---

# 获取窗口信息/查找窗口

读取指定窗口的标题、类名、句柄、位置等，或按条件查找顶层 / 子窗口。找到之后要移动或关闭，用 [窗口操作](/v2/xaction/modules/windowoperations)。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:getWindowTitle" />

## 概述

先选 **目标窗口**，其余条件字段会按类型出现。

<ModuleParamPreview moduleKey="sys:getWindowTitle" />

## 参数说明

**目标窗口**：

- 前台窗口：当前活动窗口。
- 选择一个窗口：运行时让用户点选。2.1.27 起，可正确选中部分透明顶层弹窗。
- 弹出面板前鼠标位置的窗口（可能为子窗口） / 其根窗口
- 当前鼠标位置的窗口（可能为子窗口） / 其根窗口
- 句柄指定的窗口：用 **窗口句柄hWnd**。
- 查找顶层窗口 (单个窗口)：按类名、标题、进程搜索。未指定进程时用 Win32 `FindWindow`，可能找到已隐藏窗口；指定进程时只查可见窗口。
- 所有顶层窗口：返回句柄→标题词典。
- 查找子窗口/控件 (单个窗口) / 查找子窗口 (多个窗口)

**窗口句柄hWnd**：仅句柄指定、查找子窗口时。未指定时用前台窗口句柄。

**窗口类名** / **窗口名称**：仅查找顶层或子窗口时。为空则不检查该项。

**进程名/pid**：仅查找顶层窗口时。为空则不检查。

**仅可见窗口**：未指定 / 仅可见窗口 / 所有窗口。仅查找顶层时显示。

**仅名称(标题)不为空的窗口**：仅查找顶层时。默认开启。

**使用正则匹配窗口类名和标题**：查找顶层或多个子窗口时。默认关闭。

**窗口位置包含不可见边框（阴影区域）**：查单个窗口位置时。默认关闭。

**失败后停止**：失败是否中止动作。默认开启。

## 输出

- **是否成功**
- 单个窗口：**窗口标题**、**类名**、**句柄**、**进程ID**、**进程名**、**程序路径**、**父窗口句柄**、**根窗口句柄**、**根所有者窗口句柄**、**窗口位置**（`Left,Top,Right,Bottom,Width,Height`）、**窗口位置(不含尺寸)**、**窗口位置(词典值)**、**是否置顶**、**是否可见**、**显示状态**（`1` 普通、`2` 最小化、`3` 最大化）、**不透明度**（0–255）、**边框颜色**（`#RRGGBB`，仅 Quicker 设置过的边框）、**所有子窗口**
- **所有顶层窗口**：仅该操作。词典，键为句柄、值为标题。

部分输出在「所有顶层窗口 / 查找子窗口」时不出现，以参数窗为准。

## 示例

循环等待「另存为」窗口出现：

<StepProgramView example="2a59718b-523b-4e7e-a4a8-08d70bf0ab12" />

<ShareLinkCard
  code="2a59718b-523b-4e7e-a4a8-08d70bf0ab12"
  title="示例：等待另存为窗口"
  description="等待另存为对话框打开"
  author="CL"
/>

## 限制与排障

查找不到时先放宽标题/类名，或打开 **使用正则匹配窗口类名和标题**。隐藏窗口只有在未指定进程、走 `FindWindow` 时才可能命中。位置数值是否含阴影边框，看 **窗口位置包含不可见边框**。如果旧版本中“选择一个窗口”无法选中透明顶层弹窗，升级到 2.1.27 后再试。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/windowoperations',
      label: '窗口操作',
      description: '拿到句柄后移动、置顶或关闭。',
    },
    {
      href: '/v2/xaction/modules/activateprocessmainwindow',
      label: '激活进程主窗口',
      description: '按进程把主窗口提到前台。',
    },
  ]}
/>
