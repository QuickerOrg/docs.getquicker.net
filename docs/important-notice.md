---
title: 重要提示
description: 有关数据完整性的重要提示信息
sidebar_position: 10
quickerDocKey: important-notice
comments: true
---
# 重要提示

## 从 2.1.0 降低到更低版本的风险提示（2026年7月28日版本）

2.1.0 相对于 2.0.x 增加了大量功能，以及对应的底层数据存储。

但是2.0.x里没有这些数据结构，因此，如果在2.1.0里使用了新增功能，且保存了新的配置数据，在2.0.x里，可能会被覆盖清除。
