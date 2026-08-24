---
title: "获取系统路径"
description: "返回指定的特殊目录路径。"
slug: "/v2/xaction/modules/getfolderpath"
sidebar_label: "获取系统路径"
sidebar_position: 90
quickerDocKey: "xaction/module/sys:getFolderPath"
comments: true
moduleKey: "sys:getFolderPath"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-24 20:01:39"
legacyDocId: 2121294
legacyContentUpdatedAt: "2019-07-15T08:30:07.000Z"
---

# 获取系统路径

返回 Windows 特殊目录的实际路径，例如桌面、下载、开始菜单。要检查路径是否存在，用 [检查路径/获取文件信息](/v2/xaction/modules/checkpathexists)。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:getFolderPath" />

## 概述

选一个目录类型，步骤返回该文件夹的完整路径。

<ModuleParamPreview moduleKey="sys:getFolderPath" />

## 参数说明

**目录类型**：要获取的系统目录。点开下拉看当前全部选项，对应 .NET `Environment.SpecialFolder`（另有 Downloads 等扩展项）。说明见 [SpecialFolder](https://learn.microsoft.com/zh-cn/dotnet/api/system.environment.specialfolder)。

## 输出

- **路径**：该目录的完整路径。

## 限制与排障

个别类型在当前系统上可能没有对应文件夹，此时路径可能为空。不要手写盘符去猜「我的文档」等位置，用本模块取当前用户的实际路径。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/checkpathexists',
      label: '检查路径/获取文件信息',
      description: '拿到路径后再确认是否存在。',
    },
    {
      href: '/v2/xaction/modules/pathextraction',
      label: '路径提取',
      description: '从完整路径拆出目录、文件名。',
    },
  ]}
/>
