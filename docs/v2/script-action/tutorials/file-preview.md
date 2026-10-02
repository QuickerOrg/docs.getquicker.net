---
title: "预览后创建清理文本"
description: "先展示输入输出路径和字符数，确认后创建新文件。"
quickerDocKey: v2/script-action/tutorials/file-preview
comments: false
sidebar_position: 5
---

先展示输入输出路径和字符数，确认后创建新文件。

## 准备

准备一个 UTF-8 .txt 测试文件；需要读写文件能力。输出为原路径后追加 .cleaned.txt。

## 完整源码

```csharp
string Main()
{
    var path = qk.Ui.PickFile(filter: "文本文件|*.txt");
    if (path == null) return "已取消";
    var text = qk.Files.ReadText(path);
    var result = text.Trim();
    var output = path + ".cleaned.txt";
    var preview = "将读取：" + path + "\n将创建：" + output
        + "\n原字符数：" + text.Length + "\n新字符数：" + result.Length;
    if (!qk.Ui.Confirm(preview)) return "已取消，未写入";
    qk.Files.WriteText(output, result);
    return output;
}
```

[下载源码](/files/script-action/file-preview.cs)

## 运行与预期结果

选择文件，确认预览后生成新文件；原文件不变。结果页显示输出路径。再次运行同一路径默认因目标已存在而失败。

## 取消与失败

取消文件选择或点击否都不写入。确认后的写入可能已生效，停止不回滚文件。

路径权限、编码、文件大小与目标已存在均可能失败。不要直接对重要文件批量运行；明确处理单个文件后再扩展循环。

## 相关 API

[Files](../api/files.md)、[Ui](../api/ui.md)、[限额](../limits.md)
