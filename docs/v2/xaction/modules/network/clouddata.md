---
title: "云状态存取"
description: "根据键值读取或写入网络数据。"
slug: "/v2/xaction/modules/clouddata"
sidebar_label: "云状态存取"
sidebar_position: 80
quickerDocKey: "xaction/module/sys:clouddata"
comments: true
moduleKey: "sys:clouddata"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-24 20:01:39"
legacyDocId: 4544735
legacyContentUpdatedAt: "2023-10-21T07:59:44.000Z"
---

# 云状态存取

按名称把一份文本存到云端，或再读回来。用来在多台电脑之间同步少量状态。只在本机保存请用 [状态存取](/v2/xaction/modules/statestorage)。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:clouddata" />

## 概述

每个用户有独立空间，不能和别人共享。整个空间像一个网盘文件夹：状态名相当于文件名，值相当于文件内容。名称是**全局**的，多个动作可以用同一个名字读写同一份数据（和本机状态按动作隔离不同）。

<ModuleParamPreview moduleKey="sys:clouddata" />

## 参数说明

**操作类型**：**写入数据到网络** 或 **从网络读取数据**。

**状态名称**：读写哪一条。为避免和别的动作撞名，建议写成「作者_动作名_用途」这种较长的名字。

**内容**：仅写入。要保存的值。写成 `*NULL*` 会删除这条状态。

<ModuleParamPreview
  moduleKey="sys:clouddata"
  focusKeys={['type', 'key', 'value']}
  values={{type: 'saveGlobalState', value: '*NULL*'}}
/>

**超时时间**：请求超时秒数，默认 `2.5`。

**失败后停止**：失败是否中止动作。默认开启。

## 输出

- **是否成功**
- **内容**：仅读取。读到的值。
- **最后更新时间**：仅读取。服务器上的最后更新时间，已转成本机时区。旧稿未写。
- **最后更新时间(UTC)**：仅读取。服务器 UTC 时间。旧稿未写。
- **错误信息**：出错说明。可用是否包含 `specified key does not exist` 判断键不存在。
- **错误代码**：仅读取。云服务商错误码，`NoSuchKey` 表示没有这条状态。旧稿未写。

## 额度与安全

免费版和专业版都有额度，因为云存储有额外成本。

| 项目 | 免费版 | 专业版 |
| --- | --- | --- |
| 单条最大 | 100KB | 1000KB |
| 总空间 | 50MB | 1000MB |
| 每日存取次数 | 500 | 5000 |

相对本机存储会慢一些。除图片外，其它类型会先转成文本。不要在循环里反复读写，很容易把当日次数用完。

底层是阿里云 OSS。传输走 HTTPS；本地加密后再上传，云端只存密文，每用户密钥独立。

## 如何删除

1. 登录会员中心，在「云状态数据管理」里删。

![](./img/clouddata-001-057dac14e4.png)

2. 在动作里写入，把 **内容** 设为 `*NULL*`。

## 限制与排障

键不存在时看 **错误代码** 是否为 `NoSuchKey`，或 **错误信息** 是否含 `specified key does not exist`。超时把 **超时时间** 调大。循环里高频调用会先耗尽每日次数。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/statestorage',
      label: '状态存取',
      description: '只在本机保存，不占云额度。',
    },
    {
      href: '/v2/xaction/modules/tempcloudstore',
      label: '临时云存储',
      description: '临时上传并拿到短时网址。',
    },
  ]}
/>

## 更新历史

- 1.5.7 从仅专业版改为所有用户可用，并调整额度。
- 2.x 读取时增加最后更新时间（本机时区与 UTC）。
