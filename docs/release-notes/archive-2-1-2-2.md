---
title: 2.1–2.2 版本更新归档
description: Quicker 2.1.29 至 2.2.16 版本的本站补充说明归档。
sidebar_position: 20
quickerDocKey: v2/release-notes/archive-2-1-2-2
comments: true
---

# 2.1–2.2 版本更新归档

本页归档 **2.1.29 至 2.2.16** 的早期文档补充记录；**2.2.17 及 2.3.x** 近期更新见 [更新记录](./index.md)。软件完整改动与校验值以 [官网版本记录](https://getquicker.net/v2/versions) 为准。

## 更多文档补充

### 2.2.16 · 悬浮分组与截图工具栏

- 补充[悬浮分组受控合并与中间拆分](/v2/features/floating-actions#移动和整理)、[搜索引擎 JSON 批量导入导出](/v2/features/tools#自定义搜索引擎的导入导出)。
- 补充[Quicker 截图自定义工具栏可视化编排](/v2/features/screenshot/capture-pro#标注)：拖动排序、添加子程序或动作、设置图标大小；并记录网络路径图标探测、表单多行高度、提示消息、录屏结束和缩略图等修复。

### 2.2.15 · 面板与贴图细节

- 补充[分组圆点颜色及上方居中](/v2/features/action-panel/usage#创建和管理分组)、[面板软隐藏以减少弹出闪烁](/v2/features/action-panel/usage#减少面板弹出闪烁)。
- 补充[Quicker 截图用反引号切换原始鼠标指针](/v2/features/screenshot/capture-pro#快捷键一览)、[HTML 贴图换行及屏幕内定位](/v2/features/screenshot/recording-and-pin#贴图窗口截图后)、[单个在线软件连接的目标选择](/v2/features/software-connections/command-tool#动作怎样选择目标)；并记录自由格子跨分组拖放、截图光标与提示、表单对齐等修复。

### 2.2.14 · 自由格子与表单

- 补充[自由格子触发键](/v2/features/action-panel/usage#触发键)、[用动作控制悬浮分组](/v2/features/floating-actions#用动作控制悬浮分组)、[轮盘继承动作预览](/v2/features/triggers/circle-menu#按场景覆盖与来源切换)。
- 补充[表单扩展选项及 `$=` 校验](/v2/xaction/modules/form)、[截图文件名模板 `{date:格式}`](/v2/features/screenshot/capture-pro#截图-pro-设置页)，以及面板分组导航、确认与复制按钮等交互调整。回退前请看[截图文件名模板与悬浮分组动作注意](/v2/migration/upgrade-and-rollback#2214-截图文件名模板与悬浮分组动作)。

### 2.2.13 · 长截图与自由格子

- 新增[长截图裁剪与删段](/v2/features/screenshot/capture-pro#长截图编辑)、[新面板自由格子布局](/v2/features/action-panel/usage#自由格子布局)、[多字段表单单选按钮与表达式校验](/v2/xaction/modules/form)、[逐行打开网址、文件和文件夹](/v2/xaction/modules/openurl)说明。
- 补充[动作运行状态提示](/v2/features/action-panel/usage#查找和运行动作)、[Ctrl 拖动调整全局区和上下文区高度](/v2/features/action-panel/usage#窗口尺寸)、[悬浮分组显示模式](/v2/features/floating-actions#紧凑半透明和名称显示)、[动作更新策略集中管理](/v2/features/action-sharing#安装和检查更新)、[Illustrator 2023 支持](/v2/features/software-connections/software/illustrator)。
- 多设备使用或可能回退时，请阅读[规则父场景与面板自由布局注意](/v2/migration/upgrade-and-rollback#2212-规则父场景与-2213-面板自由布局)。

### 2.2.12 · 备份、API 与截图

- 新增[动作运行数据批量本地备份](/v2/features/account-and-sync#动作运行数据的本地备份)、[HTTP API](/v2/features/http-websocket)、[规则父场景](/v2/features/scenes#规则父场景)、[悬浮动作双击](/v2/features/floating-actions#单击与双击)、[截图荧光笔及“截图+复制”](/v2/features/screenshot)说明。
- 补充场景拖放、左键辅助分组筛选、录屏工具栏排除，以及[按动作与调用链查看日志](/v2/features/tools#动作运行与触发记录)。

### 2.2.11 · 触发与运行记录

- 补充[左键辅助连续按键](/v2/features/triggers/left-button-plus#一次按住连续执行)、[触碰屏幕边框](/v2/features/triggers/advanced-mouse-triggers#触碰屏幕边框)、[云端动作回收站](/v2/features/account-and-sync#云端动作回收站)。
- 更新[变量](/v2/xaction/concepts/variables)、[运行记录](/v2/features/tools#动作运行与触发记录)、[Quicker 截图](/v2/features/screenshot/capture-pro)、[AI 与外部助手](/v2/features/ai-and-agent)的操作说明；动作更新方式、只读动作外观及分享限制见[动作分享](/v2/features/action-sharing)。
- 升级前请阅读[触发设置的多设备与回退风险](/v2/migration/upgrade-and-rollback#2211-触发设置的多设备与回退风险)。

## 早期文档补充

### 2.2.10 · 面板、轮盘与编辑器

- 补充[新面板双击显隐导航与切换宽窄](/v2/what's-new/new-main-win/usage#双击导航栏)、[轮盘覆盖粘贴与跨场景剪切](/v2/what's-new/others/circle-menu#覆盖粘贴与跨场景剪切)、[动作分组跨场景复制移动及未分组批量管理](/v2/features/scenes#跨场景复制移动与未分组)。
- 补充[自定义窗口指针右上定位与鼠标偏移](/v2/xaction/modules/customwindow#窗口位置与鼠标偏移)、[FlaUI「不等待操作完成」](/v2/xaction/modules/flauiautomation#不等待操作完成)、[截图选区圆角开关](/v2/features/screenshot/capture-pro#选区阴影与边框)。
- 补充[Mastercam 2025/2026 与跨年度目录冲突](/v2/features/software-connections/software/mastercam)、[动作分享旧版兼容检查](/v2/features/action-sharing#旧版兼容检查)、[多步骤输入编辑窗口](/v2/xaction/modules/inputscript#编辑窗口)，以及扩展热键、面板隐藏、表单、贴图和轮盘等修复。

### 2.2.9 · 软件连接与场景

- 补充[软件连接总开关](/v2/features/software-connections/install-and-manage#软件连接总开关)（默认开启、仅本机）、[图片无 EXIF 日期时的回退及「拍摄时间为空」](/v2/xaction/modules/imageinfo#无-exif-日期时)、[场景列表右键菜单](/v2/features/scenes#场景动作与触发管理中的右键)。
- 记录仪表盘 Esc、Clover 等内嵌资源管理器的场景识别、旧面板工具菜单、模块列表 Ctrl+F，以及截图刷新和工具栏图标等修复。

### 2.2.8 · 贴图与截图修复

- 补充[混合文本捕获](/v2/features/screenshot/capture-pro#混合文本捕获)、[选区侧栏按住刷新与 F5](/v2/features/screenshot/capture-pro#选区刷新)、[剪贴板贴图的富文本、公式、纯文本及图片文件支持](/v2/features/screenshot/recording-and-pin#贴图窗口截图后)、[「恢复贴图」更名与连续恢复](/v2/features/screenshot/recording-and-pin#贴图窗口截图后)。
- 补充跨屏工具栏定位、马赛克结果清理、[文本工具条从圆点展开不再误隐藏](/v2/features/triggers/text-selection-toolbar#悬浮圆点与选区定位)、[表达式数组、可空值及枚举匹配](/v2/xaction/concepts/expression#表达式的运算结果)、[表单小数加减尾数](/v2/xaction/modules/form)、[子程序内的软件连接目标窗口](/v2/what's-new/xaction-steps/subprogram)等修复。

### 2.2.7 · 截图外观与回退

- 补充[Quicker 截图选区阴影、边框及记忆规则](/v2/features/screenshot/capture-pro#选区阴影与边框)、[OCR 结果窗文本工具](/v2/features/screenshot/ocr#结果窗)、[截图侧栏恢复已关闭贴图](/v2/features/screenshot/recording-and-pin#贴图窗口截图后)。
- 补充[Photoshop 手动路径与 Adobe 依赖检测](/v2/features/software-connections/software/photoshop)、设置窗滚轮切换分组、[表达式显式 `dynamic`](/v2/xaction/concepts/expression#表达式的运算结果)、[表单打开前提示缺失变量](/v2/xaction/modules/form)。
- 回退到 2.2.6 会丢失阴影与边框配置；可先备份 `image-drawing-tool-state.json`，详见[回退注意](/v2/migration/upgrade-and-rollback#回退到-226-后保存截图设置会丢弃-227-的阴影与边框配置2026-09-07)。

### 2.2.6 · 悬浮动作与分组

- 补充[悬浮动作与分组](/v2/features/floating-actions)：整组缩放、窗口跟随、自动折叠和布局备份。功能默认关闭，启用后需要重启。
- 补充[截图选区悬停识别二维码](/v2/features/screenshot/capture-pro#二维码与条形码)、[Mastercam 软件连接](/v2/features/software-connections/software/mastercam)、动作编辑器优先显示收藏夹，以及[作者重装恢复原标识、复制切断分享关系](/v2/features/action-sharing#安装标识与副本)。

### 2.2.5 · 连接管理与贴图

- 补充[软件连接与 Bridge 在设置页安装和管理](/v2/features/software-connections)、[模兔云软件连接](/v2/features/software-connections/software/motuyun)。
- 补充[Quicker 截图二维码识别、贴图分组和保存模板](/v2/features/screenshot/capture-pro)、[AI 助手本机用量与工作区](/v2/features/ai-and-agent)，以及文件列表获取超时处理。
- 百度图片翻译 V2.0 使用 [APP ID 与 API Key 双凭证](/v2/features/screenshot/image-translate)；可能回退时请先查看该功能的凭证说明，并核对[官网版本记录](https://getquicker.net/v2/versions)中对应版本的注意项。

### 2.2.4 · 软件连接与 OCR 结果窗

- 补充[软件连接与 Bridge](/v2/features/software-connections) 入口、[OCR 结果窗表格识别、Excel 打开和原图复制](/v2/features/screenshot/ocr#结果窗)、[「用 AI 写」重复点击及未配置模型处理](/v2/features/ai-and-agent)。
- 百度图片翻译 V2.0 在此版本短暂简化为只需 API Key；后续版本的凭证要求见[图片翻译说明](/v2/features/screenshot/image-translate)。

### 2.2.2–2.2.3 · 分享安装与截图提示

- 补充[动作分享安装、公共子程序嵌入及预览版本号](/v2/features/action-sharing)、[百度图片翻译 V2.0 凭证与 API Key](/v2/features/screenshot/image-translate)。
- 补充[本地表格 OCR 固定使用 small 模型](/v2/what's-new/xaction-steps/basic-ocr)、[截图快捷键提示布局及遮挡处理](/v2/features/screenshot/capture-pro#快捷键一览)。

### 2.2.1 · 分享、录屏与等待步骤

- 补充[动作分享的 V1 / V2 制品兼容说明](/v2/what's-new/actions#动作与公共子程序分享)、[可视化录屏预选范围](/v2/xaction/modules/screen-recording-ui)、[选中文本工具条悬浮圆点与选区定位](/v2/features/triggers/text-selection-toolbar)。
- 补充[Quicker 截图设置页](/v2/features/screenshot/capture-pro#截图-pro-设置页)、[图片翻译 V2.0 单独凭证](/v2/features/screenshot/image-translate)；新增[等待窗口](/v2/xaction/modules/waitwindow)步骤，并将等待类步骤集中到等待分组。

### 2.1.29–2.2.0 · 主窗口、贴图与步骤编辑

- 补充新版主窗口侧边栏快捷按钮、暂存区「新建动作 / 用 AI 写」和「保留到场景」、贴图通用与人像抠图。
- 补充自动化脚本面向窗口或区域的 OCR、找图、找色与相对点击，窗口贴边自动隐藏、类似窗口关闭与切换，以及步骤编辑器拉伸或贴靠至完整屏幕高度。

本站只补充操作中会遇到的差异。软件各版本的完整改动和校验值始终以[官网版本记录](https://getquicker.net/v2/versions)为准。
