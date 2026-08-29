---
title: "获取前台进程信息"
description: "获取当前活动窗口进程的信息。"
slug: "/v2/xaction/modules/getactiveprocessinfo"
sidebar_label: "获取前台进程信息"
sidebar_position: 60
quickerDocKey: "xaction/module/sys:getActiveProcessInfo"
comments: true
moduleKey: "sys:getActiveProcessInfo"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-29 16:36:01"
legacyDocId: 2118185
legacyContentUpdatedAt: "2019-07-15T04:33:57.000Z"
---

# 获取前台进程信息

读取当前活动窗口所属进程的路径、名称和 PID。要按名称查某个程序是否在跑，用 [检查程序已启动/获取进程信息](/v2/xaction/modules/checkprocessexists)。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:getActiveProcessInfo" />

## 概述

<ModuleParamPreview moduleKey="sys:getActiveProcessInfo" />

## 参数说明

**失败后中止动作**：拿不到进程信息时是否停止动作。默认开启。

## 输出

- **是否成功**：是否拿到了进程信息。权限不足时可能失败。
- **程序路径**：进程 exe 的完整路径。
- **进程名**：通常是去掉 `.exe` 的文件名，如记事本是 `notepad`。
- **PID**：进程 ID。

## 限制与排障

部分系统进程或提权进程会因权限读不到路径。先看 **是否成功**，不要假定路径一定有值。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/checkprocessexists',
      label: '检查程序已启动/获取进程信息',
      description: '按进程名或 PID 查询是否在运行。',
    },
    {
      href: '/v2/xaction/modules/getwindowtitle',
      label: '获取窗口信息/查找窗口',
      description: '同时要标题、句柄、位置时用窗口模块。',
    },
  ]}
/>
