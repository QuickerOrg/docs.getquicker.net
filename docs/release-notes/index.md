---
title: 更新记录
description: Quicker V2 各版本说明在官网，本页是文档站入口。
sidebar_position: 1
quickerDocKey: v2/release-notes
comments: true
---

# 更新记录

逐版本的新增、修复、校验值和注意事项写在官网，不在本站逐条转载：

**[https://getquicker.net/v2/versions](https://getquicker.net/v2/versions)**

官网版本记录目前写到 2.2.3，完整条目以那里为准。

安装包也从 [https://getquicker.net/V2](https://getquicker.net/V2) 下载，不要使用仍提供 1.x 的 `/Download` 页。

本站补充的是安装、迁移、功能说明和相对 1.x 的结构变化，例如 [V2 重要变化](/v2/what's-new/)。文档会随版本抽查修订，但不会在每次发版时完整复述官网 changelog。

2.1.29–2.2.0 的用户可见补充集中在新版主窗口侧边栏快捷按钮、暂存区「新建动作 / 用 AI 写」和「保留到场景」、贴图通用 / 人像抠图、自动化脚本面向窗口与区域的 OCR / 找图 / 找色和相对点击、窗口操作的贴边自动隐藏 / 类似窗口关闭与切换，以及步骤编辑器可拉伸或贴靠到完整屏幕高度。2.2.1 继续补充了 [动作分享的 V1 / V2 制品兼容说明](/v2/what's-new/actions#动作与公共子程序分享)、[可视化录屏预选范围](/v2/xaction/modules/screen-recording-ui)、[选中文本工具条悬浮圆点与选区定位](/v2/features/triggers/text-selection-toolbar)、[截图 Pro 设置页](/v2/features/screenshot/capture-pro#截图-pro-设置页)、[图片翻译 V2.0 单独凭证](/v2/features/screenshot/image-translate)，并新增 [等待窗口](/v2/xaction/modules/waitwindow) 步骤、把等待类步骤集中到等待分组。2.2.2–2.2.3 补充了 [动作分享安装、公共子程序嵌入和预览版本号](/v2/features/action-sharing)、[百度图片翻译 V2.0 需要 APP ID + API Key](/v2/features/screenshot/image-translate)、[本地表格 OCR 固定使用 small 模型](/v2/what's-new/xaction-steps/basic-ocr)，以及 [截图快捷键提示布局和遮挡处理](/v2/features/screenshot/capture-pro#快捷键一览)。本站只补操作上会遇到的差异，完整版本记录仍见官网。

升级到 2.1.23 或更高版本时仍需特别检查：**后台屏幕录制**步骤的默认录制范围改为“主屏幕”。已明确保存录制范围的动作不受影响；其它旧动作升级后请打开动作确认录制范围，避免原本依赖旧默认值的动作录到不符合预期的屏幕区域。

体验、降级和回退风险见 [体验前必读](/important-notice)。
