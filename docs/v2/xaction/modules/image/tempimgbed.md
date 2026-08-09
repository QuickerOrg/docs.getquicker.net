---
title: "临时图床"
description: "将图片上传到临时（1分钟后删除）的图床，用以搜图等场景。勿上传非法内容。"
slug: "/v2/xaction/modules/tempimgbed"
sidebar_label: "临时图床"
sidebar_position: 40
quickerDocKey: "xaction/module/sys:tempImgBed"
comments: true
moduleKey: "sys:tempImgBed"
docStatus: "migrated-unreviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
metadataHash: "7fcdb0adb74297716b858b3b6e62f775ec56c317974d38ff3da018bacb8f5cb9"
legacyDocId: 7612384
legacyContentUpdatedAt: "2023-04-30T04:24:10.000Z"
---

# 临时图床

将图片上传到临时（1分钟后删除）的图床，用以搜图等场景。勿上传非法内容。

{/* xaction-metadata:start */}
## 当前模块定义

- 模块 Key：`sys:tempImgBed`
- 分类：图片处理（`Image`）
- 类型：`Action`
- 风险操作：否
- 专业版：否

## 输入参数

| Key | 名称 | 类型 | 默认值 | 必填 | 变量模式 | 条件 | 说明 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `imgVar` | 图片变量 | `Image` |  | 否 | `UseVar` |  | 指定要上传的图片变量。 |
| `stopIfFail` | 失败后停止 | `Boolean` | true | 否 | `Input` |  | 失败后是否停止动作 |

## 输出参数

| Key | 名称 | 类型 | 条件 | 说明 |
| --- | --- | --- | --- | --- |
| `isSuccess` | 是否成功 | `Boolean` |  | 操作是否成功 |
| `url` | 网址 | `Text` |  | 图片的临时网址 |
{/* xaction-metadata:end */}

本功能用于以图找图等需要**临时**将截图、图片上传到网络并获得公网地址的场景。

**警告：**请勿使用本服务上传有可能违反国家法律或规定的文件。 文件网址会带有您的用户编号，如果被阿里云或第三方机构警告，我们将会停止您使用本服务的权限。

![](./img/tempcloudstore-001-0a8af724a7.png)

图片上传后会在1分钟后自动删除。（专业版用户可能会使用阿里云+CDN服务，保持时间更长）

*注：目前本服务对所有用户开放，由于带宽限制，会对图片大小、分辨率及调用频率进行限制。根据资源状况，后续可能会对服务范围有所调整。*



![](./img/tempimgbed-002-654c3fef61.png)



## 参数

### 输入参数

【图片变量】要上传的图片变量。

【失败后停止】操作失败后是否停止动作。



### 输出

【网址】图片上传后生成的临时网址。

【是否成功】操作是否成功。
