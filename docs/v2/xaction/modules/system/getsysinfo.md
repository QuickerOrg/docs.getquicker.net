---
title: "获取系统或动作信息"
description: "获取系统、Quicker 及当前运行动作的相关信息。"
slug: "/v2/xaction/modules/getsysinfo"
sidebar_label: "获取系统或动作信息"
sidebar_position: 80
quickerDocKey: "xaction/module/sys:getSysInfo"
comments: true
moduleKey: "sys:getSysInfo"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 2122406
legacyContentUpdatedAt: "2024-03-27T02:22:03.000Z"
---

# 获取系统或动作信息

读取 Windows 环境、Quicker 状态和当前动作的运行信息。不适合在子程序里用：依赖动作运行上下文的项在子程序中拿不到。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:getSysInfo" />

## 概述

本模块没有输入参数，勾选需要的输出即可。

<ModuleParamPreview moduleKey="sys:getSysInfo" />

## 参数说明

本模块没有输入参数。

## 输出

系统和用户：

- **机器名**：Windows 主机名。
- **用户名**：当前登录用户。
- **用户域名**：当前用户的网络域名。
- **系统版本号**
- **是否为Win10或以上** / **是否为Win11**
- **Windows是否锁定**
- **系统正常运行秒数**：与任务管理器「正常运行时间」同类；很多情况下重启电脑也不会清零。

![](./img/getsysinfo-002-bb0fce6ee7.png)

- **环境变量**：全部环境变量，词典。
- **主屏分辨率**：格式 `宽度,高度`，如 `1024,768`。
- **前台窗口是否为全屏状态**
- **是否联网**
- **本机局域网IP**
- **Windows是否为深色模式**

Quicker：

- **是否自动启动**：是否开机登录后自动运行（否表示手动启动）。
- **Quicker版本**：数字，`大版本*1000000 + 中版本*1000 + 小版本`。例如 `1.2.3` → `1002003`。
- **Quicker启动秒数**
- **是否为专业版**
- **UnionId**：用户 id 的哈希，可作第三方鉴权的安全替代（一般应在服务端校验）。
- **已设置自有百度OCR帐号**
- **Quicker主题模式**：`light` / `dark` / `auto_light` / `auto_dark`（后两项表示跟随 Windows，当前为浅色或深色）。
- **Quicker是否暂停**

当前动作：

- **动作ID** / **动作名称**
- **动作库ID** / **动作版本号**：从动作库安装到本地时才有。
- **运行个数**：含当前实例。
- **是否调试运行**
- **文本上下文参数** / **图片上下文参数**：传入动作的上下文。
- **触发方式**：仅供参考。常见值：

```text
Panel,          //主面板窗口
TriggerKey,     //触发键
FloatButton,    //浮动按钮
FloatPanel,     //浮动面板
DashboardWindow, //仪表盘窗口
ActionEditor,   //动作编辑器
CircleMenu,     //轮盘菜单
SearchWindow,   //搜索窗口
Gesture,        //手势
OtherMouse,     //其他鼠标触发
Hotkey,         //热键
PowerKeys,      //扩展热键
TextCommand,    //文本指令
App,            //手机APP
Extern,         //外部启动
AutoRun,        //自动运行
ContextMenu,    //右键菜单
LeftButtonPlus, //左键辅助
ScrollOnButton, //按钮上滚轮
AdvancedMouseAction, //高级鼠标触发 1.10.10+
Association,    //上下文菜单
BrowserContextMenu, //浏览器右键菜单
WebpageButton,  //网页按钮点击
EventTrigger,   //事件触发
```

## 限制与排障

子程序里不要依赖动作 ID、触发方式、上下文参数等运行上下文。需要当前时间用 [获取日期时间](/v2/xaction/modules/gettime)，不要用本模块拼时间。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/gettime',
      label: '获取日期时间',
      description: '取当前时间或做时间换算。',
    },
    {
      href: '/v2/xaction/modules/getfolderpath',
      label: '获取系统路径',
      description: '取桌面、下载等特殊目录。',
    },
  ]}
/>
