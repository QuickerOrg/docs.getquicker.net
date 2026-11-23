---
title: 基础OCR模块
description: Quicker 2.x 的本地文字引擎、模型档位，以及 2.3.36 起在线表格识别的联网与会员要求。
sidebar_position: 130
quickerDocKey: v2/what's-new/xaction-steps/basic-ocr
comments: true
---

# 基础OCR模块

2.x 的“基础OCR”增加了独立的本地 OCR 引擎，不再只依赖在线接口或 Windows 内置识别。首次使用某个模型时可以按需下载，并可在“标准”和“快速”档之间选择：标准模型优先准确率，快速模型优先速度和体积。

普通 OCR 仍保留 Quicker 在线服务、Windows OCR 和自定义百度接口等方式。旧动作在 Quicker 文字 OCR 中选择仅离线时，会映射到本地文字引擎；这不代表表格也能离线运行。

**2.3.36 起，表格识别使用本地 small 识字＋在线表格处理，需要有效会员、联网及事先上传同意，首版仅支持 x64。** 原图与识字结果会上传；组合动作和脚本同样适用，不再支持“仅使用离线引擎”。2.3.35 及更早客户端的本地表格流程属于旧实现，不能沿用其离线或额度说明。具体操作、长表恢复、列宽和 Excel 导出见[在线表格识别](/v2/features/screenshot/ocr#hybrid-table-2336)。

普通本地文字识别避免上传图片，但会占用额外磁盘、内存和计算资源。表格混合服务会上传图片，使用前应确认内容适合上传。对复杂版面或特殊语言，按接口实际支持范围选择其它引擎。

参数说明见[基础OCR](/v2/xaction/modules/basic-ocr)。
