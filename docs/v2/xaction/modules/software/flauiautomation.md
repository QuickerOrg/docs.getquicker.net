---
title: "窗口界面控制(FlaUI)"
description: "触发Windows窗口的菜单/按钮等控件(通过FlaUI库实现)。"
slug: "/v2/xaction/modules/flauiautomation"
sidebar_label: "窗口界面控制(FlaUI)"
sidebar_position: 20
quickerDocKey: "xaction/module/sys:flauiautomation"
comments: true
moduleKey: "sys:flauiautomation"
docStatus: "generated"
metadataGeneratedAt: "2026-08-03 20:08:03"
metadataHash: "f956ccc30c5bfbc2c1aad1c177102bd754f765172d045456893d6200e31a7d7a"
---

# 窗口界面控制(FlaUI)

触发Windows窗口的菜单/按钮等控件(通过FlaUI库实现)。

{/* xaction-metadata:start */}
## 当前模块定义

- 模块 Key：`sys:flauiautomation`
- 分类：第三方软件交互（`SoftInteraction`）
- 类型：`Action`
- 风险操作：否
- 专业版：否

## 输入参数

| Key | 名称 | 类型 | 默认值 | 必填 | 变量模式 | 条件 | 说明 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `type` | 操作类型 | `Enum` | TriggerMenu | 是 | `Input` |  | 操作类型。按下和抬起需要配对使用。 |
| `window` | 窗口句柄 | `Text` |  | 否 | `UseVarOrInput` | 仅：TriggerMenu, TriggerControl, GetControlInfo | 要操作哪个窗口的控件。不填写=使用前台窗口；或窗口句柄数字。 |
| `menuPath` | 菜单路径 | `Text` |  | 否 | `UseVarOrInput` | 仅：TriggerMenu | 菜单的展开路径。每行写一个级别的菜单名（需完全匹配） |
| `expandDelay` | 展开延时 | `Integer` | 200 | 否 | `Input` | 仅：TriggerMenu | 等待下级菜单展开的时间(ms) |
| `control` | 控件XPath或Name | `Text` |  | 否 | `UseVarOrInput` | 仅：TriggerControl, GetControlInfo | 控件的XPath或Name、AutomationId。XPath以/开始。(可写多个，每行一个，前一个查找失败时会自动尝试下一个) |
| `controlType` | 控件类型 | `Enum` | 0 | 否 | `UseVarOrInput` | 仅：TriggerControl, GetControlInfo | 可选。当有多个名称相同但类型不同的控件时区分。 |
| `controlOperation` | 动作 | `Enum` | Auto | 否 | `Input` | 仅：TriggerControl | 对控件执行的操作。 |
| `value` | 值 | `Text` |  | 否 | `UseVarOrInput` | 仅：TriggerControl | 仅用于 "设置值" 操作。 |
| `pointLocation` | 坐标位置 | `Text` |  | 否 | `UseVarOrInput` | 仅：GetControlInfoByPosition | 指定要检查的控件的屏幕坐标位置，格式为"x,y" |
| `stopIfFail` | 失败后停止 | `Boolean` | true | 否 | `Input` |  | 失败后是否停止动作 |

## 输出参数

| Key | 名称 | 类型 | 条件 | 说明 |
| --- | --- | --- | --- | --- |
| `isSuccess` | 是否成功 | `Boolean` |  | 操作是否成功 |
| `value` | 值 | `Text` | 仅：GetControlInfo, GetCursorPointControlInfo, GetFocusedControlInfo, GetControlInfoByPosition | 控件的值 |
| `controlText` | 文本 | `Text` | 仅：GetControlInfo, GetCursorPointControlInfo, GetFocusedControlInfo, GetControlInfoByPosition | 获取控件上的文本。根据控件不同，可能从Value、Text、Name等信息获取。 |
| `rect` | 位置 | `Text` | 仅：GetControlInfo, GetCursorPointControlInfo, GetFocusedControlInfo, GetControlInfoByPosition | 控件坐标位置 |
| `controlName` | 控件名称 | `Text` | 仅：GetControlInfo, GetCursorPointControlInfo, GetFocusedControlInfo, GetControlInfoByPosition |  |
| `controlType` | 控件类型 | `Text` | 仅：GetControlInfo, GetCursorPointControlInfo, GetFocusedControlInfo, GetControlInfoByPosition |  |
| `controlXPath` | 控件XPath | `Text` | 仅：GetControlInfo, GetCursorPointControlInfo, GetFocusedControlInfo, GetControlInfoByPosition |  |
| `controlTypeId` | 控件类型ID | `Integer` | 仅：GetControlInfo, GetCursorPointControlInfo, GetFocusedControlInfo, GetControlInfoByPosition |  |
| `controlInfo` | 其他信息 | `Dict` | 仅：GetControlInfo, GetCursorPointControlInfo, GetFocusedControlInfo, GetControlInfoByPosition |  |
| `controlIsEnabled` | 是否启用 | `Boolean` | 仅：GetControlInfo, GetCursorPointControlInfo, GetFocusedControlInfo, GetControlInfoByPosition | 控件未处于禁用状态 |
| `controlIsVisible` | 是否可见 | `Boolean` | 仅：GetControlInfo, GetCursorPointControlInfo, GetFocusedControlInfo, GetControlInfoByPosition | 控件是否在屏幕上。 |
| `element` | 原始对象 | `Object` | 仅：GetControlInfo, GetCursorPointControlInfo, GetFocusedControlInfo, GetControlInfoByPosition | 返回控件的AutomationElement对象 |

## 选项值

### `type` 操作类型

| Value | 名称 | 说明 |
| --- | --- | --- |
| `TriggerMenu` | 触发窗口菜单 |  |
| `TriggerControl` | 触发窗口控件 |  |
| `GetControlInfo` | 获取窗口控件信息 |  |
| `GetCursorPointControlInfo` | 获取鼠标指针位置控件信息 |  |
| `GetControlInfoByPosition` | 获取指定位置控件信息 |  |
| `GetFocusedControlInfo` | 获取焦点控件信息 |  |

### `controlType` 控件类型

| Value | 名称 | 说明 |
| --- | --- | --- |
| `0` | *任意类型* |  |
| `AppBar` | AppBar |  |
| `Button` | Button |  |
| `Calendar` | Calendar |  |
| `CheckBox` | CheckBox |  |
| `ComboBox` | ComboBox |  |
| `Custom` | Custom |  |
| `DataGrid` | DataGrid |  |
| `DataItem` | DataItem |  |
| `Document` | Document |  |
| `Edit` | Edit |  |
| `Group` | Group |  |
| `Header` | Header |  |
| `HeaderItem` | HeaderItem |  |
| `Hyperlink` | Hyperlink |  |
| `Image` | Image |  |
| `List` | List |  |
| `ListItem` | ListItem |  |
| `Menu` | Menu |  |
| `MenuBar` | MenuBar |  |
| `MenuItem` | MenuItem |  |
| `Pane` | Pane |  |
| `ProgressBar` | ProgressBar |  |
| `RadioButton` | RadioButton |  |
| `ScrollBar` | ScrollBar |  |
| `SemanticZoom` | SemanticZoom |  |
| `Separator` | Separator |  |
| `Slider` | Slider |  |
| `Spinner` | Spinner |  |
| `SplitButton` | SplitButton |  |
| `StatusBar` | StatusBar |  |
| `Tab` | Tab |  |
| `TabItem` | TabItem |  |
| `Table` | Table |  |
| `Text` | Text |  |
| `Thumb` | Thumb |  |
| `TitleBar` | TitleBar |  |
| `ToolBar` | ToolBar |  |
| `ToolTip` | ToolTip |  |
| `Tree` | Tree |  |
| `TreeItem` | TreeItem |  |
| `Window` | Window |  |

### `controlOperation` 动作

| Value | 名称 | 说明 |
| --- | --- | --- |
| `Auto` | 自动 |  |
| `Invoke` | 调用（按钮、菜单项等） |  |
| `SetFocus` | 设置焦点 |  |
| `LeftClick` | 鼠标左键单击 |  |
| `MiddleClick` | 鼠标中键单击 |  |
| `RightClick` | 鼠标右键单击 |  |
| `LeftDoubleClick` | 鼠标左键双击 |  |
| `Select` | 单选：选择（单选框、标签页等） |  |
| `AddToSelection` | 多选：添加到多选（多选列表等） |  |
| `RemoveFromSelection` | 多选：从多选中移除（多选列表） |  |
| `ToggleItemSelection` | 多选：切换选中状态 |  |
| `Expand` | 展开折叠：展开（菜单等） |  |
| `Collapse` | 展开折叠：折叠（菜单等） |  |
| `ToggleExpandCollapse` | 展开折叠：切换展开折叠（菜单等） |  |
| `Toggle` | 切换：切换（检查框等） |  |
| `ToggleOn` | 切换：开（检查框等） |  |
| `ToggleOff` | 切换：关（检查框等） |  |
| `SetValue` | 设置值 |  |
{/* xaction-metadata:end */}

## 使用说明

本模块与[窗口界面控制](/v2/xaction/modules/uiautomation)共享基础使用说明；本页上方参数表是当前模块自身的定义。
