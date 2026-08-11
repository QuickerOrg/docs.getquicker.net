---
title: 图片处理模块
description: Quicker 2.x 图片处理模块为缩放和图标生成增加多种采样算法与自动选择策略。
sidebar_position: 140
quickerDocKey: v2/what's-new/xaction-steps/image-process
comments: true
---

# 图片处理模块

2.x 为图片缩放和图标生成增加了可选的“缩放采样”参数。除了原有处理方式，现在可以选择邻近采样、高质量双线性、高质量双三次、Lanczos 和区域平均，也可以让 Quicker 自动判断。

自动模式会在大比例缩小时优先使用 Lanczos，在生成图标且进行整数倍放大时使用邻近采样，其它情况使用高质量双三次。这样既能保留像素图的硬边，也能减少照片或普通图片缩放时的锯齿和模糊。

旧动作未设置该参数时继续使用兼容默认值，不需要重新保存。

参数说明见[图片处理](/v2/xaction/modules/imgprocess)。
