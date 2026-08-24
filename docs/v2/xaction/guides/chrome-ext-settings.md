---
title: "设置 Quicker Connector 浏览器扩展"
description: "安装、连接和设置 Quicker Connector，并打开网页列表与表单工具。"
slug: "/v2/xaction/guides/chrome-ext-settings"
sidebar_position: 90
quickerDocKey: "xaction/guides/chrome-ext-settings"
comments: true
docStatus: "migrated-unreviewed"
legacyDocId: 232672344
legacyContentUpdatedAt: "2025-08-16T06:49:55.000Z"
---

## 安装与版本

请从 [Quicker 下载页面](https://getquicker.net/Download)进入对应浏览器的扩展商店。Quicker Connector 1.2.0 的 Chrome / Edge 版本要求浏览器 135 或更高版本，基础连接要求 Quicker 1.44.12 或更高版本。

浏览器商店的审核时间不同，同一天看到的版本号可能不同。需要使用网页列表提取、连续翻页或表单填写时，请先确认扩展已经更新到 1.2.0 或更高版本。

### 打开扩展设置界面

可以从扩展弹窗中的设置按钮快速打开扩展设置：

![](./img/chrome-ext-settings-001-83e3589b86.png)



也可以在扩展按钮上右键，选择“管理扩展程序”。

![](./img/chrome-ext-settings-002-44dcd34bea.png)





### 设置扩展



![](./img/chrome-ext-settings-003-8ef7642225.png)

1）允许运行用户脚本（使用自定义脚本时重要）

用于“对标签页运行脚本”等需要动态执行自定义脚本的功能。Chrome / Edge 138 之前若没有此选项，需要开启扩展管理页右上角的开发者模式。

2）固定到工具栏

将扩展按钮显示在浏览器工具栏，如下图所示：

![](./img/chrome-ext-settings-004-3e021381d3.png)

3）在无痕模式下启用

是否在无痕模式（隐私模式）下启用扩展。

4）允许访问文件网址

浏览器打开本地文件网页时是否仍然生效。

## 打开网页工具侧边栏

1. 打开需要处理的网页。
2. 点击工具栏中的 Quicker Connector 图标。
3. 点击弹窗右下角的“Quicker 网页工具”按钮。

侧边栏中的“列表提取”和“表单填写”用于生成模板、预览结果和测试字段。具体步骤见[网页列表提取与表单填写](/v2/xaction/guides/web-data-and-form-automation)。

## 连接状态

扩展弹窗会分别显示“消息代理”和“Quicker”的连接状态：

- 两项均已连接：可以正常执行浏览器控制。
- 消息代理已连接、Quicker 未连接：确认 Quicker 已启动且版本满足要求，然后点击弹窗中的重新连接或修复按钮。
- 消息代理未连接：检查扩展来源、Native Messaging 注册和安全软件拦截。

Quicker 不应以管理员身份运行。若仍无法连接，请按[浏览器控制模块中的排查顺序](/v2/xaction/modules/chromecontrol#扩展连接问题排查)检查 ChromeAgent 日志和注册状态。

## 可选权限

书签、历史记录、Cookie、会话和网页捕获等权限默认不必全部开启。只有使用对应后台命令时再在扩展弹窗中授权；列表提取和普通表单填写不要求开启这些可选权限。
