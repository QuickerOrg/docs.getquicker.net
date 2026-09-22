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

本站功能说明已按 2.2.19 补充，新增了[远程文件](/v2/features/remote-files)、[自动化脚本调用截图 Pro](/v2/xaction/modules/automationscript#打开截图-pro)、[贴图窗口句柄](/v2/xaction/modules/pinimage)和[匹配子窗口详情](/v2/xaction/modules/getwindowtitle#输出)等说明。版本是否已开放下载、完整条目及安装包校验值，以官网为准。

安装包也从 [https://getquicker.net/V2](https://getquicker.net/V2) 下载，不要使用仍提供 1.x 的 `/Download` 页。

本站补充的是安装、迁移、功能说明和相对 1.x 的结构变化，例如 [V2 重要变化](/v2/what's-new/)。文档会随版本抽查修订，但不会在每次发版时完整复述官网 changelog。

2.1.29–2.2.0 的用户可见补充集中在新版主窗口侧边栏快捷按钮、暂存区「新建动作 / 用 AI 写」和「保留到场景」、贴图通用 / 人像抠图、自动化脚本面向窗口与区域的 OCR / 找图 / 找色和相对点击、窗口操作的贴边自动隐藏 / 类似窗口关闭与切换，以及步骤编辑器可拉伸或贴靠到完整屏幕高度。2.2.1 继续补充了 [动作分享的 V1 / V2 制品兼容说明](/v2/what's-new/actions#动作与公共子程序分享)、[可视化录屏预选范围](/v2/xaction/modules/screen-recording-ui)、[选中文本工具条悬浮圆点与选区定位](/v2/features/triggers/text-selection-toolbar)、[截图 Pro 设置页](/v2/features/screenshot/capture-pro#截图-pro-设置页)、[图片翻译 V2.0 单独凭证](/v2/features/screenshot/image-translate)，并新增 [等待窗口](/v2/xaction/modules/waitwindow) 步骤、把等待类步骤集中到等待分组。2.2.2–2.2.3 补充了 [动作分享安装、公共子程序嵌入和预览版本号](/v2/features/action-sharing)、[百度图片翻译 V2.0 单独凭证 / API Key](/v2/features/screenshot/image-translate)、[本地表格 OCR 固定使用 small 模型](/v2/what's-new/xaction-steps/basic-ocr)，以及 [截图快捷键提示布局和遮挡处理](/v2/features/screenshot/capture-pro#快捷键一览)。2.2.4 补充了 [软件连接与 Bridge](/v2/features/software-connections) 入口、[OCR 结果窗的表格识别、Excel 打开和原图复制](/v2/features/screenshot/capture-pro#结果窗)、[用 AI 写的重复点击与未配置模型处理](/v2/features/ai-and-agent)，以及百度图片翻译 V2.0 短暂简化为只需 API Key。2.2.5 补充了 [软件连接与 Bridge](/v2/features/software-connections) 在设置页内安装与管理、[模兔云软件连接](/v2/features/software-connections/software/motuyun)、[截图 Pro 二维码识别、贴图分组与保存模板](/v2/features/screenshot/capture-pro)、[AI 助手本机用量与工作区](/v2/features/ai-and-agent)，以及文件列表获取超时、[百度图片翻译 V2.0 APP ID 与 API Key 双凭证](/v2/features/screenshot/image-translate) 和 [2.2.4 回退风险](/important-notice)。2.2.6 补充了 [悬浮动作与分组](/v2/features/floating-actions)（整组缩放、窗口跟随、自动折叠、布局备份；默认关闭，启用后需重启）、[截图选区悬停识别二维码](/v2/features/screenshot/capture-pro#选区二维码)、[Mastercam 软件连接](/v2/features/software-connections/software/mastercam)、动作编辑器进入时优先显示收藏夹，以及 [作者重装恢复原标识、复制切断分享关系](/v2/features/action-sharing#安装标识与副本)。2.2.7 补充了 [截图 Pro 选区阴影与边框及记忆规则](/v2/features/screenshot/capture-pro#选区阴影与边框)、[OCR 结果窗文本工具](/v2/features/screenshot/capture-pro#结果窗)、[截图侧栏恢复已关闭贴图](/v2/features/screenshot/capture-pro#贴图窗口截图后)、[Photoshop 手动路径与 Adobe 安装依赖检测](/v2/features/software-connections/software/photoshop)、设置窗滚轮切换分组、[表达式显式 dynamic](/v2/xaction/concepts/expression#表达式的运算结果)、[表单打开前提示缺失变量](/v2/xaction/modules/form)，以及 [回退 2.2.6 丢阴影边框配置](/important-notice)（可备份 `image-drawing-tool-state.json`）。2.2.8 补充了 [截图 Pro 混合文本捕获](/v2/features/screenshot/capture-pro#混合文本捕获)、[选区侧栏按住刷新与 F5](/v2/features/screenshot/capture-pro#选区刷新)、[剪贴板贴图支持富文本 / 公式 / 纯文本 / 图片文件](/v2/features/screenshot/capture-pro#贴图窗口截图后)、[「恢复贴图」更名与连续恢复](/v2/features/screenshot/capture-pro#贴图窗口截图后)，以及跨屏工具栏定位、刷新后马赛克与旧智能马赛克结果清理、[选中文本工具条从圆点展开不再误隐藏](/v2/features/triggers/text-selection-toolbar#悬浮圆点与选区定位)、[表达式数组 / 可空值 / 枚举匹配](/v2/xaction/concepts/expression#表达式的运算结果)、[多字段表单小数加减尾数](/v2/xaction/modules/form)、[子程序内软件连接目标窗口](/v2/what's-new/xaction-steps/subprogram) 等修复。2.2.9 补充了 [软件连接总开关](/v2/features/software-connections/install-and-manage#软件连接总开关)（默认开启、仅本机）、[读取图片信息的无 EXIF 日期回退与「拍摄时间为空」](/v2/xaction/modules/imageinfo#无-exif-日期时)、[场景列表右键菜单](/v2/features/scenes#场景与动作管理中的右键)，以及仪表盘 Esc 拦截、Clover 等内嵌资源管理器场景识别、旧面板工具菜单补齐当前场景诊断与最近触发历史、模块列表 Ctrl+F、截图刷新黑屏与小尺寸工具栏图标等修复。2.2.10 补充了 [新面板双击显隐导航与切换宽窄](/v2/what's-new/new-main-win/usage#双击导航栏)、[轮盘覆盖粘贴与跨场景剪切](/v2/what's-new/others/circle-menu#覆盖粘贴与跨场景剪切)、[动作分组跨场景复制移动与未分组批量管理](/v2/features/scenes#跨场景复制移动与未分组)、[自定义窗口指针右上定位与鼠标偏移](/v2/xaction/modules/customwindow#窗口位置与鼠标偏移)、[FlaUI「不等待操作完成」](/v2/xaction/modules/flauiautomation#不等待操作完成)、[截图选区圆角独立开关](/v2/features/screenshot/capture-pro#选区阴影与边框)、[Mastercam 2025/2026 与跨年度目录冲突](/v2/features/software-connections/software/mastercam)、[动作分享旧版兼容检查](/v2/features/action-sharing#旧版兼容检查)、[多步骤输入编辑窗口](/v2/xaction/modules/inputscript#编辑窗口)，以及扩展热键设置界面、面板隐藏残留、文本工具条圆点展开点击、表单标题与浮点尾差、贴图 Alt 拖后放大镜、轮盘描边与 Excel 运行库等修复。本站只补操作上会遇到的差异，完整版本记录仍见官网。

2.2.11 的操作说明已补充到 [左键辅助连续按键](/v2/features/triggers/left-button-plus#一次按住连续执行)、[触碰屏幕边框](/v2/features/triggers/advanced-mouse-triggers#触碰屏幕边框)、[云端动作回收站](/v2/features/account-and-sync#云端动作回收站)、[变量](/v2/xaction/concepts/variables)、[运行记录](/v2/features/tools#动作运行与触发记录)、[截图 Pro](/v2/features/screenshot/capture-pro) 和 [AI 与外部助手](/v2/features/ai-and-agent)。动作更新方式、只读动作外观设置及指定类型分享限制见 [动作分享](/v2/features/action-sharing)。升级前请阅读 [触发设置多设备与回退风险](/important-notice#2211-触发设置的多设备与回退风险)。

2.2.12 新增 [动作运行数据批量本地备份](/v2/features/account-and-sync#动作运行数据的本地备份)、[HTTP API](/v2/features/http-websocket)、[规则父场景](/v2/features/scenes#规则父场景)、[悬浮动作双击](/v2/features/floating-actions#单击与双击)和 [截图荧光笔及“截图+复制”](/v2/features/screenshot)，同时补充了场景拖放、左键辅助分组筛选、录屏工具栏排除与[按动作及调用链查看日志](/v2/features/tools#动作运行与触发记录)。

2.2.13 新增 [长截图裁剪与删段](/v2/features/screenshot/capture-pro#长截图编辑)、[新面板自由格子布局](/v2/features/action-panel/usage#自由格子布局)、[多字段表单的单选按钮与表达式校验](/v2/xaction/modules/form)、[逐行打开网址、文件和文件夹](/v2/xaction/modules/openurl)，并补充了[动作运行状态提示](/v2/features/action-panel/usage#查找和运行动作)、[Ctrl 拖动分别调整全局/上下文区高度](/v2/features/action-panel/usage#窗口尺寸)、[悬浮分组显示模式](/v2/features/floating-actions#紧凑半透明和名称显示)、[动作更新策略集中管理](/v2/features/action-sharing#安装和检查更新)与 [Illustrator 2023 支持](/v2/features/software-connections/software/illustrator)。多设备或可能回退时，先阅读 [规则父场景与面板自由布局注意](/important-notice#2212-规则父场景与-2213-面板自由布局)。

2.2.14 补充了 [自由格子触发键](/v2/features/action-panel/usage#触发键)、[用动作控制悬浮分组](/v2/features/floating-actions#用动作控制悬浮分组)、[轮盘继承动作预览](/v2/features/triggers/circle-menu#按场景覆盖与来源切换)、[表单扩展选项与 `$=` 校验](/v2/xaction/modules/form) 与 [截图文件名模板 `{date:格式}`](/v2/features/screenshot/capture-pro#截图-pro-设置页)，并顺带提到面板分组导航与确认/复制按钮等交互调整。回退注意见 [截图文件名模板与悬浮分组动作](/important-notice#2214-截图文件名模板与悬浮分组动作)。

2.2.15 补充了 [分组圆点颜色与上方居中](/v2/features/action-panel/usage#创建和管理分组)、[减少面板弹出闪烁（软隐藏）](/v2/features/action-panel/usage#减少面板弹出闪烁)、[截图 Pro 反引号切换原始鼠标指针](/v2/features/screenshot/capture-pro#快捷键一览)、[HTML 贴图换行与屏幕内定位](/v2/features/screenshot/capture-pro#贴图窗口截图后)，以及 [仅有一个匹配在线连接时软件控制步骤不再强制从目标窗口触发](/v2/features/software-connections/command-tool#动作怎样选择目标)；并修了自由格子跨分组拖放落点、截图光标闪烁与快捷键提示样式、表单单选列表与字段标题对齐。

2.2.16 补充了 [悬浮分组受控合并与中间拆分](/v2/features/floating-actions#移动和整理)、[搜索引擎 JSON 批量导入导出](/v2/features/tools#自定义搜索引擎的导入导出)，以及 [截图 Pro 自定义工具栏可视化编排](/v2/features/screenshot/capture-pro#标注)（拖动排序、添加子程序或动作、图标大小）；并修了网络路径图标探测卡顿、表单多行高度、提示消息悬停消失、录屏结束与缩略图等。

2.2.17 补充了 [贴图鼠标穿透与独立工具条](/v2/features/screenshot/capture-pro#贴图窗口截图后)、[录屏预览焦点与播放速度](/v2/features/screenshot/capture-pro#结束方式)、[本机 ffmpeg 实时录屏](/v2/features/screenshot/capture-pro#截图-pro-设置页)、[提示消息保持 1 秒](/v2/xaction/modules/notify)、[Everything 通信接口替代服务](/v2/xaction/modules/everythingsearch)、[浏览器父场景归属纳入父场景管理与同步](/v2/features/scenes#作为浏览器程序与父场景归属)、[动作日志并入运行记录窗口](/v2/features/tools#动作运行与触发记录)，以及 [Mastercam 第三方 FT 命令筛选](/v2/features/software-connections/software/mastercam)；截图 Pro 步骤可在框选后直接走截图 / 复制 / 贴图 / 保存 / 识别等出口（参数页待 `data/xaction` 同步后再补，详见[官网版本记录](https://getquicker.net/V2/Versions)）。选择窗口会跳过鼠标穿透覆盖层；并修了 Windows 应用拖放启动参数、显示菜单子程序生命周期等。

2.2.18 补充了 [远程文件（WebDAV）步骤能力与本机账号限制](/v2/xaction)、[远程文件账号入口和 HTTP / WebSocket 设置迁移](/v2/features/software-connections)、[主面板自由格子边缘插队、工具菜单和未配置程序提示](/v2/features/action-panel/usage)、[软件桥接命令工具生成动作拖放与 Photoshop 分类筛选](/v2/features/software-connections/command-tool)、[触发规则粘贴到选中项之后及批量删除](/v2/features/triggers/advanced-mouse-triggers#规则列表筛选)、[AI 助手正式版工作区选择、历史对话目录恢复和导出后打开文件夹](/v2/features/ai-and-agent)，以及 [贴图穿透模式下通过工具栏拖动和定位修正](/v2/features/screenshot/capture-pro#贴图窗口截图后)。回退和跨设备注意见 [2.2.18 远程文件账号与 AI 助手工作区](/important-notice#2218-远程文件账号与-ai-助手工作区)；新版网络子程序搜索 / 更新检查、焦点切换瞬间窗口信息获取、贴图工具栏空格和右键遮挡等修复以官网完整记录为准。

升级到 2.1.23 或更高版本时仍需特别检查：**后台屏幕录制**步骤的默认录制范围改为“主屏幕”。已明确保存录制范围的动作不受影响；其它旧动作升级后请打开动作确认录制范围，避免原本依赖旧默认值的动作录到不符合预期的屏幕区域。

体验、降级和回退风险见 [体验前必读](/important-notice)。
