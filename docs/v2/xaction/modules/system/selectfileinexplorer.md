---
title: "在资源管理器中定位文件"
description: "在资源管理器中选中文件"
slug: "/v2/xaction/modules/selectfileinexplorer"
sidebar_label: "在资源管理器中定位文件"
sidebar_position: 190
quickerDocKey: "xaction/module/sys:SelectFileInExplorer"
comments: true
moduleKey: "sys:SelectFileInExplorer"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 2131870
legacyContentUpdatedAt: "2022-11-12T12:17:59.000Z"
---

# 在资源管理器中定位文件

打开文件所在目录，并在资源管理器里选中该文件或文件夹。已经打开着窗口、只想改选中项，用 [获取选择的文件(夹)/选择特定文件](/v2/xaction/modules/getselectedfiles)。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:SelectFileInExplorer" />

## 概述

<ModuleParamPreview moduleKey="sys:SelectFileInExplorer" />

运行后会打开所在目录并选中目标：

![](./img/selectfileinexplorer-002-a80c04e0f4.png)

## 参数说明

**路径**：要定位的文件或文件夹完整路径。

**失败后停止**：失败是否中止动作。默认开启。

## 输出

- **是否成功**：是否打开并选中成功。

## 限制与排障

路径必须存在。只改当前（或指定句柄的）资源管理器选中项、不新开窗口时，用「设置选择的文件」。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/getselectedfiles',
      label: '获取选择的文件(夹)/选择特定文件',
      description: '读取或设置当前窗口里的选中项。',
    },
    {
      href: '/v2/xaction/modules/getexplorerpath',
      label: '获取资源管理器路径/跳转路径',
      description: '读取或跳转资源管理器当前目录。',
    },
  ]}
/>
