---
title: 文档编写约定
description: Quicker 文档站的 Markdown 编写和维护约定。
sidebar_position: 100
quickerDocKey: docs/contributing
comments: false
---

# 文档编写约定

## 文件组织

- `docs/` 只放面向用户的 Markdown/MDX 文档。
- `src/` 放站点组件、主题覆盖和样式。
- `static/` 放图片、附件、下载文件等静态资源。

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
