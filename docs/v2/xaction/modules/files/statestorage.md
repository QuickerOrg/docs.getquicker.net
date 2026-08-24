---
title: "状态存取"
description: "存取状态数据；更新动作的徽标文字；设置附加的动作右键菜单项"
slug: "/v2/xaction/modules/statestorage"
sidebar_label: "状态存取"
sidebar_position: 90
quickerDocKey: "xaction/module/sys:stateStorage"
comments: true
moduleKey: "sys:stateStorage"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-24 20:01:39"
legacyDocId: 2086694
legacyContentUpdatedAt: "2024-01-11T04:51:48.000Z"
---

# 状态存取

在本机读写动作状态，或更新动作徽标、附加右键菜单。状态先写入缓存，停止写入约 2 秒后才落盘，不要在死循环里反复写状态。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:stateStorage" />

## 概述

本模块包含三类能力：

- 存取保存在本机的状态数据
- 更新动作修饰（徽标图标 / 徽标文字）
- 为动作设置附加的右键菜单

<ModuleParamPreview moduleKey="sys:stateStorage" />

## 参数说明

**操作类型**：

- **读取动作状态**
- **写入动作状态**
- **设置徽标文字**
- **设置徽标图标**
- **设置附加的右键菜单项**
- **【谨慎使用】读取全局状态**
- **【谨慎使用】写入全局状态**

**名称**：仅读写动作 / 全局状态。状态条目名，类似变量名。

**值**：仅写入动作 / 全局状态。要保存的内容。写入 `*NULL*` 则删除该状态。

**默认值**：仅读取动作 / 全局状态。尚未存储时返回的值。

**为空时请用户输入**：仅读取。读到的值为空（且默认值也为空）时，是否弹窗请用户输入。启用时请保持默认值为空。

**用户输入提示**：仅读取。弹窗标题，提示用户要填什么。

**徽标图标**：仅设置徽标图标。格式 `fa:图标名称:图标颜色`，例如 `fa:Solid_Circle:#00AA00`。图标名见 [在动作中使用图标](/v2/xaction/concepts/use-icon-in-actions)，颜色为 `#RRGGBB`。留空则去掉图标。

**徽标文字**：仅设置徽标文字。显示在动作右上角。留空则去掉徽标。请尽量用简单字母或数字；低分辨率屏幕上可能不易辨认。

**徽标颜色**：仅设置徽标文字。底色，`#RRGGBB`。默认红色。

**徽标文字颜色**：仅设置徽标文字。文字颜色，`#RRGGBB`。默认白色。

**附加的右键菜单项**：仅设置附加的右键菜单项。格式见 [为动作设计自定义右键菜单](/v2/xaction/concepts/action-custom-context-menu)。

**失败后停止**：失败后是否停止动作。默认开启。

## 输出

仅读取动作状态、读取全局状态时有输出：

- **是否成功**：是否读到了值。
- **值**：读到的状态值。
- **是否为空**：读到的值是否为空。

## 存取状态数据

把某项数据保存在本机，下次运行动作时再读。类似软件用 ini 保存用户设置。一个动作可以有多个状态项，以「键 - 值」保存。

状态值以文本保存。数字、布尔等简单类型可以自动转换；动态对象（对应 C# `object`）无法从文本恢复原始类型，不支持。

常见用途：

- 保存本机软件路径。写死路径后，换电脑就可能跑不起来。
- 每次点击执行不同操作，例如第一次做 A、第二次做 B。
- 其它需要跨次运行保留的信息。

1.3.0+ 若不需要自己控制读写时机，也可以把变量勾成「作为状态使用」：动作开始前加载，结束后写回。见 [变量](/v2/xaction/concepts/variables)。

### 读取动作状态

**操作类型** 选 **读取动作状态**。

<ModuleParamPreview
  moduleKey="sys:stateStorage"
  focusKeys={['type', 'key', 'defaultValue', 'inputIfEmpty', 'prompt', 'isSuccess', 'value', 'isEmpty']}
  values={{type: 'readActionState'}}
/>

### 写入动作状态

**操作类型** 选 **写入动作状态**，填写 **名称** 和 **值**。值为 `*NULL*` 时删除该状态。

<ModuleParamPreview
  moduleKey="sys:stateStorage"
  focusKeys={['type', 'key', 'value']}
  values={{type: 'saveActionState', key: '次数标记', value: '2'}}
/>

### 读取 / 写入全局状态

不同动作都能访问的全局存储。请谨慎使用：

- 所有动作都能读写，容易互相覆盖。
- 只在自己用的动作里使用，不要分享用了全局状态的动作。
- 避免 Key 重名，也避免存大量内容。

### 状态数据的存储

一个动作的全部状态以 JSON 保存在 `C:\Users\用户名\AppData\Local\Quicker\states`，文件名为 `state_动作ID.json`。

#### 清理状态数据

动作上右键 → **信息** → **动作数据** → **删除动作数据**。

按住 Shift 再点删除，可以打开状态文件查看或手工编辑。

![](./img/statestorage-003-ce6a330960.png)

#### 如何同步状态数据

专业版 1.38.28+ 支持自动**备份**状态（只备份，不是多机同步），需自行开启，见 [状态数据的备份和恢复](#状态数据的备份和恢复)。

免费版可用 OneDrive、坚果云等同步状态目录。参考：[用网盘同步状态数据](https://getquicker.net/KC/Kb/Article/187)。

### 状态数据的缓存机制

写入时先进入内存缓存，约 2 秒没有新的写入才落到文件。读取也走缓存，不会每次打开文件。

### 示例动作

<StepProgramView example="80dae94c-de3c-4a50-dbe6-08d7053e26bb" />

<ShareLinkCard
  items={[
    {
      code: '85f82b64-b24c-4e46-ba2c-08d6db3483c9',
      title: '搜索Everything',
      description: '用状态保存 Everything 路径；第一次运行时请用户输入。',
      author: 'CL',
    },
    {
      code: '80dae94c-de3c-4a50-dbe6-08d7053e26bb',
      title: '示例：状态操作/切换执行',
      description: '第一次打开软件 A，第二次打开软件 B。',
      author: 'CL',
    },
    {
      code: '8af98895-ef82-46d1-dbe7-08d7053e26bb',
      title: '示例：循环切换',
      description: '循环切换列表中的内容。',
      author: '治钧',
    },
    {
      code: '531248a5-f5ac-4ae5-75bd-08d709af9122',
      title: '示例：状态存储',
      description: '文件名每次加 1。',
      author: 'wzq',
    },
  ]}
/>

## 变量作为状态使用

让变量在动作结束后自动写入状态，下次运行时再加载。第一次运行使用默认值。

<PreviewMarks
  marks={[{key: 'asState', label: '勾选后，变量值会随动作持久保存'}]}>
  <VariableDefPreview
    name="number"
    type="Integer"
    remark="点击次数"
    defaultValue="5"
    asState
  />
</PreviewMarks>

适合保存动作设置：用表单直接改变量即可，不必再单独读写状态。

<StepProgramView example="acdba4d6-1c7a-4546-a11f-08d92725bcba" />

<ShareLinkCard
  items={[
    {
      code: 'acdba4d6-1c7a-4546-a11f-08d92725bcba',
      title: '计数器',
      description: '每次点击加 1。演示变量作为状态使用。',
      author: 'CL',
    },
    {
      code: '2214ddb5-d718-4da5-2c60-08d6c8ffb643',
      title: '截图保存',
      description: '用变量保存截图位置；右键菜单可改保存位置。',
      author: 'CL',
    },
  ]}
/>

**不要改作为状态使用的变量名。** 状态按变量名对应；改名后会丢失关联，下次读不到旧值。

变量对应的状态会在这些时候更新：

- 通过模块输出或表单步骤更新变量时
- 动作结束时

动作启动时按状态更新变量；之后是变量到状态的单向更新，直到动作结束。

多个实例同时跑时，后结束的那个会最终写入状态。

长期运行、迟迟不结束的动作，不要依赖「作为状态使用」——只有正常结束后才会写入。

## 更新动作修饰

1.9.13+ 可在动作按钮上显示徽标文字（靠右）或徽标图标（靠左），也可以同时显示。

![](./img/statestorage-005-8fb388416a.gif)

设置后会一直保留（动作停了也还在），除非再设成空。通常和状态一起用：把选项存在状态里，同时用徽标展示出来。

### 设置徽标图标

显示在动作左上角。

![](./img/statestorage-006-7703ad2933.png)

<ModuleParamPreview
  moduleKey="sys:stateStorage"
  focusKeys={['type', 'overlayIcon']}
  values={{type: 'UpdateOverlyIcon', overlayIcon: 'fa:Solid_Circle:#00AA00'}}
/>

### 设置徽标文字

显示在动作右上角，可控制底色、文字颜色和内容。

![](./img/statestorage-008-b7bc2ad1c7.png)

<ModuleParamPreview
  moduleKey="sys:stateStorage"
  focusKeys={['type', 'badgeText', 'badgeColor', 'badgeTextColor']}
  values={{
    type: 'UpdateActionBadge',
    badgeText: '1234',
    badgeColor: '#EE0000',
    badgeTextColor: '#FFFFFF',
  }}
/>

### 去除动作徽标

除了在动作里把徽标文字和图标清空，也可以用动作菜单把徽标和状态一起清掉：

![](./img/statestorage-010-200865d55a.png)

### 设置附加的右键菜单

![](./img/statestorage-011-bfb1a07466.png)

<ModuleParamPreview
  moduleKey="sys:stateStorage"
  focusKeys={['type', 'actionContextMenu']}
  values={{
    type: 'UpdateContextMenu',
    actionContextMenu: `[fa:Light_Flag]带图标的菜单(tooltip内容)|_qk_menu_icon_menu
[+][fa:Light_Cog]二级菜单(提示内容...)
[-][fa:Light_UserCircle]子菜单|_qk_menu_submenu
[fa:Light_Wrench:#f57e42]危险动作菜单(tooltip内容)|_qk_menu_sample`,
  }}
/>

本模块设置的条目会出现在动作选项里那些固定菜单的下方。可以搭配使用：

- 动作选项里放固定项
- 本模块放需要变化的项

格式见 [为动作设计自定义右键菜单](/v2/xaction/concepts/action-custom-context-menu)。

<StepProgramView example="4aaaaf6c-1883-4c3a-9ed6-08d85d9ed340" />

<ShareLinkCard
  code="4aaaaf6c-1883-4c3a-9ed6-08d85d9ed340"
  title="右键菜单测试"
  description="动态更新右键菜单测试"
  author="CL"
/>

### 修饰数据的存储

动作修饰保存在状态目录下的 `_action_adorn.json`（`C:\Users\用户名\AppData\Local\Quicker\states`）。

## 状态数据的备份和恢复

1.38.28+ 试验性提供自动 / 手动备份与恢复。

- 仅限专业版，且需手动开启
- 自动备份：每小时备份一次发生变化的状态
- 只备份小于 1000KB 的状态文件
- 使用 gzip 压缩，并以当前用户身份信息为密钥做 AES 加密后上传
- 自动备份保留 30 天，手动备份保留 365 天，过期删除

**自动备份**

在设置里开启：

![](./img/statestorage-013-2293ee858f.png)

**手动备份**

动作右键 → **信息** → **动作数据** → **备份到云端**。

![](./img/statestorage-014-1f87013e9c.png)

点击后可输入备份说明。

<UserInputPreview
  title="备份动作数据"
  prompt="请输入备份说明"
  value="配置数据1"
/>

**恢复历史备份**

动作右键 → **信息** → **动作数据** → **从云端恢复**。

![](./img/statestorage-016-7e51c970e7.png)

选一条备份后点「下载」，即可恢复到该时间点。

## 限制与排障

- 不要在死循环里写状态：写入走 2 秒缓存，频繁写会积压，也容易丢数据。
- 动态对象不能当状态值保存。
- 「作为状态使用」跟变量名绑定，改名等于丢状态；长期不结束的动作也不会写回。
- 全局状态所有动作都能改，分享动作时不要依赖它。
- 云端备份只备份、不同步；免费版请用网盘同步 `states` 目录。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/concepts/variables',
      label: '变量',
      description: '「作为状态使用」写在变量属性里。',
    },
    {
      href: '/v2/xaction/concepts/action-custom-context-menu',
      label: '自定义右键菜单',
      description: '附加菜单项的文本格式。',
    },
    {
      href: '/v2/xaction/concepts/use-icon-in-actions',
      label: '在动作中使用图标',
      description: '徽标图标的 fa:名称:颜色 写法。',
    },
  ]}
/>
