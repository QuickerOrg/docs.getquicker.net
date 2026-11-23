---
title: 从 1.x 升级
description: 面向 Quicker 1.x 用户的升级评估、兼容排雷、迁移清单、习惯适配与版本变化入口。
slug: /v2/migration
sidebar_position: 1
quickerDocKey: v2/migration/index
comments: false
---

# 从 1.x 升级

正在用 Quicker 1.x、考虑切换到 V2 时，先了解三个核心前提：

1. **两代不能同时安装**（浏览器扩展会冲突），不建议直接在不能中断的 1.x 主力生产环境中仓促替换。
2. **首次登录会分叉数据**：迁入后 1.x 与 V2 各自独立运行，不再双向镜像；后续带入 1.x 新动作需导出导入或重置重迁。
3. **可以退回 1.x**：反悔时卸载 V2 并重新安装 1.x，用迁移前备份恢复即可，不要把 V2 数据目录覆盖到 1.x。

## 按你的阶段阅读

<RelatedDocs
  items={[
    {
      href: '/v2/migration/why-upgrade',
      label: '1. 升级到 2.x 的理由',
      description: '看 V2 相比 1.x 的实际提升，判断值不值得现在升级',
    },
    {
      href: "/v2/what's-new/not-supported",
      label: '2. 升级前排雷：不再支持的功能',
      description: '先核对 Win7/8、32 位组件、手机遥控器与文本悬浮窗限制',
    },
    {
      href: '/v2/migration/from-v1',
      label: '3. 从 1.x 迁移到 V2',
      description: '按清单完成备份、卸载、安装、状态迁移与回退准备',
    },
    {
      href: '/v2/migration/v1-to-v2-habits',
      label: '4. 1.x 习惯与入口变化速查',
      description: '对照查看新旧面板、设置入口搬家与触发习惯差异',
    },
    {
      href: '/v2/migration/action-authors',
      label: '5. 动作作者迁移指南',
      description: '为已分享动作选择 V1/V2 支持范围与保留旧版修订',
    },
    {
      href: "/v2/what's-new/",
      label: '按主题深入了解 V2 变化',
      description: '展开查看平台、同步、动作引擎与工具链的详细演变',
    },
  ]}
/>

如果你已经在使用 V2，准备在 V2 小版本之间降级或排查多设备混用兼容项，请查看 [升级与回退](./upgrade-and-rollback.md)（已归入「Quicker V2 → 安装、更新与卸载」目录）。
