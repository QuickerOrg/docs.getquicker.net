---
title: "音频设备"
description: "获取音频设备信息，设置默认音频设备。"
slug: "/v2/xaction/modules/audiocontrol"
sidebar_label: "音频设备"
sidebar_position: 180
quickerDocKey: "xaction/module/sys:audioControl"
comments: true
moduleKey: "sys:audioControl"
docStatus: "migrated-unreviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
metadataHash: "3f0bb8582da869bceaa0eecd45ee35739bfd57f3a809807dfd7faded184e6d83"
legacyDocId: 43543457
legacyContentUpdatedAt: "2025-01-20T01:00:00.000Z"
---

# 音频设备

获取音频设备信息，设置默认音频设备。

{/* xaction-metadata:start */}
## 当前模块定义

- 模块 Key：`sys:audioControl`
- 分类：Windows系统（`System`）
- 类型：`Action`
- 风险操作：否
- 专业版：否

## 输入参数

| Key | 名称 | 类型 | 默认值 | 必填 | 变量模式 | 条件 | 说明 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `operation` | 操作类型 | `Enum` | GetOutputDeviceList | 是 | `Input` |  |  |
| `id` | 设备ID | `Text` |  | 是 | `UseVarOrInput` | 仅：GetDeviceById, SetDefaultDeviceById, SetDeviceMute, SetDeviceVolume | 要获取或更新信息的设备ID。 |
| `mute` | 静音状态 | `Text` | true | 是 | `UseVarOrInput` | 仅：SetDeviceMute | 可选值 true/false/toggle 静音、取消静音或切换状态。 |
| `volume` | 音量 | `Number` | 0.1 | 是 | `UseVarOrInput` | 仅：SetDeviceVolume | 0-1.0之间的小数数字。 |
| `returnAll` | 返回所有状态的设备 | `Boolean` | false | 否 | `Input` | 仅：GetOutputDeviceList, GetInputDeviceList | 否则只返回就绪状态 (Active) 的设备 |
| `deviceName` | 蓝牙设备名称 | `Text` |  | 否 | `UseVarOrInput` | 仅：ConnectBluetoothDevice |  |
| `stopIfFail` | 失败后停止动作 | `Boolean` | true | 否 | `Input` |  | 失败后是否停止动作 |

## 输出参数

| Key | 名称 | 类型 | 条件 | 说明 |
| --- | --- | --- | --- | --- |
| `isSuccess` | 是否成功 | `Boolean` |  | 操作是否成功 |
| `deviceList` | 设备信息列表 | `List` | 仅：GetOutputDeviceList, GetInputDeviceList | 每项的格式为:[图标]名称(注释)\|设备ID |
| `deviceId` | 设备ID | `Text` | 仅：GetOutputDefaultDevice, GetInputDefaultDevice |  |
| `deviceName` | 设备名称 | `Text` | 仅：GetOutputDefaultDevice, GetInputDefaultDevice, GetDeviceById |  |
| `deviceState` | 设备状态 | `Text` | 仅：GetOutputDefaultDevice, GetInputDefaultDevice, GetDeviceById |  |
| `mute` | 是否静音 | `Boolean` | 仅：GetOutputDefaultDevice, GetInputDefaultDevice, GetDeviceById |  |
| `isPlaying` | 是否正在播放 | `Boolean` | 仅：GetOutputDefaultDevice, GetInputDefaultDevice, GetDeviceById |  |
| `volume` | 设置音量 | `Number` | 仅：GetOutputDefaultDevice, GetInputDefaultDevice, GetDeviceById |  |
| `masterPeakValue` | 实时音量 | `Number` | 仅：GetOutputDefaultDevice, GetInputDefaultDevice, GetDeviceById |  |
| `deviceObject` | 原始对象 | `Object` | 仅：GetOutputDefaultDevice, GetInputDefaultDevice, GetDeviceById | 原始MMDevice对象 |
| `deviceObjectList` | 原始对象列表 | `Object` | 仅：GetOutputDeviceList, GetInputDeviceList | 原始MMDevice对象的列表(IList&lt;MMDevice&gt;) |

## 选项值

### `operation` 操作类型

| Value | 名称 | 说明 |
| --- | --- | --- |
| `GetOutputDeviceList` | 获取输出设备列表 |  |
| `GetOutputDefaultDevice` | 获取默认输出设备信息 |  |
| `GetInputDeviceList` | 获取输入设备列表 |  |
| `GetInputDefaultDevice` | 获取默认输入设备信息 |  |
| `GetDeviceById` | 获取指定设备的信息 |  |
| `SetDefaultDeviceById` | 设置默认设备 |  |
| `SetDeviceMute` | 设置静音 |  |
| `SetDeviceVolume` | 设置音量 |  |

### `mute` 静音状态

| Value | 名称 | 说明 |
| --- | --- | --- |
| `true` | 静音 |  |
| `false` | 取消静音 |  |
| `toggle` | 切换静音状态 |  |
{/* xaction-metadata:end */}

用于获取音频设备信息或设置默认设备、调整静音、音量。

![](./img/audiocontrol-001-a835ccea6b.png)





## 支持的操作类型



### 获取设备列表

【获取输出设备列表】

【获取输入设备列表】

![](./img/audiocontrol-002-aad1d29110.png)

输出：

【设备信息列表】

返回系统内当前可用的输入和输出设备的列表。

每项格式为： `[图标]设备名|设备ID` 

可以直接将得到的列表作为“用户选择”模块的“选项”参数的值。

【原始对象列表】表示设备的内部c#对象列表。类型为（List&lt;NAudio.CoreAudioApi.MMDevice&gt;）



### 获取默认设备

【获取默认的输出设备信息】

【获取默认的输入设备信息】

![](./img/audiocontrol-003-63f68980e5.png)

获取系统里当前选择的默认输出和输入设备，并且得到设备ID、设备名称、是否静音、音量等信息。原始对象为C#的NAudio.CoreAudioApi.MMDevice类型。



### 获取指定设备的信息

![](./img/audiocontrol-004-d00f9bba0a.png)

根据提供的设备ID，获取其信息。

设备ID是一个类似于这样的文本： `{0.0.0.00000000}.{2c3a51b4-780e-4290-bc03-8c25dfed52d1}` 

可以从“获取设备列表”等操作方式里得到。



### 设置默认设备

![](./img/audiocontrol-005-9dd84078d4.png)

将指定的设备设置为默认的输出或输入设备。



### 设置设备静音

![](./img/audiocontrol-006-a4de5ea388.png)

可选值：true（静音）、false（取消静音）、toggle（切换静音状态）。

当设备ID为空时，设置当前默认输出设备。



### 设置设备音量

![](./img/audiocontrol-007-ac0ce2e91f.png)

设置指定设备的音量。当设备ID为空时，设置当前默认输出设备的音量。

**音量值参数：**0-1.0之间的小数。







## 示例动作

-   [音频设备操作示例](https://getquicker.net/sharedaction?code=0cf96600-866a-4eac-7f44-08d8fe1fe745)
-   [将输出设置为指定的设备](https://getquicker.net/sharedaction?code=789bfd8d-3ef0-43c9-7f48-08d8fe1fe745)
-   [在两个音频设备之间切换](https://getquicker.net/sharedaction?code=d4eab7c4-b53e-4fd9-7f4a-08d8fe1fe745)
-   [选择音频设备](https://getquicker.net/sharedaction?code=8139f36b-059a-49a6-9f64-08d8ff04bb1d)（选择复制设备ID 或 传递设备ID参数可直接设置设备为默认输出设备）

## 更新历史

-   20250120 更新文档，以匹配实际功能。
