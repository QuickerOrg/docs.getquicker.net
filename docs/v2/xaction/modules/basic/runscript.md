---
title: "运行脚本"
description: "运行脚本。"
slug: "/v2/xaction/modules/runscript"
sidebar_label: "运行脚本"
sidebar_position: 130
quickerDocKey: "xaction/module/sys:runScript"
comments: true
moduleKey: "sys:runScript"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-24 20:01:39"
legacyDocId: 1530436
legacyContentUpdatedAt: "2022-02-13T05:45:37.000Z"
---

# 运行脚本

执行一段脚本。除 CMD 命令外，会先写入临时文件再交给对应程序。启动现成 exe / 打开文件请用 [运行或打开](/v2/xaction/modules/run)。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:runScript" />

## 概述

<ModuleParamPreview moduleKey="sys:runScript" />

## 参数说明

**脚本内容**：要执行的代码，可用插值。CMD 命令类型不要写太复杂（多行会用 `&` 拼成一行）。

**脚本类型**：

- **CMD命令 (完成后保留窗口)**：`cmd /K`
- **CMD命令 (完成后关闭窗口)**：`cmd /C`
- **CMD命令 (隐藏命令行窗口)**：`cmd /c` 且不显示窗口。此时不能以管理员运行。
- **BAT批处理脚本(.bat)** / **CMD批处理脚本(.cmd)**：写入对应扩展名后执行。
- **PowerShell脚本(.ps1)**：`powershell.exe -NoProfile -ExecutionPolicy Unrestricted -File {fileName}`
- **AutoHotKey脚本(.ahk)**：需要本机已安装 AutoHotKey。
- **自定义脚本类型**：自己指定扩展名和运行程序。

<PreviewMarks
  marks={[
    {key: 'ext', label: '自定义扩展名，如 .ps1'},
    {key: 'runner', label: '双击能跑就可留空；否则填程序路径'},
  ]}
>
  <ModuleParamPreview
    moduleKey="sys:runScript"
    scrollBody={false}
    focusKeys={['type', 'ext', 'runner', 'argTemplate']}
    values={{
      type: 'CUSTOM',
      ext: '.vbs',
      runner: 'cscript.exe',
      argTemplate: '%FILE%',
    }}
  />
</PreviewMarks>

**扩展名**：仅自定义。如 `.ps1`。

**使用指定软件**：仅自定义。双击就能跑可留空；否则写程序完整路径。已在 PATH 里可以只写文件名，例如 `cscript.exe`。

**命令行参数模板**：仅自定义。`%FILE%` 代表生成的临时脚本路径。

**文件编码**：写入临时文件的编码。不合适会不执行或乱码。bat / cmd 一般用系统默认。

**工作目录**：留空则用资源管理器当前窗口路径（在资源管理器上触发时）或桌面。

**脚本参数**：追加到命令行。自定义和三种 CMD 命令类型不可用。

**以管理员身份运行**：隐藏窗口或把控制台输出接到变量时无效。

**等待进程结束**：等这个进程退出再继续。脚本里再拉起的子进程不会被等。

**控制台输出编码**：控制台乱码时在 OEM / UTF8 之间切换。

**失败后停止**：启动失败是否中止动作。默认开启。

## 输出

接下面任一项都会自动等待进程结束，并且不显示命令行窗口：

- **控制台输出**：stdout；为空则出 stderr。
- **标准输出**：只捕获 stdout。
- **错误输出**：只捕获 stderr。

## 限制与排障

- 隐藏窗口或输出控制台时，不能用管理员身份。
- CMD 命令类型把多行收成一行，复杂批处理请改用 BAT / CMD 文件类型。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/run',
      label: '运行或打开',
      description: '启动已有程序或打开文件，而不是跑脚本正文。',
    },
  ]}
/>
