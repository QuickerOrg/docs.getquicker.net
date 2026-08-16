---
title: 安装 Quicker V2
description: 在 64 位 Windows 上下载并安装 Quicker V2，以及首次启动要注意的事项。
sidebar_position: 10
quickerDocKey: v2/install/windows
comments: true
---

# 安装 Quicker V2

从官网下载安装包，在受支持的 64 位 Windows 上安装。V2 与 1.x 使用不同的运行平台和数据目录，不能当成同一个程序的换皮升级。

:::caution 先确认 V2 Preview 范围

Quicker V2 目前是 Preview，官方 V2 页面标注为「仅专业版」；免费账号数据迁移仍在进行，当前不能登录 2.0。请不要把 V2 当作关键 1.x 环境的直接替换，体验前先阅读 [体验前必读](/important-notice)。

:::

## 系统要求

- **系统**：仅支持 [.NET 10 官方支持的 Windows](https://github.com/dotnet/core/blob/main/release-notes/10.0/supported-os.md)。Windows 7、8、8.1 不能安装。普通用户建议使用仍受支持的 Windows 11 x64。
- **位数**：正式安装包只有 **x64**。32 位 Windows 不能安装或运行。
- **账号**：建议登录，便于同步；也可以使用本机离线账号。

更细的运行时、Office/COM 位数和脚本兼容性见 [运行平台与兼容性](/v2/what's-new/platform-and-compatibility.md)。

## 下载和安装

1. 打开 V2 官方页面：[https://getquicker.net/V2](https://getquicker.net/V2)。
2. 下载当前 V2 安装包，按向导完成安装；不要从 [https://getquicker.net/Download](https://getquicker.net/Download) 下载 1.x 安装包来体验 V2。
3. 如果安装包提示缺少运行环境，请按提示安装 .NET 10 Desktop Runtime。
4. 若 Windows SmartScreen 或浏览器拦截，先确认文件来自上述官网，再选择保留并继续。

不要从不明镜像或转发网盘下载。安装完成后从开始菜单或桌面快捷方式启动。

## 首次启动

1. 启动 Quicker，按提示登录或使用本机离线账号。
2. 默认用**鼠标中键**弹出面板。弹出方式在 **设置 → 基础设置 → 弹出面板**。
3. 已登录账号若仍看到旧面板，按 [新面板窗口](/v2/what's-new/new-main-win/usage.md) 切到新版主窗口。

接着看 [开始使用](/v2/getting-started.md)。要从 1.x 迁数据，先完成 1.x 同步和备份，再安装 V2，步骤见 [从 V1 迁移](/v2/migration/from-v1.md)。

## 限制与排障

- 装不上：先核对 Windows 版本和是否为 64 位。1.x 能运行，不代表这台电脑能跑 V2。
- 装完打不开：确认没有用 32 位兼容方式启动，并查看是否被安全软件隔离。
- 1.x 与 V2 不要同时安装使用；浏览器扩展等组件会互相冲突。需要回退时，重新安装 1.x，并使用迁移前备份或 1.x 自己的数据。
- 动作会在 Quicker 进程内加载 DLL、COM 或 Office 组件时，这些依赖也必须提供 x64 版本。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/getting-started',
      label: '开始使用',
      description: '面板、动作和第一条组合动作',
    },
    {
      href: "/v2/what's-new/platform-and-compatibility",
      label: '运行平台与兼容性',
      description: '.NET 10、x64 和组件位数',
    },
    {
      href: '/v2/migration/from-v1',
      label: '从 V1 迁移',
      description: '备份、验证顺序和只读旧动作',
    },
    {
      href: '/v2/troubleshooting',
      label: '常见问题',
      description: '启动、面板和动作排障',
    },
  ]}
/>
