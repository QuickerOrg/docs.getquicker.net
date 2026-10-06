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

多设备使用、降级或回退前，请阅读[升级与回退](/v2/migration/upgrade-and-rollback)。各版本的具体风险也在下方对应条目中标出。

官网版本记录目前写到 2.3.1，完整条目以那里为准。

## 近期文档补充

### 开发中 · 窗口助手、键盘黑名单与布局改进

:::note[未发布功能预览 · 2026-10-06]
本节依据开发分支整理，**尚未包含在当前已发布的 2.3.1 中**；实际开放时间和版本以官网版本记录为准。
:::

- [窗口助手](/v2/features/ai-and-agent#开发版窗口助手)：设置 / 场景助手开放附件与截图；设计器、脚本、设置 / 场景助手可继续历史会话、改名、归档或删除。载入历史不会回退当前动作和设置。
- [服务商与模型分配](/v2/what's-new/ai-services-and-models#开发版服务商与模型分配)：重整设置入口，管理模型能力、探测或手动确认，并调整各任务场景的候选顺序。
- [键盘触发黑名单](/v2/features/triggers#开发版键盘触发黑名单)：动作快捷键、按键双击、热键联动可分别选择遵循全局黑名单和全屏禁用，新增开关默认关闭。
- [悬浮分组](/v2/features/floating-actions#开发版分组与布局恢复)：默认启用分组；异常旧布局可从空布局继续，首次保存前备份原文件。
- [外部文件拖放](/v2/features/action-panel/usage#开发版外部文件拖放)：改善跨权限拖放创建动作；流式布局支持多文件，自由格子仅接收空格中的单文件。
- [多圈轮盘](/v2/features/triggers/circle-menu#开发版轮盘基准尺寸)：按两圈基准说明尺寸，更多圈自动缩放，同次弹出切换来源保持统一尺度。
- [设置多词搜索](/v2/features/tools#开发版按路径组合搜索词)：用分类路径和选项标题组合定位，例如「黑名单 快捷键」。

### 2.3.1 · AI 助手附件、按账号存放与暂存文件

- [AI 本机数据按账号存放](/v2/features/account-and-sync#ai-本机数据按账号存放)：AI 配置、会话、动作日志和运行历史改为按账号存放；升级后首个启动的账号接收旧数据副本。多账号用户请先看[升级与回退](/v2/migration/upgrade-and-rollback#231-ai-数据按账号存放与密钥同步)，确认要保留旧数据的账号和回退影响。
- [在设备间同步 API 密钥](/v2/what's-new/ai-services-and-models#在设备间同步-api-密钥)：可选同步 API 密钥和自定义请求头，默认关闭；开启后会上传到 Quicker 服务器。建议所有设备升级后再启用。
- [组合动作与脚本动作的 AI 助手](/v2/features/ai-and-agent#模型附件与提问)：按对话选择模型和推理强度，添加或粘贴附件、截图与选择窗口，逐题回答助手提问；[脚本助手](/v2/script-action/assistant#先确认需求再修改)新建脚本或新增行为前先确认需求。开启完全控制时可[直接写回原动作](/v2/features/ai-and-agent#动作保存与对话入口)，新对话可一键引用最近修改的动作。
- [本机动作暂存区](/v2/features/action-panel/action-drafts#从文件导入与导出)支持从文件导入、导出动作，以及[手动备份和版本说明](/v2/features/action-panel/action-drafts#手动备份和版本说明)；点击 **＋** 先选择创建组合动作或脚本动作。
- [自定义操作窗](/v2/xaction/modules/custompanel#运行时编辑操作窗定义)新增「编辑操作窗定义」「按定义显示操作窗」，可在动作运行时打开设计器并按返回的定义显示窗口。
- [检查路径/获取文件信息](/v2/xaction/modules/checkpathexists#区分路径不存在与查询失败)可选择查询失败后继续，需先检查是否成功和是否存在。
- 截图与贴图：[截图内选字与全文编辑](/v2/features/screenshot/capture-pro#截图内选字与全文编辑)、[序号旁的文字说明](/v2/features/screenshot/capture-pro#序号旁的文字说明)、改版的[图片与录屏历史管理](/v2/features/screenshot/capture-pro#图片与录屏历史管理)，以及[窗口贴图缩放](/v2/features/screenshot/capture-pro#窗口贴图缩放)。
- [设置搜索](/v2/features/tools#搜索并定位设置)按页面组织结果并定位到选项；[窗口检查器](/v2/features/tools#查看控件树与取消选择)支持展开全部、展开分支和刷新节点，控件选择器可按 `Esc` 取消。
- [轮盘设置页](/v2/features/triggers/circle-menu#在设置中选择和编辑位置)单击只选中位置，双击或 `F2` 再编辑；[文本指令](/v2/features/triggers/text-commands#多条指令同时匹配)恢复较长指令优先匹配；[选择操作类型](/v2/features/triggers#选择操作类型)恢复为多级菜单。
- [完整分享窗口](/v2/features/action-sharing#如何选择发布格式)新分享和更新时默认勾选兼容发布格式。WebDAV 目录查询与 301 跳转、长步骤编辑窗顶部出屏、Everything 修改时间排序等修复见[官网版本记录](https://getquicker.net/V2/Versions)。

### 2.3.0 · 脚本动作与截图/设置 AI

- 新增 [脚本动作](/v2/features/script-actions/)：用 C# 语法编写动作，通过内置 API 处理文本、文件、网络、窗口和键鼠，并可调用其他动作与公共子程序。编辑器支持 AI 辅助、代码检查、断点与单步调试、运行轨迹和变量变化查看；可最小化后延迟运行。安全与授权见 [脚本动作安全与授权](/v2/features/script-actions/security)；回退注意见[升级与回退](/v2/migration/upgrade-and-rollback#230-脚本动作)。
- [设置与场景窗口中的 AI 助手](/v2/features/ai-and-agent#设置与场景窗口中的-ai-助手)：可用自然语言协助调整设置和触发规则。
- [内嵌子程序](/v2/xaction/concepts/subprogram#检查内嵌子程序的来源更新)支持从来源检查和应用更新，并可撤销、重做更新。
- [长截图自动滚动](/v2/features/screenshot/capture-pro#长截图自动滚动)与速度调整；选区外增加采集状态提示。
- [二维码与条形码](/v2/features/screenshot/capture-pro#二维码与条形码)识别扩展为多种常见码制；自动预览优先快速显示，手动识别执行完整扫描。
- 选择操作类型时支持搜索和分类筛选（完整说明见[官网版本记录](https://getquicker.net/V2/Versions)）。

### 2.2.26 · 动作编辑 AI 分析、上下文菜单与入口整合

- [动作编辑窗口 AI](/v2/features/ai-and-agent#用-ai-编写和修改动作)支持「运行并分析」：可查看最近运行结果、定位失败步骤并分析运行问题。
- [上下文菜单](/v2/features/tools#上下文菜单)可按文本、图片、文件分别调整内置功能显隐；「管理关联动作」支持自动显示或手动挑选并调整顺序。
- [轮盘菜单](/v2/features/triggers/circle-menu#按-f2-编辑指向的动作)显示时可按 `F2` 编辑鼠标指向的动作（默认开启，可在轮盘设置中关闭）；已有 F2 子动作及 F2 重复触发设置优先。回退注意见[升级与回退](/v2/migration/upgrade-and-rollback#2226-轮盘-f2-编辑指向的动作)。
- 「动作管理」整合到 **设置 → 动作 → 全部动作**，「公共子程序管理」整合到 **设置 → 动作 → 公共子程序**；独立公共子程序窗口已移除。原「场景与动作」管理窗口更名为 **场景、动作与触发**。按键双击管理入口移至 **设置 → 功能快捷键**，原有数据沿用。入口说明见[动作面板](/v2/features/action-panel/usage#侧边栏快捷按钮)、[按键双击](/v2/features/triggers/key-double-click)。
- [AI 对话](/v2/features/ai-and-agent#对话界面)合并展示同轮程序变更，支持撤销已记录完整快照的整轮修改，并保留新对话与输入草稿；粘贴附件与图片文字识别改为按需处理。
- 录屏鼠标点击提示改为中空圆环；旧 C# 脚本 `Marshal.GetActiveObject` 编译失败等修复见[官网版本记录](https://getquicker.net/V2/Versions)。

### 2.2.25 · 设置改版、设计器 AI 与截图增强

- [设置窗口](/v2/migration/upgrade-and-rollback#2225-设置窗口改版与本机界面状态)改为树形导航，支持搜索并定位具体设置项；选项修改通常立即生效，不再提供整页「应用／撤销」。找不到原位置时可用搜索；无效或尚未提交的输入会在离页时提示。
- [动作编辑窗口](/v2/features/ai-and-agent#在设计器内修改)在配置好 AI 参数后，可点右上角 AI 按钮或按 `Ctrl+J` 打开面板，用 AI 编写和修改当前动作。
- [动作面板](/v2/features/action-panel/usage#移动或复制动作)拖动动作时，悬停在场景标签上即可切换场景，便于跨场景整理。
- [截图 Pro](/v2/features/screenshot/capture-pro#预选截图区域与快捷出口)所有操作均可使用预选截图区域；「框选即出图」和快速保存可同时选择复制到剪贴板、截图后贴图。
- [HTML 贴图](/v2/features/screenshot/capture-pro#贴图窗口截图后)加强自动识别、剪贴板等来源的隔离，阻止其中的页面脚本；动作作者明确选择 HTML 模式时仍保留脚本能力。
- 分享更新列表找不到仅限 V2 的子程序（#553）、事件触发最低版本提示反复弹出（#552）等修复见[官网版本记录](https://getquicker.net/V2/Versions)。

### 2.2.24 · Quicker操作、自定义操作窗设计与 AI 对话

- [Quicker操作](/v2/xaction/modules/quickeroperations#获取最后打开编辑器的动作)新增「获取最后打开编辑器的动作」，可取得本次启动期间最近打开或重新激活编辑器的已安装动作 ID，便于接续编辑。使用该类型的动作需要 **2.2.24 或更高版本**，详见[升级注意](/v2/migration/upgrade-and-rollback#2224-获取最后打开编辑器的动作)。
- [自定义操作窗](/v2/xaction/modules/custompanel#可视化设计窗)可从步骤编辑窗口的「设计」按钮打开可视化设计窗，编辑按钮、分组和布局并实时预览；操作项定义使用变量或表达式时不可用。操作项编辑窗口按操作类型显示相关字段，路径可选文件，多行脚本更便于编辑。
- [AI 对话](/v2/features/ai-and-agent#对话界面)支持选中文字后「添加到对话」作为引用；模型菜单可切换上下文窗口大小；侧栏可收起、展开并记住状态。
- 截图编号标注字体更清晰；修复轮盘菜单子动作扩展圈触发距离与命中优先级，以及长截图结束编辑、关闭贴图后残留窗口或占用内存的问题。完整改动见[官网版本记录](https://getquicker.net/V2/Versions)。

### 2.2.23 · 浏览器通用分享、侧边栏与贴图标题

- 分享动作可选[「浏览器通用」适用软件](/v2/features/action-sharing#适用软件与浏览器通用)，可在 Chrome、Edge、Firefox 等支持的浏览器动作页中找到同一动作；从浏览器通用场景分享时默认选此分类。更新已有分享时若原适用软件为非法值需重选，详见[升级注意](/v2/migration/upgrade-and-rollback#2223-分享适用软件与浏览器通用)。
- [主面板侧边栏快捷按钮](/v2/features/action-panel/usage#侧边栏快捷按钮)按可用高度显示更多，放不下的收进「更多」。
- [贴图窗口](/v2/features/screenshot/capture-pro#贴图窗口截图后)标题不再随内容变化；图片标题改在窗口内（图片下方）显示。
- 步骤选中轮廓更清晰且保留底色；锁屏时悬浮分组不显示；托盘程序激活误报等多窗口的修复。完整改动见[官网版本记录](https://getquicker.net/V2/Versions)。

### 2.2.22 · 列表编辑、提示消息与长截图

- [管理和排序列表](/v2/xaction/modules/managelist#用子程序自定义添加和编辑)支持通过子程序自定义添加、编辑列表项，可用多字段表单处理复杂内容。使用该能力的动作需要 **2.2.22 或更高版本**，详见[升级注意](/v2/migration/upgrade-and-rollback#2222-列表项自定义子程序与提示消息默认设置)。
- [提示消息](/v2/xaction/modules/notify#默认位置与停留时间)可在「设置 → 模块功能选项」配置默认显示位置和停留时间，并随账号同步；步骤里单独指定的位置或时长仍优先。
- [表单多选列表](/v2/xaction/modules/form#多选列表已选标签图标)的已选标签会显示选项图标。
- [长截图](/v2/features/screenshot/capture-pro#长截图编辑)支持「重来」；截图、贴图和录屏标注中 `Ctrl+Shift+Z` 改为重做，「清空全部标注」改用 `Shift+Delete`，详见[快捷键说明](/v2/features/screenshot/capture-pro#快捷键一览)。
- 主面板「最新动作」会包含在编辑器中打开查看过的动作；更多对话框可用 `Esc` 取消。完整改动见[官网版本记录](https://getquicker.net/V2/Versions)。
- 补充[列表自定义编辑的变量类型和表单示例](/v2/xaction/modules/managelist#用子程序自定义添加和编辑)、[键鼠脚本提示选项](/v2/xaction/modules/automationscript#提示选项)，以及[Agent 对话文件导入导出和步骤加入对话](/v2/features/ai-and-agent)。

### 2.2.21 · 代码补全与动作面板

- [代码补全服务](/v2/xaction/concepts/xaction-editor#代码补全服务)默认在线提供，也可在「设置 → 动作设计」安装本地组件。在线补全会向服务器发送编辑中的代码等信息，详见[升级注意](/v2/migration/upgrade-and-rollback#2221-代码补全服务)。
- [文本窗口](/v2/xaction/modules/showtext#记住上次位置和大小)可记住上次的位置和大小。
- [动作面板](/v2/features/action-panel/usage#复制后同时添加与删除关联)补充了复制后「同时添加到这里」及删除时查看场景关联位置的说明。

### 2.2.20 · 显示器、录屏与 AI

- 新增[显示器与虚拟桌面步骤](/v2/features/displays-and-desktops)及其参数说明。包含这些步骤的动作需要 **2.2.20 或更高版本**客户端，详见[升级注意](/v2/migration/upgrade-and-rollback#2220-显示器与虚拟桌面步骤)。
- 补充[子程序输入参数的代码语言与高级分组](/v2/xaction/modules/subprogram#输入参数)，以及[屏幕录制](/v2/xaction/modules/screen-recording-ui#参数说明)和[后台屏幕录制](/v2/xaction/modules/screen-recording#参数说明)的 FFmpeg 编码参数。
- 补充[AI 对话导入导出与侧边设计器](/v2/features/ai-and-agent)，以及[贴图窗口按 `Y` 切换阴影、右键菜单调整](/v2/features/screenshot/capture-pro#移动模式)。

### 2.2.18 · 远程文件与工作区

- 补充[远程文件（WebDAV）步骤及本机账号限制](/v2/xaction)、[远程文件账号入口和 HTTP / WebSocket 设置迁移](/v2/features/software-connections)。跨设备或可能回退时，请先看[远程文件账号与 AI 助手工作区注意](/v2/migration/upgrade-and-rollback#2218-远程文件账号与-ai-助手工作区)。
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
- 更新[变量](/v2/xaction/concepts/variables)、[运行记录](/v2/features/tools#动作运行与触发记录)、[截图 Pro](/v2/features/screenshot/capture-pro)、[AI 与外部助手](/v2/features/ai-and-agent)的操作说明；动作更新方式、只读动作外观及分享限制见[动作分享](/v2/features/action-sharing)。
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

- 补充[混合文本捕获](/v2/features/screenshot/capture-pro#混合文本捕获)、[选区侧栏按住刷新与 F5](/v2/features/screenshot/capture-pro#选区刷新)、[剪贴板贴图的富文本、公式、纯文本及图片文件支持](/v2/features/screenshot/capture-pro#贴图窗口截图后)、[「恢复贴图」更名与连续恢复](/v2/features/screenshot/capture-pro#贴图窗口截图后)。
- 补充跨屏工具栏定位、马赛克结果清理、[文本工具条从圆点展开不再误隐藏](/v2/features/triggers/text-selection-toolbar#悬浮圆点与选区定位)、[表达式数组、可空值及枚举匹配](/v2/xaction/concepts/expression#表达式的运算结果)、[表单小数加减尾数](/v2/xaction/modules/form)、[子程序内的软件连接目标窗口](/v2/what's-new/xaction-steps/subprogram)等修复。

### 2.2.7 · 截图外观与回退

- 补充[截图 Pro 选区阴影、边框及记忆规则](/v2/features/screenshot/capture-pro#选区阴影与边框)、[OCR 结果窗文本工具](/v2/features/screenshot/capture-pro#结果窗)、[截图侧栏恢复已关闭贴图](/v2/features/screenshot/capture-pro#贴图窗口截图后)。
- 补充[Photoshop 手动路径与 Adobe 依赖检测](/v2/features/software-connections/software/photoshop)、设置窗滚轮切换分组、[表达式显式 `dynamic`](/v2/xaction/concepts/expression#表达式的运算结果)、[表单打开前提示缺失变量](/v2/xaction/modules/form)。
- 回退到 2.2.6 会丢失阴影与边框配置；可先备份 `image-drawing-tool-state.json`，详见[回退注意](/v2/migration/upgrade-and-rollback#回退到-226-后保存截图设置会丢弃-227-的阴影与边框配置2026-09-07)。

### 2.2.6 · 悬浮动作与分组

- 补充[悬浮动作与分组](/v2/features/floating-actions)：整组缩放、窗口跟随、自动折叠和布局备份。功能默认关闭，启用后需要重启。
- 补充[截图选区悬停识别二维码](/v2/features/screenshot/capture-pro#二维码与条形码)、[Mastercam 软件连接](/v2/features/software-connections/software/mastercam)、动作编辑器优先显示收藏夹，以及[作者重装恢复原标识、复制切断分享关系](/v2/features/action-sharing#安装标识与副本)。

### 2.2.5 · 连接管理与贴图

- 补充[软件连接与 Bridge 在设置页安装和管理](/v2/features/software-connections)、[模兔云软件连接](/v2/features/software-connections/software/motuyun)。
- 补充[截图 Pro 二维码识别、贴图分组和保存模板](/v2/features/screenshot/capture-pro)、[AI 助手本机用量与工作区](/v2/features/ai-and-agent)，以及文件列表获取超时处理。
- 百度图片翻译 V2.0 使用 [APP ID 与 API Key 双凭证](/v2/features/screenshot/image-translate)；可能回退时请先查看该功能的凭证说明，并核对[官网版本记录](https://getquicker.net/v2/versions)中对应版本的注意项。

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
