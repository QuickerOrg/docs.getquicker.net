---
title: "获取系统路径"
description: "返回指定的特殊目录路径。"
slug: "/v2/xaction/modules/getfolderpath"
sidebar_label: "获取系统路径"
sidebar_position: 90
quickerDocKey: "xaction/module/sys:getFolderPath"
comments: true
moduleKey: "sys:getFolderPath"
docStatus: "migrated-unreviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 2121294
legacyContentUpdatedAt: "2019-07-15T08:30:07.000Z"
---

# 获取系统路径

返回指定的特殊目录路径。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:getFolderPath" />

用于获取特定的Windows系统文件夹路径。

<ModuleParamPreview moduleKey="sys:getFolderPath" />

## 参数

### 输入

【目录类型】指定要获取的系统目录类型。

可选值请参考[https://docs.microsoft.com/zh-cn/dotnet/api/system.environment.specialfolder](https://docs.microsoft.com/zh-cn/dotnet/api/system.environment.specialfolder?f1url=https%3A%2F%2Fmsdn.microsoft.com%2Fquery%2Fdev15.query%3FappId%3DDev15IDEF1%26l%3DEN-US%26k%3Dk\(System.Environment.SpecialFolder\);k\(TargetFrameworkMoniker-.NETFramework,Version%3Dv4.6.1\);k\(DevLang-csharp\)%26rd%3Dtrue%26f%3D255%26MSPPError%3D-2147217396&view=netframework-4.8)

### 输出

【路径】文件夹对应的实际路径。
