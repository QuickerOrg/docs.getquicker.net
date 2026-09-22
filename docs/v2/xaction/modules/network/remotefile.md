---
title: "远程文件"
description: "通过 WebDAV 或 S3 上传、下载、查询和批量传输远程文件。"
slug: "/v2/xaction/modules/remotefile"
sidebar_label: "远程文件"
sidebar_position: 95
quickerDocKey: "xaction/module/sys:remoteFile"
comments: true
docStatus: "reviewed"
---

# 远程文件

通过本机保存的 WebDAV 或 S3 账号，在组合动作中上传、下载、列出、查询、复制、移动或删除远程文件，也可批量读取内容和传输文件夹。

账号配置、S3 权限、操作建议、凭据安全和回退限制见[远程文件功能说明](/v2/features/remote-files)。

:::caution

删除、覆盖和移动会直接改变远端数据。先在测试目录验证账号、路径、权限和同名文件策略；返回“结果未知”时先查询远端状态，不要立即重试。

:::
