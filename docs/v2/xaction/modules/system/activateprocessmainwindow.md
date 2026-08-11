---
title: "激活进程主窗口"
description: "找到指定进程的主窗口并使其显示在前台。"
slug: "/v2/xaction/modules/activateprocessmainwindow"
sidebar_label: "激活进程主窗口"
sidebar_position: 120
quickerDocKey: "xaction/module/sys:activateProcessMainWindow"
comments: true
moduleKey: "sys:activateProcessMainWindow"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 2131596
legacyContentUpdatedAt: "2022-06-14T05:58:37.000Z"
---

# 激活进程主窗口

找到指定进程的主窗口并提到前台。进程还没启动时，可按 **程序路径** 自动打开。只要窗口句柄、不要按进程找，用 [窗口操作](/v2/xaction/modules/windowoperations)。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:activateProcessMainWindow" />

## 概述

会依次尝试：进程主窗口句柄 → **窗口类名** / **窗口标题** → 该进程桌面上的第一个窗口。窗口藏在托盘时，可再发 **热键**（软件自己要支持，如部分 IM）。

<ModuleParamPreview moduleKey="sys:activateProcessMainWindow" />

## 参数说明

**进程名称/pid**：要激活的进程。进程名通常是 exe 去掉 `.exe`，如记事本是 `notepad`。可按住输入框右侧的窗口工具拖到目标窗口：

![](./img/activateprocessmainwindow-002-d898ebff74.gif)

**热键**：选填。最小化到托盘时发送的全局热键，格式见 [模拟按键B](/v2/xaction/modules/sendkeys)。

**窗口类名**：选填。拿不到主窗口时按类名查找，支持正则。

**窗口标题**：选填。拿不到主窗口时按标题查找，支持正则。

**程序路径**：选填。进程不存在时按此路径启动程序。

**失败后停止**：失败是否中止动作。默认开启。

## 输出

- **是否成功**：是否找到并激活了主窗口。
- **PID**：进程 ID。
- **主窗口句柄**：窗口句柄。
- **主窗口标题**：窗口标题。

## 限制与排障

不是所有进程都有主窗口句柄，可能误判（已知部分 QQ 版本有此问题）。热键必须是软件自己注册的全局热键，Quicker 无法替它「从托盘还原」。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/checkprocessexists',
      label: '检查程序已启动/获取进程信息',
      description: '先确认进程在不在。',
    },
    {
      href: '/v2/xaction/modules/windowoperations',
      label: '窗口操作',
      description: '已有句柄时移动、置顶或设为前台。',
    },
    {
      href: '/v2/xaction/modules/sendkeys',
      label: '模拟按键B',
      description: '热键格式与本模块「热键」相同。',
    },
  ]}
/>
