---
title: 按键双击（V2 变化）
description: Quicker 2.x 按键双击相对 1.x 的场景继承与 Win 键双击稳定性改进摘要。
sidebar_position: 50
quickerDocKey: v2/what's-new/others/key-double-click
comments: true
displayed_sidebar: docsSidebar
---

# 按键双击（V2 变化）

:::info[完整功能说明已合并至功能目录]
按键双击的按键配置、间隔设置与场景规则请查看主文档 **[按键双击](/v2/features/triggers/key-double-click)**。本页仅保留相对 1.x 的变化与升级注意点。
:::

## 相对 1.x 的主要变化

- **同一双击键按场景继承**：可为不同程序和网址场景绑定不同动作。
- **`Win` 键双击更稳定**：减少左右 `Win` 键在开始菜单、任务栏场景下的误触与系统菜单干扰。

## 从 1.x 升级时需要注意

- 原有按键双击规则继续保留；停用本地规则时仍按兼容行为继续向上级场景查找。
- 涉及到左右 `Win`、任务栏、开始菜单及浏览器网址场景的规则，建议升级后各实测一次。
