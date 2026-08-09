---
title: "鼠标输入"
description: "模拟鼠标输入"
slug: "/v2/xaction/modules/mouse"
sidebar_label: "鼠标输入"
sidebar_position: 80
quickerDocKey: "xaction/module/sys:mouse"
comments: true
moduleKey: "sys:mouse"
docStatus: "migrated-unreviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
metadataHash: "9c9d2be3cb84a1ff1225e03bf43eb981e090d4bbd427f6eb3256e10cc39976fb"
legacyDocId: 1453657
legacyContentUpdatedAt: "2025-01-20T02:00:01.000Z"
---

# 鼠标输入

模拟鼠标输入

{/* xaction-metadata:start */}
## 当前模块定义

- 模块 Key：`sys:mouse`
- 分类：基础（`Basic`）
- 类型：`Action`
- 风险操作：否
- 专业版：否

## 输入参数

| Key | 名称 | 类型 | 默认值 | 必填 | 变量模式 | 条件 | 说明 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `type` | 类型 | `Enum` | restore | 是 | `Input` |  | 操作类型 |
| `hWnd` | 窗口句柄 | `Integer` |  | 否 | `UseVarOrInput` | 仅：toWinTL, toWinTR, toWinBL, toWinBR, toWinCenter, moveToWinXy | 目标窗口的句柄。留空或 0 表示操作前台窗口。 |
| `btn` | 按钮 | `Enum` | left | 是 | `Input` | 仅：click, dbclick, down, up | 操作哪个按钮 |
| `bmp` | 位图路径 | `Text` |  | 是 | `UseVarOrInput` | 仅：locateByBitmap | 需要在屏幕中查找的位图路径。位图必须和屏幕图像完全匹配，不能压缩。此时X、Y的值为相对于搜索位图的左上角的偏移。 |
| `bmpVar` | 位图变量 | `Image` |  | 是 | `UseVar` | 仅：locateByBitmapVar | 需要在屏幕中查找的位图。位图必须和屏幕图像完全匹配，不能压缩。此时X、Y的值为相对于搜索位图的左上角的偏移。 |
| `bmpTargetType` | 查找范围 | `Enum` | MainScreen | 否 | `Input` | 仅：locateByBitmap, locateByBitmapVar | 位图查找范围 |
| `searchRect` | 查找坐标范围 | `Text` |  | 否 | `UseVarOrInput` | 仅：locateByBitmap, locateByBitmapVar | 当"查找范围"为"坐标范围"时有效，格式为：left,top,right,bottom |
| `bmpPosition` | 定位位置 | `Enum` | Center | 否 | `Input` | 仅：locateByBitmap, locateByBitmapVar | 查找到图片后，鼠标指针移动到的位置 |
| `bmpColorError` | 颜色容差 | `Integer` | 10 | 否 | `Input` | 仅：locateByBitmap, locateByBitmapVar | 匹配像素时允许每个颜色通道的偏差值0-100，0表示精确匹配，速度最快。 |
| `maxFindCount` | 最大匹配数量 | `Integer` | 1 | 否 | `Input` | 仅：locateByBitmap, locateByBitmapVar | 找图的最大匹配数量。将对每个查找到的目标执行附加动作。 |
| `retryCount` | 重试次数 | `Integer` | 1 | 否 | `Input` | 仅：locateByBitmap, locateByBitmapVar | 未找到位图时的重试次数。每次重试间隔300ms。 |
| `x` | X | `Integer` | 0 | 是 | `UseVarOrInput` | 仅：move, moveTo, scroll, toWinTL, toWinTR, toWinBL, toWinBR, toWinCenter, locateByBitmap, locateByBitmapVar | 水平方向的坐标/坐标偏移/移动距离(像素) 或 滚动数量（clicks。正值向右，负值向左） |
| `y` | Y | `Integer` | 0 | 是 | `UseVarOrInput` | 仅：move, moveTo, scroll, toWinTL, toWinTR, toWinBL, toWinBR, toWinCenter, locateByBitmap, locateByBitmapVar | 垂直方向的坐标/坐标偏移/移动距离 或 滚动数量（clicks。正值向前，负值向后） |
| `xy` | 坐标 | `Text` |  | 是 | `UseVarOrInput` | 仅：moveToXy | 格式为：x,y，如：100,200。也可以使用百分比表示，如：50%,50% 表示屏幕中心。 |
| `xyForWin` | 相对坐标 | `Text` |  | 是 | `UseVarOrInput` | 仅：moveToWinXy | 格式为：x,y，如：100,200（相对于窗口左上角向右100，向下200）。也可以使用百分比表示，如：50%,50% 表示窗口中心。 |
| `slowMove` | 逐渐移动到目标 | `Boolean` | false | 否 | `Input` | 仅：move, moveTo, toWinTL, toWinTR, toWinBL, toWinBR, toWinCenter, locateByBitmap, locateByBitmapVar, moveToXy, moveToWinXy | 逐渐移动而不是直接移动到目标位置。 |
| `extAction` | 移动后操作 | `Enum` | none | 是 | `Input` | 仅：restore, move, moveTo, toWinTL, toWinTR, toWinBL, toWinBR, toWinCenter, locateByBitmap, locateByBitmapVar, moveToXy, moveToWinXy | 移动位置后，需要执行的动作 |
| `restoreMousePos` | 操作完成后恢复鼠标位置 | `Boolean` | false | 否 | `Input` | 仅：move, moveTo, toWinTL, toWinTR, toWinBL, toWinBR, toWinCenter, locateByBitmap, locateByBitmapVar, moveToXy, moveToWinXy |  |
| `stopIfFail` | 失败后中止动作 | `Boolean` | true | 否 | `Input` | 仅：locateByBitmap, locateByBitmapVar | 获取位置失败后，是否停止后续动作的执行。 |

## 输出参数

| Key | 名称 | 类型 | 条件 | 说明 |
| --- | --- | --- | --- | --- |
| `isSuccess` | 找图定位是否成功 | `Boolean` | 仅：locateByBitmap, locateByBitmapVar | 操作是否成功 |
| `mouseLocation` | 鼠标位置 | `Text` | 仅：getMouseCurrentPosition, getMouseOriginPosition | 格式为X,Y的文本 |
| `mouseX` | 鼠标位置X | `Integer` | 仅：getMouseCurrentPosition, getMouseOriginPosition | 鼠标位置X坐标 |
| `mouseY` | 鼠标位置Y | `Integer` | 仅：getMouseCurrentPosition, getMouseOriginPosition | 鼠标位置Y坐标 |
| `cursorType` | 光标类型 | `Text` | 仅：getMouseCurrentPosition | 当前的鼠标指针形状类型 |

## 选项值

### `type` 类型

| Value | 名称 | 说明 |
| --- | --- | --- |
| `restore` | 还原鼠标位置 |  |
| `move` | 移动距离 |  |
| `moveTo` | 移动到(x,y分别指定) |  |
| `moveToXy` | 移动到(x,y一同指定) |  |
| `click` | 单击 |  |
| `dbclick` | 双击 |  |
| `down` | 按下 |  |
| `up` | 抬起 |  |
| `scroll` | 滚动 |  |
| `ctrlDown` | 按下Ctrl |  |
| `ctrlUp` | 松开Ctrl |  |
| `shiftDown` | 按下Shift |  |
| `shiftUp` | 松开Shift |  |
| `toWinTL` | 移动到窗口位置：相对于窗口左上角 |  |
| `toWinTR` | 移动到窗口位置：相对于窗口右上角 |  |
| `toWinBL` | 移动到窗口位置：相对于窗口左下角 |  |
| `toWinBR` | 移动到窗口位置：相对于窗口右下角 |  |
| `toWinCenter` | 移动到窗口位置：窗口中心 |  |
| `moveToWinXy` | 移动到窗口位置：xy一同指定 |  |
| `locateByBitmap` | 移动到位图位置(图片文件) |  |
| `locateByBitmapVar` | 移动到位图位置(图片变量) |  |
| `getMouseOriginPosition` | 获取鼠标位置(弹出面板前位置) |  |
| `getMouseCurrentPosition` | 获取鼠标位置及指针类型(当前位置) |  |
| `showIndicator` | 显示鼠标位置提示 |  |

### `btn` 按钮

| Value | 名称 | 说明 |
| --- | --- | --- |
| `left` | 左键 |  |
| `right` | 右键 |  |
| `middle` | 中键 |  |
| `x1` | X1 |  |
| `x2` | X2 |  |

### `bmpTargetType` 查找范围

| Value | 名称 | 说明 |
| --- | --- | --- |
| `MainScreen` | 主屏幕 |  |
| `CurrentWindow` | 当前窗口 |  |
| `Rect` | 坐标范围 |  |
| `AllScreens` | 所有屏幕 |  |

### `bmpPosition` 定位位置

| Value | 名称 | 说明 |
| --- | --- | --- |
| `Center` | 位图中间 |  |
| `TopLeft` | 左上角 |  |
| `TopRight` | 右上角 |  |
| `BottomLeft` | 左下角 |  |
| `BottomRight` | 右下角 |  |

### `extAction` 移动后操作

| Value | 名称 | 说明 |
| --- | --- | --- |
| `none` | 无 |  |
| `left` | 左键单击 |  |
| `leftDbClick` | 左键双击 |  |
| `right` | 右键单击 |  |
| `middle` | 中键单击 |  |
{/* xaction-metadata:end */}

## 概述

本模块用于移动鼠标指针、模拟鼠标点击等操作。支持多种操作类型。


![](./img/mouse-001-2ceb1871c3.png)



### 屏幕坐标

![](./img/mouse-002-db0cd3c6f1.png)

主屏幕的左上角为原点，X=0, Y=0。多屏幕时，主屏的左上角为原点。

X表示水平坐标，向右为正值增加。

Y表示垂直坐标，向下为正值增加。

### 通用参数说明

【移动后操作】

通过移动距离、移动到目标位置等方式移动鼠标坐标后，需要执行的操作，可选：`无、左键单击、左键双击、右键单击、右键双击`。

【操作完成后恢复鼠标位置】

移动鼠标并模拟点击后，是否还原鼠标位置。

【逐渐移动到目标】

分多次逐渐移动到目标位置，用于在特定情况下触发一下目标软件的鼠标移动消息。

【窗口句柄】

相对于窗口移动鼠标时，指定目标窗口的句柄。[什么是窗口句柄？](https://getquicker.net/KC/Kb/Article/1108)

留空或0表示前台窗口（即当前具有输入焦点的窗口）。



## 各操作类型说明



#### 还原鼠标位置

将鼠标指针还原到弹出Quicker面板前的位置。

因为弹出面板、选择动作时，会移动鼠标指针到动作位置，如果希望在弹出面板前的位置执行鼠标操作可以使用此操作。

通过悬浮按钮/悬浮面板/快捷键等方式触发动作时，因为无法获得弹出面板前的位置，会导致此模块无法正常操作。





#### 移动距离

将鼠标指针从**当前位置**移动一定的距离（单位为像素）。X正值表示向右移动，负值表示向左移动。Y正值表示向下移动，负值表示向上移动。

![](./img/mouse-003-259e1ab9ce.png)



#### 移动到（x,y分别指定）

移动到某个屏幕坐标，通过2个参数分别传递x和y的坐标数值。





![](./img/mouse-004-cf790dc36c.png)





#### 移动到（x、y一同指定）



移动到某个屏幕坐标，使用`x坐标,y坐标`格式的文本指定目标位置，如`100,200`。也可以使用百分比方式指定，如：`50%,50%`表示屏幕中心，或`50%,100`表示水平方向屏幕中心，y=100的位置。

可以使用Snipaste等工具查看某个位置的绝对坐标。也可以使用输入框右侧的小工具进行选择。



![](./img/mouse-005-29eee7b0a8.png)





#### 单击、双击、抬起、按下

模拟鼠标按键事件。

![](./img/mouse-006-a1da1407df.png)





#### 滚动

模拟鼠标滚动事件。



![](./img/mouse-007-939e6ac252.png)



此时可以在X、Y参数中填写数字，表示水平和垂直方向的滚动距离。

Y表示垂直滚动的click数量，正值表示向前（向上翻页），负值表示向后（向下翻页）。

X表示水平滚动的click数量，正值表示向右，负值表示向左。

（1 click，一般情况下等于鼠标滚轮的一格，一个顿挫感）

滚动只对鼠标指针所在位置的窗口有效。因此，不要使用悬浮按钮来触发模拟滚动的动作。使用面板窗口触发时，如果动作开始时就滚动，需要增加延时以等待面板窗口关闭。

有一些软件需要使用循环模拟多次滚动消息才有效果。





#### 按下Ctrl、松开Ctrl、按下Shift、松开Shift

用于模拟类似于“Ctrl+鼠标点击”的情况。

通常先模拟按下按键后，再模拟鼠标输入，再松开按键。

本功能也可以用单独的模块《[按键操作](/v2/xaction/modules/keyoperation)》实现。





#### 移动到窗口位置（左上角、右上角等）

当窗口位置或尺寸可能会变化，但是目标位置相对于窗口是固定的，可使用本功能。

可选的参考点类型：

-   窗口左上角
-   窗口右上角
-   窗口左下角
-   窗口右下角
-   窗口中心

![](./img/mouse-008-c4fc515803.png)





【X】和【Y】参数

表示相对于窗口参考点的偏移。X正值向右，Y正值向下。

比如在使用相对于右下角的方式时，X和Y分别为负值，才能定位到窗口内。



#### 移动到窗口位置（xy一同指定）

效果类似于“移动到窗口位置：相对于窗口左上角”，但是使用字符串方式一同指定相对坐标。

![](./img/mouse-009-b4f27cc34c.png)



【相对坐标】

格式为：`x,y`，如：`100,200`（相对于窗口左上角向右100，向下200）。也可以使用百分比表示，如：`50%,50%` 表示窗口中心。





#### 移动到位图位置（图片文件、图片变量）

找图定位功能。根据指定的小图，在屏幕上或窗口内查找匹配图片，并将鼠标指针移动到该位置。

找图后自动移动到目标位置。 如果只需要找到位图位置而不需要进行鼠标操作，或者要进行自定义的鼠标操作，请使用“[屏幕找图](/v2/xaction/modules/searchbmp)”模块。也可以使用子程序“[屏幕找图增强版](https://getquicker.net/subprogram?id=e4af1d5b-143b-4b62-4de5-08d85ac8eddb)”进行找图操作，该子程序具有更高的容错能力。





#### 获取鼠标位置（弹出面板前位置）

获取面板的触发位置。

与“还原鼠标位置”操作所恢复的鼠标位置一致。

![](./img/mouse-010-ae623b3a82.png)





#### 获取鼠标位置及指针类型（当前位置）

获取动作执行到此步骤时的（而非弹出面板之前的）鼠标位置和指针类型。

![](./img/mouse-011-2e6609b560.png)



【光标类型】

鼠标指针的类型。请实际测试以获得准确的值。

常见鼠标指针类型：

-   Arrow 默认
-   IBeam 选定文本
-   Hand 链接选择
-   SizeAll 移动
-   SizeWE 水平调整
-   SizeNS 垂直调整
-   SizeNESW 东北西南对角线调整
-   SizeNWSE 西北东南对角线调整
-   Wait 忙碌
-   Appstarting 后台运行

不能识别的，返回原始值（一个数字）。



#### 显示鼠标位置提示

在当前鼠标位置显示一个从小到大的水波纹动画，用于提示当前鼠标位置。

![](./img/mouse-012-b16078e96c.png)

## 注意事项

-   滚动操作会作用到鼠标指针所在位置窗口上。所以不能使用悬浮动作按钮触发（除非在动作中增加了足够的延迟时间，待鼠标移动到目标位置后再模拟滚动）。
-   模拟键盘+鼠标的组合操作时（如模拟Ctrl+滚动），键盘和步骤之间需要增加一些延迟（10ms+）。这是因为鼠标和键盘是不同的消息队列，如果没有延迟，可能会出现生效顺序和预期不一致的情况（[参考](https://getquicker.net/QA/Question/15424)）。



## 移动到位图位置（找图定位）参数说明

注意：本功能已提取为单独的模块《[屏幕找图/找色/找字](/v2/xaction/modules/searchbmp)》，后续开发建议使用该模块。


![](./img/mouse-013-94a0f61e30.png)



**位图变量/位图路径：**要在屏幕或窗口中寻找的小图；

**查找范围（****当前窗口或主屏幕****）：**在哪个范围内查找图片；

**定位位置：**找到图片位置后，将鼠标移动到寻找图片的左上角（如下图的A点）还是中间位置（如下图的B点）。

![](./img/mouse-014-efb9812e0a.png)

**颜色容差：**在匹配像素颜色时，对每种颜色（red、green、blue）的值在上下多少的范围内认为是匹配。0表示精确匹配，运算速度会最快。

**最大匹配数量：**允许最多找到多少个匹配位置。当一个窗口内有多个匹配时，会对每个匹配执行“移动后操作”。

**X、Y：**定位位置的偏移量。定位到图片的左上角或中间位置后，可以使用这两个值对坐标偏移一定的像素数。

**移动后操作：**移动到目标位置后要进行的操作，比如点击。

### 示例动作

下面的动画演示了一个截图点击动作（参考Marcus的[分享动作](https://getquicker.net/sharedaction?code=95efcbcf-0333-4e72-0086-08d6b398dbc5)）：



此处为语雀视频卡片，点击链接查看：[截图点击.mp4](/v2/xaction/modules/mouse)



**动作定义：**

![](./img/mouse-015-850bb03c05.png)



其中“鼠标输入”步骤的定义如下图所示：


![](./img/mouse-016-da277c9034.png)





## 更新历史

-   20230109 增加一些注意事项。
-   20250120 完善文档以匹配实际功能。
