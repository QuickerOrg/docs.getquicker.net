---
title: 更新记录
description: 查看 Quicker V2 完整版本记录、下载入口，以及本站按版本补充的使用说明。
sidebar_position: 1
quickerDocKey: v2/release-notes
comments: true
---

# 更新记录

<HashRedirect
  fromPath="/release-notes"
  routes={[
    {
      to: '/release-notes/archive-2-1-2-2',
      hashes: [
        '更多文档补充',
        '2216--悬浮分组与截图工具栏',
        '2215--面板与贴图细节',
        '2214--自由格子与表单',
        '2213--长截图与自由格子',
        '2212--备份api-与截图',
        '2211--触发与运行记录',
        '早期文档补充',
        '2210--面板轮盘与编辑器',
        '229--软件连接与场景',
        '228--贴图与截图修复',
        '227--截图外观与回退',
        '226--悬浮动作与分组',
        '225--连接管理与贴图',
        '224--软件连接与-ocr-结果窗',
        '222223--分享安装与截图提示',
        '221--分享录屏与等待步骤',
        '2129220--主窗口贴图与步骤编辑',
      ],
    },
  ]}
/>

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

:::caution[2.3.36 · 表格联网与录屏按键提示]
表格识别改为本地识字＋在线表格处理，会上传原图和识字结果，需要有效会员及事先同意，首版仅支持 x64。录屏实时按键提示不再自动检测密码框；录制敏感输入前请暂停录屏或关闭按键提示。规则同步、会话整理与回退影响见[2.3.36 升级与回退](/v2/migration/upgrade-and-rollback#text-and-table-2336)。
:::

:::caution[后台屏幕录制的默认范围已变化]
升级到 **2.1.23 或更高版本**时，后台屏幕录制步骤的默认录制范围改为“主屏幕”。已明确保存录制范围的动作不受影响；其他旧动作请打开并确认录制范围，避免录到不符合预期的屏幕区域。
:::

多设备使用、降级或回退前，请阅读[升级与回退](/v2/migration/upgrade-and-rollback)。各版本的具体风险也在下方对应条目中标出。

本站已补充到 **2.3.45**；版本下载与完整修复记录以官网为准。

## 近期文档补充

### 2.3.45 · 问问AI步骤、图片对话与路径导航

- [问问AI](/v2/xaction/modules/askai)说明从组合动作交付问题与材料、默认手动发送、自动发送费用及成功结果的含义；[AI 助手](/v2/features/ai-and-agent#ask-ai-2345)同步每轮 20 个内容附件的限制。
- [AI 交互对话](/v2/xaction/modules/ai-chat#images-2345)补充图片发送、历史图片恢复、模型切换及回复引用；[脚本 AI API](/v2/script-action/api/ai#aiopenassistant)同步打开助手的调用入口。
- [文件对话框路径](/v2/script-action/api/uia#uiasetdialogpath)说明本地目录直接导航及默认不提交文件的边界；[动作日志](/v2/features/tools#action-log-search-2345)补充动作搜索和同名来源区分；[截图](/v2/features/screenshot/capture-pro#悬停与滚轮)补充吸附动画及设置分组选择。
- **升级与回退**：[2.3.45 注意事项](/v2/migration/upgrade-and-rollback#ai-images-2345)说明旧版续聊可能缺少历史图片上下文，以及新步骤的最低版本要求。

### 2.3.44 · 整场景移动与树形场景选择

- [整场景移动](/v2/features/action-panel/usage#move-scene-2344)说明从 **面板动作** 右键菜单，将全部分组和动作入口移到父场景或其它场景；补充分组属性、空分组、同步范围和部分失败后的处理。
- [动作面板常见问题](/v2/features/action-panel/faq)补充浏览器父场景的选择方法，并校正跨场景同名分组的处理说明；[保留暂存动作](/v2/features/action-panel/action-drafts#保留为正式动作)同步树形目标选择入口。
- [搜索排障](/v2/features/search#排障)补充自定义程序目录深度无效时，仅跳过该条目录的行为。

### 2.3.42 · 截图速度与设置直达动作

- [截图速度](/v2/features/screenshot/capture-pro#capture-speed-2342)说明默认开启的速度优化、本机资源占用与关闭方式，并补充远程标注卡顿和文字框切换、撤销行为的改进。
- [设置直达动作](/v2/features/settings#navigation-actions-2342)说明从帮助按钮复制设置页动作，以及携带场景复制或拖入轮盘的操作。
- [动作面板](/v2/features/action-panel/usage)补充旧面板按钮逐个收起、浏览器父场景排序和同步转圈修复；[会话历史](/v2/features/ai/prompt-library-and-sessions#conversation-history-2340)补充旧设置会话的删除修复；[动作分享](/v2/features/action-sharing)补充更新说明编辑器入口和字数限制。
- **升级与回退**：[2.3.42 注意事项](/v2/migration/upgrade-and-rollback#capture-speed-2342)说明旧版保存本机配置可能清除截图速度的关闭偏好，以及重新设置与备份方式。

### 2.3.41 · 选字固定动作、标注样式与设置导航

- [屏幕选字](/v2/features/screenshot/screen-text-selection#pinned-actions-2341)补充最多 3 个固定动作的添加、排序、删除与文本交付，并说明跨屏 Ctrl+C、内置文本菜单和两行选字排版。
- [截图与贴图](/v2/features/screenshot/capture-pro#arrow-and-polyline-2341)补充箭头圆角、折线起止样式及交换两端；说明 OCR 历史列表随打开入口展开或收起。
- [设置导航](/v2/features/settings#navigation-2341)补充分类标题切换与直达链接；[左键辅助](/v2/features/triggers/left-button-plus#hold-time-2341)区分辅助键长按触发时间与左键保持时间。
- [面板入口](/v2/features/action-panel/usage#scene-button-2338)补充旧面板窄宽度下的菜单收纳；[AI 助手](/v2/features/ai/prompt-library-and-sessions#workspace-recovery-2341)补充工作目录与路径恢复修复。
- **升级与回退**：[2.3.41 注意事项](/v2/migration/upgrade-and-rollback#screen-text-and-settings-2341)说明旧版保存和同步对新增长按时间、本机标注样式及导航偏好的影响，并明确固定动作在 2.3.40 的保留边界。

### 2.3.40 · 提示词库、会话管理与截图文字编辑

- [AI 提示词库](/v2/features/ai/prompt-library-and-sessions#prompt-library-2340)补充按场景管理、快捷命令、账号同步及冲突处理；[会话历史](/v2/features/ai/prompt-library-and-sessions#conversation-history-2340)说明集中预览、归档、恢复和永久删除的范围。
- [截图与贴图](/v2/features/screenshot/capture-pro)补充自定义快捷键、录屏 `Alt+F10`、文字局部格式与对齐、OCR 智能排版和 Agent 版本要求；[基础 OCR](/v2/xaction/modules/basic-ocr#输出)说明新的“智能合并结果”输出。
- [设置导航](/v2/features/settings)、[隐藏分组标题](/v2/features/action-panel/usage#hide-group-titles-2340)、[动作快捷键](/v2/features/triggers/action-hotkeys)和[屏幕选字](/v2/features/screenshot/screen-text-selection)同步到本版入口与操作方式；[表格行编辑](/v2/xaction/concepts/tablevar#管理表格数据)补充多行文本与编辑器回填。
- **升级与回退**：[2.3.40 注意事项](/v2/migration/upgrade-and-rollback#prompts-and-ocr-2340)说明旧提示词不自动导入、旧版重存文字样式和 OCR 快照的影响，以及普通键选字规则的版本要求。

### 2.3.39 · 选字自动复制、设置导航与面板菜单

- [屏幕选字](/v2/features/screenshot/screen-text-selection#自定义引导键和触发规则)补充“显示工具栏并复制文字”、与内置预设的关系、识别等待和连续正文漏选修复；[截图与贴图](/v2/features/screenshot/capture-pro)补充圆尾内凹实心箭头和贴图工具条表格识别入口。
- [设置导航](/v2/features/settings)说明固定分组栏与页面列表；[面板菜单](/v2/features/action-panel/usage#工具菜单)修正取消“工具”中转层后的入口，说明全局触发规则与侧栏入口。
- [调试记录](/v2/xaction/concepts/debug)补充分支递归展开、折叠及过滤限制；[远程文件](/v2/features/remote-files#webdav)补充 WebDAV 签名直链下载；[AI 模型](/v2/what's-new/ai-services-and-models)补充 Gemini 工具调用后的 HTTP 400 修复。
- [脚本窗口 API](/v2/script-action/api/window)和[JavaScript 自动化](/v2/xaction/modules/automationscript#权限用户接管和输入安全)修正目标提权窗口的旧限制，明确实际操作仍受 Windows 权限约束。
- **升级与回退**：[2.3.39 注意事项](/v2/migration/upgrade-and-rollback#text-and-arrow-2339)说明新选字后处理的最低版本，以及回退保存箭头偏好后的恢复方式。

### 2.3.38 · 文本指令黑名单、最近动作与面板入口

- [文本指令](/v2/features/triggers/text-commands#global-blacklist-2338)补充统一黑名单、全屏禁用、默认关闭和自身白名单优先；[Win 拖动规则](/v2/features/triggers/advanced-mouse-triggers#drag-priority-2338)修正辅助功能预设与自定义规则的优先级，并同步选字、框选截图指南。
- [Quicker操作](/v2/xaction/modules/quickeroperations#recent-actions-2338)新增获取最近动作列表的使用方式和版本要求；[输入法状态](/v2/xaction/modules/imecontrol#限制与排障)说明未知状态、恢复基线和切换未确认提示；[调试报告](/v2/xaction/concepts/debug)补充 JSON 显示与报告标题。
- [面板顶栏入口](/v2/features/action-panel/usage#scene-button-2338)说明单击打开全局、Ctrl＋单击打开当前程序动作页；[触发与引用](/v2/features/actions#trigger-and-reference-2336)补充位置和运行参数，说明动作侧窗口选择入口。
- [AI 助手](/v2/features/ai/prompt-library-and-sessions#整理会话与保留输入)补充删除会话受阻时的处理方式，并说明输入框换行修复；截图指南补充 Alt 热键启动修复。
- **升级与回退**：[2.3.38 注意事项](/v2/migration/upgrade-and-rollback#triggers-and-recent-actions-2338)说明旧设备保存开关、拖动规则优先级和新增动作操作的兼容限制。

### 2.3.37 · 框选贴图、选字关联动作与规则分类

- [Win＋Alt 框选截图并贴图](/v2/features/screenshot/capture-pro#win-alt-capture-2337)补充开关、默认关闭、编辑工具条和规则冲突说明；[高级鼠标触发](/v2/features/triggers/advanced-mouse-triggers)补充截图后展开工具条及按类型管理规则。
- [屏幕选字](/v2/features/screenshot/screen-text-selection#text-actions-2337)补充问问 AI、文本关联动作菜单、关联条件和下载识别组件时的行为；[截图标注](/v2/features/screenshot/capture-pro)补充铅笔平滑、智能马赛克遮盖与关闭贴图按钮。
- [触发与引用](/v2/features/actions#trigger-and-reference-2336)、[动作快捷键](/v2/features/triggers/action-hotkeys#从动作入口编辑已有规则)及[扩展热键](/v2/features/triggers/powerkeys#按引导键查看场景规则)补充类型筛选、动作参数、删除规则与更换引导键。
- [助手字号](/v2/features/ai/prompt-library-and-sessions#assistant-font-2337)补充输入框同步缩放、本机分别记忆输入与内容字号；[React 界面](/v2/xaction/modules/reactui#window-controls-2337)补充窗口按钮、拉伸与首次聚焦，模块参数及脚本 API 按同一发布快照重新导出。
- **升级与回退**：[2.3.37 注意事项](/v2/migration/upgrade-and-rollback#capture-and-font-2337)说明旧设备保存设置对新开关和本机字号的影响，以及新增截图后处理的版本要求。

### 2.3.36 · 屏幕拖选文字、在线表格与会话整理

- 新增[屏幕拖选文字](/v2/features/screenshot/screen-text-selection)指南，介绍 Win＋左键预设、引导键配置、复制／编辑／翻译、结果工具条和冲突排查；[高级鼠标触发](/v2/features/triggers/advanced-mouse-triggers#text-and-capture-2336)补充附加修饰键与快速截图后处理。
- [在线表格识别](/v2/features/screenshot/ocr#hybrid-table-2336)说明本地识字与上传处理的区别、会员和 x64 限制、模式选择、长表恢复及手动列宽；同步修正[基础 OCR](/v2/xaction/modules/basic-ocr#hybrid-table-step-2336)及脚本接口中的旧离线说明。
- [OCR 结果窗口](/v2/features/screenshot/ocr#ocr-window-and-translation-2336)补充默认关闭的窗口复用及人工译文保护；[截图吸附](/v2/features/screenshot/capture-pro#capture-snap-2336)补充自动吸附开关与整窗轮廓；[录屏提示](/v2/features/screenshot/recording-and-pin#recording-key-privacy-2336)明确敏感输入保护方式。
- [触发与引用](/v2/features/actions#trigger-and-reference-2336)说明集中管理、快捷编辑和来源定位；[规则动作列表](/v2/features/scenes#rule-action-list-2336)介绍轮盘、手势配置中的候选筛选；[USB 事件](/v2/features/triggers#usb-events-2336)说明连接周期、过滤及设备标识边界。
- [AI 会话引用与整理](/v2/features/ai/prompt-library-and-sessions#conversation-reference-2336)补充 `@` 引用、彩色标签、关联动作筛选、草稿恢复及整表复制；修正旧文中“草稿不保留任何引用”的描述。
- [显示菜单](/v2/xaction/modules/showmenu#toolbar-2336)补充横向工具条与脚本接口；[搜索计算器](/v2/features/search#calculator-power-2336)补充 `^^` 乘方；[Mastercam](/v2/features/software-connections/software/mastercam)补充按年度查看在线实例。
- 组合动作参数和脚本 API 按同一发布快照重新导出，补齐早期参考数据遗漏；同时修正已存在参数却仍写“尚未同步”的旧说明。已有 [CPU 渲染切换](/v2/what's-new/platform-and-compatibility#界面或远程桌面显示异常)说明继续适用。
- **升级与回退**：[2.3.36 注意事项](/v2/migration/upgrade-and-rollback#text-and-table-2336)说明联网迁移、旧设备保存和同步新规则的风险，以及会话整理和草稿引用的本机备份要求。

### 2.3.34 · 录前智能缩放、标题排序与冲突确认

- [录屏说明](/v2/features/screenshot/recording-and-pin#recording-auto-zoom-2334)补充录前智能缩放的条件、后期按键提示、取消后的草稿恢复，以及更新历史成品与另存原片的区别。
- [面板排序](/v2/features/action-panel/usage#调整动作顺序)补充“按标题排序”；[全屏禁用](/v2/features/triggers#程序黑名单与全屏禁用)补充仅限主显示器的选项与多屏判断范围。
- [AI 动作冲突处理](/v2/features/action-panel/action-drafts#234--外部助手恢复编辑副本)说明打开时备份刷新、保存覆盖前的明确确认，以及完全控制和无确认通道的边界。
- [升级与回退](/v2/migration/upgrade-and-rollback#recording-and-fullscreen-2334)说明旧版保存录屏方案、旧设备同步全屏限制偏好的影响。跨设备同步通知、悬浮按钮置顶和匿名对象跨脚本读取等修复见[官网完整记录](https://getquicker.net/V2/Versions)。

### 2.3.33 · 录屏编辑、OCR 模式与窗口滑动

- [编辑录屏与智能缩放](/v2/features/screenshot/recording-and-pin#recording-edit-2333)补充预览与历史入口、首尾截取、画面裁切、保存方案和 MP4 导出；说明点击轨迹、默认关闭的智能缩放与原片保留边界。
- [截图 OCR 默认模式](/v2/features/screenshot/ocr#ocr-result-mode-2333)说明原图选字、打开结果窗口和直接复制全文，及右键切换、Ctrl 临时开窗和账号同步；[结果窗](/v2/features/screenshot/ocr#结果窗)补充识别历史和图片复制菜单。
- [高级鼠标触发](/v2/features/triggers/advanced-mouse-triggers#window-drag-2333)新增按住滑动移动、缩放窗口的配置方法、左键修饰键限制和取消行为。
- [动作分享](/v2/features/action-sharing#如何选择发布格式)修正新分享和更新分享的默认格式；[停止步骤](/v2/xaction/modules/stop#参数说明)补充并行分支停止整个动作的修复与取消边界。
- [账号说明](/v2/features/account-and-sync#登录之后会发生什么)、安装与入门页明确新用户暂不开放本机离线入口，已有账号继续可用。
- **升级与回退**：[2.3.33 注意事项](/v2/migration/upgrade-and-rollback#recording-and-account-2333)说明录屏工程的本机备份、历史清理和旧版维护限制，以及 OCR 模式和新鼠标操作的版本边界。轮盘重绘、拖放图标、编辑器等待、悬浮分组和 AI 流式兼容等修复见[官网完整记录](https://getquicker.net/V2/Versions)。

### 2.3.32 · 模型上下文、贴图右键与播放音量

- [AI 模型上下文设置](/v2/what's-new/ai-services-and-models#model-capacity-2332)补充服务端容量识别、常见值选择、未知模型添加及手动上限的优先级。
- [贴图右键操作](/v2/features/screenshot/recording-and-pin#pin-right-button-2332)说明局部显示开关、关闭后使用右键鼠标手势及账号同步；[截图与取字](/v2/features/screenshot/capture-pro#capture-response-2332)补充准备速度、重复识别复用和结果窗重新截图修复。
- [播放声音](/v2/xaction/modules/playsound)补充 0～4 音量倍率、静音和失真边界；[脚本接口](/v2/script-action/api/sys#sysplaysound)同步参数说明。
- **升级与回退**：[2.3.32 注意事项](/v2/migration/upgrade-and-rollback#model-capacity-and-sound-2332)说明旧客户端保存或同步 AI 设置的影响，以及音量倍率的最低版本要求。规则列表显示、外部程序路径查询和更新识别修复见[官网完整记录](https://getquicker.net/V2/Versions)。

### 2.3.31 · Windows ARM64、OCR 结果窗与录屏声音

- [安装说明](/v2/install/windows)新增 Windows ARM64 原生包入口；[更新与组件](/v2/install/update#arm64-update-2331)说明按架构选择主程序、OCR 和补全服务，及原生依赖限制。
- [OCR 结果窗](/v2/features/screenshot/ocr#结果窗)更新原生页面、独立原图校对、标准模型和方向检测重新识别流程；[多张贴图](/v2/features/screenshot/recording-and-pin#pin-multi-select-2331)说明 Ctrl 点选与当前组全选。
- [桌面录屏](/v2/features/screenshot/recording-and-pin#recording-2331)说明新的系统声音范围、主音量与录音音量的区别，以及不支持时的回退。
- [AI 与 MCP](/v2/features/ai/mcp-and-external-agents#tool-budget-and-mcp-2331)补充每轮工具额度、上下文快捷设置和默认关闭的附加功能。
- [WebSocket 文件后处理](/v2/features/http-websocket#file-receive-actions)标注正式版本，补充文件复制、定位和一次复制多个文件的协议；[亮度浮层](/v2/features/displays-and-desktops#显示器)更新默认关闭规则。
- [步骤详情](/v2/xaction/concepts/edit-step-param#extra-assignment-summary-2331)补充额外赋值摘要；[子程序](/v2/xaction/modules/subprogram)注明跳过调试输出的修复。
- **升级与回退**：[2.3.31 注意事项](/v2/migration/upgrade-and-rollback#ocr-and-arm64-2331)说明录音范围、旧版保存 OCR 校对副本和设置的影响，以及更换架构前的备份与兼容检查。

### 2.3.30 · 窗口背景确认、跨动作录屏与文本指令整理

- [AI 窗口背景](/v2/features/ai-and-agent#window-context-2330)说明默认点击确认、三种本机关联方式，以及空白新对话的侧栏显示规则。
- [后台屏幕录制](/v2/xaction/modules/screen-recording#会话什么时候结束)补充跨动作运行控制、保存会话 ID、显式停止及脚本调用示例。
- [文本指令](/v2/features/triggers/text-commands#批量复制到其它场景)补充全局与场景互相复制、重复项处理、全局生效范围和场景分组管理。
- [贴图右下角缩放](/v2/features/screenshot/recording-and-pin#pin-corner-zoom-2330)说明拖动、取消与适用状态；[脚本选中文件](/v2/script-action/api/selection#selected-files-2330)补充文件管理器兼容和剪贴板影响。
- [Mastercam](/v2/features/software-connections/software/mastercam)补充 2022 安装检测修复；搜索高亮、补全及其他修复见[官网完整记录](https://getquicker.net/V2/Versions)。
- **升级与回退**：[窗口背景和录屏注意事项](/v2/migration/upgrade-and-rollback#window-context-2330)说明旧版自动关联及偏好清除，以及后台录屏需显式停止的行为变化。

### 2.3.29 · 图片标签、标注快捷操作与步骤配置清理

- [图片、贴图与录屏管理](/v2/features/screenshot/recording-and-pin#图片与录屏历史管理)更新当前导航、图片标签、来源程序筛选、标签内新截图、文字识别及大图入口。
- [标注快捷操作](/v2/features/screenshot/capture-pro#annotation-copy-2329)补充 Shift 等宽高绘制和 Ctrl+D 复制标注。
- [AI 图片保存](/v2/features/ai/prompt-library-and-sessions#save-reply-image-2329)说明回复完成后的下载按钮及图片右键另存为。
- [动作历史与备份](/v2/features/action-history#backup-restore-2329)说明自动备份分类修复、按准确来源版本恢复和只读恢复限制。
- [步骤参数保存](/v2/xaction/concepts/edit-step-param#step-save-cleanup-2329)说明操作切换后的无效绑定清理范围；模块参数预览同步当前发布快照。
- **升级注意**：[步骤运行行为与回退](/v2/migration/upgrade-and-rollback#step-and-image-library-2329)列出残留参数停读、无意义输出停写及保存同步后的配置恢复边界，并说明图片标签的本机存储范围。

### 2.3.28 · 场景规则整理、动作引用与 MCP 接入

- [文本指令](/v2/features/triggers/text-commands#移动到父场景)补充批量复制粘贴、移动到父场景、重复项跳过及继承影响；指令引用的动作不会一起复制或移动。
- [动作面板](/v2/features/action-panel/usage#2328--定位最近动作与引用到助手)补充最近动作定位、场景动作列表复制 ID 和引用到侧边 AI 助手。
- [软件连接](/v2/features/software-connections/install-and-manage#2328--怎样判断版本兼容)按连接包声明判断兼容范围，补充 Mastercam 2022 包及验证边界，不将检测到的年度等同于已适配。
- [内置升级](/v2/install/update#2328--安装日志)补充安装日志位置和缓存复用说明。
- **升级注意**：[MCP 客户端接入同意](/v2/migration/upgrade-and-rollback#mcp-client-consent-2328)独立于完全控制，无人值守任务需先手动完成接入确认。
- AI 正文图片、对话排序、截图扩展热键、贴图定位及设计器撤销等修复见[官网完整记录](https://getquicker.net/V2/Versions)。

### 2.3.27 · AI 指令与记忆、状态迁移与响应超时

- [AI 使用](/v2/features/ai)现集中提供服务配置、助手操作与[AI 指令与记忆](/v2/features/ai/memory)专页；说明共享与本机范围、默认启用、整理、撤销、导入导出和隐私边界。
- [响应超时](/v2/what's-new/ai-services-and-models#response-timeout-2327)：首次响应与输出间隔分别设置，持续流式输出不受固定总时长限制，压缩摘要沿用相同规则。
- [1.x 动作状态迁移](/v2/migration/from-v1#action-state-migration-2327)：按动作选择、对比新旧状态，覆盖前自动备份；已有 V2 状态的动作默认不选中。
- [窗口贴图](/v2/features/screenshot/recording-and-pin#窗口贴图缩放)支持双击关闭和缩放右键菜单；截图、贴图与录屏补充工具提示。
- **升级与回退**：共享指令与记忆明文上传，本机内容不随账号同步；回退后保存 AI 设置会丢失新版超时配置。迁移旧状态会替换所选动作当前状态。请先阅读[本版注意事项](/v2/migration/upgrade-and-rollback#ai-memory-and-timeout-2327)及迁移页中的覆盖说明。
- 轮盘跨屏定位、亮度浮层等待、规则列表刷新、表达式兼容与子菜单显示等修复见[官网完整记录](https://getquicker.net/V2/Versions)。

### 2.3.26 · 长截图保存、通用标签与 AI 会话恢复

- [长截图直接保存](../v2/features/screenshot/capture-pro.md#long-capture-save-2326)：采集工具栏增加保存按钮，`Ctrl` 点击使用系统“另存为”；取消或保存失败后保留拼接内容。
- [通用场景标签显示](../v2/features/action-panel/usage.md#common-scene-tab-2326)：可关闭通用标签常驻显示，默认开启，随账号同步；说明兜底显示与旧版使用边界。
- [AI 会话恢复与图片原图](/v2/features/ai/prompt-library-and-sessions#session-recovery-2326)：暂存动作转正后原聊天可继续，失效模型引用尝试恢复，图片附件使用系统查看器打开原图；访问权限与冲突检查仍保留。
- [暂存动作悬浮](../v2/features/action-panel/action-drafts.md#float-saved-draft-2326)：修复编辑器保存后仍无法悬浮，说明首次保存及使用已保存内容的边界。（[#634](https://github.com/QuickerOrg/Quicker2-issues/issues/634)）
- 面板触发键名称完整显示、内嵌网页子框架桥接、React 界面取消结果和亮度浮层闪烁等修复，见[官网完整版本记录](https://getquicker.net/V2/Versions)。（[#636](https://github.com/QuickerOrg/Quicker2-issues/issues/636)、[#633](https://github.com/QuickerOrg/Quicker2-issues/issues/633)、[#609](https://github.com/QuickerOrg/Quicker2-issues/issues/609)）

### 2.3.25 · 截图现场、尺寸约束与 AI 编辑

- [截图现场与选区恢复](../v2/features/screenshot/capture-pro.md#capture-history-2325)：逗号/句号浏览截图现场，N / M 在当前画面恢复选区；说明完整底图的本机保存范围、容量与关闭方式。
- [尺寸与比例约束](../v2/features/screenshot/capture-pro.md#capture-size-2325)：选区可保持固定像素尺寸或比例，并随历史恢复尺寸模式；补充取色格式记忆、撤销按钮右键重做和贴图组显隐动作。
- [AI 在线图库](/v2/features/ai-and-agent#icons-and-editing-2325)可由助手搜索或打开候选窗口选择；[设计器助手](../v2/xaction/concepts/xaction-editor.md#designer-configuration-2325)可编辑动作菜单、运行选项和关联配置，冲突时可覆盖或放弃，检查后仍需保存。
- [Quicker操作](../v2/xaction/modules/system/quickeroperations.md#management-2325)补充指定设置页和悬浮分组管理入口；[SOLIDWORKS 软件连接](../v2/features/software-connections/software/solidworks.md)兼容范围扩展到 2018–2026，并说明真机验证边界。
- **升级与回退**：完整底图可能包含选区外的敏感内容；旧版保存可能清除新版尺寸模式与取色格式。请先阅读[本版注意事项](../v2/migration/upgrade-and-rollback.md#capture-and-ai-2325)。

### 2.3.24 · 贴图交互、脚本文本工具与步骤参数

- [贴图自动折叠、复制与缩放](/v2/features/screenshot/recording-and-pin#pin-interaction-2324)：默认关闭的逐张自动折叠、复制按钮双击成功后关闭、文字优先复制与鼠标锚点缩放。
- [脚本文本工具](../v2/script-action/tutorials/text-tools.md)：输入框及表单可使用内置和自定义工具，说明全文/选区替换、取消和停止边界。
- [交互截图](../v2/xaction/modules/image/screen-capture-pro.md#参数说明)的“操作”支持变量输入；[鼠标输入](../v2/xaction/modules/basic/mouse.md#通用参数)、[运行脚本](../v2/xaction/modules/basic/runscript.md#参数说明)等步骤补齐实际生效参数的配置入口。（[#626](https://github.com/QuickerOrg/Quicker2-issues/issues/626)）
- 场景禁用轮盘菜单或手势后不再拦截原生拖拽，AI 编辑动作时改善参数与文本保留；完整修复记录见[官网版本记录](https://getquicker.net/v2/versions)。（[#628](https://github.com/QuickerOrg/Quicker2-issues/issues/628)）
- **升级与回退**：浏览器步骤保存会清理不适用的元素选择器，旧版保存本地库可能丢弃自动折叠偏好；详见[本版注意事项](../v2/migration/upgrade-and-rollback.md#pin-and-step-inputs-2324)。

### 2.3.23 · 脚本 .NET、截图布局与文件收发

- [脚本动作](../v2/script-action/language.md)开放 .NET 类型，方法修饰符可自动忽略；[安全说明](../v2/script-action/security.md)同步调整为当前执行权限和停止边界。
- [截图工具栏](../v2/features/screenshot/capture-pro.md#toolbar-layout-2323)统一整理更多菜单，保存后立即刷新当前普通截图；恢复默认可正确保存，指定贴图组可重新显示全部未关闭贴图。
- [WebSocket 文件接收目录](../v2/features/http-websocket.md#receive-directory-2323)可按本机设置，连续接收合并通知，发送二进制文件显示进度。
- [AI 工具结果与草稿确认](/v2/features/ai-and-agent#tool-results-2323)说明检查、保存和设置跳转的结果，以及草稿外观修改的确认范围。
- 修复快捷键截图下拉框提前收起、OCR 小窗滚动、悬浮分组打开、轮盘边界滚轮和 AI 参数初始化卡死等问题；调整滑块数字框宽度，并修正 V2 帮助入口。（[#606](https://github.com/QuickerOrg/Quicker2-issues/issues/606)、[#623](https://github.com/QuickerOrg/Quicker2-issues/issues/623)）完整记录见[官网版本记录](https://getquicker.net/v2/versions)。
- **升级与回退**：安装和导入的脚本不再逐项确认能力；新 .NET 调用可能无法在旧版运行，早期 AI 配置读取路径退役。请先阅读[本版注意事项](../v2/migration/upgrade-and-rollback.md#script-and-settings-2323)。

### 2.3.22 · 截图工具栏、脚本编辑与 AI 工具

- [截图工具栏布局](/v2/features/screenshot/capture-pro#toolbar-layout-2322)：在设置中调整顺序、主栏与更多菜单、分组和默认项，随账号同步；保存后对新开的截图和贴图生效。
- [贴图组与图片预览](/v2/features/screenshot/recording-and-pin#pin-groups-2322)：快捷切组、调整组顺序及创建指定组切换动作；预览栏可拖动调整宽度。组和图片仍只保存在本机。
- [OCR 识别与选字](/v2/features/screenshot/ocr#ocr-selection-2322)：优先使用已安装的中文识别引擎，改善逐字选字及本地失败后的提示。
- [脚本编辑器](/v2/script-action/editor#source-search-2322)支持查找、替换和代码折叠；[多字段表单](/v2/xaction/modules/form#slider-buttons-2322)的滑块增加步进按钮。（[#606](https://github.com/QuickerOrg/Quicker2-issues/issues/606)）
- [AI 来源动作与用量](/v2/features/ai-and-agent#source-and-usage-2322)：按权限编辑来源组合动作，分析运行记录；统计动作调用和模型测试的用量。（[#613](https://github.com/QuickerOrg/Quicker2-issues/issues/613)）
- [CorelDRAW 连接](/v2/features/software-connections/software/coreldraw#catalogs-2322)：补充原生命令和自动化 API 目录、模板使用限制及旧版 x64 兼容范围。
- [自定义 MCP 升级](/v2/features/ai/mcp-and-external-agents#自定义-mcp-集成的写入方式)：移除 `quicker_eval`，读取改用专用工具；停止运行和合并预览使用独立工具。同步及回退边界见[升级与回退](/v2/migration/upgrade-and-rollback#toolbar-and-mcp-2322)。
- 修复贴图 Ctrl 拖出无法置入 Photoshop、工作台空会话、搜索说明过长和摘要恢复等问题。（[#611](https://github.com/QuickerOrg/Quicker2-issues/issues/611)、[#620](https://github.com/QuickerOrg/Quicker2-issues/issues/620)、[#621](https://github.com/QuickerOrg/Quicker2-issues/issues/621)、[#608](https://github.com/QuickerOrg/Quicker2-issues/issues/608)）完整记录见[官网版本记录](https://getquicker.net/v2/versions)。

### 2.3.20 · 截图同步、气泡标注与助手图标

- [截图复制与同步](/v2/features/screenshot/capture-pro#capture-copy-and-sync-2320)：复制时可附带 PNG 文件，Ctrl 点击保存打开系统“另存为”；截图操作偏好和全局快捷键随账号同步，目录与 HDR 等设备设置仍保留在本机。
- [气泡与连续标注](/v2/features/screenshot/capture-pro#annotation-tools-2320)：调整气泡文字、边框、底色及尖角，使用方形和白色描边序号；尺寸线按上一条比例预填，铅笔按 Shift 连续点击连线。（[#605](https://github.com/QuickerOrg/Quicker2-issues/issues/605)）
- [助手图标与执行详情](/v2/features/ai-and-agent#icons-and-tool-details-2320)：为所选动作生成并应用图标，导入 PNG、JPEG 和 SVG；按结果、输入和调用记录查看详情。补充离线图标的使用边界。
- [本地 OCR 空闲保活](/v2/features/screenshot/ocr#local-ocr-keepalive-2320)：未配置时默认 5 分钟退出，0 表示常驻，已有值保留；[亮度快捷操作](/v2/features/displays-and-desktops#显示器)默认显示浮层。
- [升级与回退](/v2/migration/upgrade-and-rollback#capture-sync-and-icons-2320)：首次导入、旧客户端同步截图快捷键、标注样式及 SVG 外链兼容注意事项。
- 修复窗口贴图按 R 恢复报错、Windows 应用内部进程查找和问问 AI 多窗口目标跟随等问题。（[#607](https://github.com/QuickerOrg/Quicker2-issues/issues/607)、[#603](https://github.com/QuickerOrg/Quicker2-issues/issues/603)）完整记录见[官网版本记录](https://getquicker.net/v2/versions)。

### 2.3.19 · 截图标注与 AI 窗口背景

- [Quicker 截图的新标注工具](/v2/features/screenshot/capture-pro#annotation-tools-2319)：尺寸、角度、引出线与局部放大；更新工具分组、数字键说明及截图 AI 的当前快捷键。[全局快捷键](/v2/features/screenshot/capture-pro#capture-name-and-hotkey-2319)可直接打开截图，2.3.19 仅本机生效，2.3.20 起随账号同步。
- [AI 窗口背景与欢迎示例](/v2/features/ai-and-agent#window-context-2319)：核对来源、重新读取或取消背景，先显示问问 AI 窗口再补入选区；说明路径、网址及选中文字随提问发送的范围。
- [AI 服务可稍后补全](/v2/what's-new/ai-services-and-models#incomplete-connections-2319)：保存未完成连接、区分不可用与保存失败，不影响其他有效服务。
- [文本变量](/v2/xaction/concepts/variables#2319--文本变量的空默认值)统一使用空字符串作为缺省初值；表达式可[获取动作数据目录](/v2/xaction/concepts/standard#expression-action-data-directory)，基础绘图类型兼容问题已修复。
- [升级与回退](/v2/migration/upgrade-and-rollback#preferences-and-ai-2319)：说明旧版保存截图偏好、按键动作页显示选择、AI 背景及不完整服务时的影响。

### 2.3.18 · 截图多选、工作台做事与表达式兼容

- [截图确认与外观记忆](/v2/features/screenshot/capture-pro#capture-confirm-actions)：确认后组合执行复制、自动保存、贴图和运行动作；图钉复制与各项外观记忆分别控制。[识字浮层](/v2/features/screenshot/ocr#open-full-ocr)可带着已编辑文字打开完整 OCR 窗口。
- [让工作台直接帮忙做事](/v2/features/ai-and-agent#desktop-tasks-2318)：查找本机文件和程序、执行一次性操作，说明目标窗口、批准和自定义 MCP 写入方式。
- [悬浮缩放](/v2/features/floating-actions#调整按钮大小)与[侧栏拖放](/v2/features/action-panel/usage#sidebar-shortcut-drag)：拖动右下角缩放悬浮按钮或整组，在面板侧栏排序和放置动作；[文字图标](/v2/xaction/concepts/use-icon-in-actions#2317--编辑动作的文字图标)支持手动换行。
- [升级与回退](/v2/migration/upgrade-and-rollback#capture-preferences-2318)：截图偏好回退后再次保存会丢失新版选项；旧表达式引擎已移除，直接调用其程序集的脚本需调整。同步修正排障和迁移页中已过时的开关指引。
- 修复 DeepSeek 思考模式的历史回传、规则编辑重复、轮盘悬停展开、JSON 数值运算、截图阴影及面板留白等问题。完整版本说明见[官网版本记录](https://getquicker.net/V2/Versions)。

### 2.3.17 · 问问 AI、场景合并与截图

- [问问 AI](/v2/features/ai-and-agent#2317--问问-ai-入口与文件操作)：从搜索、选中文本工具条及图片、文件菜单提问，在独立小窗继续对话；说明文件操作的确认与备份提示。
- [合并显示父子场景动作](/v2/features/action-panel/usage#2317--合并显示父子场景动作)：在新面板中按来源连续显示相关场景动作，默认关闭，原场景数据不移动。
- [编辑文字图标](/v2/xaction/concepts/use-icon-in-actions#2317--编辑动作的文字图标)：设置文字、字体、颜色和背景；在线分享时转换为图片，旧版直接导入原始动作有兼容限制。
- [HDR 截图颜色校正](/v2/features/screenshot/capture-pro#2317--hdr-截图颜色校正实验性)：为 HDR 屏幕提供默认关闭的实验选项，说明适用入口与回落情况。
- [升级与回退](/v2/migration/upgrade-and-rollback#2317--相关场景显示与文字图标)：说明旧版对面板合并设置及原始文字图标的兼容范围。
- 动作编辑器不再提供新建“发送手机通知”和“自动化脚本”的入口；已有动作的运行边界见对应模块文档。完整修复记录见[官网版本记录](https://getquicker.net/V2/Versions)。

### 2.3.15 · 截图 AI、会话目录与分卷更新

- [截图 AI 提问](/v2/features/screenshot/capture-pro#2315--截图-ai-提问)：点击 AI 按钮或按 `i`，选择模型并发送截图问题；用 `/` 选择历史问题和示例，说明窗口标题与进程名随请求发送的范围。
- [会话独立工作目录与文件操作](/v2/features/ai/prompt-library-and-sessions#2315--会话独立工作目录与文件操作)：空闲会话可换目录并保留历史，后台任务沿用启动目录；回复文件链接提供打开、复制、另存和附件操作，话题可标记未读，处理过程可整体折叠。
- [分卷下载与缓存复用](/v2/install/update#2315--分卷下载与缓存复用)：复用校验通过的安装文件，准备失败时回退完整包，说明首次更新及手动安装边界。
- [升级与回退](/v2/migration/upgrade-and-rollback#2315--会话目录与截图-ai-历史)：回退旧版可能无法接续新版会话上下文，保存本机状态可能清除截图问题历史，需提前保留重要内容。
- 修复动作预览中无法向 AI 提问分析内容、悬浮分组失去置顶后点击不能恢复的问题；改进 AI 服务启停和模型提示，服务设置保存失败时恢复原开关状态。完整修复记录见[官网版本记录](https://getquicker.net/V2/Versions)。

### 2.3.13 · 动作数据目录、桌面 AI 与存储调整

- [动作数据文件夹](/v2/xaction/concepts/standard#动作数据文件夹)：说明设计目的、组合动作与脚本入口、创建目录、适用场景、分享和备份边界，以及删除时回收和手动恢复。补充[获取系统或动作信息](/v2/xaction/modules/getsysinfo)的新输出。（[#594](https://github.com/QuickerOrg/Quicker2-issues/issues/594)）
- [截图 Pro 单次参数与结束方式](/v2/xaction/modules/screen-capture-pro#2313--单次截图参数与结束方式)：本次鼠标指针、确认快存模板和 PNG/JPEG 格式，按实际出口处理后续步骤；[自定义工具栏](/v2/features/screenshot/toolbar-script)改用独立编辑窗口，并修复图片图标黑块。
- [桌面 AI 与 MCP 接入](/v2/features/ai/mcp-and-external-agents#2313--桌面入口与-mcp-接入)：统一桌面预览、编辑和分享确认，说明当前会话输入历史及回复保存重试；MCP 提供 AI 自动配置、HTTP 和 stdio 三种接入指引。桌面网页版 AI、网页设计器和手机 AI 已退役，已有桌面对话保留。
- [检查和下载依赖](/v2/xaction/modules/dependencycheck)：新包写入应用数据目录，继续识别旧包，后续步骤应使用实际输出路径。[清理旧浏览器数据副本](/v2/features/tools#清理旧浏览器数据副本)说明浏览器按目录迁移后的清理入口与限制。
- [升级与回退](/v2/migration/upgrade-and-rollback#2313--动作文件与浏览器数据)：动作文件不包含在内置备份中；浏览器新旧副本独立变化，回退前需手动备份，清理旧副本不经过回收站。
- 修复远程文件账号候选列表刷新、AutoCAD 连接依赖加载、带引号匿名成员名称的表达式兼容，以及部分输入、焦点和快捷键异常，并缩小安装包。完整条目见[官网版本记录](https://getquicker.net/V2/Versions)。

### 2.3.9 · AI 动作编写、截图撕边与录屏操作

- [AI 编写、搜索与管理动作](/v2/features/ai-and-agent#239--编写搜索与管理动作)：工作台与 MCP 支持脚本动作和常用基础动作，按需求选择类型，扩展搜索排序、行内运行编辑、复制、引用查询和历史恢复；明确保存冲突和真实试跑的边界。
- [截图撕边](/v2/features/screenshot/capture-pro#239--截图撕边)：选择作用边、深度和齿宽，与边框和阴影组合；外观参数分开调整，窗口吸附按可见边框和圆角裁切。（[需求反馈](https://getquicker.net/QA/Question/42473)）
- [录屏指针与预览删除](/v2/xaction/modules/screen-recording-ui#239--鼠标指针与预览删除)：录制中切换鼠标指针、在预览中放弃本次录制；删除失败保留预览，已另存文件不受影响。
- [升级与回退](/v2/migration/upgrade-and-rollback#239--截图外观与录屏默认提示)：首次录屏默认显示点击与滚轮，旧选择保留；回退旧版并保存截图设置会清除撕边偏好，截图文件不受影响。
- 恢复动作面板“粘贴为链接动作”，加载场景时切回动作面板；修复 React 表单保存与回车提交、后台朗读失败无提示等问题。完整修复见[官网版本记录](https://getquicker.net/V2/Versions)。

### 2.3.8 · 动作隐藏、远程目录删除与表达式兼容

- [隐藏不常用动作](/v2/features/action-panel/usage#238--隐藏不常用动作)：分别从最近使用 / 最近活动及动作搜索中隐藏，在动作管理中恢复；设置随账号同步，不影响快捷键等运行入口。
- [远程目录删除](/v2/xaction/modules/remotefile#238--删除目录)：支持 WebDAV 和 S3，默认只删空目录，递归删除前需确认范围。（[#588](https://github.com/QuickerOrg/Quicker2-issues/issues/588)）
- [动作信息表达式](/v2/xaction/concepts/expression-adv#237--读取动作的只读信息)：改用 `_context.ActionIcon`、`_context.ActionTitle`、`_context.ActionDescription`，已有 `_context.Action.Icon` 等写法需手动调整。
- [升级与回退](/v2/migration/upgrade-and-rollback#238--动作隐藏与远程目录删除)：旧设备不应用隐藏设置，也不能运行新的目录删除操作；需要这些能力时请先升级对应设备。
- AI 对话显示当前模型，发送消息后收起脚本最近运行卡片；脚本编辑器“最小化运行”等待 2.5 秒后开始。完整修复见[官网版本记录](https://getquicker.net/V2/Versions)。

<a id="开发中--api-配置贴图主题与动作信息" />

### 2.3.7 · AI 保存、API 配置与贴图主题

以下说明依据 2.3.7 发布快照。使用 2.3.6 或更早版本时，仍按对应旧版说明操作。

- [API 配置弹窗](/v2/what's-new/ai-services-and-models#237--api-配置弹窗)：在对话内添加服务与模型，区分自动保存、能力测试和对话模型选择，不再隐式填入默认模型或改写模型分配。
- [模型不可用与 Claude 授权](/v2/features/ai/mcp-and-external-agents#237--api-配置与外部助手授权)：按停用、凭据和工具能力分别排查，Claude 同一安装布局的版本/构建可复用 MCP 同意。
- [纯文本与主题](/v2/xaction/modules/pinimage#237--纯文本与主题)：同步最新参数，说明纯文本不自动识别内容、自动来源的简化选项和旧颜色参数退役；原配色需重新检查。
- [只读动作信息](/v2/xaction/concepts/expression-adv#237--读取动作的只读信息)：用 `_context.Action` 读取 ID、标题、图标和说明，保留旧 ID/标题入口，不能修改或读取内部完整动作对象。
- [已有动作的保存流程](/v2/features/ai-and-agent#237--保存已有动作)：同一项目的聊天复用工作内容，保存按权限直接提交原动作；内容冲突时保留修改，新建动作仍需保留到场景。
- [升级与回退](/v2/migration/upgrade-and-rollback#237--贴图主题与-ai-保存)：检查停用的自定义颜色、明确选择 API 模型，并确认 AI 保存已生效的范围。
- 改善变量列表、输入法组字和网页窗口关闭后的内存释放，统一内置图标配色，限制动作安装说明区域高度；完整修复条目见[官网版本记录](https://getquicker.net/V2/Versions)。

<a id="开发中--设置入口与步骤参数" />

### 2.3.6 · 设置入口与步骤参数

- [桌面与网页设置入口](/v2/what's-new/tools-and-experience#236--桌面与网页设置入口)：网页设置只留外观与主题，其他项目在桌面窗口修改；旧地址需点击打开，桌面页空白点击可提交正在编辑的输入。
- [设置助手范围](/v2/features/ai-and-agent#236--统一设置入口与助手范围)：统一使用桌面已开放的项目，服务连接及远程文件账号列表只读，设置卡片点击后才打开页面。
- [旧参数与子程序接口](/v2/xaction/concepts/edit-step-param#236--旧参数与子程序接口)：确认编辑时清理已删除的接口；区分普通参数键名大小写兼容与子程序准确名称匹配，不批量清理其他动作。
- 创建场景提示菜单可对当前程序或所有程序关闭提示；设置页面卡顿、变量菜单「创建变量」图标等修复见[官网版本记录](https://getquicker.net/V2/Versions)。

<a id="开发中--手动内存回收结果" />

- [手动内存回收结果](/v2/features/tools#236--查看手动内存回收结果)：用 Ctrl + 右键设置按钮查看前后托管内存，区分该数值与进程总占用。

### 2.3.5 · 完全控制、贴图与更新流程

- [完全控制与工具恢复](/v2/features/ai-and-agent#235--完全控制与工具恢复)：已启用的工具直接执行，MCP 继承全局完全控制；需要逐次确认时改用「请求批准」。普通工具错误可修正后继续尝试。
- [AI 自动保存与密钥更换](/v2/what's-new/ai-services-and-models#235--自动保存与密钥更换)：离开编辑控件或切换服务时自动保存，明确说明更换、取消更换和清除 API Key 的操作。
- [文字与 HTML 贴图](/v2/xaction/modules/pinimage#235--文字与-html-贴图)：改善文字生成速度、深色配色和透明背景；HTML 统一静态离线渲染，依赖网络或脚本的内容需先转换。
- [应用内更新](/v2/install/update#应用内更新)：更新包保留原名及下载文件，修复等待退出的权限问题，并说明文件占用状态的处理。
- [诊断报告进度](/v2/features/tools#235--诊断报告进度)：说明压缩、上传进度与预计时间，以及最终成功状态的判断。

### 2.3.4 · 对话模型、脚本助手与 MSI 更新

- [会话模型与恢复](/v2/features/ai/prompt-library-and-sessions#234--会话模型与恢复)：对话独立保存模型，新对话复用最近选择；说明不可用模型与压缩失败的处理。
- [批量修改设置与触发规则](/v2/features/ai-and-agent#234--批量修改设置与触发规则)：提交前复核当前值，检查逐项结果，部分保存不会自动回滚。
- [外部助手恢复编辑副本](/v2/features/action-panel/action-drafts#234--外部助手恢复编辑副本)：先保全内容，以当前已保存动作作为恢复基础。
- [脚本提示词加载方式](/v2/script-action/assistant#234--提示词加载方式)：完整或按需加载（实验），本机保存，新会话生效；[最近运行卡片](/v2/script-action/assistant#234--收起最近运行卡片)可关闭。
- [MSI 更新模式](/v2/install/update#应用内更新)：展示安装进度，取消或失败时尝试恢复原版本；[诊断报告](/v2/features/tools#收集诊断报告)改用进程快照，报告 ZIP 不加密。
- [面板空白处创建与粘贴](/v2/features/action-panel/usage#234--在空白处创建和粘贴)、[OpenCode 连接](/v2/what's-new/ai-services-and-models#234--opencode-连接兼容)与[语音识别账号说明](/v2/xaction/modules/recordsound)已更新。表达式 LINQ 结果类型、深色悬浮动作闪白及文字图标等修复见[官网版本记录](https://getquicker.net/v2/versions)。

<a id="开发中--诊断脚本排查与暂存权限" />

### 2.3.3 · 诊断报告、本地补全测试与工具菜单

- [工具菜单](/v2/features/action-panel/usage#工具菜单)按更新与组件、数据管理、诊断与修复、开发与导出分组；原来的工具入口请到对应子菜单中查找，例如「动作运行与触发记录」「当前场景诊断」在「诊断与修复」下。
- [收集诊断报告](/v2/features/tools#收集诊断报告)：说明完整进程内存与日志的采集、同意上传、报告编号，以及上传失败后的 ZIP 重传。自我诊断提示不会自动上传。
- [测试本地补全](/v2/features/tools#测试本地补全)：检查实际组件路径，用独立服务验证启动、补全和表达式诊断；测试不会改变设置或自动开启本地补全。本地补全组件独立于主程序安装包，安装版遇到补全连接失败时先将组件更新到 0.1.5。
- [脚本错误与运行分析](/v2/script-action/assistant#引用错误与运行分析)：区分引用诊断、分析已有记录与用户点击后真实执行的“运行并分析”。AI 不会自行运行脚本。
- [回答助手的问题](/v2/features/ai-and-agent#回答助手的问题)：窗口内单选点击确认并前进，最后一题可提交全部答案；多选与自由输入的确认方式另有说明。
- [分享暂存动作的编辑权限](/v2/features/action-panel/action-drafts#编辑分享动作的暂存项)：读取真实来源内容、保留只读和禁止再分享限制；来源失败时不以空内容代替。
- [悬浮分组菜单](/v2/features/floating-actions#分组菜单入口调整)：进程绑定和窗口跟随集中到同一子菜单，单成员菜单精简显示选项。
- [单击 Ctrl 弹出面板](/v2/features/triggers#单击-ctrl-弹出面板)：将对应开关移到黑名单页，说明程序黑名单、全屏禁用和面板全局快捷键的区别。
- [远程文件路径与结果](/v2/xaction/modules/remotefile#路径与批处理结果)：同步最新导出的参数说明，补充根目录相对路径、完整目标文件名、目录传输与批处理结果判断；这是对已有操作的澄清。

### 2.3.2 · 窗口助手、键盘黑名单与布局改进

- [窗口助手](/v2/features/ai-and-agent#232--窗口助手)：设置 / 场景助手开放附件与截图；设计器、脚本、设置 / 场景助手可继续历史会话、改名、归档或删除。载入历史不会回退当前动作和设置。
- [服务商与模型分配](/v2/what's-new/ai-services-and-models#232--服务商与模型分配)：重整设置入口，管理模型能力、探测或手动确认，并调整各任务场景的候选顺序。
- [键盘触发黑名单](/v2/features/triggers#程序黑名单与全屏禁用)：动作快捷键、按键双击、热键联动可分别选择遵循全局黑名单和全屏禁用，新增开关默认关闭。
- [悬浮分组](/v2/features/floating-actions#保存备份与恢复)：默认启用分组；异常旧布局可从空布局继续，首次保存前备份原文件。
- [外部文件拖放](/v2/features/action-panel/usage#232--外部文件拖放)：改善跨权限拖放创建动作；流式布局支持多文件，自由格子仅接收空格中的单文件。
- [多圈轮盘](/v2/features/triggers/circle-menu#232--轮盘基准尺寸)：按两圈基准说明尺寸，更多圈自动缩放，同次弹出切换来源保持统一尺度。
- [设置多词搜索](/v2/features/tools#232--按路径组合搜索词)：用分类路径和选项标题组合定位，例如「黑名单 快捷键」。

- 补充[管理员启动与输出捕获限制](/v2/xaction/modules/run#限制与排障)，更新模块参数目录；升级、同步和回退边界见[升级与回退](/v2/migration/upgrade-and-rollback#232-键盘黑名单与悬浮分组)。

### 2.3.1 · AI 助手附件、按账号存放与暂存文件

- [AI 本机数据按账号存放](/v2/features/account-and-sync#ai-本机数据按账号存放)：AI 配置、会话、动作日志和运行历史改为按账号存放；升级后首个启动的账号接收旧数据副本。多账号用户请先看[升级与回退](/v2/migration/upgrade-and-rollback#231-ai-数据按账号存放与密钥同步)，确认要保留旧数据的账号和回退影响。
- [在设备间同步 API 密钥](/v2/what's-new/ai-services-and-models#在设备间同步-api-密钥)：可选同步 API 密钥和自定义请求头，默认关闭；开启后会上传到 Quicker 服务器。建议所有设备升级后再启用。
- [组合动作与脚本动作的 AI 助手](/v2/features/ai-and-agent#模型附件与提问)：按对话选择模型和推理强度，添加或粘贴附件、截图与选择窗口，逐题回答助手提问；[脚本助手](/v2/script-action/assistant#先确认需求再修改)新建脚本或新增行为前先确认需求。开启完全控制时可[直接写回原动作](/v2/features/ai-and-agent#动作保存与对话入口)，新对话可一键引用最近修改的动作。
- [本机动作暂存区](/v2/features/action-panel/action-drafts#从文件导入与导出)支持从文件导入、导出动作，以及[手动备份和版本说明](/v2/features/action-panel/action-drafts#手动备份和版本说明)；点击 **＋** 先选择创建组合动作或脚本动作。
- [自定义操作窗](/v2/xaction/modules/custompanel#运行时编辑操作窗定义)新增「编辑操作窗定义」「按定义显示操作窗」，可在动作运行时打开设计器并按返回的定义显示窗口。
- [检查路径/获取文件信息](/v2/xaction/modules/checkpathexists#区分路径不存在与查询失败)可选择查询失败后继续，需先检查是否成功和是否存在。
- 截图与贴图：[截图内选字与全文编辑](/v2/features/screenshot/ocr#截图内选字与全文编辑)、[序号旁的文字说明](/v2/features/screenshot/capture-pro#序号旁的文字说明)、改版的[图片与录屏历史管理](/v2/features/screenshot/recording-and-pin#图片与录屏历史管理)，以及[窗口贴图缩放](/v2/features/screenshot/recording-and-pin#窗口贴图缩放)。
- [设置搜索](/v2/features/tools#搜索并定位设置)按页面组织结果并定位到选项；[窗口检查器](/v2/features/tools#查看控件树与取消选择)支持展开全部、展开分支和刷新节点，控件选择器可按 `Esc` 取消。
- [轮盘设置页](/v2/features/triggers/circle-menu#在设置中选择和编辑位置)单击只选中位置，双击或 `F2` 再编辑；[文本指令](/v2/features/triggers/text-commands#多条指令同时匹配)恢复较长指令优先匹配；[选择操作类型](/v2/features/triggers#选择操作类型)恢复为多级菜单。
- [完整分享窗口](/v2/features/action-sharing#如何选择发布格式)新分享和更新时默认勾选兼容发布格式。WebDAV 目录查询与 301 跳转、长步骤编辑窗顶部出屏、Everything 修改时间排序等修复见[官网版本记录](https://getquicker.net/V2/Versions)。

### 2.3.0 · 脚本动作与截图/设置 AI

- 新增 [脚本动作](/v2/script-action)：用 C# 语法编写动作，通过内置 API 处理文本、文件、网络、窗口和键鼠，并可调用其他动作与公共子程序。编辑器支持 AI 辅助、代码检查、断点与单步调试、运行轨迹和变量变化查看；可最小化后延迟运行。安全与授权见 [脚本动作安全与授权](/v2/script-action/security)；回退注意见[升级与回退](/v2/migration/upgrade-and-rollback#230-脚本动作)。
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
- [AI 对话](/v2/features/ai/prompt-library-and-sessions#对话界面)合并展示同轮程序变更，支持撤销已记录完整快照的整轮修改，并保留新对话与输入草稿；粘贴附件与图片文字识别改为按需处理。
- 录屏鼠标点击提示改为中空圆环；旧 C# 脚本 `Marshal.GetActiveObject` 编译失败等修复见[官网版本记录](https://getquicker.net/V2/Versions)。

### 2.2.25 · 设置改版、设计器 AI 与截图增强

- [设置窗口](/v2/migration/upgrade-and-rollback#2225-设置窗口改版与本机界面状态)改为树形导航，支持搜索并定位具体设置项；选项修改通常立即生效，不再提供整页「应用／撤销」。找不到原位置时可用搜索；无效或尚未提交的输入会在离页时提示。
- [动作编辑窗口](/v2/features/ai-and-agent#在设计器内修改)在配置好 AI 参数后，可点右上角 AI 按钮或按 `Ctrl+J` 打开面板，用 AI 编写和修改当前动作。
- [动作面板](/v2/features/action-panel/usage#移动或复制动作)拖动动作时，悬停在场景标签上即可切换场景，便于跨场景整理。
- [截图 Pro](/v2/features/screenshot/capture-pro#预选截图区域与快捷出口)所有操作均可使用预选截图区域；「框选即出图」和快速保存可同时选择复制到剪贴板、截图后贴图。
- [HTML 贴图](/v2/features/screenshot/recording-and-pin#贴图窗口截图后)加强自动识别、剪贴板等来源的隔离，阻止其中的页面脚本；动作作者明确选择 HTML 模式时仍保留脚本能力。
- 分享更新列表找不到仅限 V2 的子程序（#553）、事件触发最低版本提示反复弹出（#552）等修复见[官网版本记录](https://getquicker.net/V2/Versions)。

### 2.2.24 · Quicker操作、自定义操作窗设计与 AI 对话

- [Quicker操作](/v2/xaction/modules/quickeroperations#获取最后打开编辑器的动作)新增「获取最后打开编辑器的动作」，可取得本次启动期间最近打开或重新激活编辑器的已安装动作 ID，便于接续编辑。使用该类型的动作需要 **2.2.24 或更高版本**，详见[升级注意](/v2/migration/upgrade-and-rollback#2224-获取最后打开编辑器的动作)。
- [自定义操作窗](/v2/xaction/modules/custompanel#可视化设计窗)可从步骤编辑窗口的「设计」按钮打开可视化设计窗，编辑按钮、分组和布局并实时预览；操作项定义使用变量或表达式时不可用。操作项编辑窗口按操作类型显示相关字段，路径可选文件，多行脚本更便于编辑。
- [AI 对话](/v2/features/ai/prompt-library-and-sessions#对话界面)支持选中文字后「添加到对话」作为引用；模型菜单可切换上下文窗口大小；侧栏可收起、展开并记住状态。
- 截图编号标注字体更清晰；修复轮盘菜单子动作扩展圈触发距离与命中优先级，以及长截图结束编辑、关闭贴图后残留窗口或占用内存的问题。完整改动见[官网版本记录](https://getquicker.net/V2/Versions)。

### 2.2.23 · 浏览器通用分享、侧边栏与贴图标题

- 分享动作可选[「浏览器通用」适用软件](/v2/features/action-sharing#适用软件与浏览器通用)，可在 Chrome、Edge、Firefox 等支持的浏览器动作页中找到同一动作；从浏览器通用场景分享时默认选此分类。更新已有分享时若原适用软件为非法值需重选，详见[升级注意](/v2/migration/upgrade-and-rollback#2223-分享适用软件与浏览器通用)。
- [主面板侧边栏快捷按钮](/v2/features/action-panel/usage#侧边栏快捷按钮)按可用高度显示更多，放不下的收进「更多」。
- [贴图窗口](/v2/features/screenshot/recording-and-pin#贴图窗口截图后)标题不再随内容变化；图片标题改在窗口内（图片下方）显示。
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
- 补充[AI 对话导入导出与侧边设计器](/v2/features/ai-and-agent)，以及[贴图窗口按 `Y` 切换阴影、右键菜单调整](/v2/features/screenshot/recording-and-pin#移动模式)。

### 2.2.18 · 远程文件与工作区

- 补充[远程文件（WebDAV）步骤及本机账号限制](/v2/xaction)、[远程文件账号入口和 HTTP / WebSocket 设置迁移](/v2/features/software-connections)。跨设备或可能回退时，请先看[远程文件账号与 AI 助手工作区注意](/v2/migration/upgrade-and-rollback#2218-远程文件账号与-ai-助手工作区)。
- 补充[主面板自由格子边缘插队、工具菜单及未配置程序提示](/v2/features/action-panel/usage)、[软件桥接命令工具的动作拖放与 Photoshop 分类筛选](/v2/features/software-connections/command-tool)、[触发规则粘贴顺序与批量删除](/v2/features/triggers/advanced-mouse-triggers#规则列表筛选)。
- 补充[AI 助手正式版工作区选择、历史对话目录恢复和导出后打开文件夹](/v2/features/ai-and-agent)，以及[贴图穿透时从工具栏拖动与定位](/v2/features/screenshot/recording-and-pin#贴图窗口截图后)。网络子程序、焦点切换和贴图工具栏等其他修复见官网完整记录。

### 2.2.17 · 贴图、录屏与运行记录

- 补充[贴图鼠标穿透及独立工具条](/v2/features/screenshot/recording-and-pin#贴图窗口截图后)、[录屏预览焦点和播放速度](/v2/features/screenshot/capture-pro#结束方式)、[本机 FFmpeg 实时录屏](/v2/features/screenshot/capture-pro#截图-pro-设置页)。截图 Pro 步骤框选后可直接截图、复制、贴图、保存或识别；完整改动见[官网版本记录](https://getquicker.net/V2/Versions)。
- 补充[提示消息保持 1 秒](/v2/xaction/modules/notify)、[Everything 通信接口替代服务](/v2/xaction/modules/everythingsearch)、[动作日志并入运行记录窗口](/v2/features/tools#动作运行与触发记录)。
- 补充[浏览器父场景归属的管理与同步](/v2/features/scenes#作为浏览器程序与父场景归属)、[Mastercam 第三方 FT 命令筛选](/v2/features/software-connections/software/mastercam)。选择窗口会跳过鼠标穿透覆盖层；Windows 应用拖放启动参数、显示菜单子程序生命周期等修复见[官网版本记录](https://getquicker.net/V2/Versions)。

## 早期版本补充归档（2.1.29–2.2.16）

为保持本页聚焦近期版本，**2.2.16 及更早（2.1.29–2.2.16）** 的文档补充已移至 [2.1–2.2 版本更新归档](./archive-2-1-2-2.md)。

本站只补充操作中会遇到的差异。软件各版本的完整改动和校验值始终以 [官网版本记录](https://getquicker.net/v2/versions)为准。
