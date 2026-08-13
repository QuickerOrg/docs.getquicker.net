---
title: 常见问题
description: Quicker V2 安装、面板、组合动作和选中文本的常见问题。
sidebar_position: 99
quickerDocKey: v2/troubleshooting
comments: true
---

# 常见问题

先对照现象看下面几条。组合动作的参数和限制以各 [模块页](/v2/xaction/modules) 为准。

## 安装和启动

**装不上或打不开**：V2 只提供 x64，并且只能跑在 [.NET 10 支持的 Windows](https://github.com/dotnet/core/blob/main/release-notes/10.0/supported-os.md) 上。1.x 能用，不代表这台电脑能跑 V2。见 [安装](/v2/install/windows.md) 和 [运行平台](/v2/what's-new/platform-and-compatibility.md)。

**1.x 的数据去哪了**：V2 使用按账号隔离的新存储，不会把旧的 `quicker.db` 当作日常库继续写入。迁移步骤见 [从 V1 迁移](/v2/migration/from-v1.md)。

## 面板

**中键没有弹出面板**：默认是 [中键弹出面板](/v2/getting-started.md)。被其它软件占用中键时不会出现。到 **设置 → 基础设置 → 弹出面板** 换一种方式，或关掉占用中键的程序。

**点了删除，动作在别的场景也没了**：从场景移除只去掉当前位置；删除会去掉动作本体及引用。整理前先看 [新面板窗口](/v2/what's-new/new-main-win/usage.md) 里的区别。

**刚保存的动作找不到**：可能在暂存区、另一个场景或分组。V2 里动作内容和入口是分开的。

## 组合动作

**`{变量名}` 原样出现在结果里**：参数要写插值时，整段最前面加 `$$`。输入框里按 **F1** 可切换原始值 / 插值 / 表达式。见 [选择或输入步骤参数](/v2/xaction/concepts/edit-step-param.md)。

**没选中文字时后面的「如果」不跑**： [获取选中的文本](/v2/xaction/modules/get_selected_text) 默认勾选 **失败后中止动作**。需要走「否则」分支时，取消这项。动手例子见 [第 3 课](/v2/xaction/guides/search-selected.md)。

**选中文字获取失败**：默认靠 Ctrl+C 读剪贴板。目标软件太慢就加大 **等待剪贴板时间**；不要污染剪贴板可勾 **尝试不通过剪贴板的方式获取**（兼容性较差）。点面板可能抢走焦点，用快捷键触发更稳。

**搜索词有中文或符号时结果不对**：拼网址请用 **URL 编码的内容**，不要直接插原文。

**旧版组合动作不能改**：V2 里旧版组合动作可以运行和查看，但不能继续编辑。需要改的，迁移为新版组合动作。见 [动作存储、执行与调试](/v2/what's-new/actions.md)。

**表达式和 1.x 行为不一样**：在 **设置 → 基础设置 → 动作** 启用新表达式引擎后，只使用 QkEval，失败不会回落到旧引擎。复杂表达式先复制动作测试。见 [QkEval](/v2/what's-new/actions/new-expression-engine.md)。

## 反馈

软件内的反馈入口、讨论区：[https://getquicker.net/QA](https://getquicker.net/QA)。报告问题时请带上 Windows 版本、Quicker 版本，以及能否稳定复现。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/getting-started',
      label: '开始使用',
      description: '面板、动作和第一条组合动作',
    },
    {
      href: '/v2/xaction/guides/how-to-learn',
      label: '怎样学会组合动作',
      description: '三条动手课',
    },
    {
      href: '/v2/migration/from-v1',
      label: '从 V1 迁移',
      description: '备份和验证顺序',
    },
  ]}
/>
