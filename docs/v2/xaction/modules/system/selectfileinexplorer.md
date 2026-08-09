---
title: "在资源管理器中定位文件"
description: "在资源管理器中选中文件"
slug: "/v2/xaction/modules/selectfileinexplorer"
sidebar_label: "在资源管理器中定位文件"
sidebar_position: 190
quickerDocKey: "xaction/module/sys:SelectFileInExplorer"
comments: true
moduleKey: "sys:SelectFileInExplorer"
docStatus: "migrated-unreviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
metadataHash: "4eea3952970a86527346570aaa69cfee18be2f653ea336f099e1ff59731a329c"
legacyDocId: 2131870
legacyContentUpdatedAt: "2022-11-12T12:17:59.000Z"
---

# 在资源管理器中定位文件

在资源管理器中选中文件

{/* xaction-metadata:start */}
## 当前模块定义

- 模块 Key：`sys:SelectFileInExplorer`
- 分类：Windows系统（`System`）
- 类型：`Action`
- 风险操作：否
- 专业版：否

## 输入参数

| Key | 名称 | 类型 | 默认值 | 必填 | 变量模式 | 条件 | 说明 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `path` | 路径 | `Text` |  | 是 | `UseVarOrInput` |  | 要定位的文件完整路径。 |
| `stopIfFail` | 失败后停止 | `Boolean` | true | 否 | `Input` |  | 失败后是否停止动作 |

## 输出参数

| Key | 名称 | 类型 | 条件 | 说明 |
| --- | --- | --- | --- | --- |
| `isSuccess` | 是否成功 | `Boolean` |  | 操作是否成功 |
{/* xaction-metadata:end */}

在资源管理器中选中文件（或文件夹）。

会打开文件所在目录，然后选择文件。

![](./img/selectfileinexplorer-001-00bb4b1ad6.png)

对应的效果：

![](./img/selectfileinexplorer-002-a80c04e0f4.png)

## 参数

【路径】要定位的文件完整路径。
