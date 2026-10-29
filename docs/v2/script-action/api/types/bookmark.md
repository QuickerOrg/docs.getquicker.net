---
title: "Bookmark"
description: "Bookmark的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/types/bookmark
comments: false
sidebar_position: 10
---

{/* script-api:start */}

浏览器书签（Browser.SearchBookmarks 返回）。

## 构造

```csharp
Bookmark(string Title, string Url, string Folder, string Browser)
```

## 属性

| 属性 | 类型 | 说明 |
|---|---|---|
| `Title` | `string` | 书签标题。 |
| `Url` | `string` | 书签网址。 |
| `Folder` | `string` | 所在书签文件夹路径，如“书签栏/工作”；没有为 ""。 |
| `Browser` | `string` | 浏览器标识：chrome &#124; msedge &#124; 360chromex &#124; vivaldi。 |

{/* script-api:end */}
