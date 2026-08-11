---
title: "生成临时文件路径"
description: "根据指定的扩展名生成一个随机的临时文件名（完整路径），供后续步骤写入文件使用。"
slug: "/v2/xaction/modules/gentempfilepath"
sidebar_label: "生成临时文件路径"
sidebar_position: 30
quickerDocKey: "xaction/module/sys:GenTempFilePath"
comments: true
moduleKey: "sys:GenTempFilePath"
docStatus: "migrated-unreviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 2116960
legacyContentUpdatedAt: "2019-07-15T02:45:21.000Z"
---

# 生成临时文件路径

根据指定的扩展名生成一个随机的临时文件名（完整路径），供后续步骤写入文件使用。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:GenTempFilePath" />

根据指定的后缀名，生成一个合法路径用于存储临时文件。

<ModuleParamPreview moduleKey="sys:GenTempFilePath" />

## 参数

### 输入

【扩展名】要生成的文件名后缀。

### 输出

【文件路径】生成的临时文件完整路径。
