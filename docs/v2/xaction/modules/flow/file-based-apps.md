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
metadataHash: "8caff1568f86b76096ac341d5ff375dce76e338255f6e866d4c21186032dc7bb"
---

# 运行C#文件应用

使用.NET SDK运行C# file-based app。支持新语法、NuGet包引用和WPF等SDK功能。

{/* xaction-metadata:start */}
## 当前模块定义

- 模块 Key：`sys:csharpFileApp`
- 分类：程序流程（`Flow`）
- 类型：`Action`
- 风险操作：是
- 专业版：否

## 输入参数

| Key | 名称 | 类型 | 默认值 | 必填 | 变量模式 | 条件 | 说明 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `code` | C#代码 | `Text` | #:property PublishAot=false<br />#:property TargetFramework=net10.0-windows<br />#:property UseWpf=true<br /><br />using System.Windows;<br /><br />MessageBox.Show(args.Length &gt; 0 ? args[0] : "Hello from Quicker!"); | 是 | `UseVarOrInput` |  | 完整的C# file-based app源码。可使用#:property、#:package、#:project等指令。 |
| `arguments` | 命令行参数 | `Any` |  | 否 | `UseVarOrInput` |  | 可直接填写常规命令行参数，如 --name "hello world"；也可选择列表变量，列表中的每一项将直接作为一个独立参数。其他类型会转换为文本并作为单个参数。C#代码通过args读取。 |
| `workingDirectory` | 工作目录 | `Text` |  | 否 | `UseVarOrInput` |  | 应用运行时的工作目录。留空时使用C#源码所在的隔离临时目录。 |
| `dotnetPath` | dotnet路径 | `Text` |  | 否 | `UseVarOrInput` |  | dotnet可执行文件路径。留空时从PATH查找dotnet。 |
| `stopIfFail` | 失败后停止 | `Boolean` | true | 否 | `Input` |  | 失败后是否停止动作 |

## 输出参数

| Key | 名称 | 类型 | 条件 | 说明 |
| --- | --- | --- | --- | --- |
| `isSuccess` | 是否成功 | `Boolean` |  | 操作是否成功 |
| `stdout` | 标准输出 | `Text` |  | 应用写入stdout的内容。 |
| `stderr` | 错误输出 | `Text` |  | SDK和应用写入stderr的内容。 |
| `exitCode` | 退出代码 | `Integer` |  | dotnet进程的退出代码。 |
| `sourceFile` | 源码文件路径 | `Text` |  | 实际运行的临时C#源码文件路径，可用于诊断。 |
| `errMessage` | 错误消息 | `Text` |  | 步骤执行出错时的消息 |
{/* xaction-metadata:end */}

## 使用说明

这是 Quicker 2.0 新增模块，当前页面已收录模块定义，详细用法与示例待补充。
