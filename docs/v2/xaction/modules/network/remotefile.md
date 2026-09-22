---
title: "远程文件"
description: "通过 WebDAV 或 S3 上传、下载、查询和批量传输远程文件。"
slug: "/v2/xaction/modules/remotefile"
sidebar_label: "远程文件"
sidebar_position: 95
quickerDocKey: "xaction/module/sys:remoteFile"
comments: true
moduleKey: "sys:remoteFile"
docStatus: "reviewed"
metadataGeneratedAt: "2026-09-22 21:47:06"
---

# 远程文件

通过本机保存的 WebDAV 或 S3 账号，在组合动作中上传、下载、列出、查询、复制、移动或删除远程文件，也可批量读取内容和传输文件夹。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:remoteFile" />

上面的模块卡片会根据所选操作显示适用的输入和输出参数。账号、路径、内容类型、覆盖策略、递归与批处理限制等字段的准确名称、默认值和出现条件以这里的当前定义为准。

账号配置、S3 权限、操作建议、凭据安全和回退限制见[远程文件功能说明](/v2/features/remote-files)。

:::caution

删除、覆盖和移动会直接改变远端数据。先在测试目录验证账号、路径、权限和同名文件策略；返回“结果未知”时先查询远端状态，不要立即重试。

:::
