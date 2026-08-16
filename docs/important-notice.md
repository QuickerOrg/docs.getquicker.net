---
title: 体验前必读
description: Quicker V2 Preview 体验前需要确认的账号、环境、安装和回退风险。
sidebar_position: 10
quickerDocKey: important-notice
comments: true
---

# 体验前必读

Quicker V2 仍处于 Preview。准备安装前，先确认下面几件事，尤其是账号资格、数据备份和回退边界。

## Preview 与账号范围

- 官方 V2 页面当前标注为 **PREVIEW · 仅专业版**。
- 免费账号的数据迁移仍在进行，当前不能登录 2.0。
- 不建议把 V2 直接替换为工作中唯一可靠的 Quicker 1.x 环境；关键动作、触发规则和数据应先保留可恢复备份。
- V2 下载入口是 [https://getquicker.net/V2](https://getquicker.net/V2)，不是 1.x 下载页 `/Download`。

## 不要同时安装 1.x 与 V2

Quicker 1.x 与 V2 的浏览器扩展等组件会互相冲突，不建议同时安装使用。迁移体验时应先在 1.x 完成同步、导出和备份，再卸载 1.x、安装 V2。

需要回退时，重新安装 1.x。不要把 V2 数据目录直接覆盖到 1.x，也不要指望 V2 的新同步数据完整反向写回 1.x。

## 从 2.1.0 降低到更低版本的风险提示（2026 年 7 月 28 日版本）

2.1.0 相对于 2.0.x 增加了大量功能，以及对应的底层数据存储。

但是 2.0.x 里没有这些数据结构。因此，如果在 2.1.0 里使用了新增功能，且保存了新的配置数据，在 2.0.x 里可能会被覆盖清除。

## 从 2.1.17 回退到旧版的 AI 凭据提示

官方 2.1.17 更新记录提示：如需回退到 v2.1.15，请在旧版中重新填写 AI API 密钥；新版保存后的凭据格式旧版不能正确读取。使用新 AI 模块的动作也无法在 v2.1.15 及更旧版本运行。

## 建议阅读

- [安装 Quicker V2](/v2/install/windows)
- [从 V1 迁移到 V2](/v2/migration/from-v1)
- [数据存储与同步变化](/v2/what's-new/data-and-sync)
- [官方 V2 版本更新](https://getquicker.net/v2/versions)
