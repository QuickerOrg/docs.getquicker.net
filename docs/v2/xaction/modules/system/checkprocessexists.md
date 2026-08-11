---
title: "检查程序已启动/获取进程信息"
description: "检查指定的应用程序是否已经启动。"
slug: "/v2/xaction/modules/checkprocessexists"
sidebar_label: "检查程序已启动/获取进程信息"
sidebar_position: 130
quickerDocKey: "xaction/module/sys:checkProcessExists"
comments: true
moduleKey: "sys:checkProcessExists"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 2131828
legacyContentUpdatedAt: "2021-08-03T05:28:28.000Z"
---

# 检查程序已启动/获取进程信息

按进程名或 PID 检查程序是否在运行，并读取路径、主窗口和启动时间。要直接把该程序提到前台，用 [激活进程主窗口](/v2/xaction/modules/activateprocessmainwindow)。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:checkProcessExists" />

## 概述

进程名通常是 exe 去掉 `.exe`：Quicker 主程序是 `quicker`，Word 是 `winword`。可按住输入框右侧的窗口工具，拖到目标窗口上松开。

<ModuleParamPreview moduleKey="sys:checkProcessExists" />

## 参数说明

**进程名称/pid**：要检查的进程名或进程 ID。

**失败后停止**：获取失败后是否停止动作。默认开启。进程未启动不算操作失败。

## 输出

- **操作是否成功**：本次检测有没有遇到异常（例如无权访问高权限进程）。不代表程序是否在跑。
- **是否运行**：指定进程是否在运行。
- **进程ID**：找到的第一个匹配进程的 ID。
- **所有进程ID列表**：同名进程同时运行时，返回这些 PID 的列表。
- **程序路径**：对应 exe 的路径。
- **主窗口句柄** / **主窗口标题**：不是所有进程都有主窗口。
- **启动时间**：进程开始运行的时间。

## 限制与排障

权限不足时 **操作是否成功** 为否，但进程可能仍在运行。先看 **是否运行**，再用 **操作是否成功** 判断信息是否完整。1.9.13 起支持按 PID 查询。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/activateprocessmainwindow',
      label: '激活进程主窗口',
      description: '找到进程后把它的主窗口提到前台。',
    },
    {
      href: '/v2/xaction/modules/getactiveprocessinfo',
      label: '获取前台进程信息',
      description: '读当前活动窗口所属进程。',
    },
  ]}
/>
