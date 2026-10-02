---
title: "Win"
description: "Win的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/types/win
comments: false
sidebar_position: 10
---

{/* script-api:start */}

本次运行拥有的窗口引用；不公开句柄，不能返回或写入 State。需要返回时用 qk.Window.Info(window)。

## 属性

| 属性 | 类型 | 说明 |
|---|---|---|
| `Title` | `string` | 见类型说明。 |
| `Process` | `string` | 见类型说明。 |

{/* script-api:end */}
