---
title: "WebView2浏览器窗口"
description: "基于微软Edge浏览器内核的组件，需要安装Edge最新预览版方可使用。"
slug: "/v2/xaction/modules/webview2"
sidebar_label: "WebView2浏览器窗口"
sidebar_position: 130
quickerDocKey: "xaction/module/sys:webview2"
comments: true
moduleKey: "sys:webview2"
docStatus: "migrated-unreviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
metadataHash: "a1d672675f6b22e70a2719ae709aa211d00145b7663a1f1ea940c6ece64478c8"
legacyDocId: 13009021
legacyContentUpdatedAt: "2026-03-22T03:26:04.000Z"
---

# WebView2浏览器窗口

基于微软Edge浏览器内核的组件，需要安装Edge最新预览版方可使用。

{/* xaction-metadata:start */}
## 当前模块定义

- 模块 Key：`sys:webview2`
- 分类：界面组件（`Ui`）
- 类型：`Action`
- 风险操作：否
- 专业版：否

## 输入参数

| Key | 名称 | 类型 | 默认值 | 必填 | 变量模式 | 条件 | 说明 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `type` | 操作类型 | `Enum` | OpenUrl | 是 | `Input` |  |  |
| `url` | 网址或HTML内容 | `Text` |  | 是 | `UseVarOrInput` | 仅：OpenUrl, OpenAndWaitLoad, OpenUrlAndWaitClose | 网页地址/文件路径或html代码内容 |
| `urlList` | 网址列表 | `List` |  | 是 | `UseVarOrInput` | 仅：MultiTab_OpenUrl, MultiColumn_OpenUrl | 每行一个：网址，或"标题\|网址"，或"[图标]标题\|网址"格式。 |
| `additionalBrowserArguments` | 附加的浏览器参数 | `Text` |  | 是 | `UseVarOrInput` | 仅：OpenUrl, OpenAndWaitLoad, OpenUrlAndWaitClose | 用于设置代理等用途 |
| `virtualHostToFolder` | 虚拟主机映射 | `Text` |  | 是 | `UseVarOrInput` | 仅：OpenUrl, OpenAndWaitLoad, OpenUrlAndWaitClose | 将文件夹映射为虚拟主机名。格式：主机名\|文件夹路径。多个时，每行一个。<br />在html中可以使用https://servername/path/to/file.png的格式访问文件。 |
| `userAgent` | User Agent | `Text` |  | 否 | `UseVarOrInput` | 仅：OpenUrl, OpenAndWaitLoad, OpenUrlAndWaitClose, MultiTab_OpenUrl, MultiColumn_OpenUrl | 可选。自定义UserAgent |
| `title` | 窗口标题 | `Text` |  | 是 | `UseVarOrInput` | 仅：OpenUrl, OpenAndWaitLoad, OpenUrlAndWaitClose, MultiTab_OpenUrl, MultiColumn_OpenUrl | 窗口标题文字。未设置时，自动使用网页标题。 |
| `icon` | 窗口图标 | `Text` |  | 否 | `UseVarOrInput` | 仅：OpenUrl, OpenAndWaitLoad, OpenUrlAndWaitClose | 显示在窗口左上角的图标。支持fa:内置图报名:#RRGGBB或图标网址。 |
| `defaultBgColor` | 默认背景色 | `Text` |  | 否 | `UseVarOrInput` | 仅：OpenUrl, OpenAndWaitLoad, OpenUrlAndWaitClose | 可选。设置窗口的默认背景色。 |
| `autoCloseKey` | 窗口标识 | `Text` | = | 否 | `UseVarOrInput` | 排除：CheckInstalled | (仅必要时使用)用于关闭之前打开的具有此标识的WebView2窗口。使用=表示当前动作ID。 |
| `modeForExists` | 如果窗口已存在 | `Enum` | SkipThisStep | 否 | `Input` | 仅：OpenUrl, OpenAndWaitLoad |  |
| `script` | JS脚本 | `Text` |  | 是 | `UseVarOrInput` | 仅：OpenUrl, OpenAndWaitLoad, OpenUrlAndWaitClose, ExecuteScript | 可选。 |
| `sendMessage` | 消息内容 | `Text` |  | 是 | `UseVarOrInput` | 仅：SendMessage | Json格式的消息内容。词典变量会自动转换成json。 |
| `additionalObjects` | 附加对象 | `List` |  | 否 | `UseVarOrInput` | 仅：SendMessage | PostWebMessageAsJson的附加对象列表参数内容。目前支持路径的列表 |
| `winLocation` | 窗口位置 | `Enum` | CenterScreen | 否 | `UseVarOrInput` | 仅：OpenUrl, OpenAndWaitLoad, OpenUrlAndWaitClose, MultiTab_OpenUrl, MultiColumn_OpenUrl | 在哪里显示选择窗口 |
| `winSize` | 窗口尺寸/位置 | `Text` |  | 否 | `Input` | 仅：OpenUrl, OpenAndWaitLoad, OpenUrlAndWaitClose, MultiTab_OpenUrl, MultiColumn_OpenUrl | 设置选择窗口的尺寸，格式为：宽度,高度。支持像素数值或屏幕宽高百分比，详情请参考模块文档。<br />"窗口位置" 类型为 "自定义位置" 时用于指定显示位置，格式为：left,top,right,bottom |
| `defaultDownloadFolderPath` | 默认下载文件夹 | `Text` |  | 否 | `Input` | 仅：OpenUrl, OpenAndWaitLoad, OpenUrlAndWaitClose, MultiTab_OpenUrl, MultiColumn_OpenUrl | 默认的文件下载存储目录 |
| `profileName` | Profile | `Text` |  | 否 | `Input` | 仅：OpenUrl, OpenAndWaitLoad, OpenUrlAndWaitClose | 当需要同时登录一个网站的多个账号时，可以创建独立的Profile。请输入Profile名称，不支持文件夹路径。 |
| `topMost` | 置顶显示 | `Boolean` | false | 否 | `UseVarOrInput` | 仅：OpenUrl, OpenAndWaitLoad, OpenUrlAndWaitClose, MultiTab_OpenUrl, MultiColumn_OpenUrl |  |
| `showInTaskbar` | 显示任务栏图标 | `Boolean` | true | 否 | `UseVarOrInput` | 仅：OpenUrl, OpenAndWaitLoad, OpenUrlAndWaitClose |  |
| `noActivate` | 不占用焦点 | `Boolean` | false | 否 | `UseVarOrInput` | 仅：OpenUrl, OpenAndWaitLoad, OpenUrlAndWaitClose | 不占用焦点时也无法在窗口中输入文字 |
| `closeWhenLostFocus` | 失去焦点后 | `Enum` | false | 否 | `UseVarOrInput` | 仅：OpenUrl, OpenAndWaitLoad, OpenUrlAndWaitClose |  |
| `escCloseWindow` | 按Esc关闭窗口 | `Boolean` | false | 否 | `UseVarOrInput` | 仅：OpenUrl, OpenAndWaitLoad, OpenUrlAndWaitClose |  |
| `showToolbar` | 显示工具栏 | `Boolean` | false | 否 | `UseVarOrInput` | 仅：OpenUrl, OpenAndWaitLoad, OpenUrlAndWaitClose |  |
| `addDevTool` | 添加DevTools桥 | `Boolean` | false | 否 | `Input` | 仅：OpenUrl, OpenAndWaitLoad, OpenUrlAndWaitClose |  |
| `windowStyle` | 窗口风格 | `Enum` | normal | 否 | `UseVarOrInput` | 仅：OpenUrl, OpenAndWaitLoad, OpenUrlAndWaitClose |  |
| `clearCookies` | 关闭窗口时清理Cookie | `Boolean` | false | 否 | `Input` | 仅：OpenUrl, OpenAndWaitLoad, OpenUrlAndWaitClose |  |
| `stopIfFail` | 失败后停止 | `Boolean` | true | 否 | `Input` |  | 失败后是否停止动作 |

## 输出参数

| Key | 名称 | 类型 | 条件 | 说明 |
| --- | --- | --- | --- | --- |
| `isSuccess` | 是否成功 | `Boolean` |  | 操作是否成功。获取窗口信息时，窗口是否存在。 |
| `isInstalled` | 是否安装WebView2 | `Boolean` | 仅：CheckInstalled |  |
| `hWnd` | 窗口句柄 | `Integer` | 仅：OpenUrl, OpenAndWaitLoad, CheckWindowState |  |
| `webView` | WebView2对象 | `Object` | 仅：OpenUrl, OpenAndWaitLoad, CheckWindowState | 可用于在C#脚本中使用，需运行在UI线程中。注意避免循环引用。 |
| `lastLocation` | 窗口位置 | `Text` | 仅：OpenAndWaitLoad, CheckWindowState, OpenUrlAndWaitClose | 返回窗口坐标范围。格式为：left,top,right,bottom |
| `currUri` | 当前网址 | `Text` | 仅：OpenAndWaitLoad, CheckWindowState | 浏览器当前网址 |
| `docTitle` | 网页标题 | `Text` | 仅：OpenAndWaitLoad, CheckWindowState |  |
| `sourceCode` | 网页代码 | `Text` | 仅：OpenAndWaitLoad, CheckWindowState |  |
| `cookies` | Cookie | `Text` | 仅：OpenAndWaitLoad, CheckWindowState |  |
| `scriptResult` | 脚本运行结果 | `Text` | 仅：ExecuteScript | json编码的脚本运行结果内容 |
| `previewImage` | 预览图 | `Image` | 仅：CheckWindowState |  |
| `isNavCompleted` | 导航是否已结束 | `Boolean` | 仅：CheckWindowState | 是否已完成网页加载过程 |

## 选项值

### `type` 操作类型

| Value | 名称 | 说明 |
| --- | --- | --- |
| `OpenUrl` | 打开网页 |  |
| `OpenAndWaitLoad` | 打开网页并等待加载完成 |  |
| `OpenUrlAndWaitClose` | 打开网页并等待窗口关闭 |  |
| `SendMessage` | 发送消息 |  |
| `ExecuteScript` | 执行脚本 |  |
| `CheckWindowState` | 获取窗口状态 |  |
| `Close` | 关闭窗口(如果尚未关闭) |  |
| `Reload` | 重新加载/刷新 |  |
| `Stop` | 停止加载 |  |
| `CheckInstalled` | 检查是否安装WebView2 |  |
| `MultiTab_OpenUrl` | 【多标签】打开网址 |  |
| `MultiColumn_OpenUrl` | 【多列】打开网址 |  |

### `modeForExists` 如果窗口已存在

| Value | 名称 | 说明 |
| --- | --- | --- |
| `SkipThisStep` | 跳过此步骤 |  |
| `UpdateUrl` | 更新网址 |  |
| `UpdateUrlAndPosition` | 更新网址和窗口位置 |  |
| `RecreateWindow` | 关闭并重建窗口 |  |
| `BringToFront` | 激活窗口 |  |

### `winLocation` 窗口位置

| Value | 名称 | 说明 |
| --- | --- | --- |
| `WithMouse1` | 跟随鼠标（指针周围） |  |
| `WithMouse2` | 跟随鼠标（指针右下） |  |
| `CenterScreen` | 屏幕中间 |  |
| `TopLeft` | 屏幕左上 |  |
| `TopCenter` | 屏幕中上 |  |
| `TopRight` | 屏幕右上 |  |
| `LeftCenter` | 屏幕左中 |  |
| `RightCenter` | 屏幕右中 |  |
| `BottomLeft` | 屏幕左下 |  |
| `BottomCenter` | 屏幕中下 |  |
| `BottomRight` | 屏幕右下 |  |
| `FullScreen` | 全屏 |  |
| `Maximized` | 最大化 |  |
| `Manual` | 自定义位置 |  |

### `closeWhenLostFocus` 失去焦点后

| Value | 名称 | 说明 |
| --- | --- | --- |
| `false` | 不执行操作 |  |
| `true` | 关闭窗口 |  |
| `hide` | 隐藏窗口 |  |
| `minimize` | 最小化窗口 |  |
| `close_if_not_topmost` | 如果未置顶，关闭窗口 |  |
| `hide_if_not_topmost` | 如果未置顶，隐藏窗口 |  |
| `minimize_if_not_topmost` | 如果未置顶，最小化窗口 |  |

### `windowStyle` 窗口风格

| Value | 名称 | 说明 |
| --- | --- | --- |
| `normal` | 正常 |  |
| `none` | 无边框 |  |
{/* xaction-metadata:end */}

提示：

-   本模块使用了微软[WebView2](https://docs.microsoft.com/en-us/microsoft-edge/webview2/)组件。
-   组件安装地址：[https://developer.microsoft.com/zh-cn/microsoft-edge/webview2/](https://developer.microsoft.com/zh-cn/microsoft-edge/webview2/) （Win11操作系统会自带WebView2）
-   在Quicker动作中修改变量名时，JS脚本中使用的Quicker变量名可能无法自动更改。





## 基础

操作类型：

-   打开网址：打开一个指定的网址或HTML网页内容，然后继续运行后面的模块。如果指定了“窗口标识”并且之前已经打开了窗口，则使用已打开的窗口打开网址。
-   打开网址并加载完成：打开一个指定的网址，等待加载完成，然后继续运行后面的模块。
-   打开网址并等待窗口关闭：打开指定的网址，等待用户关闭窗口后再继续运行后面的模块。
-   发送消息：使用[PostWebMessageAsJson](https://learn.microsoft.com/en-us/dotnet/api/microsoft.web.webview2.core.corewebview2.postwebmessageasjson?view=webview2-dotnet-1.0.2045.28)接口向网页发送消息。需要预先在网页中引入处理消息接收的代码。可用于动态更新网页的某些内容。
-   执行脚本：在网页上下文中执行js代码。使用[ExecuteScriptAsync](https://learn.microsoft.com/en-us/dotnet/api/microsoft.web.webview2.core.corewebview2.executescriptasync?source=recommendations&view=webview2-dotnet-1.0.1587.40)接口。仅在顶层文档中执行（不对iframe执行）
-   获取窗口状态：获取当前的网址、标题、是否加载完成等信息。
-   关闭窗口：根据“唯一性标识”关闭之前已打开的窗口。
-   重新加载/刷新：刷新网页。
-   停止加载：停止加载网页。
-   检查是否安装WebView2。
-   【多标签】打开网址：使用多标签页窗口同时打开多个网址。方便打开一组相关的窗口并一起关闭。
-   【多列】打开网址：使用多列布局方式同时打开多个网址。

### 参数



#### 操作类型：打开网页

【网址或HTML内容】需要打开的网址或HTML代码。

【附加的浏览器参数】[参考文档](https://learn.microsoft.com/en-us/dotnet/api/microsoft.web.webview2.core.corewebview2environmentoptions.additionalbrowserarguments?view=webview2-dotnet-1.0.2045.28)。 非必要请勿设置此参数，此参数可能造成无法同时开启多个WebView2窗口。

如：设置代理服务器参数，可使用类似于这样的参数： `--proxy-server=http://127.0.0.1:8888`。

【虚拟主机映射】将本地目录映射为一个服务器域名。 如`myserver|d:\folder`，将`d:\folder`映射为一个名为`myserver`的服务器，可以在网页中使用`https://myserver/file.png`这样的网址加载目录中的文件。需确保此目录在电脑上存在。

【UserAgent】必要时用于自定义浏览器UserAgent参数。

可以在[这里查看](https://tools.getquicker.cn/browser/useragent)您当前使用的浏览器的UserAgent。

可以在这里查看最新的其它设备UserAgent：[https://www.whatismybrowser.com/guides/the-latest-user-agent/](https://www.whatismybrowser.com/guides/the-latest-user-agent/)

【窗口标题】

【窗口图标】

【默认背景色】

【窗口标识】可以通过相同的标识避免打开多个窗口。 再次使用模块打开网址时，会自动在已经打开的窗口中更新。`=`表示使用当前动作的ID作为窗口标识（用以避免重复）。

【如果窗口已存在】打开网址时，如果已经打开了具有相同标识的窗口，则进行何种操作。

【js脚本】在网页加载后执行的js脚本内容。将通过 [AddScriptToExecuteOnDocumentCreatedAsync](https://learn.microsoft.com/en-us/dotnet/api/microsoft.web.webview2.core.corewebview2.addscripttoexecuteondocumentcreatedasync?view=webview2-dotnet-1.0.2045.28) 方法注入。

【窗口位置】设定显示窗口的位置类型。

【窗口尺寸/位置】当“窗口位置”参数为自定义位置时，可以设定窗口的坐标，格式为`left,top,right,bottom`，可以直接写逻辑像素值或相对于屏幕的百分比数值，如 `981,608,2610,1143`、`25%,25%,75%,75%` 。窗口位置为其它类型时，可用于设定窗口尺寸，格式为`width,height`，可以使用逻辑像素值或屏幕百分比数值，如`400,700`、`50%,50%`。

【默认下载文件夹】设定默认下载到的文件夹。 此选项对所有相同Profile下的WebView窗口生效。

【Profile】当需要使用多个账号登录同一网站时，可以创建独立的Profile 来存储单独的一套用户数据。通常使用一个单词或拼音来作为Profile名称。

【置顶显示】略。

【显示任务栏图标】略。

【不占用焦点】略。

【失去焦点自动关闭】略。

【按Esc关闭窗口】略。

【显示工具栏】是否显示工具栏：前进、后退、刷新、地址栏。

【窗口风格】可选普通窗口或无边框窗口。

【关闭窗口时清理cookie】关闭窗口时，清理最后显示网页的cookie数据（用于自动退出网页账号。）

#### 操作类型：发送消息

【窗口标识】目标WebViw窗口的标识。

【消息内容】json格式的文本内容，通过 [PostWebMessageAsJson](https://learn.microsoft.com/en-us/dotnet/api/microsoft.web.webview2.core.corewebview2.postwebmessageasjson?view=webview2-dotnet-1.0.2045.28) 方法发送到WebView2控件。

在网页中需要有代码接受消息并进行处理。示例：

```
window.chrome.webview.addEventListener('message', event =>
{
  console.log('recv message:', event.data);

  document.getElementById('js_fanyi_input').innerText = event.data.keyword;
  //模拟一个输入，才会真正去翻译。
  document.getElementById('js_fanyi_input').dispatchEvent(new Event('input',{bubbles:true}));

});
```

#### 操作类型：执行脚本

【窗口标识】目标WebViw窗口的标识。

【JS脚本】要执行的脚本内容。将通过[ExecuteScriptAsync](https://learn.microsoft.com/en-us/dotnet/api/microsoft.web.webview2.core.corewebview2.executescriptasync?view=webview2-dotnet-1.0.2045.28) 方法执行。

### 附加的视图类型

这两个布局窗口主要为了方便同时打开多个相关的网页，没有和动作其它部分进行交互的功能。

两个方式的参数设置也相同。

#### 多标签页

使用多标签页窗口同时打开多个网址。

示例场景：使用多个搜索引擎搜索相同关键词。

![](./img/webview2-001-9a98ada9d2.png)

#### 多列

使用多列布局同时打开网站。这种布局因为每列比较窄，比较适合访问移动端网页（通常需要通过设置UserAgent来模拟移动浏览器）。

![](./img/webview2-002-90b37278ae.png)

#### 参数设置

![](./img/webview2-003-73f41bfb09.png)

【网址列表】定义要打开的网址，每行一个，可以为下列格式之一：

-   `网址` 直接写网址，此时标签页标题自动使用网页标题。
-   `标题|网址` 此时使用固定的标题。
-   `标题(ProfileName)|网址` 谨慎使用。当需要同时使用多个账号登录相同的网站时，可以为每个账号设定单独的Profile，此时每个账号的cookie等数据会保存在对应的Profile中。

【窗口标题】略。

【窗口标识】可以通过相同的标识避免打开多个窗口。 再次使用模块打开网址时，会自动在已经打开的窗口中更新。

【窗口位置】设定显示窗口的位置类型。

【窗口尺寸/位置】当“窗口位置”参数为自定义位置时，可以设定窗口的坐标，格式为`left,top,right,bottom`，可以直接写逻辑像素值或相对于屏幕的百分比数值。

【UserAgent】必要时设定需要模拟的浏览器UserAgent类型。可以在[这里查看](https://tools.getquicker.cn/browser/useragent)您当前使用的浏览器的UserAgent。

【默认下载文件夹】下载文件的默认保存位置。

【置顶显示】是否将窗口置顶显示。

## 动作交互

### 桥接对象



桥接对象用于同动作的其它部分交互，如访问动作中的变量、调用子程序等。

可以通过 `window.chrome.webview.hostObjects.v` 对象以异步方式访问桥接对象，或者通过 `window.chrome.webview.hostObjects.sync.v` 以同步方式访问桥接对象。

更多信息可参考微软[官方文档](https://docs.microsoft.com/en-us/dotnet/api/microsoft.web.webview2.core.corewebview2.addhostobjecttoscript?view=webview2-dotnet-1.0.774.44#Microsoft_Web_WebView2_Core_CoreWebView2_AddHostObjectToScript_System_String_System_Object_)。



自1.23.5 版本起，可以在js中通过 `$quicker` 异步方式访问桥接对象，通过 `$quickerSync` 同步方式访问桥接对象。





### 读写动作变量

Quicker中使用WebView2组件的[AddHostObjectToScript](https://docs.microsoft.com/en-us/microsoft-edge/webview2/reference/win32/0-9-488/icorewebview2#addhostobjecttoscript)接口注入“**v**" （v表示variables，变量）

异步操作方式：

```
async function func(){
  // 注入的对象
  let v = await $quicker;
  // 读取变量
  let varValue = await v.getVar("变量名");
  // 写入变量
  await v.setVar("变量名", newValue);
}
```

同步操作方式：

```
function funcSync(){
  // 读取变量
  let varValue = $quickerSync.getVar("text");
  // 写入变量
  $quickerSync.setVar("text", "Hello world from js code");
}
```

示例动作：

-   [https://getquicker.net/sharedaction?code=c501debe-7e80-408c-d791-08d856359351](https://getquicker.net/sharedaction?code=c501debe-7e80-408c-d791-08d856359351)





读写变量操作支持简单变量（数字/文本以及列表变量）。

词典变量在读取时自动转换为json文本数据。词典变量不支持通过setVar方法写入。





### 词典变量的操作

在js中无法直接操作词典变量。



为词典变量赋予一个完整的新值

```
//setDictByJson(变量名, json内容)
$quickerSync.setDictByJson("dict", "{a: 1, b: 2}");
```

为词典的某个key赋值：

```
//setDictItemValue(词典变量名,键名,值)
$quickerSync.setDictItemValue("dict", "c", 3);
```

获取词典的某个键的值：

```
// 返回词典的某个键的值getDictItemValue(词典变量名,键名)
var value = $quickerSync.getDictItemValue("dict","c");
```



### 调用子程序并返回结果

*需****1.23.15+****版本。*

通过 `await $quickerSp(spName, dataObj)` 方法调用动作中定义的子程序。

参数：

-   spName: 子程序名称
-   dataObj: 子程序输入参数对象。每个key对应于子程序中作为输入参数的变量名。

注意：传入子程序的输入参数dataObj，和回调的输出参数outputObj都是**对象类型**。

示例：

```
// 调用子程序：返回原始输入值
async function testSubprogram(){
  //子程序输入参数，每个key对应子程序的输入变量。 input为子程序的一个输入变量。
  var obj = {input:'Hello Quicker!', age:3};
  // 调用子程序
  var data = await $quickerSp('subprogram1', obj);
  //处理子程序返回结果
  alert('success: ' + data.output); //output为子程序的一个输出变量
}
```



【以下方法不建议使用】

也可通过 `await $quicker.subprogram(spName, dataJson, boolParam, callback)` 方法调用动作中定义的子程序（不推荐）。

参数：

-   子程序名
-   json序列化后的输入参数值对象。输入参数js对象的每个key对应于子程序中作为输入参数的变量名。
-   布尔类型的备用参数，请传入false值。
-   回调函数：function(success, data)。success参数表示是否成功，data参数表示成功时返回的结果（Json序列化后的子程序输出变量的值），出错时返回错误消息。

-   data为子程序各个输出变量名和对应的值的词典的JSON序列化**文本**。

```
async function testSubprogram() {
  // 为子程序的输入参数构造对象
  var inputParam = { input: "text to process", prop1: 3, prop2: "value" };
  // 调用: $quicker.subprogram(子程序名, 输入参数对象的Json序列化文本值, 布尔类型备用参数,回调函数)
  await $quicker.subprogram(
    "子程序名",
    JSON.stringify(inputParam),
    false,
    (success, data) => {
      //回调函数，处理
      if (success) {
        // 子程序调用成功, data = 子程序输出参数的Json序列化后的文本
        alert(data);
      } else {
        // 子程序调用失败
        alert("error:" + data);
      }
    } //end of callback
  ); //end of subprogram
}
```



注意：进行复杂操作时，请使用**异步调用方式**（await $quicker.subprogram()...)。同步调用时js会等待结果，可能会造成界面死锁。



示例动作：[https://getquicker.net/sharedaction?code=c501debe-7e80-408c-d791-08d856359351](https://getquicker.net/sharedaction?code=c501debe-7e80-408c-d791-08d856359351)



## 推荐资源

### WebView2相关

-   [WebView2 官方文档](https://docs.microsoft.com/en-us/microsoft-edge/webview2/)





### 前端技术相关

-   [现代JavaScript教程](https://zh.javascript.info/)



## 示例

参数传递与子程序调用

-   [https://getquicker.net/sharedaction?code=c501debe-7e80-408c-d791-08d856359351](https://getquicker.net/sharedaction?code=c501debe-7e80-408c-d791-08d856359351)



通过发送消息更新已打开的WebView窗口

-   [https://getquicker.net/sharedaction?code=a6fd6ca9-b6d8-4fbf-afe2-08d8f6743496](https://getquicker.net/sharedaction?code=a6fd6ca9-b6d8-4fbf-afe2-08d8f6743496) （搜索Quicker网站）
-   [https://getquicker.net/sharedaction?code=0b13fc42-ada7-4bb0-afe3-08d8f6743496](https://getquicker.net/sharedaction?code=0b13fc42-ada7-4bb0-afe3-08d8f6743496) (有道翻译）





## 更新历史

-   20230929 完善文档。 增加多标签、多列等内容的说明。
-   20240426 修正虚拟主机映射的错误（主机名应该在前面）。
