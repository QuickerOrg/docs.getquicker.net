---
title: 组合动作模块新增与改进
description: Quicker 2.x 相比 1.x 新增和改进的组合动作模块。
sidebar_position: 1
quickerDocKey: v2/what's-new/xaction-steps/index
comments: true
---

# 组合动作模块新增与改进

Quicker 2.x 在保持已有组合动作兼容的基础上，增加了一批面向截图、录屏、文件处理和设备联动的新模块，也扩展了部分常用模块的参数、输出和运行行为。

这里仅收录当前可以在 2.x 组合动作编辑器中使用，并且相对 1.x 有明确功能变化的模块。只更换为新版运行器、用户可见功能没有变化的模块不重复列出。

## 新增模块

- [新增：发送手机通知模块](./new-mobile-notification.md)：向已授权的 Android 设备发送通知，并接收按钮或文字回复。
- [新增：PDF 文件处理模块](./new-pdf.md)：创建、合并、拆分和调整 PDF，并处理文档信息、安全和内容叠加。
- [新增：截图 Pro 模块](./new-screen-capture-pro.md)：使用控件跟踪、渐进式选区、标注、贴图和保存结果。
- [新增：长截图模块](./new-long-screenshot.md)：选择滚动区域并输出拼接后的长图。
- [新增：屏幕录制模块](./new-screen-recording-ui.md)：框选区域，通过录屏工具栏交互式完成录制。
- [新增：后台屏幕录制模块](./new-background-screen-recording.md)：通过会话 ID 自动开始、查询和停止录制。
- [新增：运行C#文件应用模块](./new-csharp-file-app.md)：使用 .NET SDK 编译运行支持现代 SDK 功能的单文件应用。
- [新增：自动化脚本模块](/v2/xaction/modules/automationscript)：使用受限 JavaScript 编排鼠标、键盘、剪贴板和识别定位等桌面自动化操作；2.1.29 起可面向窗口和区域执行 OCR、找图、找色与目标相对点击，窗口移动后仍按最新位置执行。

[官网 2.1.21 记录](https://getquicker.net/V2/Versions)中还新增了 **贴图** 步骤，可从图片变量、剪贴板、文本、HTML、公式和 OCR 原始结果创建贴图。[官网 2.1.23 记录](https://getquicker.net/V2/Versions)补充了「自动」和「截图原位置」贴图位置，Quicker 或 PixPin 复制的图片可贴回原处，旧动作仍保持原有自定义坐标。当前 `data/xaction` 暂无该步骤的独立模块定义，因此本站先在[截图与贴图概览](/v2/features/screenshot)中说明能力，参数页待结构化数据同步后再补。

## 改进模块

- [提示消息模块](./notify.md)：增加显示位置、持续时间、重复消息处理和交互按钮。
- [浏览器控制模块](/v2/xaction/modules/chromecontrol)：2.1.27 配合 Quicker Connector 1.2.0，可通过侧边栏生成列表提取、连续翻页和表单填写模板；文件上传 / 拖放使用专用文件操作，参数以当前编辑器为准。
- [屏幕截图模块](./screen-capture.md)：增加 UI 元素检测、截图历史，并接入新版截图后工具。
- [获取窗口信息/查找窗口模块](/v2/xaction/modules/getwindowtitle)：2.1.27 起，“选择一个窗口”可正确命中部分透明顶层弹窗。
- [窗口操作模块](/v2/xaction/modules/windowoperations)：2.2.0 起新增任意窗口贴边自动隐藏，以及切换、关闭、最小化、恢复类似窗口；模块页列出了当前参数、输出和限制。
- [窗口界面控制(FlaUI)](/v2/xaction/modules/flauiautomation)：2.1.28 起可提取窗口界面信息、观察可交互元素，并批量返回控件树、定位信息和坐标范围。
- [屏幕录制模块](./new-screen-recording-ui.md) / [后台屏幕录制模块](./new-background-screen-recording.md)：2.1.23 起可选择保存文件夹；自定义目录中的成品只建立历史索引，不再额外复制一份。
- [屏幕找图/找色/找字模块](/v2/xaction/modules/searchbmp)：找图新增相似度匹配模式；2.1.25 起查找范围还支持指定窗口和指定图片，适合在被遮挡窗口或本地图片中定位目标。2.1.26 起，指定图片可使用图片路径或图片变量；指定窗口可选择返回窗口相对坐标。2.1.25 里已经配过指定图片的动作，升级后需要重新打开步骤编辑一次。
- [基础OCR模块](./basic-ocr.md)：增加独立本地引擎、模型档位和本地表格识别。
- [下载文件模块](/v2/xaction/modules/download) / [HTTP请求模块](/v2/xaction/modules/http)：2.1.27 恢复旧版重定向兼容规则，并避免大文件跳转时的额外缓冲。
- [图片处理模块](./image-process.md)：为缩放和图标生成增加多种采样算法。
- [读取文件模块](./read-file.md)：改进 BOM、UTF-8 和 Windows ANSI 自动编码识别。
- [运行C#代码模块](./csharp-script.md)：更新编译和补全能力，支持纯脚本及异步返回值。
- [自定义窗口模块](./custom-window.md)：改进脚本缓存、动作状态访问和异步窗口生命周期。
- [Quicker操作模块](./quicker-operation.md)：增加显示选中文本工具条等 2.x 界面操作。
- [运行子程序模块](./subprogram.md)：改进调用会话、取消传播和结构化调试关联；2.1.28 起，调试结果支持定位共享子程序步骤。
- [步骤组模块](./group.md)：增加 WaitAny 完成后自动取消其它分支的选项。
- [“每个”模块](./each.md)：改进并行循环的 WaitAny、取消和调试信息。
- [等待按键模块](./wait-keyboard.md)：动作停止或并行分支取消时可以及时退出等待；2.1.27 起，“忽略模拟的按键”也适用于鼠标按键。
- [屏幕取色/颜色转换与计算模块](/v2/xaction/modules/color)：2.1.27 修复允许空颜色时无法通过 RGB 滑块或增减按钮生成颜色的问题。
- [云状态存取模块](./cloud-state.md)：读取云状态时可以同时取得本机时间和 UTC 最后更新时间。
- [播放声音模块](./play-sound.md)：增加适合轻量反馈的内置弱提醒音效。

{/*
研究依据（不在页面渲染）：
- 新增模块注册：QuickerPc/Quicker/Actions/XActions/StepRunners/StepRunnerService.cs；1.x 对照：D:/Work_Ref/Quicker_Dev/QuickerPc/Quicker/Actions/XActions/StepRunners/StepRunnerRegistry.cs。
- 新增模块：CaptureProStepV2（86ef5dccc7）、LongScreenshotStepV2（a29aaabf8d）、ScreenRecordingUIStepV2/ScreenRecordingStepV2（f49c0da40a、494e3afd14）、PdfStepV2（f8711f039b）、RunCSharpFileAppStepV2（5f5b9c07f2）、MobileNotificationStepV2（028e2ce95e）。
- 改进模块：NotifyStepV2（48ce037411）、CaptureStepV2（c5b6c4140c、9b2f150fd3）、OcrStepV2（24df43df3f、07dac6815b）、ImageProcessStepV2（d5cd683996）、ReadFileStepV2（3e426045a8）、RunCsScriptStepV2（4e23676288、a6fe695c84）、CustomWindowContext（aa9198fe1d、6669ff5927）、QuickerOperationStepV2（2f5e7a099f）、SubProgramStepV2（0120410e58）、GroupStepRunnerV2/EachStepV2（f5b4ed9833）、WaitKeyboardStepV2（dd2b3c96ea）、CloudDataStepV2（4944394b87）、PlaySoundStepV2（a0a08528b9）。
- 排除项：EvalExpressionStepV2、PinImageStepV2、GetActionInfoStepV2 等虽有代码，但当前未在 StepRunnerService 中注册，未按可用新增模块写入。
*/}
