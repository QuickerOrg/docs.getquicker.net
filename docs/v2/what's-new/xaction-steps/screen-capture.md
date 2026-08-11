---
title: 屏幕截图模块
description: Quicker 2.x 屏幕截图模块增加 UI 元素检测、截图历史，并接入新版截图后的 OCR 与翻译工具。
sidebar_position: 120
quickerDocKey: v2/what's-new/xaction-steps/screen-capture
comments: true
---

# 屏幕截图模块

2.x 保留了 1.x 的选区、全屏、固定区域和窗口截图方式，并改进了交互式选区。

选择区域时可以启用“UI 元素检测”：悬停会吸附到控件范围，滚轮可切换父级或子级控件；关闭时仍只检测窗口范围。模块还可以选择是否把结果加入本机截图历史，默认关闭，避免后台或循环动作持续保存敏感画面。

新版截图界面还整合了本地 OCR、表格识别和文本翻译等后续工具。原有图片和截图区域输出保持不变，旧动作无需为了这些能力重新创建。

参数说明见[屏幕截图](/v2/xaction/modules/screencapture)。
