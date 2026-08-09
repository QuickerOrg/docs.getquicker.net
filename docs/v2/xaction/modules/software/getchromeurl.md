---
title: "获取浏览器网址"
description: "获取当前浏览器网址。"
slug: "/v2/xaction/modules/getchromeurl"
sidebar_label: "获取浏览器网址"
sidebar_position: 30
quickerDocKey: "xaction/module/sys:getChromeUrl"
comments: true
moduleKey: "sys:getChromeUrl"
docStatus: "migrated-unreviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
metadataHash: "6dc12ab8d1324ed288b03a8dec57a52e4b3d81accb3c77016a11902c43d61920"
legacyDocId: 2118114
legacyContentUpdatedAt: "2021-10-06T14:07:29.000Z"
---

# 获取浏览器网址

获取当前浏览器网址。

{/* xaction-metadata:start */}
## 当前模块定义

- 模块 Key：`sys:getChromeUrl`
- 分类：第三方软件交互（`SoftInteraction`）
- 类型：`Action`
- 风险操作：否
- 专业版：否

## 输入参数

| Key | 名称 | 类型 | 默认值 | 必填 | 变量模式 | 条件 | 说明 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `stopIfFail` | 失败后停止 | `Boolean` | true | 否 | `Input` |  | 失败后是否停止动作 |

## 输出参数

| Key | 名称 | 类型 | 条件 | 说明 |
| --- | --- | --- | --- | --- |
| `isSuccess` | 是否成功 | `Boolean` |  | 操作是否成功 |
| `output` | 网址 | `Text` |  | 当前标签网址URL |
{/* xaction-metadata:end */}

## 使用说明

获取当前浏览器窗口的网址。

对于chrome、msedge和firefox进程，它会首先尝试通过浏览器扩展接口获取网址。

如果失败了，会尝试模拟Ctrl+L跳转到地址栏复制网址。

![](./img/getchromeurl-001-0d486d352e.png)
