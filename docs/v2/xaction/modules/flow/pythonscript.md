---
title: "运行Python代码"
description: "执行Python代码片段。"
slug: "/v2/xaction/modules/pythonscript"
sidebar_label: "运行Python代码"
sidebar_position: 140
quickerDocKey: "xaction/module/sys:pythonscript"
comments: true
moduleKey: "sys:pythonscript"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-24 20:01:39"
legacyDocId: 84031885
legacyContentUpdatedAt: "2025-06-24T01:29:03.000Z"
---

# 运行Python代码

在动作里执行一段 Python 3 代码。通过 `quicker.context` 读写动作变量。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:pythonscript" />

## 概述

本模块用 [pythonnet](https://github.com/pythonnet/pythonnet) 接入。当前组件版本为 pythonnet 3.2.1，支持 Python 3.11–3.15。Quicker V2 为 x64 程序，请安装 64 位 Python。

<ModuleParamPreview moduleKey="sys:pythonscript" />

## 参数说明

**脚本内容**：要执行的 Python。用 `quicker.context.GetVarValue('变量名')` 读动作变量，用 `quicker.context.SetVarValue('变量名', value)` 写回。

**Python环境路径**：可选。Python 解释器 DLL 的完整路径或所在目录，例如 `C:\Python311\python311.dll` 或 `C:\Python311`。留空时使用全局设置（**Quicker 设置 → 模块功能选项 → 运行Python脚本**）。

![](./img/pythonscript-002-3a4b58c14a.png)

未在模块里指定、全局也留空时，Quicker 会先检查 `PYTHONHOME` 指向的目录，再查找 PATH 中路径包含 `python` 的目录，从中选择解释器 DLL。目录名不必与 DLL 的版本号一致，例如 `pythoncore-3.14-64` 目录内的 `python314.dll` 也可以识别。同一目录有多个版本时，优先选择符合最低版本要求的较新版本。

**失败后停止**：失败后是否停止动作。默认开启。

## 输出

- **是否成功**：操作是否成功。

## 从 Python 返回内容

简单值可以直接 `SetVarValue`。1.35.37+ 也可以这样返回文本列表和简单词典：

```python
##.py
quicker.context.SetVarValue('text', 'hello world')
quicker.context.SetVarValue('list', ['hello1','hello2','hello3'])
quicker.context.SetVarValue('dict', {'a':1, 'b':2, 'day':'2022-1-1'})
```

不要返回更复杂的数据类型（从 Python 转到 C# 可能出奇怪问题）。尽量在 Python 里处理完，只把简单值交回动作。

## 限制与排障

- 请使用 [python.org](https://www.python.org/downloads/windows/) 官方安装包。第三方发行版可能跑不起来。
- 当前 pythonnet 3.2.1 支持 Python 3.11–3.15（见 [官方版本要求](https://pypi.org/project/pythonnet/3.2.1/)）。Python 3.10 及以下版本不再受支持；旧版 Quicker 的支持范围取决于其内置组件版本。
- 请指定带版本号的解释器 DLL（例如 `python311.dll`），不能选择 `python3.dll` 转发库。升级 Python 后，请重新选择环境路径。
- 尽量只访问数字、文本等简单类型。列表、词典等复杂类型有概率导致闪退。
- 脚本在 Quicker 进程里执行，权限高于普通非管理员程序，因此不能用 COM 去控制第三方软件（例如 `Word.Application`）。

## 示例动作

<StepProgramView example="e4ec073a-1f86-449c-8001-08da66cce8dc" />

<ShareLinkCard
  code="e4ec073a-1f86-449c-8001-08da66cce8dc"
  title="python测试"
  description="测试"
  author="CL"
/>

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/jsscript',
      label: '运行Javascript代码',
      description: '不依赖本机 Python 的脚本片段。',
    },
    {
      href: '/v2/xaction/modules/csscript',
      label: '运行C#代码',
      description: '需要 COM 时改用低权限模式的 C#。',
    },
    {
      href: '/v2/xaction/modules/runscript',
      label: '运行脚本',
      description: '写成临时文件再交给外部解释器。',
    },
  ]}
/>

## 更新历史

- 1.35.37 可直接指定 Python 主运行库路径；可用 `SetVarValue` 返回列表和简单词典。
- 20230215 增加注意事项。
