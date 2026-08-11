---
title: 新增：运行C#文件应用模块
description: Quicker 2.x 新增运行 C# 文件应用模块，使用 .NET SDK 编译运行单文件应用并支持现代 SDK 功能。
sidebar_position: 70
quickerDocKey: v2/what's-new/xaction-steps/new-csharp-file-app
comments: true
---

# 新增：运行C#文件应用模块

2.x 新增“运行C#文件应用”模块，用 .NET SDK 编译并运行 C# file-based app。它适合比普通脚本更完整的程序，例如需要现代 C# 语法、NuGet 包、项目引用、WPF 或其它 SDK 功能的代码。

代码中可以使用 `#:property`、`#:package` 和 `#:project` 等文件应用指令。模块还支持命令行参数、工作目录、托管 DLL 引用和输出编码，并返回标准输出、错误输出、退出代码及实际源码路径。

相同代码会复用构建缓存，以减少重复运行的等待时间。此模块在独立进程中运行；电脑需要可用的 .NET SDK，引用的 DLL 必须使用绝对路径并同时提供其依赖项。
