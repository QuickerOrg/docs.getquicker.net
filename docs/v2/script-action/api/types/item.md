---
title: "Item"
description: "Item的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/types/item
comments: false
sidebar_position: 10
---

{/* script-api:start */}

列表项：字符串项 "[fa:icon]标题|值" 的结构化形式；Title/Value 原样使用，不解析图标与 |。任意文本（网址、路径、OCR/二维码结果、窗口标题）请用 Item。

## 构造

```csharp
Item(string Title, string? Value = null, string? Icon = null, string? Description = null, Item[]? Children = null)
```

## 属性

| 属性 | 类型 | 说明 |
|---|---|---|
| `Title` | `string` | 见类型说明。 |
| `Value` | `string?` | 选中后返回的值；缺省为标题。 |
| `Icon` | `string?` | 图标：只支持 fa: 字体图标（如 "fa:Light_Star"）；不支持图片路径或网址。 |
| `Description` | `string?` | 说明文字（第二行）。 |
| `Children` | `Item[]?` | 子项/子菜单；Ui.Select/SelectMany 中被忽略。 |

{/* script-api:end */}
