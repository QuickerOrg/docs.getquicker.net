---
title: "重放键鼠操作"
description: "重放录制好的键鼠操作数据。"
slug: "/v2/xaction/modules/playrecord"
sidebar_label: "重放键鼠操作"
sidebar_position: 100
quickerDocKey: "xaction/module/sys:playRecords"
comments: true
moduleKey: "sys:playRecords"
docStatus: "migrated-unreviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 3817323
legacyContentUpdatedAt: "2024-07-11T01:19:39.000Z"
---

# 重放键鼠操作

重放录制好的键鼠操作数据。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:playRecords" />

回放录制的键鼠操作。

可以使用托盘菜单中的“键鼠录制工具”录制，也可以使用“录制键鼠操作”模块录制。请参考：[/v2/xaction/modules/record](/v2/xaction/modules/record)

注意：录制的数据使用绝对坐标，重放时是否能够成功依赖比较多的因素：

-   窗口位置和状态
-   屏幕分辨率
-   输入法状态
-   其他可能有影响的情况。

因此包含这类操作的动作仅供特定情况下使用，使用时需保持和录制时尽量相同的环境。

<ModuleParamPreview moduleKey="sys:playRecords" />

### 如何中止重放

与其他情形下中止动作的操作类似，可以在配置中设置好“停止运行中动作”的快捷键后，在需要时按下此快捷键。

![](./img/playrecord-002-13e45d2fc0.png)

## 参数

【录制数据】使用录制功能录制的键鼠操作数据。

【重放速度】重复速度，1为原始速度，1.5为原始速度的1.5倍（更快）。

## 录制数据的格式

以下为一段实例数据：

```text

816;	MC;	Left,693,2130,1;
559;	MC;	Left,1531,1274,1;
707;	KP;	Space;
207;	KD;	LShiftKey;
184;	KP;	H;
59;	KU;	LShiftKey;
103;	KP;	E;
106;	KP;	L;
152;	KP;	L;
192;	KP;	O;
152;	KP;	Space;
130;	KD;	LShiftKey;
88;	KP;	W;
72;	KU;	LShiftKey;
76;	KP;	O;
126;	KP;	R;
83;	KP;	L;
147;	KP;	D;
216;	KD;	LShiftKey;
131;	KP;	D1;
80;	KU;	LShiftKey;
71;	KD;	LShiftKey;
40;	KU;	LShiftKey;
```

以`//`开始的行视为注释内容，会被忽略。

除此以外，每行一个键盘或鼠标操作，数据分为3个部分，使用分号和tab分隔开。

第一个部分：表示距离上一步的毫秒数。重放时会根据速度参数重新计算实际等待时间（此值除以重复速度）。

第二个部分：表示操作类型。

第三个部分：根据第二部分的操作类型，提供具体的参数。

支持的操作类型有：

-   MV：鼠标移动
-   MD：鼠标按下
-   MC：鼠标点击（按下+抬起）
-   MU：鼠标抬起
-   MH：鼠标水平滚轮滚动
-   MW：鼠标滚轮垂直滚动
-   DL：等待时间（无操作）
-   KD：键盘按键按下
-   KU：键盘按键抬起
-   KP：按键按下+抬起
-   MVD：移动相对距离 （1.10.12增加）

对鼠标类型的事件，参数格式为：**按键,鼠标位置X,鼠标位置Y,滚动click数量**。x，y坐标留空或-99999表示不移动鼠标，按键位置留空表示None。

-   例如，100ms后，向左移动10个像素：100; MVD; None,-10,0,0;
-   滚动鼠标滚轮：0; MW;None,0,0,-30

对于按键类型的事件，参数格式为：按键名 （参考：[https://docs.microsoft.com/en-us/dotnet/api/system.windows.forms.keys?view=netframework-4.8](https://docs.microsoft.com/en-us/dotnet/api/system.windows.forms.keys?view=netframework-4.8)）

## 更新历史

-   20240711 增加注释语法说明。
