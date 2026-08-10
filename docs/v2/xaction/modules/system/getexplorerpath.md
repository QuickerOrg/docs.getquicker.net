---
title: "获取资源管理器路径/跳转路径"
description: "获取资源管理器的当前文件夹路径。"
slug: "/v2/xaction/modules/getexplorerpath"
sidebar_label: "获取资源管理器路径/跳转路径"
sidebar_position: 110
quickerDocKey: "xaction/module/sys:getExplorerPath"
comments: true
moduleKey: "sys:getExplorerPath"
docStatus: "migrated-unreviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 2131484
legacyContentUpdatedAt: "2022-11-12T12:00:34.000Z"
---

# 获取资源管理器路径/跳转路径

获取资源管理器的当前文件夹路径。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:getExplorerPath" />

用于获取当前资源管理器窗口的路径，或跳转到指定路径。

![](./img/getexplorerpath-001-f0c748b17a.png)

## 获取路径

获取资源管理器窗口所打开的目录路径。

![](./img/getexplorerpath-002-898fd2a554.png)

输出参数

【当前窗口路径】当前具有焦点的资源管理器窗口路径。

【所有打开的路径】所有资源管理器窗口打开的路径的列表。

【最近访问的路径】（在使用其它软件时）获取最近打开的资源管理器窗口的路径。示例动作：[切换](https://getquicker.net/Sharedaction?code=b7a369da-ec8e-4d0f-764b-08d950c2afd2)

## 设置路径

用于跳转前台资源管理器窗口到指定的目录。

![](./img/getexplorerpath-003-f463d225d5.png)

输入参数

【路径】需要跳转到的目标目录路径。
