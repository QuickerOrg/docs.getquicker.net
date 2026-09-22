---
title: "Mastercam控制"
description: "通过 Mastercam 2024/2027 NET-Hook 发送命令；仅有一个在线连接时直接使用，多个连接时按动作触发窗口定位。"
slug: "/v2/xaction/modules/mastercamcontrol"
sidebar_label: "Mastercam控制"
sidebar_position: 180
quickerDocKey: "xaction/module/sys:mastercamcontrol"
comments: true
moduleKey: "sys:mastercamcontrol"
docStatus: "reviewed"
metadataGeneratedAt: "2026-09-20 15:25:17"
---

# Mastercam控制

通过 Mastercam 2024/2027 NET-Hook 发送命令；仅有一个在线连接时直接使用，多个连接时按动作触发窗口定位。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:mastercamcontrol" />

## 使用说明

先按 [Mastercam 软件连接](/v2/features/software-connections/software/mastercam) 安装对应年度的连接插件，并确认宿主在线。

1. 在“操作类型”中选择常用功能，按分类选择文档、选择、视图、图层等操作，再填写当前显示的参数。
2. 若需要直接发送命令，以命令工具提供的命令和参数为准。第三方 FT 命令可在命令工具中按文件筛选，再生成动作。
3. 先在副本模型中试运行，检查是否成功、返回结果和错误信息，再用于实际工作。

只有一个在线连接时直接使用该连接；有多个连接时，按动作触发窗口定位。无法唯一确定目标时会报错，不会随意选择一个实例；调用失败后也不会重新选目标执行。

命令能否执行取决于 Mastercam 年度、产品线、许可证和当前文档状态。保存、覆盖或放弃未保存修改时，请核对参数中的确认选项。通过界面队列提交的命令只表示已提交，不保证交互窗口已经处理完毕。
