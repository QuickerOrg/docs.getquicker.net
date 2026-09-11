---
title: Mastercam 软件连接
description: Mastercam Bridge 的兼容范围、分年度安装、命令工具与常见限制。
slug: /v2/features/software-connections/software/mastercam
sidebar_position: 125
quickerDocKey: v2/software-connections/mastercam
comments: true
---

通过 Bridge，Quicker 可以连接 Mastercam，读取文档与选择、调用视图与图层、执行 Function Table 命令，并把常用操作做成动作。完整安装过程见[安装与管理](../install-and-manage.md)，本页说明该软件的差异。

## 适用范围

2.2.6 起支持 **Mastercam 2024** 与 **Mastercam 2027**（Windows x64）。2.2.10 起还可识别并安装 **Mastercam 2025** / **2026** 连接插件。支持范围不等于所有小版本或全部产品线均已真机测试；实际可安装的年度与版本以设置页检测与软件卡片显示为准。更完整的发版说明见[官网版本记录](https://getquicker.net/V2/Versions)。

## 安装前准备与首次启用

安装机制：**Mastercam NET-Hook（按年度分别安装）**。

1. 退出全部 Mastercam 实例。
2. 打开 **Quicker 设置 → 软件连接 → Mastercam**。
3. 在对应年度卡片（如 2024、2025、2026 或 2027）中点击安装、修复或卸载。各年度使用各自的包和部署目录；2.2.10 起还会阻止不同年度共用同一安装目录，避免跨年度插件冲突。
4. 安装完成后启动对应年度的 Mastercam，确认 Bridge 已加载，再回到 Quicker 刷新连接。

进度、结果和配置提示显示在对应年度卡片中。空闲的 Startup 槽是正常的待安装状态；若 Startup 已被其他插件占用，卡片会提示冲突，不会覆盖其他插件的配置。

## 确认连接

安装并重启宿主后，在 Mastercam 卡片中确认出现在线实例。打开命令工具并选择实例，用空对象 `{}` 调用 `bridge.ping`。成功响应及 `pong: true` 表明本次会话可调用。

宿主没有打开合适的文档、或当前产品线 / 许可证不包含某项功能时，部分业务命令可能列出但无法执行。先测试连接，再在副本模型中验证具体命令。详细步骤见[连接状态与命令工具](../command-tool.md)。

## 创建动作

在命令工具中，可浏览 Bridge 提供的命令，以及当前宿主 `Mastercam.ft` 中的界面命令：按来源、分类或名称筛选，立即试运行，或 **生成动作** 后粘贴到 Quicker 面板。

组合动作里也可使用 Mastercam 控制步骤（模块标识 `sys:mastercamcontrol`）。本站模块参数参考尚未同步到 `data/xaction`；创建动作时请以命令工具生成结果和客户端步骤参数为准，不要手工猜测参数 Key。

动作根据触发时前台窗口对应的 PID 与进程启动时间精确定位宿主进程。该实例未连接时失败，不回退到其他在线实例。动作不保存工具窗口选择的临时 session。

## 限制与排障

- 列表里出现的 Function Table 或 Ribbon 命令，仍受当前 Mastercam 产品线和许可证限制；列出不等于一定能执行。
- 部分脚本与界面命令需要明确确认风险后才能运行；脚本拥有宿主进程权限，请只运行可信内容。
- Bridge 不会替宿主弹出“是否保存”一类对话框；打开、新建或放弃未保存修改时，需在命令参数中明确确认。
- 以异步方式提交的界面命令只表示已入队，不保证交互或对话框已经完成。

遇到问题先记录错误信息、Mastercam 年度与版本，按[通用排障](../troubleshooting.md)区分安装、加载、连接或命令执行阶段。

## 相关页面

- [安装、更新、修复与卸载](../install-and-manage.md)
- [连接状态与命令工具](../command-tool.md)
- [软件连接总览](../index.md)
- [官网版本记录](https://getquicker.net/V2/Versions)
