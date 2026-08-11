---
title: 新增：屏幕录制模块
description: Quicker 2.x 新增交互式屏幕录制模块，可框选区域、使用录屏工具栏并返回录制结果。
sidebar_position: 50
quickerDocKey: v2/what's-new/xaction-steps/new-screen-recording-ui
comments: true
---

# 新增：屏幕录制模块

“屏幕录制”是 2.x 新增的交互式录屏步骤。运行后会显示选区界面，让用户框选录制范围，再通过录屏工具栏开始、暂停和结束录制。

录制结束后，模块会等待用户完成预览或导出，并返回视频文件路径、录制时长和实际区域。它适合需要在动作运行时由用户临时决定范围的流程。

如果动作需要无人值守地启动和停止录制，或由多个步骤共同控制同一次录制，请改用“后台屏幕录制”模块。

参数说明见[屏幕录制](/v2/xaction/modules/screen-recording-ui)。
