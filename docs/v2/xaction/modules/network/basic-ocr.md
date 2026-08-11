---
title: "基础OCR"
description: "获取图片中的文字"
slug: "/v2/xaction/modules/basic-ocr"
sidebar_label: "基础OCR"
sidebar_position: 40
quickerDocKey: "xaction/module/sys:basic-ocr"
comments: true
moduleKey: "sys:basic-ocr"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 3602224
legacyContentUpdatedAt: "2024-12-06T01:38:30.000Z"
---

# 基础OCR

从图片里认出文字或表格。公式请用 [公式识别](/v2/xaction/modules/mathocr)。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:basic-ocr" />

## 概述

**接口/引擎** 决定走哪套识别：

<ModuleParamPreview
  moduleKey="sys:basic-ocr"
  focusKeys={['operation']}
  values={{operation: 'QuickerServerOcr'}}
/>

- **Quicker OCR引擎**：在线服务。当前固定走在线，不再用「离线模式」切换。
- **本地 OCR（中英）**：2.x 独立本地引擎，图片不上传。首次按需下载模型，可选标准和快速档。见 [2.x 基础OCR说明](/v2/what's-new/xaction-steps/basic-ocr)。
- **Windows10/11 内置OCR引擎**
- **百度通用文字识别（自定义帐号 / Quicker帐号）**
- **百度自定义接口识别（自定义帐号）**
- **表格识别（Quicker服务）**：2.x 改为本地完成。

旧动作若在 Quicker OCR 上选了「仅使用离线引擎」，会转到 **本地 OCR（中英）**。新动作请直接选本地 OCR。

## 共用参数

多数引擎都会用到：

**图片变量**：要识别的图。也可以传图片路径或 Base64 文本。图越小越快。

**转换标点符号**：不转换 / 全角 / 半角。仅 Quicker 在线、百度通用。

**合并段落**：按行尾是否像句子结束，决定要不要把多行合成一段。仅 Quicker 在线、百度通用。

**语言**：仅 Quicker 在线和表格识别。中英、英语、韩语、日语、繁体中文、拉丁语、阿拉伯语。表格识别只支持中英和英文。

**失败后停止**：失败是否中止动作。默认开启。

## 输出

- **是否成功**
- **行列表**：每行一项。Quicker 在线、本地 OCR、Windows、百度通用。
- **合并后结果**：按标点和合并段落处理后的文本。表格识别时是 HTML。
- **原始结果**：接口返回的完整内容。
- **原始结果JObject对象**：仅百度三种接口。

## Quicker OCR引擎

免费在线识别。服务器资源有限，请合理使用。

- 免费版：最短间隔 10 秒，每日最多 100 次。
- 专业版：最短间隔 2 秒，每日最多 1000 次；可用独享 GPU。
- 额度可能随负载调整。无首次启动延迟，适合偶尔用。

<ModuleParamPreview
  moduleKey="sys:basic-ocr"
  values={{
    operation: 'QuickerServerOcr',
    punctuationType: 'no',
    mergeChapter: 'no',
    lang: 'CHN_ENG',
  }}
  inputVars={{imgVar: 'img'}}
  outputVars={{content: 'text'}}
/>

**离线模式** 是旧版兼容项，仅 Quicker OCR 引擎还显示。现在这个引擎固定走在线；旧动作选「仅使用离线引擎」会改走本地 OCR。

调试运行时可以看到实际用的引擎：

![](./img/basic-ocr-003-9122e59f45.png)

<ShareLinkCard
  code="45a0cf34-ca99-494c-4af7-08db410cf70d"
  title="QuickerOCR"
  description="识别并自动复制文本"
  author="CL"
/>

## 本地 OCR（中英）

2.x 的本地引擎，不经过在线服务。首次使用某个模型会按需下载；标准档偏准，快速档偏小偏快。会占磁盘、内存和 CPU。复杂版面或其它语言可换别的引擎。

旧版离线包（Paddle 引擎、手动解压到 `文档\Quicker\_ocr`）仍可用于老环境。新动作请直接选本项，不必再装那套 zip。

<ModuleParamPreview
  moduleKey="sys:basic-ocr"
  focusKeys={['operation', 'imgVar', 'isSuccess', 'content', 'textList']}
  values={{operation: 'LocalOcr'}}
  inputVars={{imgVar: 'img'}}
  outputVars={{content: 'text'}}
/>

### 旧版离线识别引擎包

安装条件：64 位 Windows，CPU 支持 AVX。

适合识别很勤、需要屏幕找字、或要认整屏大图的场景。不支持多线程，不要同时在多个动作里调。首次（或超过保活时间后再用）要加载模型，会慢一点。1.2.1 起不再支持表格识别。

下载：

- [百度网盘](https://pan.baidu.com/s/19PF_mVVfnEIXqjJju4I4fA?pwd=rrv4)（提取码 rrv4）
- [123 网盘](https://www.123pan.com/s/9eOcVv-HsSD3.html)
- [GitHub OfflineOCR1.2.1](https://github.com/cuiliang/Quicker/releases/tag/OfflineOCR1.2.1)
- QQ 群文件

默认会做文字方向检测；小图可能判错。要关掉旋转检测，先装完整包，再用 [quickerocragent_norotation.zip](https://files.getquicker.cn/files/quickerocragent_norotation.zip) 覆盖对应文件。

安装：下载 zip → 解压 → 双击 `安装到目标位置.bat`，或把内容复制到 `文档\Quicker\_ocr`。

![](./img/basic-ocr-004-2fb1920fb5.png)

最终目录类似：

![](./img/basic-ocr-005-9e612e1086.png)

若出现「PaddleConfig 的类型初始值设定项引发异常」，安装 [Visual C++ Redistributable](https://aka.ms/vs/17/release/vc_redist.x64.exe)。

<NotifyToastPreview
  variant="warning"
  message={'离线OCR失败。“Sdcb.PaddleInference.PaddleConfig”的类型初始值设定项引发异常。\n(----Quicker OCRv2:基础OCR----)'}
/>

旧版保活时间在软件设置里调，避免每次重新加载模型：

![](./img/basic-ocr-008-074dd26b9c.png)

<ShareLinkCard
  code="4f27bd92-e6fc-4c48-ad58-08dd15875f2b"
  title="QuickerOCR离线"
  description="旧版离线引擎示例"
  author="CL"
/>

## Windows 10/11 内置OCR

用系统当前语言识别，速度快，效果一般。参数含义与上文共用项相同。

<ModuleParamPreview
  moduleKey="sys:basic-ocr"
  focusKeys={['operation', 'imgVar', 'stopIfFail', 'isSuccess', 'content', 'textList', 'rawData']}
  values={{operation: 'WindowsOcr'}}
  inputVars={{imgVar: 'img'}}
  outputVars={{content: 'text'}}
/>

## 百度OCR

### 通用文字识别（自定义帐号）

<ModuleParamPreview
  moduleKey="sys:basic-ocr"
  focusKeys={[
    'operation',
    'apiKey',
    'secretKey',
    'imgVar',
    'punctuationType',
    'mergeChapter',
    'stopIfFail',
    'isSuccess',
    'content',
    'textList',
    'rawData',
    'rawObject',
  ]}
  values={{operation: 'baidu-basic', punctuationType: 'no', mergeChapter: 'no'}}
  inputVars={{imgVar: 'img'}}
  outputVars={{content: 'text'}}
/>

**ApiKey** / **SecretKey**：自己的百度账号。

申请可参考：[百度账号申请教程](https://getquicker.net/KC/Kb/Article/364)（@Marcus）。

### 通用文字识别（Quicker帐号）

公共账号省去自己申请，但大家共享百度每日约 5 万次免费额度：

- 百度若取消免费额度，此方式会不可用。
- 只适合轻度使用；量大请用自己的账号。
- 免费版每日最多 20 次，专业版 100 次。
- 设置里可在额度用完后花 Q豆继续，每次 0.005 Q豆。[什么是 Q豆？](https://getquicker.net/KC/Kb/Article/933)

<ModuleParamPreview
  moduleKey="sys:basic-ocr"
  focusKeys={[
    'operation',
    'imgVar',
    'punctuationType',
    'mergeChapter',
    'stopIfFail',
    'isSuccess',
    'content',
    'textList',
    'rawData',
    'rawObject',
  ]}
  values={{operation: 'baidu-quicker', punctuationType: 'no', mergeChapter: 'no'}}
  inputVars={{imgVar: 'img'}}
  outputVars={{content: 'text'}}
/>

### 全局自有 OCR 账号

在软件设置里填一组百度 ApiKey，供所有基础 OCR 步骤使用。

![](./img/basic-ocr-012-480c543752.png)

勾选 **总是使用上面设置的自有ApiKey** 后，即使步骤里选了 Quicker 账号或另填了密钥，也会改用这组全局账号。

### 自定义接口识别

按百度文档调用指定接口，返回原始响应。[接口文档](https://cloud.baidu.com/doc/OCR/s/1k3h7y3db)

<ModuleParamPreview
  moduleKey="sys:basic-ocr"
  focusKeys={[
    'operation',
    'apiKey',
    'secretKey',
    'imgVar',
    'interface',
    'options',
    'stopIfFail',
    'isSuccess',
    'rawData',
    'rawObject',
  ]}
  values={{operation: 'baidu-custom'}}
  inputVars={{imgVar: 'img'}}
/>

**接口名称或网址**：完整 URL，或 `https://aip.baidubce.com/rest/2.0/ocr/v1/` 后面的名字，如下拉里的 `accurate_basic`。个别接口域名不同，这时要填完整网址并自己试。

![](./img/basic-ocr-014-a73dd30a25.png)

**附加参数**：词典，或每行 `option:value`。以百度文档为准。

## 表格识别（Quicker服务）

抽出图中的表格，**合并后结果** 是 HTML。2.x 改为本地识别。旧版在线额度：免费版约 10 分钟一次，专业版约 10 秒一次。

<ModuleParamPreview
  moduleKey="sys:basic-ocr"
  focusKeys={['operation', 'imgVar', 'lang', 'stopIfFail', 'isSuccess', 'content', 'rawData']}
  values={{operation: 'table_quicker', lang: 'CHN_ENG'}}
  inputVars={{imgVar: 'bmp'}}
  outputVars={{content: 'selectedText'}}
/>

<ShareLinkCard
  code="3fc97b7e-7be1-4a23-3d64-08db3e27302e"
  title="表格识别"
  description="截图识别表格并生成 Excel"
  author="CL"
/>

## 限制与排障

- 在线 Quicker OCR 有次数和间隔限制，循环里请改用本地 OCR。
- 旧版离线包报 PaddleConfig 异常时，先装 VC++ 运行库。
- 百度公共账号额度用完会失败，改自己的 ApiKey 或开 Q豆续用。
- 本地 OCR 首次会下载模型，需已登录 Quicker。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/mathocr',
      label: '公式识别',
      description: '认的是公式，不是普通文字。',
    },
    {
      href: "/v2/what's-new/xaction-steps/basic-ocr",
      label: '2.x 基础OCR',
      description: '本地引擎、模型档位和本地表格识别。',
    },
  ]}
/>

## 更新历史

- 20230505 整理文档。
- 20241206 增加离线 OCR 测试动作。
- 2.x 增加本地 OCR（中英）；旧离线选项映射到本地引擎。
