---
title: 更新记录
description: 查看 Quicker V2 完整版本记录、下载入口，以及本站按版本补充的使用说明。
sidebar_position: 1
quickerDocKey: v2/release-notes
comments: true
---

# 更新记录

<div className="release-notes-hero">
  <p className="release-notes-hero__eyebrow">QUICKER V2 · 文档更新</p>
  <p className="release-notes-hero__lead">这里按版本整理本站新增或修订的使用说明。软件每版的完整新增、修复、注意事项及安装包校验值，请查看官网版本记录。</p>
  <div className="release-notes-hero__actions">
    <a className="button button--primary" href="https://getquicker.net/v2/versions">查看完整版本记录 ↗</a>
    <a className="button button--outline button--primary" href="https://getquicker.net/V2">下载 Quicker V2 ↗</a>
  </div>
  <p className="release-notes-hero__footnote">版本是否已开放下载，以官网为准；仍提供 1.x 的 <code>/Download</code> 页面不适用于 V2。</p>
</div>

本站还提供 [V2 安装说明](/v2/install/windows)、[从 1.x 迁移](/v2/migration/from-v1)和相对 1.x 的 [V2 重要变化](/v2/what's-new/)。下方只列文档补充过的版本，不代替官网更新记录。

## 升级前先看

:::caution[后台屏幕录制的默认范围已变化]
升级到 **2.1.23 或更高版本**时，后台屏幕录制步骤的默认录制范围改为“主屏幕”。已明确保存录制范围的动作不受影响；其他旧动作请打开并确认录制范围，避免录到不符合预期的屏幕区域。
:::

多设备使用、降级或回退前，请阅读[体验前必读](/important-notice)。各版本的具体风险也在下方对应条目中标出。

## 近期文档补充

### 2.2.22 · 列表编辑、提示消息与 Agent

- 补充[列表项自定义子程序编辑](/v2/xaction/modules/managelist#自定义添加和编辑)的变量约定、表单示例和取消行为。
- 补充[提示消息默认位置与时长同步](/v2/xaction/modules/notify#全局默认位置和时长)，以及[键鼠脚本提示选项](/v2/xaction/modules/automationscript#提示选项)的默认值规则。
- 更新[Agent 对话文件导入导出和步骤加入对话](/v2/features/ai-and-agent)、[最近动作的编辑访问记录](/v2/features/action-panel/usage#调整动作顺序)。
- 补充[长截图重来](/v2/features/screenshot/capture-pro#长截图编辑)，并更新截图、贴图和录屏标注快捷键。同步设置、旧客户端和快捷键变化见[升级注意](/important-notice#2222-提示设置与编辑操作)。

### 2.2.21 · 代码补全与动作面板

- [代码补全服务](/v2/xaction/concepts/xaction-editor#代码补全服务)默认在线提供，也可在「设置 → 动作设计」安装本地组件。在线补全会向服务器发送编辑中的代码等信息，详见[升级注意](/important-notice#2221-代码补全服务)。
- [文本窗口](/v2/xaction/modules/showtext#记住上次位置和大小)可记住上次的位置和大小。
- [动作面板](/v2/features/action-panel/usage#复制后同时添加与删除关联)补充了复制后「同时添加到这里」及删除时查看场景关联位置的说明。

### 2.2.20 · 显示器、录屏与 AI

- 新增[显示器与虚拟桌面步骤](/v2/features/displays-and-desktops)及其参数说明。包含这些步骤的动作需要 **2.2.20 或更高版本**客户端，详见[升级注意](/important-notice#2220-显示器与虚拟桌面步骤)。
- 补充[子程序输入参数的代码语言与高级分组](/v2/xaction/modules/subprogram#输入参数)，以及[屏幕录制](/v2/xaction/modules/screen-recording-ui#参数说明)和[后台屏幕录制](/v2/xaction/modules/screen-recording#参数说明)的 FFmpeg 编码参数。
- 补充[AI 对话导入导出与侧边设计器](/v2/features/ai-and-agent)，以及[贴图窗口按 `Y` 切换阴影、右键菜单调整](/v2/features/screenshot/capture-pro#移动模式)。

### 2.2.18 · 远程文件与工作区

- 补充[远程文件（WebDAV）步骤及本机账号限制](/v2/xaction)、[远程文件账号入口和 HTTP / WebSocket 设置迁移](/v2/features/software-connections)。跨设备或可能回退时，请先看[远程文件账号与 AI 助手工作区注意](/important-notice#2218-远程文件账号与-ai-助手工作区)。
- 补充[主面板自由格子边缘插队、工具菜单及未配置程序提示](/v2/features/action-panel/usage)、[软件桥接命令工具的动作拖放与 Photoshop 分类筛选](/v2/features/software-connections/command-tool)、[触发规则粘贴顺序与批量删除](/v2/features/triggers/advanced-mouse-triggers#规则列表筛选)。
- 补充[AI 助手正式版工作区选择、历史对话目录恢复和导出后打开文件夹](/v2/features/ai-and-agent)，以及[贴图穿透时从工具栏拖动与定位](/v2/features/screenshot/capture-pro#贴图窗口截图后)。网络子程序、焦点切换和贴图工具栏等其他修复见官网完整记录。

### 2.2.17 · 贴图、录屏与运行记录

- 补充[贴图鼠标穿透及独立工具条](/v2/features/screenshot/capture-pro#贴图窗口截图后)、[录屏预览焦点和播放速度](/v2/features/screenshot/capture-pro#结束方式)、[本机 FFmpeg 实时录屏](/v2/features/screenshot/capture-pro#截图-pro-设置页)。截图 Pro 步骤框选后可直接截图、复制、贴图、保存或识别；完整改动见[官网版本记录](https://getquicker.net/V2/Versions)。
- 补充[提示消息保持 1 秒](/v2/xaction/modules/notify)、[Everything 通信接口替代服务](/v2/xaction/modules/everythingsearch)、[动作日志并入运行记录窗口](/v2/features/tools#动作运行与触发记录)。
- 补充[浏览器父场景归属的管理与同步](/v2/features/scenes#作为浏览器程序与父场景归属)、[Mastercam 第三方 FT 命令筛选](/v2/features/software-connections/software/mastercam)。选择窗口会跳过鼠标穿透覆盖层；Windows 应用拖放启动参数、显示菜单子程序生命周期等修复见[官网版本记录](https://getquicker.net/V2/Versions)。

## 更多文档补充

### 2.2.16 · 悬浮分组与截图工具栏

- 补充[悬浮分组受控合并与中间拆分](/v2/features/floating-actions#移动和整理)、[搜索引擎 JSON 批量导入导出](/v2/features/tools#自定义搜索引擎的导入导出)。
- 补充[截图 Pro 自定义工具栏可视化编排](/v2/features/screenshot/capture-pro#标注)：拖动排序、添加子程序或动作、设置图标大小；并记录网络路径图标探测、表单多行高度、提示消息、录屏结束和缩略图等修复。

### 2.2.15 · 面板与贴图细节

- 补充[分组圆点颜色及上方居中](/v2/features/action-panel/usage#创建和管理分组)、[面板软隐藏以减少弹出闪烁](/v2/features/action-panel/usage#减少面板弹出闪烁)。
- 补充[截图 Pro 用反引号切换原始鼠标指针](/v2/features/screenshot/capture-pro#快捷键一览)、[HTML 贴图换行及屏幕内定位](/v2/features/screenshot/capture-pro#贴图窗口截图后)、[单个在线软件连接的目标选择](/v2/features/software-connections/command-tool#动作怎样选择目标)；并记录自由格子跨分组拖放、截图光标与提示、表单对齐等修复。

### 2.2.14 · 自由格子与表单

- 补充[自由格子触发键](/v2/features/action-panel/usage#触发键)、[用动作控制悬浮分组](/v2/features/floating-actions#用动作控制悬浮分组)、[轮盘继承动作预览](/v2/features/triggers/circle-menu#按场景覆盖与来源切换)。
- 补充[表单扩展选项及 `$=` 校验](/v2/xaction/modules/form)、[截图文件名模板 `{date:格式}`](/v2/features/screenshot/capture-pro#截图-pro-设置页)，以及面板分组导航、确认与复制按钮等交互调整。回退前请看[截图文件名模板与悬浮分组动作注意](/important-notice#2214-截图文件名模板与悬浮分组动作)。

### 2.2.13 · 长截图与自由格子

- 新增[长截图裁剪与删段](/v2/features/screenshot/capture-pro#长截图编辑)、[新面板自由格子布局](/v2/features/action-panel/usage#自由格子布局)、[多字段表单单选按钮与表达式校验](/v2/xaction/modules/form)、[逐行打开网址、文件和文件夹](/v2/xaction/modules/openurl)说明。
- 补充[动作运行状态提示](/v2/features/action-panel/usage#查找和运行动作)、[Ctrl 拖动调整全局区和上下文区高度](/v2/features/action-panel/usage#窗口尺寸)、[悬浮分组显示模式](/v2/features/floating-actions#紧凑半透明和名称显示)、[动作更新策略集中管理](/v2/features/action-sharing#安装和检查更新)、[Illustrator 2023 支持](/v2/features/software-connections/software/illustrator)。
- 多设备使用或可能回退时，请阅读[规则父场景与面板自由布局注意](/important-notice#2212-规则父场景与-2213-面板自由布局)。

### 2.2.12 · 备份、API 与截图

- 新增[动作运行数据批量本地备份](/v2/features/account-and-sync#动作运行数据的本地备份)、[HTTP API](/v2/features/http-websocket)、[规则父场景](/v2/features/scenes#规则父场景)、[悬浮动作双击](/v2/features/floating-actions#单击与双击)、[截图荧光笔及“截图+复制”](/v2/features/screenshot)说明。
- 补充场景拖放、左键辅助分组筛选、录屏工具栏排除，以及[按动作与调用链查看日志](/v2/features/tools#动作运行与触发记录)。

### 2.2.11 · 触发与运行记录

- 补充[左键辅助连续按键](/v2/features/triggers/left-button-plus#一次按住连续执行)、[触碰屏幕边框](/v2/features/triggers/advanced-mouse-triggers#触碰屏幕边框)、[云端动作回收站](/v2/features/account-and-sync#云端动作回收站)。
- 更新[变量](/v2/xaction/concepts/variables)、[运行记录](/v2/features/tools#动作运行与触发记录)、[截图 Pro](/v2/features/screenshot/capture-pro)、[AI 与外部助手](/v2/features/ai-and-agent)的操作说明；动作更新方式、只读动作外观及分享限制见[动作分享](/v2/features/action-sharing)。
- 升级前请阅读[触发设置的多设备与回退风险](/important-notice#2211-触发设置的多设备与回退风险)。

## 早期文档补充

### 2.2.10 · 面板、轮盘与编辑器

- 补充[新面板双击显隐导航与切换宽窄](/v2/what's-new/new-main-win/usage#双击导航栏)、[轮盘覆盖粘贴与跨场景剪切](/v2/what's-new/others/circle-menu#覆盖粘贴与跨场景剪切)、[动作分组跨场景复制移动及未分组批量管理](/v2/features/scenes#跨场景复制移动与未分组)。
- 补充[自定义窗口指针右上定位与鼠标偏移](/v2/xaction/modules/customwindow#窗口位置与鼠标偏移)、[FlaUI「不等待操作完成」](/v2/xaction/modules/flauiautomation#不等待操作完成)、[截图选区圆角开关](/v2/features/screenshot/capture-pro#选区阴影与边框)。
- 补充[Mastercam 2025/2026 与跨年度目录冲突](/v2/features/software-connections/software/mastercam)、[动作分享旧版兼容检查](/v2/features/action-sharing#旧版兼容检查)、[多步骤输入编辑窗口](/v2/xaction/modules/inputscript#编辑窗口)，以及扩展热键、面板隐藏、表单、贴图和轮盘等修复。

### 2.2.9 · 软件连接与场景

- 补充[软件连接总开关](/v2/features/software-connections/install-and-manage#软件连接总开关)（默认开启、仅本机）、[图片无 EXIF 日期时的回退及「拍摄时间为空」](/v2/xaction/modules/imageinfo#无-exif-日期时)、[场景列表右键菜单](/v2/features/scenes#场景与动作管理中的右键)。
- 记录仪表盘 Esc、Clover 等内嵌资源管理器的场景识别、旧面板工具菜单、模块列表 Ctrl+F，以及截图刷新和工具栏图标等修复。

### 2.2.8 · 贴图与截图修复

- 补充[混合文本捕获](/v2/features/screenshot/capture-pro#混合文本捕获)、[选区侧栏按住刷新与 F5](/v2/features/screenshot/capture-pro#选区刷新)、[剪贴板贴图的富文本、公式、纯文本及图片文件支持](/v2/features/screenshot/capture-pro#贴图窗口截图后)、[「恢复贴图」更名与连续恢复](/v2/features/screenshot/capture-pro#贴图窗口截图后)。
- 补充跨屏工具栏定位、马赛克结果清理、[文本工具条从圆点展开不再误隐藏](/v2/features/triggers/text-selection-toolbar#悬浮圆点与选区定位)、[表达式数组、可空值及枚举匹配](/v2/xaction/concepts/expression#表达式的运算结果)、[表单小数加减尾数](/v2/xaction/modules/form)、[子程序内的软件连接目标窗口](/v2/what's-new/xaction-steps/subprogram)等修复。

### 2.2.7 · 截图外观与回退

- 补充[截图 Pro 选区阴影、边框及记忆规则](/v2/features/screenshot/capture-pro#选区阴影与边框)、[OCR 结果窗文本工具](/v2/features/screenshot/capture-pro#结果窗)、[截图侧栏恢复已关闭贴图](/v2/features/screenshot/capture-pro#贴图窗口截图后)。
- 补充[Photoshop 手动路径与 Adobe 依赖检测](/v2/features/software-connections/software/photoshop)、设置窗滚轮切换分组、[表达式显式 `dynamic`](/v2/xaction/concepts/expression#表达式的运算结果)、[表单打开前提示缺失变量](/v2/xaction/modules/form)。
- 回退到 2.2.6 会丢失阴影与边框配置；可先备份 `image-drawing-tool-state.json`，详见[回退注意](/important-notice)。

### 2.2.6 · 悬浮动作与分组

- 补充[悬浮动作与分组](/v2/features/floating-actions)：整组缩放、窗口跟随、自动折叠和布局备份。功能默认关闭，启用后需要重启。
- 补充[截图选区悬停识别二维码](/v2/features/screenshot/capture-pro#选区二维码)、[Mastercam 软件连接](/v2/features/software-connections/software/mastercam)、动作编辑器优先显示收藏夹，以及[作者重装恢复原标识、复制切断分享关系](/v2/features/action-sharing#安装标识与副本)。

### 2.2.5 · 连接管理与贴图

- 补充[软件连接与 Bridge 在设置页安装和管理](/v2/features/software-connections)、[模兔云软件连接](/v2/features/software-connections/software/motuyun)。
- 补充[截图 Pro 二维码识别、贴图分组和保存模板](/v2/features/screenshot/capture-pro)、[AI 助手本机用量与工作区](/v2/features/ai-and-agent)，以及文件列表获取超时处理。
- 百度图片翻译 V2.0 使用 [APP ID 与 API Key 双凭证](/v2/features/screenshot/image-translate)；可能回退时请看[2.2.4 回退风险](/important-notice)。

### 2.2.4 · 软件连接与 OCR 结果窗

- 补充[软件连接与 Bridge](/v2/features/software-connections) 入口、[OCR 结果窗表格识别、Excel 打开和原图复制](/v2/features/screenshot/capture-pro#结果窗)、[「用 AI 写」重复点击及未配置模型处理](/v2/features/ai-and-agent)。
- 百度图片翻译 V2.0 在此版本短暂简化为只需 API Key；后续版本的凭证要求见[图片翻译说明](/v2/features/screenshot/image-translate)。

### 2.2.2–2.2.3 · 分享安装与截图提示

- 补充[动作分享安装、公共子程序嵌入及预览版本号](/v2/features/action-sharing)、[百度图片翻译 V2.0 凭证与 API Key](/v2/features/screenshot/image-translate)。
- 补充[本地表格 OCR 固定使用 small 模型](/v2/what's-new/xaction-steps/basic-ocr)、[截图快捷键提示布局及遮挡处理](/v2/features/screenshot/capture-pro#快捷键一览)。

### 2.2.1 · 分享、录屏与等待步骤

- 补充[动作分享的 V1 / V2 制品兼容说明](/v2/what's-new/actions#动作与公共子程序分享)、[可视化录屏预选范围](/v2/xaction/modules/screen-recording-ui)、[选中文本工具条悬浮圆点与选区定位](/v2/features/triggers/text-selection-toolbar)。
- 补充[截图 Pro 设置页](/v2/features/screenshot/capture-pro#截图-pro-设置页)、[图片翻译 V2.0 单独凭证](/v2/features/screenshot/image-translate)；新增[等待窗口](/v2/xaction/modules/waitwindow)步骤，并将等待类步骤集中到等待分组。

### 2.1.29–2.2.0 · 主窗口、贴图与步骤编辑

- 补充新版主窗口侧边栏快捷按钮、暂存区「新建动作 / 用 AI 写」和「保留到场景」、贴图通用与人像抠图。
- 补充自动化脚本面向窗口或区域的 OCR、找图、找色与相对点击，窗口贴边自动隐藏、类似窗口关闭与切换，以及步骤编辑器拉伸或贴靠至完整屏幕高度。

本站只补充操作中会遇到的差异。软件各版本的完整改动和校验值始终以[官网版本记录](https://getquicker.net/v2/versions)为准。
