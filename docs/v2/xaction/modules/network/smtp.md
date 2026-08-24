---
title: "SMTP发送邮件"
description: "使用SMTP协议发送邮件"
slug: "/v2/xaction/modules/smtp"
sidebar_label: "SMTP发送邮件"
sidebar_position: 120
quickerDocKey: "xaction/module/sys:smtp"
comments: true
moduleKey: "sys:smtp"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-24 20:01:39"
legacyDocId: 2570697
legacyContentUpdatedAt: "2021-11-29T13:33:22.000Z"
---

# SMTP发送邮件

用 SMTP 发一封邮件。账号密码是敏感信息，不要写进分享动作；需要保存时用 [状态存取](/v2/xaction/modules/statestorage) 放在本机。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:smtp" />

## 概述

请勿用本模块大量群发，容易被服务商当成垃圾邮件，导致账号停用。

<ModuleParamPreview moduleKey="sys:smtp" />

## 参数说明

**邮件服务器**：SMTP 域名或 IP。本机要能访问到。

**端口**：通常不加密用 `25`；Gmail 等用 `587` 并打开加密连接。

**使用加密连接**：是否用 TLS（常见于 587 端口）。默认关闭。

**帐号** / **密码**：发信账号。

**发信邮箱**：与账号匹配的邮箱地址。

**发件人名称**：收件人看到的显示名。可选。

**收件人**：不能为空。多个地址用半角逗号分隔。

**抄送** / **密送**：多个地址同样用半角逗号分隔。

**邮件主题** / **邮件正文**

**附件**：文件完整路径，多个时每行一个。文件太大可能失败。

**内容为html**：正文是否按 HTML 发送。默认关闭。

**失败后停止**：发送失败是否中止动作。默认开启。

## 输出

- **是否成功**：是否已交给邮件服务器。

## 示例动作

步骤较多，用卡片打开后查看。

<ShareLinkCard
  code="4943c94a-0437-4b98-20f1-08d742f11f76"
  title="发送到QQ邮箱"
  author="CL"
/>

## 限制与排障

本机访问不到 SMTP、端口/加密方式与服务商要求不一致、或开启了「登录保护 / 应用专用密码」时会失败。先用服务商提供的 SMTP 主机、端口和 TLS 要求核对。

常用邮箱的 SMTP 信息可参考：[CSDN 整理](https://blog.csdn.net/ning521513/article/details/79217203)（第三方文章，以各服务商当前文档为准）。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/statestorage',
      label: '状态存取',
      description: '把账号密码存在本机，不要写进分享动作。',
    },
  ]}
/>

## 更新历史

- 1.1.12 开始提供。
