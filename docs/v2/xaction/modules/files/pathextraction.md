---
title: "提取文件路径信息/生成路径"
description: "从文件路径中提取文件名、文件夹等信息"
slug: "/v2/xaction/modules/pathextraction"
sidebar_label: "提取文件路径信息/生成路径"
sidebar_position: 50
quickerDocKey: "xaction/module/sys:pathExtraction"
comments: true
moduleKey: "sys:pathExtraction"
docStatus: "migrated-unreviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 2117073
legacyContentUpdatedAt: "2022-06-14T01:38:52.000Z"
---

# 提取文件路径信息/生成路径

从文件路径中提取文件名、文件夹等信息

## 当前模块定义

<XActionModuleMeta moduleKey="sys:pathExtraction" />

提取路径中的信息，以及计算生成新的路径。

根据选择的“操作类型”不同，实现不同的功能。

## 提取路径信息

从完整的文件、文件夹路径中提取文件名、扩展名等信息。

![](./img/pathextraction-001-5e494dd491.png)

**输入**

【完整路径】要提取信息的完整路径。

**输出**

【文件名】路径中的文件名信息。

【文件名（去掉扩展名）】去掉扩展名的文件名。

【路径】文件所在的文件夹路径。

【扩展名】文件的后缀。

**示例：**

输入：

-   路径：`D:\Work\Quicker\doc\icon.psd`

输出：

-   文件名：`icon.psd`
-   文件名（去掉扩展名）：`icon`
-   扩展名：`.psd`
-   所在文件夹路径：`D:\Work\Quicker\doc`

## 更改扩展名，其它不变

基于现有的文件路径，生成一个**仅修改文件扩展名**的新路径。 (需Quicker 1.33.25+)

![](./img/pathextraction-002-d16a3ffe38.png)

**输入**

【路径】现有的文件完整路径或文件名。

【新的扩展名】目标扩展名。

**输出**

【结果路径】生成的结果路径。

**示例**

输入：

-   路径：`D:\Work\Quicker\doc\icon.psd`
-   新的扩展名：`.jpg`

输出：

-   结果路径：`D:\Work\Quicker\doc\icon.jpg`

## 更改文件名(含扩展名)，所在目录不变

基于现有的文件路径，生成一个**相同目录下**的新文件名的完整路径。

![](./img/pathextraction-003-5b6478c443.png)

**输入**

【路径】现有的文件完整路径。

【新的文件名】目标文件名。

**输出**

【结果路径】生成的结果路径。

**示例**

输入：

-   路径：`D:\Work\Quicker\doc\icon.psd`
-   新的文件名： `icon_save_20220506_112233.psd`

输出：

-   结果路径：`D:\Work\Quicker\doc\icon_save_20220506_112233.psd`

## 更改所在目录，文件名不变

根据现有文件的名称和目标路径生成新的文件路径。

![](./img/pathextraction-004-81ebbc016e.png)

**输入**

【路径】现有的文件完整路径。

【目标目录路径】目标目录的完整路径。

**输出**

【结果路径】生成的结果路径。

**示例**

输入：

-   路径：`D:\Work\Quicker\doc\icon.psd`
-   目标目录路径：`D:\Backup\20220105`

输出：

-   结果路径：`D:\Backup\20220105\icon.psd`

## 生成路径

根据根路径和更多路径片段生成一个完整路径。

![](./img/pathextraction-005-6b854a7e29.png)

**输入**

【路径】某个磁盘分区的根目录或根目录开始的文件夹路径。

【路径部分2-4】路径的中间层次或文件名。如果某个参数值为空，将被忽略。

**输出**

【结果路径】生成的结果路径。

**示例**

输入：

-   路径：`D:\Work`
-   路径部分2：`Media`
-   路径部分3：`202205`
-   路径部分4：`abc.gif`

输出：

-   结果路径：`D:\Work\Media\20220506\abc.gif`

## 示例动作

-   [https://getquicker.net/Sharedaction?code=7e0ffda7-cbc9-4e31-2462-08da4d582a20](https://getquicker.net/Sharedaction?code=7e0ffda7-cbc9-4e31-2462-08da4d582a20)
