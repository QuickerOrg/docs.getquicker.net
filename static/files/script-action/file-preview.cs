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
