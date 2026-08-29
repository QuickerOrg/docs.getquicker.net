---
title: "窗口操作"
description: "Window窗口相关操作"
slug: "/v2/xaction/modules/windowoperations"
sidebar_label: "窗口操作"
sidebar_position: 30
quickerDocKey: "xaction/module/sys:windowOperations"
comments: true
moduleKey: "sys:windowOperations"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-29 16:36:01"
legacyDocId: 2117672
legacyContentUpdatedAt: "2024-08-15T08:31:00.000Z"
---

# 窗口操作

移动、置顶、显示或关闭指定的 Windows 窗口。要先按标题或进程找到窗口，用 [获取窗口信息/查找窗口](/v2/xaction/modules/getwindowtitle)。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:windowOperations" />

## 概述

**窗口句柄** 留空或 `0` 表示操作前台窗口。换 **类型** 后会显示对应参数。

<ModuleParamPreview moduleKey="sys:windowOperations" />

## 参数说明

**类型**：移动窗口、移动窗口(增强)、置顶窗口、切换置顶状态、取消置顶窗口、置底窗口、设置显示状态、设置为前台窗口、关闭、切换 / 关闭 / 最小化 / 恢复类似窗口、贴边隐藏、强制关闭、设置或更新透明度、设置边框颜色。

**窗口句柄**：要操作的窗口句柄。留空表示前台窗口。

**失败后停止**：失败是否中止动作。默认开启。

### 移动窗口

<ModuleParamPreview
  moduleKey="sys:windowOperations"
  focusKeys={['type', 'hWnd', 'x', 'y', 'width', 'height']}
  values={{type: 'move', hWnd: '', x: '100', y: '100', width: '500', height: '500'}}
/>

**X坐标** / **Y坐标**：窗口左上角。屏幕左上角为 `0,0`，向右 X 增加，向下 Y 增加。

**宽度** / **高度**：像素。`-1` 或小于 0 表示不改尺寸。

### 移动窗口(增强)

按百分比或像素指定左、上、右、下：

- `50%,0,100%,100%`：右侧半屏
- `25%,25%,75%,75%`：屏幕中央、约为屏幕 1/4
- `100,100,500,500`：绝对坐标
- `100,100,50%,50%`：像素和百分比混用

<ModuleParamPreview
  moduleKey="sys:windowOperations"
  focusKeys={['type', 'hWnd', 'area']}
  values={{type: 'move_ex', hWnd: '', area: '25%,25%,75%,75%'}}
/>

**目标位置**：`左,上,右,下`。四个值都从屏幕左上角 `(0,0)` 量起；**右**、**下** 是窗口右/下边缘到屏幕左/上边缘的距离（相对工作区宽/高），不是窗口自身的宽和高。

| 边 | 量什么 | 示例值 |
| --- | --- | --- |
| 左 | 窗口左边缘 → 屏幕左边缘 | `20%` |
| 上 | 窗口上边缘 → 屏幕上边缘 | `25%` |
| 右 | 窗口右边缘 → 屏幕左边缘（相对工作区**宽度**） | `55%` |
| 下 | 窗口下边缘 → 屏幕上边缘（相对工作区**高度**） | `60%` |

上表即 `20%,25%,55%,60%`：窗口左缘在宽 20%、上缘在高 25% 处，右缘在宽 55%、下缘在高 60% 处，约占屏幕中央 35%×35% 区域。

### 置顶 / 置底 / 前台 / 关闭

- **置顶窗口** / **切换置顶状态** / **取消置顶窗口**：改置顶。
- **置底窗口**：把窗口放到其它窗口后面。
- **设置为前台窗口**：显示并取得焦点。
- **关闭**：相当于点右上角 ×，窗口可能询问是否保存。
- **强制关闭**：可能造成数据丢失。

### 设置显示状态

<ModuleParamPreview
  moduleKey="sys:windowOperations"
  focusKeys={['type', 'hWnd', 'showCmd', 'isSuccess']}
  values={{type: 'show', hWnd: '', showCmd: '3'}}
/>

**显示状态**：最大化、最小化、显示并恢复大小、隐藏、显示、切换最大化/恢复。对应 Win32 `ShowWindow`。

### 设置或更新透明度

<ModuleParamPreview
  moduleKey="sys:windowOperations"
  focusKeys={['type', 'hWnd', 'alpha']}
  values={{type: 'set_trans', hWnd: '', alpha: '128'}}
/>

**不透明度Alpha**：

- `0`–`255` 的整数：`0` 全透明，`255` 不透明。
- `+数字`：减少透明度（更不透明），加号不能省。
- `-数字`：增加透明度（更透明）。

### 设置边框颜色

**窗口边框颜色**：`#RRGGBB`；兼容已有的 `#AARRGGBB` 输入，但透明度会被忽略。此操作中留空恢复系统默认，`none` 隐藏边框。

### 类似窗口

类似窗口不是按标题文字模糊匹配，而是由 Quicker 根据目标窗口所属应用和窗口身份筛选可见顶层窗口；文件资源管理器、共享运行时进程等会使用额外身份信息，避免把无关应用一起处理。目标句柄留空时，以执行步骤时的前台窗口为基准。

<ModuleParamPreview
  moduleKey="sys:windowOperations"
  focusKeys={['type', 'hWnd', 'closeSimilarKeepCurrent', 'switchSimilarDirection', 'matchedCount', 'skippedCount']}
  values={{type: 'closeSimilar', hWnd: '', closeSimilarKeepCurrent: false}}
/>

- **关闭类似窗口**：默认向包括当前窗口在内的全部匹配窗口投递正常关闭请求；勾选 **保留当前窗口** 后只关闭其它窗口。正常关闭可能弹出保存确认，步骤只表示关闭请求已投递，不等待所有窗口真正退出。
- **切换到下一个类似窗口**：按稳定环序切到“下一个”或“上一个”；此顺序不随窗口 Z 序和最近激活顺序变化。
- **最小化类似窗口**：最小化全部匹配窗口；已经最小化的窗口计入跳过数。
- **恢复类似窗口**：只恢复已最小化的匹配窗口，并保留其原来的普通 / 最大化状态；未最小化窗口计入跳过数。

执行前会再次核验窗口身份。窗口在枚举后关闭、重建或身份变化时会被跳过，以免操作到被复用的句柄。

### 贴边隐藏

<ModuleParamPreview
  moduleKey="sys:windowOperations"
  focusKeys={['type', 'hWnd', 'edgeAutoHideAction', 'edgeAutoHideEdge', 'edgeAutoHideRevealDip', 'edgeAutoHideDelayMs', 'borderColor', 'isEdgeAutoHideEnabled']}
  values={{type: 'edgeAutoHide', hWnd: '', edgeAutoHideAction: 'toggle', edgeAutoHideEdge: 'auto', edgeAutoHideRevealDip: 4, edgeAutoHideDelayMs: 600, borderColor: ''}}
/>

1. 选择 **启用**（或使用默认的 **切换**）后，再把窗口拖到屏幕工作区的外沿。
2. 窗口贴边后会置顶；鼠标离开并经过 **隐藏延迟** 后自动藏到边缘，只保留 **保留宽度**。
3. 把鼠标移到保留条附近可唤出窗口。选择 **停用并恢复** 会结束接管并把窗口恢复到可见位置。

**边缘** 可设为自动、左、上、右或下；自动会根据拖到的外沿决定。**保留宽度** 范围为 2–16 DIP，默认 4；**隐藏延迟** 范围为 100–5000 毫秒，默认 600。**窗口边框颜色** 留空使用默认高亮蓝 `#468FFC`，填写 `none` 可关闭边框反馈。

普通最大化时会暂停贴边隐藏，恢复窗口后继续；全屏、最小化、弹出 / 工具窗口、桌面与任务栏等系统窗口、Quicker 自身窗口，以及权限高于当前 Quicker 的窗口不支持启用。多个 Quicker 实例不会互相抢占同一窗口。

## 输出

- **是否成功**
- **是否置顶**：仅 **切换置顶状态**。操作后窗口是否置顶。
- **是否已启用贴边隐藏**：仅 **贴边隐藏**。
- **匹配窗口数** / **跳过窗口数**：类似窗口操作。
- **已投递关闭请求数** / **关闭请求失败数** / **权限拒绝数**：仅 **关闭类似窗口**。
- **已处理窗口数** / **操作失败数**：仅 **最小化类似窗口**、**恢复类似窗口**。

## 限制与排障

部分全屏或受保护窗口无法移动、改透明度或执行批量操作。目标进程权限高于 Quicker 时，关闭请求可能被拒绝；可按需以同等权限运行 Quicker。强制关闭前确认没有未保存内容。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/getwindowtitle',
      label: '获取窗口信息/查找窗口',
      description: '先按标题或进程拿到句柄。',
    },
    {
      href: '/v2/xaction/modules/restoreactivewindow',
      label: '恢复活动窗口',
      description: '把焦点还给动作开始前的窗口。',
    },
  ]}
/>
