---
title: "运行或打开"
description: "运行软件或命令，打开文件、文件夹或网址。效果类似于在Windows\"运行\"对话框中执行命令。"
slug: "/v2/xaction/modules/run"
sidebar_label: "运行或打开"
sidebar_position: 120
quickerDocKey: "xaction/module/sys:run"
comments: true
moduleKey: "sys:run"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-24 20:01:39"
legacyDocId: 1530304
legacyContentUpdatedAt: "2025-01-20T02:30:50.000Z"
---

# 运行或打开

启动一个 Windows 进程：跑 exe、打开文件或文件夹、打开网址或商店应用 URI。效果接近 Win+R「运行」。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:run" />

## 概述

常见用途：

- 启动 exe，按需带命令行参数
- 用关联程序打开文件
- 打开文件夹
- 打开网址，或 Windows 商店应用 URI（如 `ms-settings:`）
- 执行 `cmd`、`ping`、`control` 这类系统命令

<ModuleParamPreview
  moduleKey="sys:run"
  values={{
    path: 'notepad.exe',
    setWorkingDir: '1',
    windowStyle: '0',
    runas: 'false',
    activateWindowIfRunning: 'false',
    waitInputIdle: 'false',
    waitExit: 'false',
    outputEncoding: 'oem',
    stopIfFail: 'true',
  }}
/>

可运行的命令和 Win10 URI 可参考论坛：[可以运行的命令](https://getquicker.net/Forum/ViewTopic/172)。只打开网页时，也可以用 [打开网址](/v2/xaction/modules/openurl)。

## 参数说明

**路径或命令**：要启动或打开的目标，例如：

- Windows 命令：`cmd`、`ping`、`control`
- PATH 里的程序名（带不带 `.exe` 都行），或 exe 的完整路径
- 文件完整路径，如 `E:\Download\协议.doc`
- 网址，如 `https://getquicker.net`
- 商店应用 URI，如 `ms-settings:`

点输入框右侧 **…** 可以从已安装软件、文件、文件夹里选路径（菜单以当前软件为准）：

<ContextMenuPreview
  openPath={['已安装的软件...']}
  items={[
    {label: '已安装的软件...', icon: 'fa:Brands_Windows', tooltip: '选择开始菜单中可以找到的程序'},
    {label: '文件...', icon: 'fa:Light_File', tooltip: '选择已存在的文件路径'},
    {label: '文件夹...', icon: 'fa:Light_FolderOpen', tooltip: '选择文件夹路径'},
    {label: '另存路径...', icon: 'fa:Light_Save', tooltip: '选择文件要保存到的位置'},
    {type: 'separator'},
    {label: '窗口信息(拖动选择)...', icon: 'fa:Light_Crosshairs', tooltip: '选择窗口，获取窗口信息'},
    {label: '屏幕颜色(拖动选择)...', icon: 'fa:Light_EyeDropper', tooltip: '选择指定位置的颜色'},
    {label: '屏幕坐标(拖动选择)...', icon: 'fa:Light_Location', tooltip: '选择指定位置的坐标'},
    {type: 'separator'},
    {label: '选择动作ID...', tooltip: '选择动作并填入动作的ID'},
    {label: '选择图标...', tooltip: '选择内置的矢量图标名'},
  ]}
>
  <ModuleParamPreview
    moduleKey="sys:run"
    scrollBody={false}
    focusKeys={['path', 'arg']}
    values={{
      path: 'notepad.exe',
      arg: '',
    }}
  />
</ContextMenuPreview>

**参数(可选)**：传给 exe 的命令行参数，格式取决于目标程序。路径里可能有空格时，两端加英文双引号，避免被截断。

**以管理员身份运行**：会弹出 Windows 的 UAC 确认。非必要不要开。

**激活窗口快捷键**：目标软件若支持热键唤起已有窗口，按 [模拟按键B](/v2/xaction/modules/sendkeys) 的格式填写；可点输入框右侧键盘按钮录入。旧步骤里若误填成 `false` / `true` / `0` / `1`，运行时会当成空（不当热键）。

**如果程序已运行则尝试激活窗口**：已有同名进程时先试着激活窗口，而不是再开一份。**路径或命令** 要写成 exe 的完整路径，才能靠它判断进程。依赖目标软件；多进程、一进程多窗口、缩到托盘时通常不行。

**备用路径**：同一动作在不同电脑上 exe 路径不一样时，每行写一条备用完整路径。

**工作目录**：进程的当前目录。留空或 `0` 用系统默认；`1` 用 exe 所在目录（此时路径必须是完整路径）；也可以写成具体目录。例如执行 `cmd` 时填 `d:\`，窗口会进到该盘。

**窗口风格**：普通、隐藏、最小化、最大化。是否生效取决于目标软件。路径若是 `.lnk` 快捷方式，此参数无效，请直接写 exe 完整路径。

**等待启动完成**：等进程初始化完、能接受输入后再继续。只对部分软件有效。要拿主窗口句柄或标题时，常常需要打开它。

**等待进程结束**：等进程退出后再跑后面的步骤。

**用户名** / **密码**：需要用本机另一个 Windows 账号启动时再填。

**控制台输出编码**：控制台输出乱码时，在 `OEM` 和 `UTF8` 之间换一下。

**环境变量**：给进程额外环境变量。每行 `变量名=值`，例如 `CONFIG_FILE=d:\config.json`。

**失败后停止**：启动失败时是否中止动作。默认开启。

## 输出

- **是否成功**：是否启动成功。
- **PID**：进程 ID。
- **主窗口句柄** / **主窗口标题**：不是每个进程都有主窗口；拿不到时打开 **等待启动完成** 再试。
- **控制台输出**：仅控制台程序必要时再用。会自动等待进程结束；stdout 为空时改出 stderr。
- **stdout输出** / **stderr输出**：分别捕获，同样会等待进程结束。
- **退出代码**：进程 ExitCode。输出此项时会自动等待进程结束。

不要随便接控制台输出或退出代码，否则动作会卡在等进程退出。

## 示例动作

<StepProgramView example="abf666ed-08bc-46a9-6d8a-08d6bfa4ff29" />

<ShareLinkCard
  code="abf666ed-08bc-46a9-6d8a-08d6bfa4ff29"
  title="示例：运行或打开"
  description="演示“运行或打开”模块"
  author="CL"
/>

依次演示：记事本、打开 `C:\Program Files`、打开论坛帖、用记事本打开 hosts。

## 限制与排障

- 激活已有窗口、窗口风格都依赖目标软件，先实机试。
- 用 `.lnk` 时窗口风格不生效。
- 接了控制台输出或退出代码，会一直等到进程结束。
- 管理员运行会出 UAC，无人值守动作容易卡在确认框。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/openurl',
      label: '打开网址',
      description: '只打开网页时用这个更直接。',
    },
    {
      href: '/v2/xaction/modules/sendkeys',
      label: '模拟按键B',
      description: '激活窗口快捷键的写法。',
    },
    {
      href: '/v2/xaction/modules/runscript',
      label: '运行脚本',
      description: '跑一段脚本而不是启动外部程序。',
    },
  ]}
/>

## 更新历史

- v1.0.2：增加「等待启动完成」，以及 PID、主窗口句柄、主窗口标题。
- 1.5.7：增加「失败后停止」。
- 20250120：完善文档。
