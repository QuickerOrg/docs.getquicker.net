---
title: "qk.Browser：浏览器"
description: "qk.Browser：浏览器的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/browser
comments: false
sidebar_position: 10
---

{/* script-api:start */}

浏览器中的网页（标签页、元素、表单、页面脚本），经 Quicker 浏览器扩展读取和操作；单纯请求网址或下载见 qk.Http。Chrome/Edge 等需安装并连接扩展（Open 不经扩展）。目标浏览器为前台/最近使用的已连接浏览器，本次运行内不变；tabId 为 null 表示其当前标签页。错误码：BROWSER_UNAVAILABLE（没有已连接的扩展）、BROWSER_FAILED（扩展返回错误、找不到元素、标签页已关闭）、BROWSER_TIMEOUT（扩展无响应）。

<a id="browser-open" />

## Browser.Open

```csharp
void Open(string url, string browser = "default")
```

用浏览器打开网址（启动程序，不经扩展，需要启动程序能力）；启动失败报 PROCESS_FAILED。

| 参数声明 | 说明 |
|---|---|
| `string url` | http/https/file 网址或本机路径；无协议时补 https://（IP 与 localhost 补 http://）；javascript:、data:、chrome: 等其他协议与 UNC 路径报 INVALID_ARGUMENT。本机文件只支持 .html/.htm/.xhtml/.pdf/.svg/.txt/.xml/.mht/.mhtml/.json/.png/.jpg/.jpeg/.gif/.webp/.bmp（exe 路径的浏览器除外），程序、脚本、快捷方式等报 INVALID_ARGUMENT（请用 qk.Process.Open）。 |
| `string browser = "default"` | default&#124;edge&#124;chrome&#124;current（前台浏览器）&#124;edgeApp&#124;edgeIncognito&#124;chromeApp&#124;chromeIncognito&#124;浏览器 exe 的完整路径（以普通权限启动，网址作为参数）。 取值：`default`、`edge`、`chrome`、`current`、`edgeApp`、`edgeIncognito`、`chromeApp`、`chromeIncognito`。也接受其他值，详见成员说明。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：启动程序或打开文件/网址。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="browser-geturl" />

## Browser.GetUrl

```csharp
string? GetUrl()
```

前台浏览器当前标签页的网址；前台不是浏览器或其扩展未连接时返回 null（不是错误；其他 Browser 调用仍可能作用于另一个已连接的浏览器，没有时报 BROWSER_UNAVAILABLE）；已连接但读取标签页失败报 BROWSER_FAILED。

返回类型：`string?`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：操作浏览器页面。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="browser-listtabs" />

## Browser.ListTabs

```csharp
Tab[] ListTabs()
```

目标浏览器（首次调用时选定的已连接浏览器，本次运行内不变）的全部标签页。

返回类型：`Tab[]`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：操作浏览器页面。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="browser-opentab" />

## Browser.OpenTab

```csharp
int OpenTab(string url, bool wait = true)
```

在目标浏览器新标签页打开网址并返回标签页 Id；网址规则同 Open。

| 参数声明 | 说明 |
|---|---|
| `string url` | 见本成员和所在域的说明。 |
| `bool wait = true` | 等待页面加载完成（最长 30 秒，超时报 BROWSER_TIMEOUT，标签页保持打开；等待中标签页被关闭报 BROWSER_FAILED）。 |

返回类型：`int`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：操作浏览器页面。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="browser-activatetab" />

## Browser.ActivateTab

```csharp
void ActivateTab(int tabId)
```

激活标签页。

| 参数声明 | 说明 |
|---|---|
| `int tabId` | 标签页 Id（来自 ListTabs/OpenTab）。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：操作浏览器页面。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="browser-closetab" />

## Browser.CloseTab

```csharp
void CloseTab(int tabId)
```

关闭标签页。

| 参数声明 | 说明 |
|---|---|
| `int tabId` | 标签页 Id（来自 ListTabs/OpenTab）。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：操作浏览器页面。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="browser-eval" />

## Browser.Eval

```csharp
object? Eval(string script, int? tabId = null, int frameId = 0, int timeoutMs = 30000)
```

在页面中执行 JS 并返回结果（JSON 数据：Dictionary/List/string/bool 或 null；整数为 long、小数为 decimal，用 Convert.ToInt32(x)/Convert.ToDouble(x) 转换，不要 (int)x 强转）；高风险能力。MV3 扩展需开启“允许运行用户脚本”。

| 参数声明 | 说明 |
|---|---|
| `string script` | 函数体：用 return 返回可 JSON 化的值（可 await/返回 Promise）；在隔离环境（USER_SCRIPT）运行，可访问 DOM，不能访问页面自身的全局变量。 |
| `int? tabId = null` | 标签页 Id；null 为当前标签页。 |
| `int frameId = 0` | 框架 Id，0 为顶层框架。 |
| `int timeoutMs = 30000` | 等待结果的超时毫秒（200–300000，默认 30000；扩展传输需要有限超时，不支持 0）；超时报 BROWSER_TIMEOUT（宿主只停止等待，页面脚本可能仍在运行）。 |

返回类型：`object?`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：在外部程序中执行脚本或命令（高风险）。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="browser-act" />

## Browser.Act

```csharp
void Act(string target, string action = "click", string? value = null, int? tabId = null, int timeoutMs = 10000)
```

操作页面元素；在 timeoutMs 内找不到元素报 BROWSER_FAILED，扩展无响应报 BROWSER_TIMEOUT。

| 参数声明 | 说明 |
|---|---|
| `string target` | css=… &#124; text=…（包含；text="…" 为精确）&#124; role=button[name=确定]（角色 + 可访问名称，name 必填）&#124; xpath=…；无前缀按 CSS，以 // 开头按 xpath。 |
| `string action = "click"` | click&#124;fill&#124;type&#124;paste&#124;clear&#124;select&#124;check&#124;uncheck&#124;hover&#124;scroll（滚动到可见）。 取值：`click`、`fill`、`type`、`paste`、`clear`、`select`、`check`、`uncheck`、`hover`、`scroll`。 |
| `string? value = null` | fill/type/paste/select 必填的值。select 时须与 &lt;option> 的 value 属性完全一致（区分大小写，不按显示文字匹配），否则报 BROWSER_FAILED（Select option does not exist）；要按显示文字选，先用 Eval 查出对应 value。 |
| `int? tabId = null` | 见本成员和所在域的说明。 |
| `int timeoutMs = 10000` | 等待元素的最长毫秒（200–300000）。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：操作浏览器页面。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="browser-waitfor" />

## Browser.WaitFor

```csharp
bool WaitFor(string? target = null, string? urlPattern = null, int timeoutMs = 10000, int? tabId = null)
```

等待元素出现和/或网址匹配（两者都给时须同时满足，共用 timeoutMs；页面跳转后继续等待）；满足返回 true，超时返回 false。

| 参数声明 | 说明 |
|---|---|
| `string? target = null` | CSS 选择器（xpath= 仅支持 //tag 与 //tag[@属性='值']）；text=/role= 报 INVALID_ARGUMENT，请改用 Act（会等待元素出现）。 |
| `string? urlPattern = null` | 标签页网址的 .NET 正则（宿主每 250 毫秒轮询标签页网址，跳转后仍有效）。 |
| `int timeoutMs = 10000` | 1–300000 毫秒。 |
| `int? tabId = null` | 见本成员和所在域的说明。 |

返回类型：`bool`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：操作浏览器页面。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="browser-extract" />

## Browser.Extract

```csharp
List<Dictionary<string, object?>> Extract(string template, int? tabId = null, int limit = 500, bool allowEmpty = false, int timeoutMs = 30000)
```

按列表模板提取当前页数据：每行一个字典（列 key → string，缺失为 null）。没有匹配行时 allowEmpty 为 false 报 BROWSER_FAILED（e.Detail 为 LIST_ROWS_NOT_FOUND）；网址与模板不符 BROWSER_FAILED（e.Detail 为 URL_PATTERN_MISMATCH）；模板无效 INVALID_ARGUMENT；需要新版（MV3）扩展。

| 参数声明 | 说明 |
|---|---|
| `string template` | 扩展“列表提取”生成的模板 JSON 文本。 |
| `int? tabId = null` | 见本成员和所在域的说明。 |
| `int limit = 500` | 最多行数 1–2000。 |
| `bool allowEmpty = false` | 没有匹配行时返回空列表（false 时报 BROWSER_FAILED）。 |
| `int timeoutMs = 30000` | 整个调用的超时 1000–300000 毫秒。 |

返回类型：`List<Dictionary<string, object?>>`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：操作浏览器页面。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="browser-fill" />

## Browser.Fill

```csharp
FillResult Fill(string template, IDictionary<string, object?> data, int? tabId = null, bool dryRun = false, string failOn = "required", int timeoutMs = 30000)
```

按表单模板填写页面：扩展先预检全部字段，必填失败时不写入任何字段。

| 参数声明 | 说明 |
|---|---|
| `string template` | 扩展“表单”模板 JSON 文本。 |
| `IDictionary<string, object?> data` | 字段 key → 值（文本/数字/日期；勾选类为 bool）；null 或缺失为不填；必填字段缺失报 INVALID_ARGUMENT；模板没有的 key 记入 Warnings。 |
| `int? tabId = null` | 见本成员和所在域的说明。 |
| `bool dryRun = false` | 只预检不写入。 |
| `string failOn = "required"` | required（默认：必填失败抛 BROWSER_FAILED）&#124;any（任一失败即抛）&#124;never（只返回结果）。 取值：`required`、`any`、`never`。 |
| `int timeoutMs = 30000` | 见本成员和所在域的说明。 |

返回类型：`FillResult`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：操作浏览器页面。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="browser-upload" />

## Browser.Upload

```csharp
void Upload(string target, IEnumerable<string> files, int? tabId = null, string? urlPattern = null, int timeoutMs = 30000)
```

把本机文件放入页面的文件输入框（需要读文件能力；浏览器按路径读取文件并显示调试提示条）。

| 参数声明 | 说明 |
|---|---|
| `string target` | 唯一匹配 input[type=file] 的 CSS 选择器（css= 或无前缀）。 |
| `IEnumerable<string> files` | 1–100 个已存在文件的完整路径（相对路径 INVALID_ARGUMENT，不存在 FILE_NOT_FOUND）。 |
| `int? tabId = null` | 见本成员和所在域的说明。 |
| `string? urlPattern = null` | 可选的 http(s) 网址匹配模式；给出时当前页不符即拒绝（建议给出）。 |
| `int timeoutMs = 30000` | 见本成员和所在域的说明。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：读取文件；操作浏览器页面。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

<a id="browser-command" />

## Browser.Command

```csharp
object? Command(string command, object? arguments = null, int? tabId = null, int timeoutMs = 30000)
```

【高风险】执行浏览器扩展后台命令并返回结果（与 Eval 同一能力）。拒绝（INVALID_ARGUMENT）：读写或运行本机文件的命令（上传/拖放/下载/打开下载文件/写入下载文件夹的截图与归档）、调试协议、删除浏览数据、读取或删除历史、扩展自身存储、未给 url 的 Cookie 命令、已有专门方法的 page.* 命令、租约与诊断命令。

| 参数声明 | 说明 |
|---|---|
| `string command` | 后台命令名，如 api_tabs_query、scripts_reloadTab、page.extract。 |
| `object? arguments = null` | 匿名对象、字典或 JSON 对象文本。 |
| `int? tabId = null` | page.* 命令的目标标签页；api_* 命令的 tabId 写在 arguments 中。 |
| `int timeoutMs = 30000` | 见本成员和所在域的说明。 |

返回类型：`object?`。空值、用户取消和异常行为以成员及域说明为准。

基础能力：在外部程序中执行脚本或命令（高风险）。某些参数或数据来源会追加能力，详见[安全与授权](../security.md)。

{/* script-api:end */}
