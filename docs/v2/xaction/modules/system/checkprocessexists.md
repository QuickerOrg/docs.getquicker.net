---
title: "检查程序已启动/获取进程信息"
description: "检查指定的应用程序是否已经启动。"
slug: "/v2/xaction/modules/checkprocessexists"
sidebar_label: "检查程序已启动/获取进程信息"
sidebar_position: 130
quickerDocKey: "xaction/module/sys:checkProcessExists"
comments: true
moduleKey: "sys:checkProcessExists"
docStatus: "migrated-unreviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 2131828
legacyContentUpdatedAt: "2021-08-03T05:28:28.000Z"
---

# 检查程序已启动/获取进程信息

检查指定的应用程序是否已经启动。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:checkProcessExists" />

检查某个软件是否在运行中（检查系统中存在指定名称的进程）。

<ModuleParamPreview moduleKey="sys:checkProcessExists" />

## 参数

【进程名称/pid】要检查的进程名称或ID。

进程名称通常为应用程序文件.exe去除.exe后缀的部分。如quicker软件主程序为“quicker.exe”，对应的进程名为“quicker”；Word软件对应的进程名为“winword”。

可以通过“窗口进程名”菜单直接获取：按住并拖放到目标软件窗口上松开。

【失败后停止】获取失败后是否停止动作。

### 输出

【操作是否成功】是否成功得到了数据。此操作可能因为权限等原因无法访问某些进程的信息。注意：此输出不代表程序是否在运行，只是代表本次检测操作没有遇到异常。

【是否运行】进程是否在运行。

【进程ID】进程的id数字。

【所有进程id列表】对于有多个同名进程同时运行的情况，返回这些进程id的列表。

【程序路径】进程所对应的exe文件路径。

【主窗口句柄】进程的主窗口句柄（MainWinHandle）数字。不是所有的进程都有此数据。

【主窗口标题】进程的主窗口标题文字。不是所有的进程都有此信息。

【启动时间】进程开始运行的时间。

## 版本历史

-   1.9.13 增加根据pid获取进程信息的功能；增加进程信息的输出。
