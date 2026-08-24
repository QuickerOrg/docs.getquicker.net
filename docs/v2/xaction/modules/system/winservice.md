---
title: "Windows服务和注册表"
description: "获取Windows服务的状态、注册表项信息"
slug: "/v2/xaction/modules/winservice"
sidebar_label: "Windows服务和注册表"
sidebar_position: 220
quickerDocKey: "xaction/module/sys:winservice"
comments: true
moduleKey: "sys:winservice"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-24 20:01:39"
legacyDocId: 88864932
legacyContentUpdatedAt: "2022-08-08T08:45:27.000Z"
---

# Windows服务和注册表

读取某个 Windows 服务的运行状态，列出服务，或读取注册表项的值（常用来判断组件是否已安装）。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:winservice" />

## 概述

<ModuleParamPreview moduleKey="sys:winservice" />

## 参数说明

**操作类型**：获取某个服务的信息、获取 Windows 服务列表、获取注册表项值。

**失败后停止**：失败是否中止动作。默认开启。

### 获取某个服务的信息

**服务名**：服务名称（不是显示名），大小写敏感。可在服务属性里查看：

![](./img/winservice-002-cf7a93ab93.png)

输出：

- **是否存在**：电脑上是否有此服务。
- **显示名**
- **服务状态**：数字。`4` 表示运行中。

| 名称 | 值 | 说明 |
| --- | --- | --- |
| Stopped | 1 | 未运行 |
| StartPending | 2 | 正在启动 |
| StopPending | 3 | 正在停止 |
| Running | 4 | 正在运行 |
| ContinuePending | 5 | 即将继续 |
| PausePending | 6 | 即将暂停 |
| Paused | 7 | 已暂停 |

### 获取 Windows 服务列表

<ModuleParamPreview
  moduleKey="sys:winservice"
  focusKeys={['operation', 'serviceList']}
  values={{operation: 'getServiceList'}}
  outputVars={{serviceList: 'serviceList'}}
/>

输出 **服务名列表**。

### 获取注册表项值

可用于判断某项是否存在，并读取其值。

![](./img/winservice-004-75a1446712.png)

<ModuleParamPreview
  moduleKey="sys:winservice"
  focusKeys={['operation', 'regKeyPath', 'regValueName', 'isExists', 'regValue']}
  values={{operation: 'getRegValue', regKeyPath: 'HKCU\\Software\\Quicker', regValueName: 'installed'}}
  outputVars={{isExists: 'isExists', regValue: 'regValue'}}
/>

**注册表项路径**：左侧树节点的路径，如 `HKEY_CURRENT_USER\Software\Quicker`。

**值名称**：右侧列表里的值名。留空对应「(默认)」。

输出：

- **是否存在**：指定的注册表**项**是否存在（不是右侧某个值条目是否存在；值不存在时 **值** 为空字符串）。
- **值**：转为文本后的实际值。

## 输出

随操作类型变化，见上。

## 限制与排障

服务名必须是内部名（如 `Spooler`），不是「Print Spooler」这种显示名。读 `HKLM` 等受保护位置可能因权限失败。**是否存在** 对注册表指的是项，不是值。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/getsysinfo',
      label: '获取系统或动作信息',
      description: '读系统版本、用户和 Quicker 状态。',
    },
    {
      href: '/v2/xaction/modules/checkprocessexists',
      label: '检查程序已启动/获取进程信息',
      description: '查的是进程，不是 Windows 服务。',
    },
  ]}
/>
