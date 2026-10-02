---
title: "预览后批量创建清理文本"
description: "先预览文件映射并检查冲突，再将最多 20 个文本文件写到新目录。"
quickerDocKey: v2/script-action/tutorials/file-batch
comments: false
sidebar_position: 9
---

把一个小测试目录中的 UTF-8 文本文件去掉首尾空白，写入 `cleaned` 子目录。先预览所有输出路径，再确认执行；不覆盖原文件。

## 准备

创建一个只包含两三个 `.txt` 文件的测试目录，填写它的绝对路径。示例只处理顶层文件，不递归，最多 20 个；需要读写文件能力。

## 完整源码

```csharp
string Main([ActionParameter("测试文件夹的绝对路径")] string directory)
{
    directory = qk.Files.GetFullPath(directory);
    var files = qk.Files.ListFiles(directory, "*.txt");
    if (files.Length == 0) return "没有 txt 文件";
    if (files.Length > 20) return "示例每次最多处理 20 个文件，请使用小测试目录";

    var outputDirectory = Path.Combine(directory, "cleaned");
    var preview = new List<string>();
    foreach (var file in files)
    {
        var output = Path.Combine(outputDirectory, Path.GetFileName(file));
        if (qk.Files.Exists(output)) return "目标已存在，未写入：" + output;
        preview.Add(Path.GetFileName(file) + " → " + output);
    }
    if (!qk.Ui.Confirm("将创建以下文件，原文件不变：\n" + string.Join("\n", preview)))
        return "已取消，未写入";

    qk.Files.CreateDirectory(outputDirectory);
    foreach (var file in files)
    {
        var output = Path.Combine(outputDirectory, Path.GetFileName(file));
        qk.Files.WriteText(output, qk.Files.ReadText(file).Trim());
        qk.Log("已创建：" + output);
    }
    return "已创建 " + files.Length + " 个文件：" + outputDirectory;
}
```

[下载源码](/files/script-action/file-batch.cs)

## 运行与预期结果

检查并运行，输入目录，在确认框核对文件映射。确认后，原目录的 `a.txt`、`b.txt` 保留，`cleaned/a.txt`、`cleaned/b.txt` 为去掉首尾空白的内容，日志列出已经创建的文件。

再次执行时，若输出已存在，会在写入前返回冲突提示。确认与写入之间出现的新冲突也不会覆盖目标，因为 `WriteText` 默认 `overwrite: false`。

## 取消与失败

取消参数表单或预览确认，不创建输出目录。写入开始后，停止或某个文件读取失败会留下此前已创建的文件，不提供批次原子性或自动回滚。根据日志检查已有结果，再决定是否重试。

预览只列出路径，实际写入时才读取文本；如果期间源文件被其他程序修改，输出使用写入时读到的内容。目录权限、严格 UTF-8 解码、单文件大小和动作超时都可能导致失败。不要直接套用到重要数据；需要事务或一致性时，应另行设计快照与恢复流程。

## 相关 API

[Files](../api/files.md)、[Ui](../api/ui.md)、[运行限额](../limits.md)、[单文件预览](./file-preview.md)。
