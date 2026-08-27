---
title: 截图与贴图概览
description: Quicker 截图 Pro、贴图、长截图与录屏功能入口说明。
sidebar_position: 1
quickerDocKey: v2/features/screenshot
comments: true
---

# 截图与贴图概览

Quicker 提供一套完整的屏幕截取与后续处理能力，可在动作中作为步骤使用，也可配合快捷键随时唤起。完整操作说明在独立页面，点下面的入口查看：

<RelatedDocs
  layout="cards"
  items={[
    {
      href: '/v2/features/screenshot/capture-pro',
      label: '截图 Pro',
      description: '全屏选区、控件吸附、标注、OCR、复制 / 保存 / 贴图，并可进入长截图或录屏。',
      featured: true,
    },
    {
      href: '/v2/features/screenshot/image-translate',
      label: '图片翻译',
      description: '截图 / 贴图图到图翻译；选择百度或有道，本机填写 API，设置页可直接申请。',
    },
    {
      href: '/v2/features/screenshot/toolbar-script',
      label: 'JS 自定义工具栏',
      description: '用脚本给默认工具栏加自定义按钮；进阶才整栏重排。',
    },
    {
      href: '/v2/xaction/modules/screen-capture-pro',
      label: '截图 Pro 步骤参数',
      description: '组合动作里的截图 Pro 步骤：延迟、剪贴板、贴图、吸附与自定义工具栏。',
    },
    {
      href: '/v2/xaction/modules/long-screenshot',
      label: '长截图',
      description: '在选区内滚动或移动，自动拼接成长图。',
    },
    {
      href: '/v2/xaction/modules/screen-recording-ui',
      label: '屏幕录制',
      description: '选定区域后录制为视频或 GIF。',
    },
    {
      href: '/v2/xaction/modules/showimage',
      label: '贴图（显示图片）',
      description: '将图片浮在屏幕上，支持缩放、透明度、标注与自动 OCR 选字。',
    },
    {
      href: '/v2/xaction/modules/screencapture',
      label: '屏幕截图（经典步骤）',
      description: '更简单的一屏截取：区域 / 全屏 / 窗口 / 固定区域。',
    },
  ]}
/>

[官网 2.1.21 记录](https://getquicker.net/V2/Versions)中新增了独立的 **贴图** 组合动作步骤，可从图片变量、剪贴板、文本、HTML、公式或 OCR 原始结果创建贴图；内容参数会跟随内容来源显示。[官网 2.1.23 记录](https://getquicker.net/V2/Versions)进一步增加了「自动」和「截图原位置」贴图位置，Quicker 或 PixPin 复制的图片可贴回原处，旧动作仍保持原有自定义坐标。当前仓库的 `data/xaction` 还没有该步骤的独立模块定义，因此参数页待后续结构化数据同步后补齐。已有 **显示图片** 步骤仍可用于显示图片文件、图片变量或剪贴板图片。

截图界面内已集成 OCR、图片翻译、智能马赛克、斜铺文字水印等常用后处理。更复杂的自动化仍可在动作链中用独立步骤完成。截图历史、已关闭贴图与录屏成品可在采集历史中心统一查看与管理；2.1.23 起，进行中的录屏也可以在这里管理，并可在页内预览、复制、另存和切换播放速度。
