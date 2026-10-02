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
