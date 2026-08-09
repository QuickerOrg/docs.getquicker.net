---
title: "Zip压缩打包"
description: "Zip压缩或解压缩"
slug: "/v2/xaction/modules/zip"
sidebar_label: "Zip压缩打包"
sidebar_position: 100
quickerDocKey: "xaction/module/sys:zip"
comments: true
moduleKey: "sys:zip"
docStatus: "migrated-unreviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
metadataHash: "2f6bf254f090610d843f5ee487e627baf60a1f6cca4370b21ca74f30838283df"
legacyDocId: 8014488
legacyContentUpdatedAt: "2025-12-18T13:17:15.000Z"
---

# Zip压缩打包

Zip压缩或解压缩

{/* xaction-metadata:start */}
## 当前模块定义

- 模块 Key：`sys:zip`
- 分类：系统操作（`Files`）
- 类型：`Action`
- 风险操作：否
- 专业版：否

## 输入参数

| Key | 名称 | 类型 | 默认值 | 必填 | 变量模式 | 条件 | 说明 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `type` | 操作类型 | `Enum` | Zip | 是 | `Input` |  |  |
| `sourcePath` | 源路径 | `Text` |  | 是 | `UseVarOrInput` | 仅：Zip | 待压缩的文件夹或文件路径。多个文件时每个文件一行。 |
| `targetZipFile` | Zip文件路径 | `Text` |  | 是 | `UseVarOrInput` | 仅：Zip | 压缩时：目标文件的路径。留空时自动生成临时文件。点(.)表示待压缩的文件夹或文件所在位置。 |
| `sourceZipFile` | Zip文件路径 | `Text` |  | 是 | `UseVarOrInput` | 仅：Unzip | 待解压的文件路径。 |
| `keepBaseFolder` | 源路径为单个文件夹时，压缩整个文件夹（保留文件夹名称） | `Boolean` | false | 否 | `Input` | 仅：Zip |  |
| `outputPath` | 目标路径 | `Text` |  | 是 | `UseVarOrInput` | 仅：Unzip | 解压缩的目标路径, 点(.)表示zip文件所在的文件夹, 星(*)表示以zip文件名创建的子文件夹。 |
| `password` | 密码 | `Text` |  | 否 | `UseVarOrInput` |  | 压缩文件密码 |
| `comment` | 备注 | `Text` |  | 否 | `UseVarOrInput` | 仅：Zip | 压缩文件注释内容 |
| `level` | 级别 | `Integer` | 1 | 否 | `UseVarOrInput` | 仅：Zip | 压缩级别，0-9。0表示不压缩（速度快），9表示压缩到最小（速度慢） |
| `overwrite` | 自动覆盖文件 | `Boolean` | false | 否 | `Input` | 仅：Unzip |  |
| `skipOverwriteError` | 覆盖失败时忽略 | `Boolean` | false | 否 | `Input` | 仅：Unzip | 忽略掉无法覆盖的情况 |
| `showProgress` | 显示进度条 | `Boolean` | false | 否 | `Input` | 仅：Zip, Unzip | 仅支持解压缩或压缩单个文件夹。 |
| `stopIfFail` | 失败后停止 | `Boolean` | true | 否 | `Input` |  | 失败后是否停止动作 |

## 输出参数

| Key | 名称 | 类型 | 条件 | 说明 |
| --- | --- | --- | --- | --- |
| `isSuccess` | 是否成功 | `Boolean` |  | 操作是否成功 |
| `resultPath` | 结果路径 | `Text` |  | 生成的zip文件完整路径，或解压缩后的完整路径 |

## 选项值

### `type` 操作类型

| Value | 名称 | 说明 |
| --- | --- | --- |
| `Zip` | 创建Zip文件 |  |
| `Unzip` | 解压缩Zip文件 |  |
{/* xaction-metadata:end */}

## 概要

本模块支持2个功能：

-   将文件夹或多个文件打包成一个zip文件；
-   解压缩一个zip文件到指定文件夹；



注：

本模块适用于需要将几个文件打包发送给他人等轻量级使用场景，不适合压缩大文件或大量文件，不适合解压缩大文件。

本模块从1.8.2版本开始提供。





## 操作：创建zip文件

将指定的文件夹或多个文件压缩为一个zip文件。

![](./img/zip-001-816f083f00.png)

### 输入参数

【源路径】

需要压缩打包的内容，可以为如下几种：

-   1个文件夹路径
-   1个文件
-   同一文件夹下的多个文件或子文件夹



【Zip文件路径】

生成的目标zip文件路径。可以按如下格式指定：

-   完整的zip文件路径，如：d:\\backup\\20200618\_work.zip
-   留空，自动在Windows临时目录中生成文件。并将生成的zip文件路径从【结果路径】参数中输出。
-   英文句点“.”,待压缩的文件或文件夹所在路径，文件名自动生成，从【结果路径】参数中输出。

【源文件为单个文件夹时，压缩整个文件夹】

单个文件夹时，是否将文件夹本身也打包到zip中。 不选择时，会将文件夹内的内容压缩，而不包含文件夹自身。



【密码】 设置zip文件的密码。

【备注】 压缩文件中保存的备注文字。

【级别】 压缩级别，越大，压缩率越高，文件越小，但是也会越慢。

【显示进度条】 压缩时是否显示进度条。



### 输出参数

【是否成功】是否成功完成了操作。

【结果路径】生成的zip文件的完整路径。







## 操作：解压缩zip文件

将zip文件解压缩到指定文件夹。

![](./img/zip-002-652a1a1eb0.png)

### 输入参数

【zip文件路径】要解压缩的zip文件完整路径。

【目标路径】要解压缩到的位置，支持如下格式：

-   目标文件夹的完整路径
-   英文句点“.”，将文件解压缩到zip文件所在的文件夹。
-   星号“\*”，解压缩到以zip文件名创建的子文件夹中。

【密码】 zip文件的密码。

【自动覆盖文件】 解压缩时覆盖已有文件。

【覆盖失败时忽略】 如果无法覆盖已有文件，是否忽略错误继续解压缩其它文件。

【显示进度条】 解压缩时显示进度条。
