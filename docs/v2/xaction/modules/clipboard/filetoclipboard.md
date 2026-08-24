---
title: "文件放入剪贴板"
description: "将文件或文件列表存入剪贴板"
slug: "/v2/xaction/modules/filetoclipboard"
sidebar_label: "文件放入剪贴板"
sidebar_position: 50
quickerDocKey: "xaction/module/sys:fileToClipboard"
comments: true
moduleKey: "sys:fileToClipboard"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-24 20:01:39"
legacyDocId: 2067561
legacyContentUpdatedAt: "2019-07-08T14:02:45.000Z"
---

# 文件放入剪贴板

把磁盘上的文件或文件夹放进剪贴板，方便在聊天窗口、资源管理器里粘贴。写入文本或图片用 [写入剪贴板](/v2/xaction/modules/writeclipboard)。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:fileToClipboard" />

## 概述

指定一个文件路径，或传入多个路径组成的列表。粘贴时对方收到的是文件本身，不是路径文本。

<ModuleParamPreview moduleKey="sys:fileToClipboard" />

## 参数说明

**单个文件** 和 **文件列表** 二选一，不要同时填。

**单个文件**：一个文件或文件夹的完整路径。

**文件列表**：多个路径组成的列表。数量不定、或可能只有一项时，用这个。

<ModuleParamPreview
  moduleKey="sys:fileToClipboard"
  focusKeys={['file', 'list']}
/>

**剪切文件**：勾选后按剪切放入。在资源管理器里粘贴会移走原文件，而不是复制一份。默认关闭。

**失败后停止**：放入失败是否中止动作。默认开启。

## 输出

- **是否成功**：是否放入成功。

## 限制与排障

文件必须存在，并且当前能读（没有被别的软件独占锁定）。路径填错、文件已删或正在被占用时，这一步会失败。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/getclipboardfiles',
      label: '获取剪贴板文件列表',
      description: '把剪贴板里的文件路径读回来。',
    },
    {
      href: '/v2/xaction/modules/writeclipboard',
      label: '写入剪贴板',
      description: '写入文本、图片或 HTML，不是文件。',
    },
  ]}
/>
