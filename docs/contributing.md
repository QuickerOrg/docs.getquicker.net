---
title: 文档编写约定
description: Quicker 文档站的 Markdown 编写和维护约定。
sidebar_position: 50
quickerDocKey: docs/contributing
comments: false
---

# 文档编写约定

## 文件组织

- `docs/` 只放面向用户的 Markdown/MDX 文档（含文档专属图片，见下文）。
- `src/` 放站点组件、主题覆盖和样式。
- `static/` 放共用图片、下载文件等全局静态资源。

## 图片与附件

优先**就近存放**：图片放在文档同级的 `img/` 目录，用相对路径引用。这样文档和图片绑定，移动或删除一起处理，构建时还会校验路径。

```
docs/v2/install/
├─ windows.md
└─ img/
   └─ download.png
```

```md
![下载入口](./img/download.png)
```

只有以下情况才放 `static/`，用绝对路径引用（路径里不带 `static`）：

- 多篇文档共用的图或全局示意图 → `static/img/`，引用 `/img/...`。
- 下载包、附件等非图片资源 → `static/files/` 或 `static/downloads/`。

文件名用清晰、稳定的小写英文，避免随意改名导致引用失效。

## Frontmatter

每篇文档建议包含：

```md
---
title: 安装 Quicker V2
description: Quicker V2 的安装说明
quickerDocKey: v2/install/windows
comments: true
---
```

`quickerDocKey` 用于关联 Quicker 网站评论系统，应保持稳定。
