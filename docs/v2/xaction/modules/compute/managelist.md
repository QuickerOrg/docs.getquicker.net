---
title: "管理和排序列表"
description: "弹出窗口，让用户手工排序、添加、修改或删除列表项。"
slug: "/v2/xaction/modules/managelist"
sidebar_label: "管理和排序列表"
sidebar_position: 60
quickerDocKey: "xaction/module/sys:manageList"
comments: true
moduleKey: "sys:manageList"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 5350953
legacyContentUpdatedAt: "2024-10-23T06:02:52.000Z"
---

# 管理和排序列表

弹出窗口，让用户手工调整列表顺序，或添加、修改、删除项。动作里自动改列表用 [列表操作](/v2/xaction/modules/listoperations)。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:manageList" />

## 概述

运行时打开列表管理窗口。改动直接写回 **列表** 变量，点「完成」后继续。

![](./img/managelist-001-040cc435a4.png)

<ModuleParamPreview
  moduleKey="sys:manageList"
  values={{
    parseData: 'true',
    seperator: '|',
    allowAdd: 'true',
    allowEdit: 'true',
    allowDelete: 'true',
  }}
  inputVars={{list: 'list'}}
/>

### 管理界面

**添加**：点右侧「添加」。

- 选中了某一项：新项加在它后面。
- 没有选中：加到末尾。
- 开启 **解析菜单数据** 时，添加会打开「编辑菜单项」窗口，可生成带图标的 [菜单数据项](/v2/xaction/concepts/action-custom-context-menu)。窗口里可以勾选「连续添加」。

**编辑**：选中后点「编辑」，或双击该项。

**删除**：选中后点「删除」。按 Ctrl 或 Shift 可多选。

**排序**：按住项拖到新位置。也可点右侧「A-Z」「Z-A」按字母序或倒序。

**重置**：恢复到打开窗口时的内容。

## 参数说明

**列表**：要管理的列表变量。直接选变量，不要写表达式。

**窗口标题**：管理窗口的标题。

**提示信息**：显示给用户的说明。

**允许添加项** / **允许编辑项** / **允许删除项**：限制用户能做哪些操作。默认都开启。

**取消后停止动作**：点「取消」后是否中止后续步骤。默认关闭。

**解析菜单数据**：是否把 `[fa:Solid_Pen:#FF0000]文字标题(提示文字内容)|值` 当成菜单项。开启后列表显示图标和标题，编辑用「编辑菜单项」窗口。

![](./img/managelist-003-1875478276.png)

关闭时按普通文本管理，编辑用文本框。

![](./img/managelist-004-c987d208d3.png)

**分隔符**：菜单项外观和值之间的分隔符，默认 `|`。

**窗口宽度**：可选。自定义窗口宽度，最小 `200`。旧稿未写。

**显示内容提取表达式**：可选。仅在 **解析菜单数据** 关闭时生效（1.42.34+）。列表项很长、但只有一部分是关键信息时，用表达式生成显示标题。写法接近 [普通表达式](/v2/xaction/concepts/expression)，但：

- 不要以 `$=` 开头（加了会先被解析而出错）。
- 用 `x` 表示当前项，返回要显示的标题。例如路径列表只显示文件名：`Path.GetFileName(x);`

**帮助按钮内容**：Markdown。填写后窗口上出现「帮助」按钮。

## 输出

- **是否确认**：用户是否点了「完成」。

对列表的修改直接写回原变量，没有单独的列表输出。

## 限制与排障

**列表** 必须选变量，写表达式会无效。显示内容提取表达式里不要加 `$=`。取消时若未勾选 **取消后停止动作**，后续步骤仍会跑，且列表保持打开窗口前的内容。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/listoperations',
      label: '列表操作',
      description: '在动作里自动增删排序，不弹窗。',
    },
    {
      href: '/v2/xaction/concepts/action-custom-context-menu',
      label: '自定义右键菜单',
      description: '解析菜单数据时的项格式。',
    },
    {
      href: '/v2/xaction/modules/userselect',
      label: '用户选择',
      description: '只让用户选一项，不改列表本身。',
    },
  ]}
/>

## 更新内容

- 20240504 (1.42.34) 增加「显示内容提取表达式」和「取消后停止动作」。
- 20241023 修复错别字。
