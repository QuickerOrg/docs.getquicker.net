---
title: "ElInfo"
description: "ElInfo的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/types/elinfo
comments: false
sidebar_position: 10
---

{/* script-api:start */}

界面元素信息快照（可返回、可写入 State）。

## 构造

```csharp
ElInfo(string Name, string ControlType, string AutomationId, string ClassName, string? Value, Rect Bounds, bool Enabled, bool Visible, string XPath, bool? Toggled = null)
```

## 属性

| 属性 | 类型 | 说明 |
|---|---|---|
| `Name` | `string` | 见类型说明。 |
| `ControlType` | `string` | UIA 控件类型名：Button、Edit、CheckBox、ComboBox、ListItem、MenuItem、TabItem 等。 |
| `AutomationId` | `string` | AutomationId；没有为空串。 |
| `ClassName` | `string` | ClassName；没有为空串。 |
| `Value` | `string?` | 文本/值（按控件类型解析）；没有可读的值或为密码框时为 null。富文本/文档类控件即使有内容也可能返回空串：空串应视为“读不到”，可改为聚焦控件后 Ctrl+A 再 qk.Selection.GetText()（宿主会恢复剪贴板）。 |
| `Bounds` | `Rect` | 元素区域（屏幕物理像素）。 |
| `Enabled` | `bool` | 见类型说明。 |
| `Visible` | `bool` | 见类型说明。 |
| `XPath` | `string` | 相对于元素自身所在顶层窗口（可能是 window 的对话框，而不是 window 本身）的定位路径，可在之后交给 qk.Uia.Find(该窗口, xpath: …) 重新查找。 |
| `Toggled` | `bool?` | 复选框/开关按钮的勾选状态：true 已勾选、false 未勾选；没有勾选状态或半选为 null。 |

{/* script-api:end */}
