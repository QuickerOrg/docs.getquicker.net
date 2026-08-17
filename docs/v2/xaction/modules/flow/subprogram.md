---
title: "运行子程序"
description: "运行子程序"
slug: "/v2/xaction/modules/subprogram"
sidebar_label: "运行子程序"
sidebar_position: 100
quickerDocKey: "xaction/module/sys:subprogram"
comments: true
moduleKey: "sys:subprogram"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 4144243
legacyContentUpdatedAt: "2025-06-06T03:33:32.000Z"
---

# 运行子程序

把一组步骤和变量封成可复用的「自定义模块」，再在动作里调用。简单动作一般用不到；步骤变多、要拆功能或要复用时再用。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:subprogram" />

## 概述

子程序类似编程里的函数：把步骤和变量封装在一起。用途主要是：

- 在动作里复用一部分功能。
- 把大功能拆成几个较独立的小功能。

1.10.x 起子程序做了较大调整，本文按当前版本说明。

![](./img/subprogram-001-1b76aae5f7.png)

<ModuleParamPreview moduleKey="sys:subprogram" />

### 子程序的类别

按可复用范围和存放位置分成三类：

- **动作内子程序**：只在当前动作里用，存在动作内部。1.10.x 之前的子程序都是这一类。
- **公共子程序**：可在本机任意动作里用，存在动作外部，支持自动同步。
- **网络共享子程序**：网站子程序库里的子程序，搜到后可直接拖进步骤。

### 通用用法

和普通模块一样：找到目标子程序，按住拖到步骤列表的合适位置。

<ActionEditorPreview
  focus="toolbox"
  toolboxTab="flow"
  toolboxSearch="子程序"
  toolboxSelected="sys:subprogram"
  actionTitle="调用子程序"
  actionDescription="从工具箱拖入运行子程序"
  caption="将「运行子程序」拖到步骤列表（示意，悬停可暂停）"
  data={{steps: []}}
  dragDemo={{
    moduleKey: 'sys:subprogram',
    targetSlot: 'steps',
    afterData: {
      steps: [{key: 'sys:subprogram'}],
    },
  }}
/>

再在步骤参数窗口里设定输入和输出。选好子程序后，窗口里还会出现该子程序标记为输入 / 输出的变量。

![](./img/subprogram-003-cb795a4acc.png)

## 参数说明

**子程序**：要调用的子程序。必填。

**跳过调试输出**：调试运行动作时，不输出子程序内部的调试信息。默认关闭。

**失败后停止**：子程序运行失败后是否停止动作。默认开启。

选好子程序后，还会按它的变量标记出现对应的输入项。改过子程序的变量名后，请重新打开本步骤核对参数。

## 输出

- **是否成功**：子程序是否运行成功。

选好子程序后，还会按它的变量标记出现对应的输出项。

## 子程序的定义

子程序和组合动作一样，由步骤和变量组成。

![](./img/subprogram-004-501759bafb.png)

子程序里的变量和主程序是**各自独立**的：

- 每次运行子程序，内部变量都会重新初始化。
- 子程序可以使用和主程序相同的变量名（尽量不要这样做），两边的值互不影响。通过参数传入列表、词典等复杂对象时，两边指向同一个对象，在子程序里改内容也会影响主程序。

和基础模块一样，子程序要从外部接收输入，并把结果交回去。做法是**给变量打上输入 / 输出标记**。变量名前面的图标表示它可能是输入或输出参数。

![](./img/subprogram-005-74b01bf559.png)

子程序开始运行时，会给作为输入的变量赋值；运行结束后，再把作为输出的变量读回主程序。

### 输入参数

子程序的变量和主程序独立。在变量属性里附加选项，就能把某个变量变成输入或输出参数。

![](./img/subprogram-006-91ac05bd3e.png)

变量一旦作为子程序的输入或输出，尽量不要改名。改了之后，请编辑调用它的「运行子程序」步骤，重新设置参数。

### 输出参数

在变量属性里勾选「子程序的输出」，即可把它变成输出参数。

![](./img/subprogram-007-b3d54a2eb5.png)

## 动作内子程序

动作内子程序保存在动作内部，只能在当前动作里用。

![](./img/subprogram-008-86881f079c.png)

1. 动作内子程序标签页。
2. 动作内子程序列表。
3. 点击编辑子程序。
4. 创建新的动作内子程序。
5. 导入网络子程序（先在子程序库复制网址，再点此按钮）。也可以在共享子程序标签页搜到后，从右键菜单直接导入。
6. 从文件导入子程序。
7. 清理不使用的子程序。

在子程序上右键：

<ContextMenuPreview
  openPath={['转换为公共子程序(A)']}
  items={[
    {label: '高亮步骤(H)', icon: '✎', iconColor: '#e53935'},
    {label: '转换为公共子程序(A)', icon: '→', iconColor: '#2196f3'},
    {label: '删除(D)', icon: '×', iconColor: '#f44336', danger: true},
  ]}
/>

1. 高亮步骤：把子程序名称当作关键字，高亮步骤列表里的对应步骤（只能高亮已展开的步骤）。
2. 转换为公共子程序：方便在其它动作里使用。
3. 删除此子程序。

### 创建子程序

点列表下方的创建按钮，可添加新的动作内子程序。

![](./img/subprogram-010-57e5689682.png)

### 编辑子程序

点子程序后面的编辑按钮即可编辑。

![](./img/subprogram-011-6c50d8b647.png)

1. 点子程序后的打开按钮。
2. 点步骤列表里子程序后的打开按钮。
3. 双击子程序名称。

### 删除子程序

从右键菜单删除，或选中后点删除按钮。

![](./img/subprogram-012-7b2f20667b.png)

### 转换为动作内子程序

通过步骤的右键菜单，可以把公共子程序和网络共享子程序转成动作内子程序。

![](./img/subprogram-013-65abbf25f5.png)

### 其它操作

在子程序列表上右键，可以重命名、复制、创建副本、复制名称等。

<ContextMenuPreview
  openPath={['重命名(R)']}
  items={[
    {label: '高亮步骤(H)', icon: '✎', iconColor: '#e53935'},
    {label: '查找使用情况(U)', icon: '⌕', iconColor: '#2196f3'},
    {label: '重命名(R)', icon: '✎', iconColor: '#2196f3'},
    {label: '转换为公共子程序(A)', icon: '→', iconColor: '#2196f3'},
    {label: '创建副本(N)', icon: '□', iconColor: '#2196f3'},
    {label: '复制子程序(C)', icon: '□', iconColor: '#2196f3'},
    {label: '复制子程序名', icon: '□', iconColor: '#2196f3'},
    {label: '分享(S)', icon: '⌘', iconColor: '#2196f3'},
    {label: '删除(D)', icon: '×', iconColor: '#f44336', danger: true},
  ]}
/>

复制后，可在其它动作的子程序列表空白处右键粘贴。

<ContextMenuPreview
  items={[
    {label: '粘贴剪贴板中的子程序', icon: '▱', iconColor: '#2196f3'},
  ]}
/>

## 公共子程序

公共子程序可以在本机所有动作中使用。

![](./img/subprogram-016-08d43a7149.png)

1. 公共子程序标签页。
2. 筛选子程序（数量较多时使用）。
3. 子程序列表。
4. 创建新的公共子程序。
5. 双击，或点右侧按钮，可以编辑此公共子程序。
6. 右键菜单。
7. 分享公共子程序到共享库。
8. 查找使用此公共子程序的动作：在本机所有动作里查找。
9. 复制为动作内子程序。
10. 在步骤列表中高亮此子程序（仅高亮已展开的步骤）。
11. 删除此子程序。

### 分享公共子程序

**请勿分享任何含有恶意内容的子程序，否则将停用您的账号。**

在公共子程序上右键，选「分享」。

![](./img/subprogram-017-df90c860c5.png)

可以分享新的子程序，或更新之前已分享的子程序。

## 共享子程序

子程序网站：[https://getquicker.net/Share/SubPrograms](https://getquicker.net/Share/SubPrograms)

子程序不会经过管理员审核，使用前请自行检查。发现恶意内容可反馈到 197906@qq.com，将奖励 1 年专业版兑换码。

### 方法一：导入为动作内子程序

见上面的 [动作内子程序](#动作内子程序)。

### 方法二：直接使用共享子程序

![](./img/subprogram-018-895314019a.png)

1. 切换到共享子程序标签页。
2. 输入关键词。
3. 点击查询。
4. 符合条件的结果会出现在列表中。
5. 按住拖到步骤区域即可。
6. 双击子程序，或点右边的打开按钮，可以打开共享子程序网页。

<ContextMenuPreview
  openPath={['查看子程序定义(P)']}
  items={[
    {label: '查看子程序定义(P)', icon: '⌕', iconColor: '#2196f3'},
    {label: '导入为动作内子程序(D)', icon: '□', iconColor: '#2196f3'},
  ]}
/>

在共享子程序上右键：

1. 查看子程序定义：在编辑窗口里查看内部定义。
2. 导入为动作内子程序：需要对定义做修改时，先导入再用。

## 限制与排障

- 改了子程序的输入 / 输出变量名后，已有的「运行子程序」步骤不会自动改映射，需要重新打开步骤设置。
- 传入列表、词典等对象时按引用传递，子程序里改内容会作用到主程序。
- 网络共享子程序未经审核，使用前请检查内容。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/concepts/variables',
      label: '变量',
      description: '给变量打上输入 / 输出标记，才会出现在本模块里。',
    },
    {
      href: '/v2/xaction/modules/runaction',
      label: '运行或停止动作',
      description: '要跑的是另一个动作，而不是子程序。',
    },
    {
      href: '/v2/xaction/concepts/subprogram',
      label: '子程序概念',
      description: '三类子程序与编辑器的补充说明。',
    },
  ]}
/>

## 更新历史

- 20250606 修改描述错误。
