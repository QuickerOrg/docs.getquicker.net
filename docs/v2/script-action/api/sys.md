---
title: "qk.Sys：系统"
description: "qk.Sys：系统的成员、参数和使用约定。"
quickerDocKey: v2/script-action/api/sys
comments: false
sidebar_position: 10
---

{/* script-api:start */}

Windows 与本机（系统信息、CPU 与内存占用、环境变量与注册表读取、提示音、朗读、音量与音频设备、媒体键、磁盘、网络与 Wi-Fi、Windows 设置页（SearchSettings/OpenSettings）、显示器亮度、深色模式、锁屏/关屏/睡眠/关机等电源操作）；Quicker 自身的信息见 qk.Quicker。

<a id="sys-info" />

## Sys.Info

```csharp
SysInfo Info()
```

读取计算机名、用户名、系统版本、锁屏/全屏/深色模式/联网状态、局域网 IP 与开机时长。

返回类型：`SysInfo`。空值、用户取消和异常行为以成员及域说明为准。

<a id="sys-playsound" />

## Sys.PlaySound

```csharp
void PlaySound(string sound, bool wait = false)
```

播放声音；每次运行 PlaySound 与 Speak 合计最多 100 次；无法解码或没有音频设备报 SOUND_FAILED（不等待时只记警告）。

| 参数声明 | 说明 |
|---|---|
| `string sound` | 内置音名 info&#124;snip&#124;succeed&#124;warning&#124;wrong&#124;dim（总是按内置音处理），或音频文件路径（mp3/wav/wma/m4a 等；不存在 FILE_NOT_FOUND），或 http(s) 网址；其他协议 INVALID_ARGUMENT。 取值：`info`、`snip`、`succeed`、`warning`、`wrong`、`dim`。也接受其他值，详见成员说明。 |
| `bool wait = false` | true：播完才返回，停止脚本即停止播放并立即返回；false：立即返回并在后台播完（运行结束后继续；在 Quicker 中停止本动作时随之停止；最长 30 分钟）。整个 Quicker 同时最多 4 个后台播放/朗读，超出报 LIMIT_EXCEEDED（不排队；连续播放请用 wait: true）。文件/网址 15 秒内打不开报 SOUND_FAILED。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

<a id="sys-speak" />

## Sys.Speak

```csharp
void Speak(string text, bool wait = false)
```

用 Windows 默认语音朗读文本（1–20000 字符）；语音引擎不可用报 SOUND_FAILED。

| 参数声明 | 说明 |
|---|---|
| `string text` | 见本成员和所在域的说明。 |
| `bool wait = false` | true：读完才返回，停止脚本即停止朗读并立即返回；false：立即返回并在后台读完（与 PlaySound 共用同时 4 个的后台名额，超出 LIMIT_EXCEEDED）。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

<a id="sys-getvolume" />

## Sys.GetVolume

```csharp
VolumeInfo GetVolume(string device = "output")
```

读取当前默认输出设备（或默认录音设备）的音量与静音（每次调用都重新取默认设备）；没有音频设备报 SOUND_FAILED。停止后的 finally 中也可调用。

| 参数声明 | 说明 |
|---|---|
| `string device = "output"` | output（默认输出/播放设备，默认）&#124; input（默认录音设备，如麦克风）。 取值：`output`、`input`。 |

返回类型：`VolumeInfo`。空值、用户取消和异常行为以成员及域说明为准。

<a id="sys-setvolume" />

## Sys.SetVolume

```csharp
VolumeInfo SetVolume(int? level = null, bool? muted = null, string device = "output")
```

设置当前默认输出设备（或默认录音设备，如麦克风静音）的音量与静音，返回调用后的状态；运行后保留（宿主不自动恢复：先 GetVolume 保存，在 finally 中 SetVolume 恢复，停止后的 finally 中也可调用）；没有音频设备报 SOUND_FAILED。

| 参数声明 | 说明 |
|---|---|
| `int? level = null` | 音量 0–100；null 不改。 |
| `bool? muted = null` | 是否静音；null 不改。 |
| `string device = "output"` | output（默认输出/播放设备，默认）&#124; input（默认录音设备，如麦克风）。 取值：`output`、`input`。 |

返回类型：`VolumeInfo`。空值、用户取消和异常行为以成员及域说明为准。

<a id="sys-power" />

## Sys.Power

```csharp
void Power(string action)
```

电源与会话操作。lock、screenOff 锁定或关闭屏幕；sleep/hibernate/signOut/shutdown/restart 可使电脑睡眠、休眠、注销、关机或重启，未保存的工作可能丢失。失败报 POWER_FAILED。screenOff 由鼠标或按键触发时，随后的鼠标移动或松键可能立即点亮屏幕。睡眠期间停止与超时不生效；唤醒后若已超过动作超时，后续代码不再执行。

| 参数声明 | 说明 |
|---|---|
| `string action` | lock（锁定计算机）&#124; screenOff（关闭显示器）&#124; sleep（睡眠，唤醒后返回）&#124; hibernate（休眠，未启用休眠报 POWER_FAILED）&#124; signOut（注销）&#124; shutdown（立即关机）&#124; restart（立即重启）；不区分大小写。 取值：`lock`、`sleep`、`hibernate`、`screenOff`、`signOut`、`shutdown`、`restart`。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

<a id="sys-getbrightness" />

## Sys.GetBrightness

```csharp
int GetBrightness(string screen = "mouse")
```

读取显示器亮度 0–100（同“显示器亮度”步骤：笔记本内置屏走 WMI，外接显示器走 DDC/CI）。不支持调节亮度报 BRIGHTNESS_UNSUPPORTED，其他失败（屏幕未连接等）报 BRIGHTNESS_FAILED。

| 参数声明 | 说明 |
|---|---|
| `string screen = "mouse"` | mouse（鼠标所在屏，默认）&#124; primary（主屏）&#124; all（与 primary 相同）&#124; qk.Screen.List() 返回的 ScreenInfo.Id。 取值：`mouse`、`primary`、`all`。也接受其他值，详见成员说明。 |

返回类型：`int`。空值、用户取消和异常行为以成员及域说明为准。

<a id="sys-setbrightness" />

## Sys.SetBrightness

```csharp
int SetBrightness(int? level = null, int delta = 0, string screen = "mouse", bool osd = false)
```

设置显示器亮度，返回设置后的亮度；设备只支持部分档位时取最接近的档位；运行后保留。screen 为 all 时设置全部显示器，至少一块成功即返回（鼠标所在屏，否则第一块成功屏的亮度），全部失败才报错。错误码同 GetBrightness。

| 参数声明 | 说明 |
|---|---|
| `int? level = null` | 目标亮度 0–100；与 delta 只能给出一个。 |
| `int delta = 0` | 相对调整 -100–100（非 0；越界取 0/100）；与 level 只能给出一个。 |
| `string screen = "mouse"` | mouse（默认）&#124; primary &#124; all &#124; qk.Screen.List() 返回的 ScreenInfo.Id。 取值：`mouse`、`primary`、`all`。也接受其他值，详见成员说明。 |
| `bool osd = false` | 是否显示亮度提示（同步骤的 OSD）。 |

返回类型：`int`。空值、用户取消和异常行为以成员及域说明为准。

<a id="sys-listaudiodevices" />

## Sys.ListAudioDevices

```csharp
AudioDevice[] ListAudioDevices(string device = "output")
```

列出已启用的音频输出（或录音）设备，IsDefault 标出当前默认设备；读取失败报 SOUND_FAILED。

| 参数声明 | 说明 |
|---|---|
| `string device = "output"` | output（播放设备，默认）&#124; input（录音设备）。 取值：`output`、`input`。 |

返回类型：`AudioDevice[]`。空值、用户取消和异常行为以成员及域说明为准。

<a id="sys-setdefaultaudiodevice" />

## Sys.SetDefaultAudioDevice

```csharp
void SetDefaultAudioDevice(string idOrName, string device = "output")
```

设为默认音频设备（多媒体、控制台与通信，同“音频控制”步骤）；运行后保留。找不到 AUDIO_DEVICE_NOT_FOUND；名称匹配到多个 INVALID_ARGUMENT（请改用 Id）；设置失败 SOUND_FAILED。

| 参数声明 | 说明 |
|---|---|
| `string idOrName` | 设备 Id，或设备名称（依次按完整名称、名称包含匹配，不区分大小写）。 |
| `string device = "output"` | output（播放设备，默认）&#124; input（录音设备）。 取值：`output`、`input`。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

<a id="sys-getenv" />

## Sys.GetEnv

```csharp
string? GetEnv(string name)
```

读取环境变量（Quicker 进程中的当前值；Quicker 启动后在系统设置中修改的变量需重启 Quicker 才可见）；不存在返回 null。

| 参数声明 | 说明 |
|---|---|
| `string name` | 变量名，如 "PATH"、"USERPROFILE"（不区分大小写）。 |

返回类型：`string?`。空值、用户取消和异常行为以成员及域说明为准。

<a id="sys-getregistry" />

## Sys.GetRegistry

```csharp
object? GetRegistry(string path, string? name = null)
```

读取注册表值（只读）；键或值不存在返回 null。REG_SZ/REG_EXPAND_SZ → string（已展开）、REG_DWORD → long（无符号）、REG_QWORD → long、REG_MULTI_SZ → string[]、REG_BINARY → byte[]；无权限报 ACCESS_DENIED。

| 参数声明 | 说明 |
|---|---|
| `string path` | 键路径，如 @"HKCU\Software\Microsoft"；根键可写 HKCU/HKLM/HKCR/HKU/HKCC 或全名，可带注册表编辑器复制出的“计算机\”前缀。 |
| `string? name = null` | 值名；null 或 "" 为默认值。 |

返回类型：`object?`。空值、用户取消和异常行为以成员及域说明为准。

<a id="sys-setdarkmode" />

## Sys.SetDarkMode

```csharp
void SetDarkMode(bool dark, string scope = "all")
```

切换当前用户的 Windows 深色（true）/浅色（false）模式，并通知已打开的程序（个别程序重启后才生效）；运行后保留，当前状态见 qk.Sys.Info().DarkMode。

| 参数声明 | 说明 |
|---|---|
| `bool dark` | 见本成员和所在域的说明。 |
| `string scope = "all"` | apps（应用）&#124; system（任务栏、开始菜单等系统界面）&#124; all（默认）。 取值：`apps`、`system`、`all`。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

<a id="sys-mediakey" />

## Sys.MediaKey

```csharp
void MediaKey(string key)
```

发送系统媒体播放键。全局生效，不需要目标窗口或键盘焦点（qk_run 的 target:'none' 可用）；响应的播放器由系统决定；只能发送这四个键（音量与静音请用 Sys.SetVolume）。失败报 HOST_FAILED。

| 参数声明 | 说明 |
|---|---|
| `string key` | playPause（播放/暂停）&#124; next（下一首）&#124; previous（上一首）&#124; stop；不区分大小写，不接受别名（play_pause 等报 INVALID_ARGUMENT）。 取值：`playPause`、`next`、`previous`、`stop`。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

<a id="sys-listdisks" />

## Sys.ListDisks

```csharp
DiskInfo[] ListDisks()
```

列出本机各驱动器的盘符、卷标、类型、文件系统、总容量与剩余空间（字节）。未就绪的驱动器（光驱无盘、断开的网络盘）IsReady 为 false，其余字段为 null，不报错；所有非固定盘（可移动盘、光驱、网络盘、内存盘、未知类型）并行探测，合计最多约 0.5 秒，无响应的按“未就绪、容量未知”报告（类型照实给出），不会被断开的网络盘或休眠的 USB 盘卡住。

返回类型：`DiskInfo[]`。空值、用户取消和异常行为以成员及域说明为准。

<a id="sys-searchsettings" />

## Sys.SearchSettings

```csharp
SettingsPage[] SearchSettings(string query, int limit = 10)
```

按关键词查 Windows 设置页（数据同搜索插件“Windows 设置”）：空白分隔的每个词都须出现在标题、分类或地址中（不区分大小写），标题更贴近的排前面；只收 ms-settings: 与 control.exe 目标；没有命中返回空数组。

| 参数声明 | 说明 |
|---|---|
| `string query` | 关键词，如 "蓝牙"、"wifi"、"默认应用"；多个词用空格分隔。 |
| `int limit = 10` | 最多返回条数，1–100。 |

返回类型：`SettingsPage[]`。空值、用户取消和异常行为以成员及域说明为准。

<a id="sys-opensettings" />

## Sys.OpenSettings

```csharp
void OpenSettings(string uri)
```

以普通权限打开 Windows 设置页，不等待窗口出现。uri 只接受 ms-settings: 开头的地址（按原样打开，不检查该页在当前 Windows 版本是否存在），或 SearchSettings 返回的 control.exe 目标；其他地址、命令（含 rundll32）报 INVALID_ARGUMENT；启动失败 PROCESS_FAILED。

| 参数声明 | 说明 |
|---|---|
| `string uri` | 如 "ms-settings:bluetooth"，或 SearchSettings 返回的 Uri（control.exe 目标须与目录中的命令逐字相同）。 |

返回类型：`void`。空值、用户取消和异常行为以成员及域说明为准。

<a id="sys-getnetwork" />

## Sys.GetNetwork

```csharp
NetworkInfo GetNetwork()
```

本机网络状态：是否联网，以及已连接的适配器（不含回环与隧道）的名称、类型、Wi-Fi 名称与信号、IPv4/IPv6、网关、DNS。绝不读取或返回 Wi-Fi 密码。Wi-Fi 名称与 IP 可识别用户。

返回类型：`NetworkInfo`。空值、用户取消和异常行为以成员及域说明为准。

<a id="sys-getperf" />

## Sys.GetPerf

```csharp
PerfInfo GetPerf()
```

整机性能（只读）：CPU 占用（约 0.5 秒采样，调用阻塞约半秒）与物理内存已用/总量（字节）；开机时长请用 Sys.Info().UptimeMs。

返回类型：`PerfInfo`。空值、用户取消和异常行为以成员及域说明为准。

{/* script-api:end */}
