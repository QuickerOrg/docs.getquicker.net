---
title: "运行或停止动作"
description: "执行指定的其他动作"
slug: "/v2/xaction/modules/runaction"
sidebar_label: "运行或停止动作"
sidebar_position: 90
quickerDocKey: "xaction/module/sys:runAction"
comments: true
moduleKey: "sys:runAction"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-24 20:01:39"
legacyDocId: 2133919
legacyContentUpdatedAt: "2025-01-20T02:46:30.000Z"
---

# 运行或停止动作

运行、停止指定动作，或显示它的右键菜单。也可以再跑一遍当前动作、停掉其它实例、查询自己编写的动作正在跑几个。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:runAction" />

## 概述

<ModuleParamPreview moduleKey="sys:runAction" />

## 参数说明

**类型**：

- **运行动作**
- **停止动作**
- **显示动作右键菜单**
- **运行当前动作（注意避免产生循环或递归）**
- **停止当前动作的其它实例**
- **获取动作运行个数（自己编写动作时可用）**

**目标动作**：仅运行 / 停止 / 显示右键菜单 / 获取运行个数。可以是：

- 动作 ID（GUID，例如 `7521f699-fcab-43b9-9686-560de2c8aa92`）。在动作上右键 → **信息** → **复制动作ID**。
- 动作名称。必须完全匹配，且不能有重名。
- 动作库中的 ID（仅「运行动作」）：已从动作库安装的，或本机分享到动作库的（1.5.27+）。

![](./img/runaction-002-2be955ab7f.png)

**仅显示动作的自定义菜单**：仅「显示动作右键菜单」。不显示编辑、复制等系统项。见[为动作设计自定义右键菜单](/v2/xaction/concepts/action-custom-context-menu)。

<ModuleParamPreview
  moduleKey="sys:runAction"
  focusKeys={['type', 'actionId', 'onlyCustomMenu']}
  values={{type: 'ShowActionContextMenu', actionId: '', onlyCustomMenu: 'false'}}
/>

**等待运行结束**：仅运行动作 / 运行当前动作。等目标跑完再继续。要取「动作输出」必须勾选。不勾选则启动后立刻往下走。

**命令参数**：仅运行动作 / 运行当前动作。传给目标，写入该动作的 `quicker_in_param`。见[为动作传递参数](/v2/xaction/concepts/quicker_in_param)。

**调试模式运行**：仅运行动作 / 运行当前动作。以调试模式启动（方便调动作右键菜单项）。

<ModuleParamPreview
  moduleKey="sys:runAction"
  focusKeys={['type', 'inputParam', 'wait', 'debug']}
  values={{type: 'StartCurrentAction', inputParam: '', wait: 'true', debug: 'false'}}
/>

**不显示提示消息**：仅停止动作。隐藏「动作已停止」提示。只对非动作库安装的动作有效。

<ModuleParamPreview
  moduleKey="sys:runAction"
  focusKeys={['type', 'actionId', 'hideMessage']}
  values={{type: 'StopAction', actionId: '等待点击', hideMessage: 'false'}}
/>

**失败后停止**：找不到目标动作时，是否停止当前动作。默认开启。

## 输出

- **是否成功**：操作是否成功。
- **动作名称**：仅运行动作。用 ID 指定时，这里给出动作名称，方便提示用户。
- **动作输出**：仅运行动作 / 运行当前动作。被调用动作里用[停止](/v2/xaction/modules/stop)设定的返回值。需勾选「等待运行结束」。
- **运行个数**：仅获取动作运行个数。该动作当前正在跑的实例数。基于安全考虑，只能查自己编写的动作，不能查动作库安装的动作。

## 限制与排障

「运行当前动作」不要写成停不下来的递归。获取运行个数只支持自己开发的动作。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/stop',
      label: '停止(return)',
      description: '被调用动作用「返回值」把结果交回来。',
    },
    {
      href: '/v2/xaction/concepts/quicker_in_param',
      label: '为动作传递参数',
      description: '「命令参数」会写入 quicker_in_param。',
    },
    {
      href: '/v2/xaction/concepts/action-custom-context-menu',
      label: '自定义右键菜单',
      description: '「仅显示动作的自定义菜单」时只出现这些项。',
    },
  ]}
/>

## 更新历史

- 20250120 完善文档以匹配实际功能。
