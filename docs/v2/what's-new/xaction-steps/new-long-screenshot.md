---
title: 新增：长截图模块
description: Quicker 2.x 新增长截图模块，可选择滚动区域并输出拼接后的长图。
sidebar_position: 40
quickerDocKey: v2/what's-new/xaction-steps/new-long-screenshot
comments: true
---

# 新增：长截图模块

2.x 新增“长截图”组合动作模块。运行后先选择需要滚动截取的区域，再进入长截图流程，将连续滚动的内容拼接为一张图片。

模块可以把结果写入剪贴板，并输出长图对象、起始选区和成功状态，便于继续保存、识别或处理。新版还改进了长截图结束后的结果处理，复制结果时不会再意外触发贴图。

长截图依赖页面能够稳定滚动和正确重绘。包含固定悬浮层、动画或大量异步加载内容的页面，仍可能需要放慢滚动速度或分段截取。

参数说明见[长截图](/v2/xaction/modules/long-screenshot)。
