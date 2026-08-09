---
title: "获取窗口信息/查找窗口"
description: "获取指定窗口的标题等信息。"
slug: "/v2/xaction/modules/getwindowtitle"
sidebar_label: "获取窗口信息/查找窗口"
sidebar_position: 50
quickerDocKey: "xaction/module/sys:getWindowTitle"
comments: true
moduleKey: "sys:getWindowTitle"
docStatus: "migrated-unreviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
metadataHash: "0e4e912833e9f910536151b7a107fa79500927a9e683ebd9c658f00bda9acf73"
legacyDocId: 2118011
legacyContentUpdatedAt: "2023-02-04T13:19:28.000Z"
---

# 获取窗口信息/查找窗口

获取指定窗口的标题等信息。

{/* xaction-metadata:start */}
## 当前模块定义

- 模块 Key：`sys:getWindowTitle`
- 分类：Windows系统（`System`）
- 类型：`Action`
- 风险操作：否
- 专业版：否

## 输入参数

| Key | 名称 | 类型 | 默认值 | 必填 | 变量模式 | 条件 | 说明 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `which` | 目标窗口 | `Enum` | foreground | 是 | `Input` |  | 判断哪个窗口的信息 |
| `hWnd` | 窗口句柄hWnd | `Integer` |  | 否 | `UseVarOrInput` | 仅：fromHwnd, findChildWindow, child_windows | 未指定时使用前台窗口句柄 |
| `className` | 窗口类名 | `Text` |  | 否 | `UseVarOrInput` | 仅：findWindow, top_windows, findChildWindow, child_windows | 要查找窗口的类名（ClassName），为空时不检查此项。 |
| `windowName` | 窗口名称 | `Text` |  | 否 | `UseVarOrInput` | 仅：findWindow, top_windows, findChildWindow, child_windows | 要查找窗口的标题，为空时不检查此项。 |
| `procIdOrName` | 进程名/pid | `Text` |  | 否 | `UseVarOrInput` | 仅：findWindow, top_windows | 要查找窗口所属的进程名或pid，为空时不检查此项。 |
| `onlyVisible` | 仅可见窗口 | `Enum` | default | 否 | `Input` | 仅：top_windows, findWindow |  |
| `requireTitle` | 仅名称(标题)不为空的窗口 | `Boolean` | true | 否 | `Input` | 仅：top_windows, findWindow |  |
| `useRegex` | 使用正则匹配窗口类名和标题 | `Boolean` | false | 否 | `Input` | 仅：findWindow, top_windows, child_windows |  |
| `winRectIncludeInvisibleBorder` | 窗口位置包含不可见边框（阴影区域） | `Boolean` | false | 否 | `Input` | 排除：top_windows, findChildWindow, child_windows |  |
| `stopIfFail` | 失败后停止 | `Boolean` | true | 否 | `Input` |  | 失败后是否停止动作 |

## 输出参数

| Key | 名称 | 类型 | 条件 | 说明 |
| --- | --- | --- | --- | --- |
| `isSuccess` | 是否成功 | `Boolean` |  | 操作是否成功 |
| `output` | 窗口标题 | `Text` | 排除：top_windows, findChildWindow, child_windows | 窗口的标题文字 |
| `className` | 类名 | `Text` | 排除：top_windows, findChildWindow, child_windows | 窗口的 Class Name |
| `handle` | 句柄 | `Integer` | 排除：top_windows, child_windows | 窗口的句柄 |
| `pid` | 进程ID | `Integer` | 排除：top_windows, findChildWindow, child_windows | 窗口所属进程的ID |
| `procName` | 进程名 | `Text` | 排除：top_windows, findChildWindow, child_windows | 进程名称 |
| `path` | 程序路径 | `Text` | 排除：top_windows, findChildWindow, child_windows | 获得的进程路径 |
| `parent` | 父窗口句柄 | `Integer` | 排除：top_windows, findChildWindow, child_windows |  |
| `root` | 根窗口句柄 | `Integer` | 排除：top_windows, findChildWindow, child_windows |  |
| `rootOwner` | 根所有者窗口句柄 | `Integer` | 排除：top_windows, findChildWindow, child_windows |  |
| `rect` | 窗口位置 | `Text` | 排除：top_windows, findChildWindow, child_windows | 文本值，格式为:Left,Top,Right,Bottom,Width,Height。 |
| `rectNoSize` | 窗口位置(不含尺寸) | `Text` | 排除：top_windows, child_windows | 文本值，格式为:Left,Top,Right,Bottom。如:0,0,100,100 |
| `rectDict` | 窗口位置(词典值) | `Dict` | 排除：top_windows, child_windows | 词典值，属性为:Left,Top,Right,Bottom,Width,Height |
| `isTopmost` | 是否置顶 | `Boolean` | 排除：top_windows, findChildWindow, child_windows |  |
| `isVisible` | 是否可见 | `Boolean` | 排除：top_windows, findChildWindow, child_windows |  |
| `showState` | 显示状态 | `Integer` | 排除：top_windows, findChildWindow, child_windows | 1:普通，2:最小化，3:最大化。 |
| `alpha` | 不透明度 | `Integer` | 排除：top_windows, findChildWindow, child_windows | 窗口的透明度，范围为0-255。0表示全透明 |
| `borderColor` | 边框颜色 | `Text` | 排除：top_windows, findChildWindow, child_windows | 窗口的边框颜色，格式为#RRGGBB，或空字符串表示未设置颜色。（仅支持通过Quicker设置的边框颜色） |
| `allChildWindows` | 所有子窗口 | `Dict` | 排除：top_windows, findChildWindow | 词典值，Key为窗口句柄，Value为窗口标题 |
| `topLevelWindows` | 所有顶层窗口 | `Dict` | 仅：top_windows | 词典值，Key为窗口句柄，Value为窗口标题 |

## 选项值

### `which` 目标窗口

| Value | 名称 | 说明 |
| --- | --- | --- |
| `foreground` | 前台窗口 |  |
| `selectWindow` | 选择一个窗口 |  |
| `pointing` | 弹出面板前鼠标位置的窗口（可能为子窗口） |  |
| `pointing_root` | 弹出面板前鼠标位置窗口的根窗口 |  |
| `pointing_now` | 当前鼠标位置的窗口（可能为子窗口） |  |
| `pointing_now_root` | 当前鼠标位置窗口的根窗口 |  |
| `fromHwnd` | 句柄指定的窗口 |  |
| `findWindow` | 查找顶层窗口 (单个窗口) |  |
| `top_windows` | 所有顶层窗口 |  |
| `findChildWindow` | 查找子窗口/控件 (单个窗口) |  |
| `child_windows` | 查找子窗口 (多个窗口) |  |

### `onlyVisible` 仅可见窗口

| Value | 名称 | 说明 |
| --- | --- | --- |
| `default` | 未指定 |  |
| `1` | 仅可见窗口 |  |
| `0` | 所有窗口 |  |
{/* xaction-metadata:end */}

获取指定窗口的标题等信息。



![](./img/getwindowtitle-001-4d31c8bf24.png)



## 参数

### 输入

【目标窗口】要获取信息的窗口。可选值如下：

-   前台窗口：Windows的当前活动窗口；
-   弹出面板前鼠标位置的窗口（可能为子窗口）：弹出面板前鼠标所在位置的窗口，由于Windows创建是层级结构，这里得到的可能是子窗口。
-   弹出面板前鼠标位置窗口的根窗口：弹出面板前鼠标所在位置窗口的根窗口。
-   当前鼠标位置的窗口（可能为子窗口）：执行步骤时鼠标位置的窗口信息。
-   当前鼠标位置窗口的根窗口：执行步骤时鼠标位置窗口的根窗口信息。
-   句柄指定的窗口：通过“窗口句柄”参数指定窗口对象。
-   查找顶层窗口：通过窗口类名、窗口名称参数搜索Windows的顶层窗口。当不指定进程名时，使用Win32方法FindWindow查找窗口。可能找到已隐藏的窗口。当指定进程名时，仅查找可见的窗口。
-   所有顶层窗口：返回所有顶层窗口的句柄和名称的词典。



### 输出

窗口的各项信息。（就不详细解释了，需要了解Win32编程的相关知识）





## 示例

-   等待“另存为”窗口：[https://getquicker.net/sharedaction?code=2a59718b-523b-4e7e-a4a8-08d70bf0ab12](https://getquicker.net/sharedaction?code=2a59718b-523b-4e7e-a4a8-08d70bf0ab12)

## 更新历史

-   20230204 更新图片。
