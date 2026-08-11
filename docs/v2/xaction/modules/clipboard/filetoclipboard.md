---
title: "文件放入剪贴板"
description: "将文件或文件列表存入剪贴板"
slug: "/v2/xaction/modules/filetoclipboard"
sidebar_label: "文件放入剪贴板"
sidebar_position: 50
quickerDocKey: "xaction/module/sys:fileToClipboard"
comments: true
moduleKey: "sys:fileToClipboard"
docStatus: "migrated-unreviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 2067561
legacyContentUpdatedAt: "2019-07-08T14:02:45.000Z"
---

# 文件放入剪贴板

将文件或文件列表存入剪贴板

## 当前模块定义

<XActionModuleMeta moduleKey="sys:fileToClipboard" />

## 概述

将指定的一个或多个文件存入剪贴板，方便在其他软件中粘贴（如粘贴在聊天窗口里）。

<ModuleParamPreview moduleKey="sys:fileToClipboard" />

## 参数

根据需求，【单个文件】和【文件列表】两个参数选择一个使用。

单个文件时，使用【单个文件】参数，输入此文件的完整路径。

文件数量不定或多个文件时（这时候也可能列表里只有一个文件），使用【文件列表】参数传入多个文件的路径列表。

请确保文件都是存在的并且可以正常读取（没有被其他软件锁定）。
