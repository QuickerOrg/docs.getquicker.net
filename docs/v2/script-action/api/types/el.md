---
title: "El"
description: "El的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/types/el
comments: false
sidebar_position: 10
---

{/* script-api:start */}

界面元素句柄：仅本次运行有效，不能返回或写入 State；需要数据时返回 qk.Uia.Info(element)。

## 属性

| 属性 | 类型 | 说明 |
|---|---|---|
| `Name` | `string` | 取得引用时的元素名称（快照）。 |
| `ControlType` | `string` | 取得引用时的控件类型名（快照，如 Button、Edit）。 |

{/* script-api:end */}
