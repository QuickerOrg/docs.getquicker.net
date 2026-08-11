---
title: "写入图片文件"
description: "将图片内容写入文件"
slug: "/v2/xaction/modules/writeimagefile"
sidebar_label: "写入图片文件"
sidebar_position: 70
quickerDocKey: "xaction/module/sys:WriteImageFile"
comments: true
moduleKey: "sys:WriteImageFile"
docStatus: "migrated-unreviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 2115755
legacyContentUpdatedAt: "2020-10-26T11:02:29.000Z"
---

# 写入图片文件

将图片内容写入文件

## 当前模块定义

<XActionModuleMeta moduleKey="sys:WriteImageFile" />

将图片写入文件。

支持的图片格式类型：.jpg, .png, .bmp, .tiff

<ModuleParamPreview moduleKey="sys:WriteImageFile" />

## 参数

### 输入

【内容】要写入文件的图片。

【文件路径】完整的图片文件路径。必须使用包含完整文件名的路径。Quicker将根据后缀名判断保存文件的格式。

【图片质量】当保存格式为jpg格式时，指定图片质量，可选范围 10-100。数字越小，图片压缩程度越高，文件越小，图片质量越差。(1.5.7之后加入)

## 更改历史

-   1.5.7 增加图片质量参数。
