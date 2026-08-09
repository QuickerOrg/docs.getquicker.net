---
title: "文本的处理"
description: "文本的处理的 Quicker 2.0 使用说明。"
slug: "/v2/xaction/guides/text-process"
sidebar_position: 50
quickerDocKey: "xaction/guides/text-process"
comments: true
docStatus: "migrated-unreviewed"
legacyDocId: 1460424
legacyContentUpdatedAt: "2025-12-05T02:18:14.000Z"
---

本文简单介绍和文本获取处理相关的操作模块。



## 获取文本

-   [获取选择的文本](/v2/xaction/modules/get_selected_text)：通过向窗口发送Ctrl+C然后读取剪贴板的方式获取选择的文本。
-   [读取剪贴板文本](/v2/xaction/modules/getclipboardtext)：从剪贴板中读取文本内容。
-   [读取文件](/v2/xaction/modules/readfile)：从文本文件中读取内容。
-   [获取选择的文件列表](/v2/xaction/modules/getselectedfiles)：获取剪贴板中的文件路径列表。



## 处理文本

-   [使用插值方法组合文本](/v2/xaction/concepts/interpolation)
-   [组合成文本](/v2/xaction/modules/formatstring)：将多个变量格式化拼接为大的字符串；
-   [文本处理](/v2/xaction/modules/stringprocess)：对文本进行编码、解码等操作；
-   [替换文本](/v2/xaction/modules/strreplace)：替换文本中的指定内容；
-   [正则提取](/v2/xaction/modules/regexextract)：使用正则表达式从文本中提取内容；
-   [比较文本](/v2/xaction/modules/strcompare)：比较文本大小；
-   [拆分文本为列表](/v2/xaction/modules/splitstring)：将文本内容按换行或其他指定的字符拆分成列表。
-   [提取HTML内容](/v2/xaction/modules/htmlextract)：从HTML代码中提取内容。



## 输出文本

-   [发送文本到窗口](/v2/xaction/modules/outputtext)：将指定的文本内容通过模拟输入或复制粘贴方式发送到当前活动窗口。
-   [文本或图片写入剪贴板](/v2/xaction/modules/writeclipboard)：将文本内容写入到剪贴板。
-   [写入文本文件](/v2/xaction/modules/writetextfile)：将文本内容写入到文件中。
-   [状态存取](/v2/xaction/modules/statestorage)：将信息保存到状态中，以便下次运行动作时使用。
