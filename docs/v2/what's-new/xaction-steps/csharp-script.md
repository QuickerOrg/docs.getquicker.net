---
title: 运行C#代码模块
description: Quicker 2.x 运行 C# 代码模块改用新版编译与补全能力，并支持纯脚本和异步返回值。
sidebar_position: 160
quickerDocKey: v2/what's-new/xaction-steps/csharp-script
comments: true
---

# 运行C#代码模块

2.x 的普通运行模式改用 Quicker 自带的 Roslyn 编译链，不再依赖 1.x 使用的旧脚本组件，并提供与当前运行环境一致的本地代码补全和诊断。

除了继续支持完整的 `Exec(context)` 方法，现在也可以直接编写顶层脚本，通过 `context` 读写动作变量，并把末行表达式作为返回值。脚本返回 `Task` 或 `ValueTask` 时，Quicker 会等待完成并输出解包后的结果。

编译结果支持磁盘缓存；关闭磁盘缓存后，相同代码在当前进程内仍可复用。迁移旧脚本时仍应检查 .NET 10、x64、程序集引用和已移除 API 的兼容性。

参数说明见[运行C#代码](/v2/xaction/modules/csscript)。
