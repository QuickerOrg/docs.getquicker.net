---
title: "读取图片信息"
description: "读取图片的宽高、旋转角度、拍摄时间和 Exif。"
slug: "/v2/xaction/modules/imageinfo"
sidebar_label: "读取图片信息"
sidebar_position: 10
quickerDocKey: "xaction/module/sys:imageinfo"
comments: true
moduleKey: "sys:imageinfo"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 5711058
legacyContentUpdatedAt: "2020-03-31T00:36:08.000Z"
---

# 读取图片信息

读取图片的宽高、旋转角度、拍摄时间和 Exif。来源可以是图片变量，也可以是文件路径。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:imageinfo" />

## 概述

<ModuleParamPreview moduleKey="sys:imageinfo" />

## 参数说明

**图片来源**：图片变量，或图片文件。

**图片变量**：来源为图片变量时，从哪个变量读图。

**文件路径**：来源为图片文件时，图片的完整路径。

**计算旋转后的宽高**：Exif 里有旋转信息时，输出旋转后的宽高。默认关闭。旧稿未写。

**失败后停止**：读取失败是否中止动作。默认开启。旧稿未写。

## 输出

- **是否成功**：是否读到了信息。旧稿未写。
- **宽度** / **高度**：像素数。
- **旋转角度**：Exif 中的旋转角度。旧稿未写。
- **拍摄时间**：Exif 拍摄时间。没有这项、且来源是文件时，用文件创建时间；否则返回时间最小值（公元 1 年 1 月 1 日 0 时）。
- **Exif数据**：词典。键是转换后的属性名，值是文本。不支持的属性会直接用数字当键。
- **原始属性数据**：C# 词典。键是 Exif 属性数字，值是 [`PropertyItem`](https://docs.microsoft.com/en-us/dotnet/api/system.drawing.imaging.propertyitem)。
- **内容图片格式**：仅来源为文件。按文件内容判断的格式（可能不准），扩展名不可靠时用。旧稿未写。

Exif 词典示例（节选）：

```json
{
  "EquipMake": "SONY",
  "EquipModel": "DSC-RX10M4",
  "Orientation": "1",
  "DateTime": "2017:09:25 12:18:21",
  "ExifExposureTime": "1/250",
  "ExifFNumber": "40/10",
  "ExifISOSpeed": "1250",
  "ExifFocalLength": "22000/100",
  "ExifPixXDim": "5472",
  "ExifPixYDim": "3648",
  "ThumbnailData": "NOT_SUPPORTED"
}
```

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/imgprocess',
      label: '图片处理',
      description: '按 Exif 方向自动旋转，或做缩放、灰度等变换。',
    },
    {
      href: '/v2/xaction/modules/readfile',
      label: '读取文件',
      description: '先把文件读成图片变量，再查信息。',
    },
  ]}
/>

## 更改历史

- 1.4.7：开始提供。
