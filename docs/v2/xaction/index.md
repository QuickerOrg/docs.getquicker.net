---
title: 组合动作
description: Quicker 2.0 组合动作的入门、模块参考、教程与迁移说明。
slug: /v2/xaction
sidebar_position: 1
quickerDocKey: v2/xaction/index
comments: true
hide_table_of_contents: true
---

# 组合动作

组合动作把多个步骤按顺序执行，用来完成打开网页、处理文本、操作窗口这类自动化。Quicker 2.0 沿用 1.x 的主要模块，并补充了参数、执行和调试能力。

2.2.18 起，客户端新增[远程文件](/v2/xaction/modules/remotefile)步骤，可通过 WebDAV 上传、下载、列出、查询、删除或移动网盘及 NAS 文件，并创建目录；2.2.19 起进一步支持 S3、文本与图片内容、复制文件和批量传输。账号在 **设置 → 软件连接 → 远程文件账号** 中配置，只保存在本机；换电脑或分享动作时，需要在目标电脑配置相同的账号引用名。

<XActionLanding
  moduleCount={173}
  generatedAt="2026-09-22 21:47:06"
  counts={{
    Basic: 14,
    Waiting: 4,
    Text: 11,
    Image: 15,
    Clipboard: 5,
    Flow: 15,
    System: 22,
    Files: 11,
    Compute: 14,
    Network: 14,
    Ui: 13,
    SoftInteraction: 27,
    Input: 2,
  }}
/>
