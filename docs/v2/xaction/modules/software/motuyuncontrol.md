---
title: "模兔云控制"
description: "通过模兔云本机服务搜索并执行 SketchUp 插件命令。"
slug: "/v2/xaction/modules/motuyuncontrol"
sidebar_label: "模兔云控制"
sidebar_position: 60
quickerDocKey: "xaction/module/sys:motuyuncontrol"
comments: true
moduleKey: "sys:motuyuncontrol"
docStatus: "reviewed"
metadataGeneratedAt: "2026-09-05 22:23:16"
---

# 模兔云控制

通过模兔云本机服务搜索并执行 SketchUp 插件命令。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:motuyuncontrol" />

## 使用说明

先在 SketchUp 中安装并启用支持本机命令接口的模兔云，然后保持 SketchUp 和模兔云运行。此模块直接连接模兔云本机服务，不需要安装 Quicker Bridge。准备方法见[模兔云软件连接](/v2/features/software-connections/software/motuyun)。

### 执行命令

推荐从 **Quicker 设置 → 软件连接 → 模兔云 → 命令工具** 搜索命令并生成动作，程序会填写命令 ID 和插件 ID。把生成的步骤用于组合动作时，选择“执行命令”，保留这两个 ID；不要把命令名称当作 ID。

### 搜索命令与读取工具列表

选择“搜索命令”，填写搜索词，并设置最大数量及是否返回图标。需要读取服务提供的工具目录时，选择“读取工具列表”。返回结果为 JSON 文本，可交给后续 JSON 处理步骤解析。

### 结果与失败处理

“成功”输出表示本次请求是否成功，“返回结果”保存服务返回的 JSON。最长等待时间默认 30000 毫秒。连接失败时先确认 SketchUp、模兔云及其本机接口可用；命令执行还可能依赖当前模型或选择状态。

需要自行处理失败时，关闭“出错时停止动作”，并根据“成功”输出决定后续分支。
