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

官网版本记录目前写到 2.2.10，完整条目以那里为准。

安装包也从 [https://getquicker.net/V2](https://getquicker.net/V2) 下载，不要使用仍提供 1.x 的 `/Download` 页。

本站补充的是安装、迁移、功能说明和相对 1.x 的结构变化，例如 [V2 重要变化](/v2/what's-new/)。文档会随版本抽查修订，但不会在每次发版时完整复述官网 changelog。

2.1.29–2.2.0 的用户可见补充集中在新版主窗口侧边栏快捷按钮、暂存区「新建动作 / 用 AI 写」和「保留到场景」、贴图通用 / 人像抠图、自动化脚本面向窗口与区域的 OCR / 找图 / 找色和相对点击、窗口操作的贴边自动隐藏 / 类似窗口关闭与切换，以及步骤编辑器可拉伸或贴靠到完整屏幕高度。2.2.1 继续补充了 [动作分享的 V1 / V2 制品兼容说明](/v2/what's-new/actions#动作与公共子程序分享)、[可视化录屏预选范围](/v2/xaction/modules/screen-recording-ui)、[选中文本工具条悬浮圆点与选区定位](/v2/features/triggers/text-selection-toolbar)、[截图 Pro 设置页](/v2/features/screenshot/capture-pro#截图-pro-设置页)、[图片翻译 V2.0 单独凭证](/v2/features/screenshot/image-translate)，并新增 [等待窗口](/v2/xaction/modules/waitwindow) 步骤、把等待类步骤集中到等待分组。2.2.2–2.2.3 补充了 [动作分享安装、公共子程序嵌入和预览版本号](/v2/features/action-sharing)、[百度图片翻译 V2.0 单独凭证 / API Key](/v2/features/screenshot/image-translate)、[本地表格 OCR 固定使用 small 模型](/v2/what's-new/xaction-steps/basic-ocr)，以及 [截图快捷键提示布局和遮挡处理](/v2/features/screenshot/capture-pro#快捷键一览)。2.2.4 补充了 [软件连接与 Bridge](/v2/features/software-connections) 入口、[OCR 结果窗的表格识别、Excel 打开和原图复制](/v2/features/screenshot/capture-pro#结果窗)、[用 AI 写的重复点击与未配置模型处理](/v2/features/ai-and-agent)，以及百度图片翻译 V2.0 短暂简化为只需 API Key。2.2.5 补充了 [软件连接与 Bridge](/v2/features/software-connections) 在设置页内安装与管理、[模兔云软件连接](/v2/features/software-connections/software/motuyun)、[截图 Pro 二维码识别、贴图分组与保存模板](/v2/features/screenshot/capture-pro)、[AI 助手本机用量与工作区](/v2/features/ai-and-agent)，以及文件列表获取超时、[百度图片翻译 V2.0 APP ID 与 API Key 双凭证](/v2/features/screenshot/image-translate) 和 [2.2.4 回退风险](/important-notice)。2.2.6 补充了 [悬浮动作与分组](/v2/features/floating-actions)（整组缩放、窗口跟随、自动折叠、布局备份；默认关闭，启用后需重启）、[截图选区悬停识别二维码](/v2/features/screenshot/capture-pro#选区二维码)、[Mastercam 软件连接](/v2/features/software-connections/software/mastercam)、动作编辑器进入时优先显示收藏夹，以及 [作者重装恢复原标识、复制切断分享关系](/v2/features/action-sharing#安装标识与副本)。2.2.7 补充了 [截图 Pro 选区阴影与边框及记忆规则](/v2/features/screenshot/capture-pro#选区阴影与边框)、[OCR 结果窗文本工具](/v2/features/screenshot/capture-pro#结果窗)、[截图侧栏恢复已关闭贴图](/v2/features/screenshot/capture-pro#贴图窗口截图后)、[Photoshop 手动路径与 Adobe 安装依赖检测](/v2/features/software-connections/software/photoshop)、设置窗滚轮切换分组、[表达式显式 dynamic](/v2/xaction/concepts/expression#表达式的运算结果)、[表单打开前提示缺失变量](/v2/xaction/modules/form)，以及 [回退 2.2.6 丢阴影边框配置](/important-notice)（可备份 `image-drawing-tool-state.json`）。2.2.8 补充了 [截图 Pro 混合文本捕获](/v2/features/screenshot/capture-pro#混合文本捕获)、[选区侧栏按住刷新与 F5](/v2/features/screenshot/capture-pro#选区刷新)、[剪贴板贴图支持富文本 / 公式 / 纯文本 / 图片文件](/v2/features/screenshot/capture-pro#贴图窗口截图后)、[「恢复贴图」更名与连续恢复](/v2/features/screenshot/capture-pro#贴图窗口截图后)，以及跨屏工具栏定位、刷新后马赛克与旧智能马赛克结果清理、[选中文本工具条从圆点展开不再误隐藏](/v2/features/triggers/text-selection-toolbar#悬浮圆点与选区定位)、[表达式数组 / 可空值 / 枚举匹配](/v2/xaction/concepts/expression#表达式的运算结果)、[多字段表单小数加减尾数](/v2/xaction/modules/form)、[子程序内软件连接目标窗口](/v2/what's-new/xaction-steps/subprogram) 等修复。2.2.9 补充了 [软件连接总开关](/v2/features/software-connections/install-and-manage#软件连接总开关)（默认开启、仅本机）、[读取图片信息的无 EXIF 日期回退与「拍摄时间为空」](/v2/xaction/modules/imageinfo#无-exif-日期时)、[场景列表右键菜单](/v2/features/scenes#场景与动作管理中的右键)，以及仪表盘 Esc 拦截、Clover 等内嵌资源管理器场景识别、旧面板工具菜单补齐当前场景诊断与最近触发历史、模块列表 Ctrl+F、截图刷新黑屏与小尺寸工具栏图标等修复。2.2.10 补充了 [新面板双击显隐导航与切换宽窄](/v2/what's-new/new-main-win/usage#双击导航栏)、[轮盘覆盖粘贴与跨场景剪切](/v2/what's-new/others/circle-menu#覆盖粘贴与跨场景剪切)、[动作分组跨场景复制移动与未分组批量管理](/v2/features/scenes#跨场景复制移动与未分组)、[自定义窗口指针右上定位与鼠标偏移](/v2/xaction/modules/customwindow#窗口位置与鼠标偏移)、[FlaUI「不等待操作完成」](/v2/xaction/modules/flauiautomation#不等待操作完成)、[截图选区圆角独立开关](/v2/features/screenshot/capture-pro#选区阴影与边框)、[Mastercam 2025/2026 与跨年度目录冲突](/v2/features/software-connections/software/mastercam)、[动作分享旧版兼容检查](/v2/features/action-sharing#旧版兼容检查)、[多步骤输入编辑窗口](/v2/xaction/modules/inputscript#编辑窗口)，以及扩展热键设置界面、面板隐藏残留、文本工具条圆点展开点击、表单标题与浮点尾差、贴图 Alt 拖后放大镜、轮盘描边与 Excel 运行库等修复。本站只补操作上会遇到的差异，完整版本记录仍见官网。

升级到 2.1.23 或更高版本时仍需特别检查：**后台屏幕录制**步骤的默认录制范围改为“主屏幕”。已明确保存录制范围的动作不受影响；其它旧动作升级后请打开动作确认录制范围，避免原本依赖旧默认值的动作录到不符合预期的屏幕区域。

体验、降级和回退风险见 [体验前必读](/important-notice)。
