---
title: 基础OCR模块
description: Quicker 2.x 基础 OCR 模块增加独立本地引擎、模型档位和本地表格识别。
sidebar_position: 130
quickerDocKey: v2/what's-new/xaction-steps/basic-ocr
comments: true
---

# 基础OCR模块

2.x 的“基础OCR”增加了独立的本地 OCR 引擎，不再只依赖在线接口或 Windows 内置识别。首次使用某个模型时可以按需下载，并可在“标准”和“快速”档之间选择：标准模型优先准确率，快速模型优先速度和体积。

表格识别也改为在本地完成，可以返回适合继续处理的原始结果。普通 OCR 仍保留 Quicker 在线服务、Windows OCR 和自定义百度接口等方式，旧动作中的离线选项会映射到新的本地引擎。

本地识别避免上传图片，但会占用额外磁盘、内存和计算资源。对复杂版面或特殊语言，仍可根据结果切换其它引擎。

参数说明见[基础OCR](/v2/xaction/modules/basic-ocr)。
