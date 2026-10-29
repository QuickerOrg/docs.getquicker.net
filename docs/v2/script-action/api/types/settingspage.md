---
title: "SettingsPage"
description: "SettingsPage的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/types/settingspage
comments: false
sidebar_position: 10
---

{/* script-api:start */}

Windows 设置页（Sys.SearchSettings 返回）。

## 构造

```csharp
SettingsPage(string Title, string Uri, string Path)
```

## 属性

| 属性 | 类型 | 说明 |
|---|---|---|
| `Title` | `string` | 设置页名称。 |
| `Uri` | `string` | 可直接传给 qk.Sys.OpenSettings 的地址（ms-settings:… 或 control.exe -name …）。 |
| `Path` | `string` | 所属分类，如“网络和 Internet”。 |

{/* script-api:end */}
