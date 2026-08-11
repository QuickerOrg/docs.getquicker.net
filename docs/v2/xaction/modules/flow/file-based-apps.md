---
title: "运行C#文件应用"
description: "使用.NET SDK运行C# file-based app。支持新语法、NuGet包引用和WPF等SDK功能。"
slug: "/v2/xaction/modules/file-based-apps"
sidebar_label: "运行C#文件应用"
sidebar_position: 120
quickerDocKey: "xaction/module/sys:csharpFileApp"
comments: true
moduleKey: "sys:csharpFileApp"
docStatus: "generated"
metadataGeneratedAt: "2026-08-03 20:08:03"
---

# 运行C#文件应用

用本机 .NET SDK 运行 C# [file-based app](https://learn.microsoft.com/dotnet/core/sdk/file-based-apps)。支持较新语法、NuGet 包引用和 WPF 等 SDK 功能。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:csharpFileApp" />

## 概述

把完整源码交给本模块，由 `dotnet` 在隔离临时目录里编译并运行。这是 Quicker 2.0 新增模块。需要本机已安装 .NET SDK。

<ModuleParamPreview moduleKey="sys:csharpFileApp" />

**C#代码**：完整的 file-based app 源码。可用 `#:property`、`#:package`、`#:project` 等指令。

**命令行参数**：可直接填写常规参数，如 `--name "hello world"`；也可选列表变量，列表中每一项会作为一个独立参数。其它类型会转成文本并作为单个参数。C# 里用 `args` 读取。

**工作目录**：应用运行时的工作目录。留空时使用 C# 源码所在的隔离临时目录。

**dotnet路径**：`dotnet` 可执行文件路径。留空时从 PATH 查找。

**失败后停止**：失败后是否停止动作。默认开启。

输出包括 **是否成功**、**标准输出**、**错误输出**、**退出代码**、**源码文件路径**（实际运行的临时 `.cs`，便于诊断）和 **错误消息**。

## 限制与排障

本模块标记为有风险操作。必须能在本机找到 `dotnet`（填写 **dotnet路径**，或保证 PATH 里有）。工作目录留空时，文件读写发生在隔离临时目录，不要假设是动作所在文件夹。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/csscript',
      label: '运行C#代码',
      description: '在 Quicker 进程或低权限进程里跑 C# 片段，不走 SDK。',
    },
    {
      href: '/v2/xaction/modules/runscript',
      label: '运行脚本',
      description: '跑 CMD、PowerShell 等外部脚本。',
    },
  ]}
/>
