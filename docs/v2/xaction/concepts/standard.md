---
title: "复杂动作的编程约定"
description: "复杂动作的编程约定的 Quicker 2.0 使用说明。"
slug: "/v2/xaction/concepts/standard"
sidebar_position: 180
quickerDocKey: "xaction/concepts/standard"
comments: true
docStatus: "migrated-unreviewed"
legacyDocId: 30775973
legacyContentUpdatedAt: "2021-01-27T03:04:42.000Z"
---

## 用户数据和依赖文件的存储



如果动作需要保存和使用用户产生的数据，请将数据保存在这个位置：



**用户的Windows个人文档目录\\Quicker\\动作名\\**



可以根据需要再细分子目录用于保存不同的文件。

动作名不需要完全和实际动作名称一致，可以增加额外的后缀以避免冲突。

可以通过这个模块获得“个人文档目录”的实际路径。

![image.png](./img/standard-001-1158dea522.png "image.png")
