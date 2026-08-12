---
title: "文本窗口"
description: "在独立窗口中显示或编辑较长文本，也可追加、关闭或读取已打开的窗口。"
slug: "/v2/xaction/modules/showtext"
sidebar_label: "文本窗口"
sidebar_position: 80
quickerDocKey: "xaction/module/sys:showText"
comments: true
moduleKey: "sys:showText"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 1548914
legacyContentUpdatedAt: "2025-06-04T23:29:00.000Z"
---

# 文本窗口

在独立窗口里显示或编辑较长文本。可以显示后继续跑后续步骤，也可以等用户关窗再往下走，并取回改过的文字和点过的按钮。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:showText" />

## 概述

两种常用工作方式：

- **不等待**：弹出窗口后立刻执行后续步骤。
- **等待关闭**：等窗口关掉再继续；可在工具栏加按钮，并返回用户点的按钮和改过的文字。

<ModuleParamPreview moduleKey="sys:showText" />

### 窗口使用

运行中的文本窗口带工具栏、扩展菜单、右键和查找（Ctrl+F）。下面叠层示意保留原图：

![](./img/showtext-001-e7813dac79.png)

#### 右键菜单

<ContextMenuPreview
  openPath={['高亮语法', 'C#']}
  items={[
    {label: '撤消', icon: 'fa:Light_Undo'},
    {label: '重做', icon: 'fa:Light_Redo'},
    {type: 'separator'},
    {label: '剪切'},
    {label: '复制'},
    {label: '粘贴'},
    {type: 'separator'},
    {label: '恢复初始内容'},
    {
      label: '高亮语法',
      children: [
        {label: 'XmlDoc'},
        {label: 'C#'},
        {label: 'JavaScript'},
        {label: 'HTML'},
        {label: 'CSS'},
        {label: 'PowerShell'},
      ],
    },
    {label: '置顶'},
  ]}
>
  <TextWindowPreview
    title="结果内容"
    text={'# 标题1\n## 标题2\n\n单星号 = *斜体*\n双星号 = **加粗**'}
  />
</ContextMenuPreview>

- 撤销、重做、剪切、复制、粘贴
- **恢复初始内容**：回到刚打开时的文本
- **高亮语法**：选择高亮类型
- **置顶**：置顶或取消置顶

#### 快捷键

| 快捷键 | 作用 |
| --- | --- |
| Ctrl+Z / Ctrl+Y | 撤销 / 重做 |
| Ctrl+C、Ctrl+X、Ctrl+V | 复制、剪切、粘贴 |
| Ctrl+F / Ctrl+H | 查找 / 替换 |
| Alt+↑ / Alt+↓ | 当前行上移 / 下移（v1.40.11+） |
| Ctrl+D | 重复选中内容；未选择时重复当前行（v1.40.12+） |
| Ctrl+Shift+D | 删除当前行 |

## 操作类型

<ModuleParamPreview
  moduleKey="sys:showText"
  focusKeys={['type']}
  values={{type: 'NO_WAIT'}}
/>

**操作类型**（界面里也叫等待方式）：

- **显示窗口，不等待关闭**：弹出后立刻继续。
- **显示窗口，等待关闭**：等用户关窗再继续。
- **关闭窗口**：关掉前面用「不等待」打开的文本窗口。
- **获取窗口信息**：指定窗口是否还在、当前文本等。
- **追加内容**：向已打开的窗口追加文本。
- **显示和激活窗口**：把最小化或被挡住的窗口提到前台。
- **等待窗口关闭**：等指定窗口关掉再继续（1.39.33+）。
- **获取所有文本窗口**：返回本机文本窗口词典。为安全起见，仅限自己开发的动作使用。
- **获取当前动作创建的所有文本窗口**：只返回当前动作打开的窗口。

跨步骤操作同一个窗口时，用 **文本窗口标识** 指定目标。填 `=` 表示用当前动作 ID，避免和别的动作抢同一个窗口。

## 参数说明

<ModuleParamPreview
  moduleKey="sys:showText"
  values={{
    type: 'WAIT',
    text: '',
    title: '结果内容',
    topMost: 'false',
    autoCloseKey: '=',
    winLocation: 'CenterScreen',
    winSize: '',
    fontsize: '14',
    fontfamily: '',
    bgColor: '',
    textColor: '',
    highlight: '',
    autoSaveToState: '',
    closeWhenLostFocus: 'false',
    enableEscClose: 'true',
    showLineNum: 'true',
    autoWrap: 'true',
    showBuildInToolbar: 'true',
    stopIfFail: 'true',
  }}
/>

**操作类型**：见上一节。默认「显示窗口，不等待关闭」。

**文本内容**：要显示或追加的文字。显示窗口、追加内容时使用。

**窗口标题**：窗口标题栏文字。默认「文本窗口」。仅显示窗口时使用。

**置顶显示**：是否保持在最前。默认关闭。

**工具栏操作**：在窗口工具栏显示附加按钮，每行一个。格式见下文「工具栏操作按钮」。仅显示窗口时使用。

**文本窗口标识**：可选。显示前先关掉（或更新）此前弹出的、使用同一标识的窗口。适合 OCR、翻译这类会反复弹出结果的动作。应全局唯一。默认 `=`（当前动作 ID）。「获取所有 / 当前动作文本窗口」时不出现此参数。

**窗口位置类型**：窗口出现在哪，如屏幕中间、跟随鼠标、全屏、最大化、自定义位置。默认屏幕中间。

<ModuleParamPreview
  moduleKey="sys:showText"
  focusKeys={['winLocation', 'winSize']}
  values={{type: 'WAIT', winLocation: 'CenterScreen'}}
/>

**窗口尺寸/位置**：

- **窗口位置类型** 为「自定义位置」时，写 `left,top,right,bottom`（左边,顶边,右边,底边）。每个值可以是像素或百分比。
  - 数字是相对屏幕左边 / 顶边的物理像素，如 `100,100,500,500` 是 400×400 的矩形。
  - 百分比是相对屏幕工作区，如 `0%,0%,50%,100%` 占左半边。
  - 可混用，如 `100,100,50%,50%`：左上角在 100,100，右下角在工作区中心。
- 其它位置类型时，写 `width,height`（宽,高），数字或百分比。
  - 数字是**逻辑像素**（已含 Windows 缩放）。`500,400` 在 150% 缩放下实际约 750×600 物理像素。
  - 百分比相对桌面工作区，如 `50%,50%` 约占工作区 1/4。
  - 宽和高可分别用数字和百分比，如 `300,90%`。

**字体大小**：初始字号，默认 `14`。

**字体名称**：仅需要时填写。多个字体用英文逗号分隔。

**背景颜色** / **文字颜色**：可选，格式 `#RRGGBB`。

**语法高亮**：选择已有规则；也可指定自定义规则文件路径或规则正文（v1.39.11+）。规则格式见 [AvalonEdit 官方规则](https://github.com/icsharpcode/AvalonEdit/tree/master/ICSharpCode.AvalonEdit/Highlighting/Resources)。

<ShareLinkCard
  code="92b7ac12-3349-4d2d-a4a6-08dbb4bd66e6"
  title="示例：自定义高亮语法"
  description="文本窗使用，自定义高亮语法示例。"
  author="level1"
/>

**自动保存到状态**：文本被修改时自动写入动作状态，避免意外关闭丢内容。这里填状态 Key 字符串（不要用变量），例如 `暂存文本`。之后可用 [状态存取](/v2/xaction/modules/statestorage) 按同一 Key 读回。

**Esc 键关闭窗口**：在文本窗口里按 Esc 是否关窗。默认开启。

**失去焦点自动关闭**：失焦后自动关窗，适合只看不改的场景（1.26.5+）。若手动置顶，会暂时取消此行为。

**显示行号**：左侧是否显示行号。默认开启。

**自动换行显示**：单行过长是否折行；关闭则出现水平滚动条（v1.10.1+）。默认开启。

**显示内置工具栏**：是否显示预置工具栏。默认开启。

**未选择内容时，复制或剪切整行**：未选中时，Ctrl+C / Ctrl+X 操作光标所在整行（v1.10.1+）。默认关闭。

**光标位置**：打开后插入符所在位置。`0` 最前，`-1` 末尾，其它数字表示该字符后面（v1.36.23+）。

**如果窗口存在，则直接更新窗口内容（而不是关闭后打开新窗口）**：仅「不等待」时出现。默认关闭。

**高级设置**：仅特殊需求时使用。窗口加载后或关闭前执行子程序，或加额外选项，每行一条。

支持的指令：

- `loaded_sp:窗口加载后执行的子程序`
- `closing_sp:窗口关闭时执行的子程序`

调用子程序时传入：

- `_windowId` 窗口标识
- `_handle` 窗口句柄
- `_window` 窗口对象
- `_windowLocation` 最后的窗口位置

需要熟悉相关编程，避免卡死 UI 线程。（v1.39.34；1.42.35 增加 `_windowLocation`）

**失败后停止**：出错后是否中止动作。默认开启。

## 输出

- **是否成功**
- **选择的项**：用户点的附加按钮。直接点 X 关窗则返回空。仅「等待关闭」。
- **结果文本**：框内最终全部文本。等待关闭、关闭窗口、获取窗口信息时输出。
- **窗口句柄**：不等待、获取窗口信息时输出。
- **选中的文本**：框内当前选中的文字。
- **光标位置**：插入符所在字符序号。
- **窗口位置**：窗口最终显示位置。
- **窗口是否存在**：仅获取窗口信息。
- **所有窗口**：词典，key 为窗口句柄，value 为窗口标识。仅「获取所有文本窗口」「获取当前动作创建的所有文本窗口」。获取全部窗口时，仅限自己开发的动作使用。

## 工具栏操作按钮

- 每行一个按钮。
- 格式为 **显示内容|值或处理方式**。
- **显示内容** 使用 **\[图标\]标题文字(ToolTip文字)**：
  - 示例：**\[fa:Solid_Cog:#339900\]转大写(将选中的文字转换为大写)**
    ![](./img/showtext-007-4e2f174a06.png)
  - 图标和 Tooltip 都可省略。
  - 图标：`fa:` 开头；第二部分是图标名，可在动作图标选择窗口里查看：
    ![](./img/showtext-008-7b4ae43b84.png)
  - 第三部分是颜色，`#RRGGBB`。
  - 网络图片（1.22.27+）：`[url:https://files.getquicker.net/_icons/0C8F7C4E850B0BF5A9915603076B6D3577F0C3F6.svg]`
- 标题里可用 `_字母` 设快捷访问键。例如「保存(_S)」可用 Alt+S。
- Tooltip 应多于 2 个字符，尽量避免括号干扰匹配。

支持菜单：

- 一个主菜单下可跟多个子项。
- 主菜单：**\[+\]** *\[fa:Solid_Pen:#FF0000\]标题文字(提示文字)*
- 子菜单：**\[-\]** *\[fa:Solid_Pen:#FF0000\]菜单标题文字(菜单提示文字)*

以 `////` 开头的行当作注释，或用来临时关掉这一行。

默认用 `|` 分隔显示内容和值。要改分隔符，在第一行写 `|=新分隔符`。

### 按钮行为

扩展按钮 `|` 后面定义行为，两种：

**返回值并关窗**：直接写要返回的值。仅「等待关闭」可用。

例如：`使用百度翻译|baidu`，点击后关窗，**选择的项** 输出 `baidu`。

**执行文本处理**：写成 `call:` 加功能定义。

### 定义文本处理功能

基本格式是 `call:` 后面用 `$` 分成 4 段：

**call:第1部分$第2部分$第3部分$第4部分**

**第1部分**：处理全部文本还是选中部分。

- **a** 或 **all**：全部内容
- **s** 或 **selection**：选中部分
- **n** 或 **none**：不需要输入文本
- **auto**：有选中则用选中，否则用全部（1.5.20+）
- **l** 或 **line**：选中内容 / 光标所在整行（1.10.1+）

**第2部分**：处理结果怎么用。

- **ra** 或 **replaceall**：替换全部内容
- **rs** 或 **replaceselection**：替换选中部分
- **c** 或 **copy**：复制到剪贴板
- **n** 或 **none**：不处理返回内容
- **rauto**：按来源是选中还是全部，自动替换对应范围（1.5.20+）
- **insertafter** 或 **ia**：在选中后面插入（1.6.2+）
- **append**：在末尾追加（1.37.35+）
- **caret**：更新光标位置，用于子程序返回的 `caretOffset`（1.39.22+）

在 **rs** / **ia** / **ra** 时，可把光标移到插入内容的某处：`操作方式-从结尾向前的字符数` 或 `操作方式+从开头的字符数`。例如 `rs-1` 表示替换选中后，光标停在新内容倒数第 1 个字符前。也可由子程序的 `caretOffset` 控制，见下文。

**第3部分**：功能类型。

- **sp**：子程序
- **in** 或 **internal**：内置文本处理
- **cloud**：在线文本处理（后期支持）
- **url**：第三方文本处理网址（后期支持）

**第4部分**：资源名称或网址，以及参数。

格式：**子程序名** 或 **在线服务 key** 或 **第三方网址**`?参数1=值1&参数2=值2...`

没有参数时可省略 `?` 及后面。参数值需要 URL 编码。

<ShareLinkCard
  items={[
    {
      code: 'd3dcdaf2-1544-43b8-17c3-08d7dec8856a',
      title: '文器',
      description: '集大成的文本处理利器',
      author: '治钧',
    },
    {
      code: '1ec2aca5-554f-4abd-17c1-08d7dec8856a',
      title: '文本显示测试',
      description: '预览版',
      author: 'CLOutlook',
    },
  ]}
/>

#### 文本处理子程序

调用示例：

- 不带参数：`call:s$rs$sp$子程序名`
- 带参数：`call:s$rs$sp$子程序名?head=head_value&end=end_value&param3=value3`

子程序需要符合：

- **Input**：文本，待处理内容。
- **params**（可选）：文本或词典，附加参数。文本类型时原样传入（如 `head=head_value&end=end_value`）；词典类型时自动拆开，表达式里按键取值：

```text
$={params}["参数名"]
```
- **output**：文本，处理结果。`output` 为空时不替换选中内容（避免用户取消时被清空）。若要清空，请返回 `\*NULL\*`。
- **caretOffset**（可选，1.39.20+）：设定光标。优先级高于指令第 2 部分：
  - `+0`、`0`、正数：从插入内容开头算
  - `-0`、负数：从插入内容末尾向前
  - 空字符串：不处理

![](./img/showtext-009-2aabb594e2.png)

<ShareLinkCard
  href="https://getquicker.net/SubProgram?id=58926ef7-0908-46d6-17c0-08d7dec8856a"
  title="文本处理参考子程序"
/>

#### 内置的文本处理功能

调用示例：

- `call:s$rs$in$toUpper`
- `call:a$ra$internal$toLower`

目前支持：

| 名称 | 作用 |
| --- | --- |
| toUpper / toLower | 英文转大写 / 小写 |
| reverse | 反转文本 |
| trimStart / trimEnd / trim | 去前 / 后 / 前后空白 |
| urlEncode / urlDecode | URL 编解码（utf8） |
| htmlEncode / htmlDecode | HTML 编解码 |
| intercappedToSentence | 组合词拆成句子（thisIsChina → this Is China） |
| base64Encode / base64Decode | Base64 编解码 |
| removeEmptyLine / mergeEmptyLine | 去空行 / 合并多个空行 |
| sortLinesAsc / sortLinesDesc | 多行 A–Z / Z–A |
| reverseLines | 翻转多行顺序 |
| toTitleCase | 首字母大写 |
| formatJson | 格式化 JSON |
| md5 / sha1Hash / sha256Hash | 计算哈希 |
| escapeJson | 转义为合法 JSON 值 |
| DecodeUnicode | 解码 `\uXXXX` |
| toCnNum | 金额数字转大写 |
| cn2num / num2cn | 中文数字 ↔ 阿拉伯数字 |
| ExpandEnvironmentVariables | 替换环境变量 |

#### 在线文本处理服务

预留接口。调用：`call:a$ra$cloud$服务名?参数1=值1&参数2=值2`

`?` 及参数按具体服务可选。示例：`Echo服务|call:all$rs$cloud$echo`

目前可用：

- **echo**：原样返回输入

#### 第三方文本处理服务

预留接口。调用：`call:a$ra$url$https://somesite.com/text/processor?参数1=值1&参数2=值2`

接口约定：

**请求**：POST，JSON 请求体：

```json
{
  "content": "待处理文本的内容。"
}
```

**响应**：

```json
{
  "isSuccess": true,
  "message": "",
  "data": "文本处理结果"
}
```

- **isSuccess**：是否成功
- **message**：失败时的错误消息
- **data**：处理后的文本

## 限制与排障

- 跨步骤操作同一窗口时，**文本窗口标识** 必须一致；填 `=` 可避免和其它动作冲突。
- 「获取所有文本窗口」只适合自己开发的动作。
- **高级设置** 里的子程序跑在 UI 线程，写不好会卡死窗口。
- 工具栏 `call:` 的参数值需要 URL 编码；子程序 `output` 为空不会替换选中内容。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/statestorage',
      label: '状态存取',
      description: '按同一 Key 读回自动保存的文本。',
    },
    {
      href: '/v2/xaction/modules/showmenu',
      label: '显示菜单',
      description: '弹出菜单让用户选一项。',
    },
    {
      href: '/v2/xaction/modules/userinput',
      label: '用户输入',
      description: '短文本、确认框等输入。',
    },
  ]}
/>

## 更新历史

- 1.1.12 增加字体大小；窗口位置增加「全屏」；支持 Ctrl+滚轮缩放。
- 1.5.17 扩展按钮外观和功能增强。
- 1.5.27 增加置顶、失去焦点后关闭。
- 1.6.2 支持移动光标。
- 1.36.23 增加设置光标位置。
- 1.37.35 增加 append。
- 1.39.11 自定义语法高亮。
- 1.39.20 子程序可设定光标。
- 1.39.22 工具栏按钮增加 caret。
- 1.39.33 增加等待窗口关闭。
- 20240717 「Esc 键关闭窗口」改为独立参数。
- 20250605 补充快速访问键说明。
