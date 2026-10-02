---
title: "Quicker 脚本动作"
description: "用 C# 语法和 qk API 编写、调试、分享 Quicker 动作。"
quickerDocKey: v2/script-action/index
comments: false
sidebar_position: 1
slug: /v2/script-action
---

脚本动作让你用 C# 语法编写一个完整的 Quicker 动作。输入来自 Main 参数，输出来自返回值；通过 qk 读取选区、弹出表单、处理文件、操作窗口或调用其他动作。

## 从哪里开始

| 你的目标 | 阅读路线 |
|---|---|
| 第一次使用 | [快速开始](./quick-start.md) → [编辑器](./editor.md) → [安全与授权](./security.md) |
| 让 AI 帮忙写 | [AI 助手](./assistant.md) → [检查与调试](./debugging.md) → [备份与恢复](./backup.md) |
| 自己编写 | [语言与脚本结构](./language.md) → [参数与返回值](./parameters.md) → [API 参考](./api/index.md) |
| 解决具体问题 | [任务教程](./tutorials/index.md) → [常见问题](./troubleshooting.md) |

## 适合做什么

文本清洗、JSON 与正则处理、条件和循环较多的逻辑、文件与网络处理、窗口自动化，以及带参数表单的小工具，都适合用脚本动作实现。需要大量现成模块或图形化搭建时，可以继续使用组合动作；二者支持互相调用。

| 编写方式 | 适合的场景 | 使用的能力 |
|---|---|---|
| 组合动作 | 图形化搭建，复用现成步骤 | 组合动作模块 |
| Quicker 脚本动作 | 用源码表达条件、循环和数据处理 | 受控 C# 语法与 qk API |
| 组合动作中的“运行 C# 脚本”步骤 | 已有 CLR 脚本及其依赖 | 对应步骤的脚本环境，见[迁移对照](./migration.md) |

## 使用前知道这些

- 通过新建动作中的“Quicker脚本动作”进入；可使用当前 V2 的用户无需另设脚本动作环境变量。V2 本身的登录与版本限制见[V2 入口](/v2)。
- 不需要安装 Visual Studio 或 .NET SDK。支持的语法和类型有明确范围，不能直接执行任意 .NET 程序。
- 编辑器里的运行也会真实修改文件、剪贴板和窗口，没有自动回滚。
- 第三方动作按来源和能力授权；你自己编写或让 AI 代写后保存的动作不会因此多一次运行确认。
- 本文档核对当前开发版实现；API 索引与[分享和版本兼容](./sharing.md)帮助你判断旧版本是否可用。
