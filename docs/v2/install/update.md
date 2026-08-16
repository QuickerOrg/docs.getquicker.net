---
title: 更新 Quicker V2
description: 在 Quicker V2 内检查更新、下载并静默安装，以及失败时怎么处理。
sidebar_position: 20
quickerDocKey: v2/update
comments: true
---

# 更新 Quicker V2

:::caution Preview · 仅专业版
当前 V2 是 **Preview 体验版**，仅面向专业版用户。回退到更早版本前，先看 [体验前必读](/important-notice) 和 [官网版本记录](https://getquicker.net/v2/versions) 里该版本的注意项。
:::

日常升级优先用软件内的更新窗口，不要去 `https://getquicker.net/Download` 找 1.x 安装包。需要手动下载某个 2.x 安装器时，用 [https://getquicker.net/V2](https://getquicker.net/V2) 或 [版本记录](https://getquicker.net/v2/versions)。

## 应用内更新

更新窗口可以：

- **下载并静默更新**
- 跳过当前版本
- 暂不更新

自动安装要求服务端提供 HTTPS 下载地址和完整 SHA-256。下载完成后，Quicker 会再核一次文件哈希；独立更新程序还会验证安装包的 Windows 签名，并要求发布者与更新程序一致。

确认更新后，Windows 会在安装阶段请求一次管理员权限。Quicker 随后退出，使用 Windows Installer 静默安装，并在完成后尝试以普通用户身份重新启动。

签名、发布者、文件位置或哈希验证失败时，不会继续静默安装。安装成功但 Windows 要求重启时，更新程序会提示保存工作并重启电脑。

以上行为的背景见 [工具与使用体验 · 应用更新](/v2/what's-new/tools-and-experience.md)。

## 更新失败时

1. 确认当前装的是 V2，且安装包来自 `/V2` 或版本记录页。
2. 核对 Windows 仍是受支持的 x64，并已安装 .NET 10 桌面运行时。
3. 看安全软件是否隔离了安装器或更新程序。
4. 仍失败时，从 [版本记录](https://getquicker.net/v2/versions) 下载对应安装包手动安装；不要覆盖 1.x 数据目录。

降级不是「点一下就回去」。从 2.1.0 降到 2.0.x 可能清掉新数据结构；从 2.1.17 降到 2.1.15 需要重填 AI API 密钥。见 [体验前必读](/important-notice)。
