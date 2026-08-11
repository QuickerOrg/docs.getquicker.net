---
title: 读取文件模块
description: Quicker 2.x 读取文件模块改进自动编码识别，兼顾 BOM、UTF-8 与 Windows ANSI 文本。
sidebar_position: 150
quickerDocKey: v2/what's-new/xaction-steps/read-file
comments: true
---

# 读取文件模块

2.x 改进了读取文本文件时的“自动”编码识别。新版会先检查 UTF 的 BOM，再验证无 BOM UTF-8；如果不是可靠的 UTF-8，则尝试识别常见 ANSI 代码页，结果不够可信时回退到当前 Windows 的系统 ANSI 编码。

相比把所有无 BOM 文件都按一种编码打开，这种方式更适合同时处理现代 UTF-8 文件和历史中文文本，也减少把 ANSI 文件误读成乱码的情况。

自动检测基于文件开头的有限样本，不能保证识别所有混合编码或损坏文件。已知来源的文件仍建议显式选择编码。

参数说明见[读取文件](/v2/xaction/modules/readfile)。
