---
title: "显示图片"
description: "在屏幕上显示图片。输入文件路径/url或图片变量。"
slug: "/v2/xaction/modules/showimage"
sidebar_label: "显示图片"
sidebar_position: 130
quickerDocKey: "xaction/module/sys:showImage"
comments: true
moduleKey: "sys:showImage"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-24 20:01:39"
legacyDocId: 2113283
legacyContentUpdatedAt: "2025-05-11T08:37:04.000Z"
---

# 显示图片

在屏幕上显示文件、网址、变量或剪贴板里的图片，也可以按标识关闭窗口或查询窗口信息。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:showImage" />

## 概述

<ModuleParamPreview moduleKey="sys:showImage" />

**操作/来源** 可选：

- **显示：图片文件或网络图片**
- **显示：变量中的图片**
- **显示：剪贴板图片**
- **关闭图片窗口**
- **获取图片窗口信息**
- **获取所有图片窗口标识**

## 参数说明

**操作/来源**：图片来源，或关闭 / 查询窗口。

**路径/网址**：仅显示文件或网络图片。本机图片的完整路径，或网络图片 URL。

**图片变量**：仅显示变量中的图片。由截图或读文件得到的图片变量。

**初始缩放比例**：仅显示类操作。`1` 为原始大小，`0.5` 为边长一半，`1.5` 为 1.5 倍。`-1` 表示自动（大图会缩小）。默认 `1`。

**唯一性标识**：显示、关闭、获取窗口信息时可用。自定义窗口 ID，方便之后按 ID 关闭或查询。显示时也会先关掉同标识的旧窗口。

**自动关闭时间**：仅显示类操作。几秒后自动关闭，可为小数。`0` 表示不自动关，由用户双击或右键关闭。默认 `0`。

**不透明度**：仅显示类操作。`0`–`1` 的小数，`1` 完全不透明，`0` 完全透明。默认 `1`。

**显示位置**：仅显示类操作。

- **自动**：由 Windows 决定
- **屏幕中间**、**屏幕左上**、**屏幕中上**、**屏幕右上**、**屏幕左中**、**屏幕右中**、**屏幕左下**、**屏幕中下**、**屏幕右下**
- **自定义位置**：再填 **位置坐标**

**位置坐标**：仅显示类操作，且 **显示位置** 为 **自定义位置**。格式：

- `left,top`，如 `100,200`。阴影会占一点宽度，实际画面会略靠下、靠右。
- `left,top,right,bottom`，通常来自截图得到的范围；右下角不会严格卡死这个数字。

1.42.23+ 若希望图片落在指定范围内并自适应缩放：把 **初始缩放比例** 设为 `-1`，**显示位置** 选 **自定义位置**，**位置坐标** 写成 `left,top,right,bottom`。数字可以是像素，也可以是屏幕百分比，如 `100,100,500,500` 或 `100,100,50%,50%`。

<StepProgramView example="3d9f7fbb-752a-40f5-d827-08d86cbb0005" />

<ShareLinkCard
  code="3d9f7fbb-752a-40f5-d827-08d86cbb0005"
  title="截图贴图"
  description="截图后在原位置贴图"
  author="CL"
/>

**等待图片关闭**：仅显示类操作。是否等图片关掉后再继续后面的步骤。默认关闭。

**显示阴影**：仅显示类操作。是否显示边框阴影。默认开启。

**显示任务栏图标**：仅显示类操作。是否在任务栏显示图标。默认开启。

**是否置顶显示**：仅显示类操作。是否总在最前，避免被普通窗口挡住。默认开启。

**不激活窗口**：仅显示类操作。显示时不抢焦点（此时无法用 Esc 关闭）。默认关闭。

**丢失焦点时自动关闭**：仅显示类操作。焦点离开图片窗口后自动关闭。默认关闭。

**ToolTip提示文字**：仅显示类操作。鼠标悬停在图片上时显示的提示。

**关闭窗口回调参数**：仅显示类操作。可选。填写后，关闭窗口时会再次运行当前动作，并把这段内容当作动作参数传入（1.44.8+，[需求说明](https://getquicker.net/Common/Topics/ViewTopic/33091)）。不填则不回调。

## 输出

- **是否存在**：仅获取图片窗口信息。是否存在指定标识的窗口。
- **窗口句柄**：显示类操作，以及获取图片窗口信息。图片窗口的系统句柄。
- **最终贴图位置**：显示类操作（需开启 **等待图片关闭**），以及获取图片窗口信息。移动窗口后的位置，格式 `left,top,right,bottom`。
- **窗口标识列表**：仅获取所有图片窗口标识。当前已打开窗口的标识列表。

## 其它操作类型

**关闭图片窗口**：关掉具有指定 **唯一性标识** 的图片窗口。

<ModuleParamPreview
  moduleKey="sys:showImage"
  focusKeys={['source', 'autoCloseKey']}
  values={{source: 'closeWindow', autoCloseKey: '每日一图'}}
/>

**获取图片窗口信息**：按标识查询窗口是否还在。

<ModuleParamPreview
  moduleKey="sys:showImage"
  focusKeys={['source', 'autoCloseKey', 'isExists', 'hwnd']}
  values={{source: 'getState', autoCloseKey: '每日一图'}}
/>

**获取所有图片窗口标识**：列出当前已打开窗口的标识。

<ModuleParamPreview
  moduleKey="sys:showImage"
  focusKeys={['source', 'windowIdList']}
  values={{source: 'getImageWindows'}}
  outputVars={{windowIdList: 'list'}}
/>

<StepProgramView example="8e49c374-062d-4824-979c-08db3d4a9dcd" />

<ShareLinkCard
  code="8e49c374-062d-4824-979c-08db3d4a9dcd"
  title="关闭所有图片窗口"
  description="关闭所有的显示图片窗口"
  author="CL"
/>

## 图片窗口的使用

![](./img/showimage-005-04f2c536e2.png)

### 右键菜单

- 关闭：关闭图片
- 重置：恢复默认大小、旋转、透明度等
- 不透明度：数值越低越透明
- 大小：缩放比例
- 旋转：旋转某个角度
- 镜像：左右或上下翻转
- 显示/隐藏阴影
- 复制图片：复制到剪贴板
- 另存为：保存到文件
- 操作提示：显示鼠标快捷操作说明

### 鼠标操作

- 滚轮：调整缩放
- Shift+滚轮：按像素微调尺寸
- Ctrl+滚轮：调整透明度
- Alt+滚轮：旋转
- 中键单击：恢复视图（缩放和旋转）
- 左键双击：关闭图片

**快速保存**：Ctrl+拖拽图片到桌面、资源管理器或其它程序（如 Word），可直接存文件或嵌入文档。

![](./img/showimage-006-4786e0565a.gif)

### 键盘操作

1.35.36+。图片窗口拥有焦点时，周围会显示蓝色阴影边框，此时可用键盘操作。

![](./img/showimage-007-f103c6ff39.png)

- `Esc`：关闭
- 方向键 / ESDF：移动窗口
- Shift+方向键 / ESDF：更快移动
- `Ctrl+=` / `Ctrl+-`：缩放
- `R`：重置
- `C` 或 `Ctrl+C`：复制图片
- `Ctrl+S`：另存
- `Alt+左` / `Alt+右`：旋转

### 其它说明

置顶且不显示任务栏图标时，图片窗口不会出现在 Alt+Tab 切换列表里。

![](./img/showimage-008-d0ba16464e.png)

## 限制与排障

- **不激活窗口** 开启后无法用 Esc 关闭，请改用双击、右键或「关闭图片窗口」。
- 要拿 **最终贴图位置**，显示时须勾选 **等待图片关闭**，或改用「获取图片窗口信息」。
- 自适应缩放到指定矩形：缩放设为 `-1`，位置用 `left,top,right,bottom`（1.42.23+）。
- 关闭回调会再次启动当前动作，注意避免写成关不掉的循环。

## 示例动作

<ShareLinkCard
  items={[
    {
      code: '78e28478-b1ea-421e-75d3-08d692da05cc',
      title: '原尺寸图片',
      description: '获得图片网址后，以原始尺寸显示。',
      author: 'CL',
    },
    {
      code: 'b1c9e1a0-bb9a-41ad-6798-08d67448baf3',
      title: '批量贴图',
      description: '选择图片后贴到屏幕上，未选择则贴剪贴板。',
      author: 'xiuluoc',
    },
    {
      code: '9bfc34fb-b7f7-40bd-6d0c-08d6c304e16e',
      title: '截图',
      description: '截图后贴在屏幕上，可拖动、缩放；步骤较多，请到动作库查看。',
      author: 'Marcusx',
    },
  ]}
/>

## 相关链接

<RelatedDocs
  layout="cards"
  items={[
    {
      href: '/v2/features/screenshot/capture-pro',
      label: '截图 Pro 功能说明',
      description: '截图完成后也可以直接贴图；贴图操作与本模块相近。',
      featured: true,
    },
    {
      href: '/v2/xaction/modules/screen-capture-pro',
      label: '截图 Pro 步骤',
      description: '截完再交给本模块，或直接勾选「截图后贴图」。',
    },
    {
      href: '/v2/xaction/modules/screencapture',
      label: '屏幕截图',
      description: '经典截图步骤，截完再贴到屏幕上。',
    },
    {
      href: '/v2/xaction/modules/imgprocess',
      label: '图片处理',
      description: '显示前先缩放、裁剪或调色。',
    },
    {
      href: '/v2/xaction/concepts/quicker_in_param',
      label: '为动作传递参数',
      description: '关闭窗口回调会把参数写入 quicker_in_param。',
    },
  ]}
/>

## 更新历史

- 1.6.7 增加「位置坐标」。
- 增加不在 Alt+Tab 列出的说明。
- 20240327 支持自适应缩放。
- 20250511 支持关闭窗口时回调动作。
