---
title: "qk.Files：文件"
description: "qk.Files：文件的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/files
comments: false
sidebar_position: 10
---

{/* script-api:start */}

本机文件与文件夹（读写、复制、压缩、搜索）以及资源管理器当前文件夹；用关联程序打开文件见 qk.Process.Open。文本默认严格 UTF-8（BOM 优先）；ReadBytes/ReadText/WriteBytes/WriteText/AppendText 单次最多 16 MiB（Copy/Move/Zip/Unzip/Hash 不受此限）；覆盖/递归默认关闭；删除不进回收站；临时文件建议放在 GetRunTempDirectory()。WriteText/AppendText 从不写 BOM（"utf-8-bom" 不是编码名）；给 Excel 打开的 UTF-8 CSV 请写 "\uFEFF" + 文本（或先用 WriteBytes 写 EF BB BF）；AppendText 在文件不存在时创建。常见错误码：FILE_NOT_FOUND、ACCESS_DENIED、FILE_FAILED（目标已存在、被占用等）、LIMIT_EXCEEDED。

<a id="files-getfullpath" />

## Files.GetFullPath

```csharp
string GetFullPath(string path)
```

将路径规范化为绝对路径（相对路径基于 Quicker 当前目录）。

| 参数声明 | 说明 |
|---|---|
| `string path` | 见本成员和所在域的说明。 |

返回类型：`string`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：读取文件。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="files-getruntempdirectory" />

## Files.GetRunTempDirectory

```csharp
string GetRunTempDirectory()
```

本次根运行专属的临时文件夹（完整路径，不以 \ 结尾），首次调用时创建；qk.Actions.Call 调用的子脚本得到同一个文件夹。运行结束（正常、异常、停止、超时）后由 Quicker 递归删除，脚本不必在 finally 里删除（停止后 finally 也不能调用 Files.Delete）。本方法不需确认；在其中读写文件仍按文件读写能力确认。

返回类型：`string`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：无基础能力授权要求。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="files-exists" />

## Files.Exists

```csharp
bool Exists(string path)
```

文件或文件夹存在时都返回 true（区分用 Info(path)?.IsDirectory）。

| 参数声明 | 说明 |
|---|---|
| `string path` | 见本成员和所在域的说明。 |

返回类型：`bool`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：读取文件。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="files-info" />

## Files.Info

```csharp
PathInfo? Info(string path)
```

文件或目录的基本信息；不存在返回 null。

| 参数声明 | 说明 |
|---|---|
| `string path` | 见本成员和所在域的说明。 |

返回类型：`PathInfo?`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：读取文件。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="files-readbytes" />

## Files.ReadBytes

```csharp
byte[] ReadBytes(string path)
```

读取文件字节；单次最多 16 MiB。

| 参数声明 | 说明 |
|---|---|
| `string path` | 见本成员和所在域的说明。 |

返回类型：`byte[]`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：读取文件。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="files-readtext" />

## Files.ReadText

```csharp
string ReadText(string path, string encoding = "utf-8")
```

读取文本文件；单次最多 16 MiB。

| 参数声明 | 说明 |
|---|---|
| `string path` | 文件路径（相对路径基于 Quicker 当前目录）。 |
| `string encoding = "utf-8"` | 编码名称（如 gbk），默认严格 UTF-8；文件 BOM 优先。 |

返回类型：`string`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：读取文件。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="files-writebytes" />

## Files.WriteBytes

```csharp
void WriteBytes(string path, byte[] bytes, bool overwrite = false)
```

写入文件字节；单次最多 16 MiB。

| 参数声明 | 说明 |
|---|---|
| `string path` | 见本成员和所在域的说明。 |
| `byte[] bytes` | 见本成员和所在域的说明。 |
| `bool overwrite = false` | 覆盖已有文件（默认不覆盖，已存在则报错）。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：修改文件。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="files-writetext" />

## Files.WriteText

```csharp
void WriteText(string path, string text, bool overwrite = false, string encoding = "utf-8")
```

写入文本文件；单次最多 16 MiB。

| 参数声明 | 说明 |
|---|---|
| `string path` | 见本成员和所在域的说明。 |
| `string text` | 见本成员和所在域的说明。 |
| `bool overwrite = false` | 覆盖已有文件（默认不覆盖，已存在则报错）。 |
| `string encoding = "utf-8"` | 编码名称，默认 UTF-8（无 BOM；任何编码都不写 BOM，需要 BOM 时在文本前加 "\uFEFF"）。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：修改文件。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="files-appendtext" />

## Files.AppendText

```csharp
void AppendText(string path, string text, string encoding = "utf-8")
```

追加文本（文件不存在时创建，不写 BOM）；单次最多 16 MiB。

| 参数声明 | 说明 |
|---|---|
| `string path` | 见本成员和所在域的说明。 |
| `string text` | 见本成员和所在域的说明。 |
| `string encoding = "utf-8"` | 见本成员和所在域的说明。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：修改文件。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="files-listfiles" />

## Files.ListFiles

```csharp
string[] ListFiles(string directory, string pattern = "*", bool recursive = false)
```

列出目录中的文件（完整路径）；最多 10000 项，不遍历链接。

| 参数声明 | 说明 |
|---|---|
| `string directory` | 见本成员和所在域的说明。 |
| `string pattern = "*"` | 通配符，如 "*.txt"。 |
| `bool recursive = false` | 包含子目录。 |

返回类型：`string[]`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：读取文件。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="files-listdirectories" />

## Files.ListDirectories

```csharp
string[] ListDirectories(string directory, string pattern = "*", bool recursive = false)
```

列出目录中的子目录（完整路径）；最多 10000 项，不遍历链接。

| 参数声明 | 说明 |
|---|---|
| `string directory` | 见本成员和所在域的说明。 |
| `string pattern = "*"` | 见本成员和所在域的说明。 |
| `bool recursive = false` | 见本成员和所在域的说明。 |

返回类型：`string[]`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：读取文件。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="files-createdirectory" />

## Files.CreateDirectory

```csharp
string CreateDirectory(string path)
```

创建目录（含上级）并返回绝对路径；已存在时直接返回（幂等）。

| 参数声明 | 说明 |
|---|---|
| `string path` | 见本成员和所在域的说明。 |

返回类型：`string`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：修改文件。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="files-copy" />

## Files.Copy

```csharp
void Copy(string source, string destination, bool overwrite = false)
```

复制文件；不受 16 MiB 限制（该限制只针对 Read*/Write*）。目标所在文件夹必须已存在（先 qk.Files.CreateDirectory(Path.GetDirectoryName(dest))）；目标已存在且 overwrite 为 false 时报 FILE_FAILED。

| 参数声明 | 说明 |
|---|---|
| `string source` | 见本成员和所在域的说明。 |
| `string destination` | 见本成员和所在域的说明。 |
| `bool overwrite = false` | 覆盖目标文件（默认不覆盖）。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：修改文件。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="files-move" />

## Files.Move

```csharp
void Move(string source, string destination, bool overwrite = false)
```

移动或重命名文件/目录（目录不支持覆盖）；仅大小写不同的改名取决于文件系统（NTFS 可用，部分虚拟盘静默不生效）。不受 16 MiB 限制；目标所在文件夹必须已存在。

| 参数声明 | 说明 |
|---|---|
| `string source` | 见本成员和所在域的说明。 |
| `string destination` | 见本成员和所在域的说明。 |
| `bool overwrite = false` | 覆盖目标文件（默认不覆盖）。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：修改文件。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="files-delete" />

## Files.Delete

```csharp
void Delete(string path, bool recursive = false, bool recycle = false)
```

删除文件或目录（默认不经过回收站；recycle: true 移到回收站）；路径不存在时什么也不做；停止后的 finally 中不可调用。

| 参数声明 | 说明 |
|---|---|
| `string path` | 见本成员和所在域的说明。 |
| `bool recursive = false` | 递归删除非空目录（默认关闭）。 |
| `bool recycle = false` | true：移到回收站（目录连同内容；不能进回收站——网络位置、回收站已关闭或超过容量——时报 FILE_FAILED 且不删除，不会静默彻底删除）；false（默认）：直接删除。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：修改文件。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="files-zip" />

## Files.Zip

```csharp
void Zip(string source, string zipPath, bool overwrite = false)
```

把文件或文件夹（只含其内容，不含外层文件夹名；保留空子文件夹；UTF-8 文件名）压缩为 zip；zipPath 所在文件夹须已存在且不能在源文件夹内；source 末尾的 \ 忽略；单个文件在 zip 中只用文件名（磁盘根下的文件也是）；先写临时文件，失败或停止不留下半个 zip。

| 参数声明 | 说明 |
|---|---|
| `string source` | 见本成员和所在域的说明。 |
| `string zipPath` | 见本成员和所在域的说明。 |
| `bool overwrite = false` | zipPath 已存在时是否覆盖（否则 FILE_FAILED）。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：修改文件。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="files-unzip" />

## Files.Unzip

```csharp
void Unzip(string zipPath, string directory, bool overwrite = false)
```

解压 zip 到目录（不存在则创建；不能是磁盘根目录）。先整体检查再写出：条目路径越出目录（../、绝对路径、盘符）、含 . 或 .. 层级、以点或空格结尾、Windows 设备名（CON、NUL、COM1 等）或冒号、zip 内文件与文件夹同名、不支持的压缩方式、加密或损坏的 zip 报 ZIP_FAILED 且不写任何文件；超过 10000 个条目或解压后超过 1 GiB 报 LIMIT_EXCEEDED。写出中途失败（停止、实际解压超过 1 GiB、磁盘错误）时删除本次新建的全部文件与文件夹。文件名按 UTF-8，旧中文 zip 按 GBK（系统代码页）。还原文件修改时间（文件夹时间不还原）。

| 参数声明 | 说明 |
|---|---|
| `string zipPath` | 见本成员和所在域的说明。 |
| `string directory` | 见本成员和所在域的说明。 |
| `bool overwrite = false` | 目标文件已存在时是否覆盖；false 时只要有一个已存在就报 FILE_FAILED，且不写任何文件；true 时中途失败无法恢复已被替换的旧文件。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：修改文件。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="files-getknownfolder" />

## Files.GetKnownFolder

```csharp
string GetKnownFolder(string name)
```

已知文件夹的完整路径（不以 \ 结尾）；本机没有该文件夹报 FILE_NOT_FOUND。

| 参数声明 | 说明 |
|---|---|
| `string name` | 不区分大小写：desktop&#124;documents&#124;downloads&#124;pictures&#124;music&#124;videos&#124;appData（Roaming）&#124;localAppData&#124;programData&#124;userProfile&#124;temp&#124;startup&#124;startMenu&#124;programs&#124;sendTo&#124;recent&#124;templates&#124;favorites&#124;fonts&#124;programFiles&#124;programFilesX86&#124;windows&#124;system&#124;commonDesktop&#124;commonStartup&#124;commonStartMenu，或 .NET Environment.SpecialFolder 名称的 camelCase（如 commonDocuments）；未知名称报 INVALID_ARGUMENT。 取值：`desktop`、`documents`、`pictures`、`music`、`videos`、`appData`、`localAppData`、`programData`、`userProfile`、`startup`、`downloads`、`temp`。也接受其他值，详见成员说明。 |

返回类型：`string`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：读取文件。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="files-reveal" />

## Files.Reveal

```csharp
void Reveal(params string[] paths)
```

在资源管理器中打开所在文件夹并选中（1–100 个路径；须存在，否则 FILE_NOT_FOUND；多个时须在同一文件夹，否则 INVALID_ARGUMENT；不等待窗口出现）。用户配置了其他文件管理器时只定位第一个。路径末尾的 \ 忽略。每次运行最多 20 次（LIMIT_EXCEEDED）。

| 参数声明 | 说明 |
|---|---|
| `params string[] paths` | 见本成员和所在域的说明。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：读取文件。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="files-getexplorerpath" />

## Files.GetExplorerPath

```csharp
string? GetExplorerPath()
```

当前资源管理器窗口的文件夹（桌面返回桌面路径）；不在资源管理器中返回 null。

返回类型：`string?`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：读取资源管理器路径。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="files-setexplorerpath" />

## Files.SetExplorerPath

```csharp
void SetExplorerPath(string directory, Win? window = null)
```

让资源管理器窗口的活动标签页转到指定文件夹（文件夹须存在，否则 FILE_NOT_FOUND）。window 为 null 时作用于前台窗口；也可传入 Win（如 qk.Window.Find(className: "CabinetWClass")、qk.Context.ActiveWindow）。目标不是资源管理器（桌面、其他程序）时报 EXPLORER_NOT_FOUND，此时可用 qk.Process.Open(directory) 新开窗口。在打开/另存为对话框中切换路径见 qk.Uia.SetDialogPath。

| 参数声明 | 说明 |
|---|---|
| `string directory` | 见本成员和所在域的说明。 |
| `Win? window = null` | 目标资源管理器窗口；null 为前台窗口。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：激活窗口；读取资源管理器路径。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="files-search" />

## Files.Search

```csharp
string[] Search(string query, int limit = 100, bool regex = false, string? sort = null, bool descending = false)
```

用 Everything 搜索文件和文件夹并返回完整路径（Everything 须正在运行，否则 EVERYTHING_UNAVAILABLE；其他失败 EVERYTHING_FAILED）。排除 Office 临时文件（~$ 开头）最稳的做法是在 C# 中二次过滤：.Where(p => !Path.GetFileName(p).StartsWith("~$"))。

| 参数声明 | 说明 |
|---|---|
| `string query` | Everything 搜索语法：空格为“且”、&#124; 为“或”、! 为“非”、"整句"、通配符 * ?、ext:pdf;docx、size:>10mb、dm:today（今天修改）、parent:C:\x（直接子项）、路径前缀 "D:\Work\ "。 |
| `int limit = 100` | 最多返回数 1–10000。 |
| `bool regex = false` | query 按正则解释。 |
| `string? sort = null` | name&#124;path&#124;size&#124;extension&#124;created&#124;modified；null 为按名称。 取值：`name`、`path`、`size`、`extension`、`created`、`modified`。 |
| `bool descending = false` | true 为降序（如 sort: "modified", descending: true 为最新在前）。 |

返回类型：`string[]`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：读取文件。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="files-hash" />

## Files.Hash

```csharp
string Hash(string path, string algorithm = "sha256", string output = "hex")
```

文件内容的哈希（流式计算，不受 16 MiB 限制，最大 16 GiB，超出 LIMIT_EXCEEDED；可被停止打断）；结果与 qk.Text.Hash(qk.Files.ReadBytes(path)) 相同。文件不存在或是文件夹报 FILE_NOT_FOUND。

| 参数声明 | 说明 |
|---|---|
| `string path` | 见本成员和所在域的说明。 |
| `string algorithm = "sha256"` | md5&#124;sha1&#124;sha256&#124;sha384&#124;sha512（不区分大小写）。 取值：`md5`、`sha1`、`sha256`、`sha384`、`sha512`。 |
| `string output = "hex"` | hex（小写）&#124;base64。 取值：`hex`、`base64`。 |

返回类型：`string`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：读取文件。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

{/* script-api:end */}
