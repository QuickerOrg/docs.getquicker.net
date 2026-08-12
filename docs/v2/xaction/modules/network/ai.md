---
title: "AI 调用"
description: "调用第三方AI服务"
slug: "/v2/xaction/modules/ai"
sidebar_label: "AI 调用"
sidebar_position: 90
quickerDocKey: "xaction/module/sys:ai"
comments: true
moduleKey: "sys:ai"
docStatus: "reviewed"
metadataGeneratedAt: "2026-08-03 20:08:03"
legacyDocId: 117580978
legacyContentUpdatedAt: "2025-11-04T00:24:46.000Z"
---

# AI 调用

调用 OpenAI 兼容的 Chat / Completions 接口。非兼容接口请用 [HTTP请求](/v2/xaction/modules/http) 自己处理。

## 当前模块定义

<XActionModuleMeta moduleKey="sys:ai" />

## 概述

动作里多半是一次性任务，不是连续聊天。常见写法：

- **系统提示词** 说明角色和要求。
- **提示词** 用插值拼出完整指令和待处理内容。

下面是中英互译：系统提示说明「有中文就译成英文，否则译成中文，只返回译文」；提示词后面再接 `{text}`（来自获取选中文本或用户输入）。

需要自备网络和服务商账号。数据会发到服务商（可能在境外），不要发送敏感、隐私或依法不得出境的信息，也不要用于违法用途。模型和端点的对应关系、token 上限以官方文档为准。

<ModuleParamPreview
  moduleKey="sys:ai"
  values={{
    endpoint: 'chat',
    model: 'gpt-3.5-turbo',
    systemPrompt: '你是一位诗人。',
    prompt: '$$请根据下面的提示词写一首诗歌：\n{text}',
    maxTokens: '0',
    temperature: '0.6',
    topP: '1',
    n: '1',
    stream: 'true',
    streamTo: 'INPUT_TEXT',
    expireSeconds: '30',
    forceProxy: 'true',
  }}
  inputVars={{apiKey: 'apikey'}}
  outputVars={{result: 'result'}}
/>

## 参数说明

**接口端点**：Chat 或 Completions。

**模型**：模型 ID。是否适用于当前端点，看官方文档。

**系统提示词**：仅 Chat。角色和要求，例如「你是一个专业的翻译助手」。

**提示词**：仅 Chat / Completions。完整用户提示。1.42.21+ 支持纯文本，或兼容 gpt-4-vision 的 JSON 数组。不要填完整请求体。

<ModuleParamPreview
  moduleKey="sys:ai"
  focusKeys={['prompt']}
  values={{
    endpoint: 'chat',
    prompt: `[
  {
    "type": "image_url",
    "image_url": {
      "url": "https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/Studio-2-platinum_sprite_thumbnaill?sc=1"
    }
  },
  {
    "type": "text",
    "text": "图像描述了什么？"
  }
]`,
  }}
/>

**最大响应Token数**：大约 1 个汉字或 2/3 个英文单词。建议 `0`，太短会被截断。提示 token + 本项不能超过模型上限。

**温度**：0～1。越小越稳，越大越发散。默认 `0.2`。

**APIKey**：服务商密钥，注意保密。

**Orgnization**：可选，APIKey 对应的组织 ID。

**top_p**：见官方文档。仅 Chat / Completions。

**n**：生成几条结果，会加倍耗 token。模块只输出一条，其余要从原始响应里解析。

**使用流式输出**：边收边写到文本窗口。此时拿不到原始响应和 token 用量。

**流式输出窗口标识**：事先用非等待模式打开的文本窗口标识。填 `INPUT_TEXT` 则模拟输入到当前窗口（一切走焦点就停）。

**停止符stop**：遇到这些内容就停。[官方说明](https://help.openai.com/en/articles/5072263-how-do-i-use-stop-sequences)。留空时用推荐默认 `<|endoftext|>`。接第三方接口时务必设置（或用 1.38.35+），建议 `<|endoftext|>`。可用 `\r` `\n` `\t`；多行表示多个停止符。

**API网址**：自定义或中转。

- Azure：`https://YOUR_RESOURCE_NAME.openai.azure.com/openai/deployments/YOUR_DEPLOYMENT_NAME/{1}?api-version=2023-05-15`。`{1}` 不要改，是接口名占位符。
- 其它中转：`https://api网址/{1}`。
- 1.44.32+ 也可直接写以 `chat/completions` 结尾的完整网址。其它结尾可在前面加 `!` 强制使用，如 `!https://myserver/api/chat`。
- 硅基流动：`https://api.siliconflow.cn/v1/{1}`
- Ollama 本机：`http://127.0.0.1:11434/v1/{1}`

**超时秒数**：默认 `120`。

**响应格式**：仅 Chat。留空为文本，或 `json_object`。1.43.55+ 也可填完整 `response_format` JSON（如 json_schema）。输出 JSON 时提示词要配合，并避免超 token 被截断。

```json
{
  "type": "json_schema",
  "json_schema": {
    "name": "math_reasoning",
    "schema": {
      "type": "object",
      "properties": {
        "steps": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "explanation": { "type": "string" },
              "output": { "type": "string" }
            },
            "required": ["explanation", "output"],
            "additionalProperties": false
          }
        },
        "final_answer": { "type": "string" }
      },
      "required": ["steps", "final_answer"],
      "additionalProperties": false
    },
    "strict": true
  }
}
```

**附加参数**：仅 Chat。给第三方接口加字段。可传词典、JSON 或匿名对象：`$= new { 参数名 = "参数值" }`。

**强制使用代理**：即使软件设置未开代理，本步骤也走代理。

**会话ID** / **历史消息**：见下文。仅 Chat。

**失败后停止**：失败是否中止动作。默认开启。

## 输出

- **是否成功**
- **生成结果**
- **推理内容**：推理模型的 `reasoning_content`。旧稿未单独列出。
- **原始响应内容**
- **提示Token数** / **响应Token数** / **总Token数**
- **结束原因**
- **历史消息**：仅 Chat。消息对象列表；赋给文本变量时会变成 JSON。

流式输出时，原始响应和 token 相关输出不可用。

## 流式响应

流式目前无法检测错误。两种用法：

### 写到文本窗口

<TextWindowPreview
  title="文本窗口"
  text={'翻译结果：\nThe quick brown fox jumps over the lazy dog.'}
/>

先开一个非等待的文本窗口，设好标识（建议 `=`，等于动作 ID，避免多个动作抢同一个窗）：

<ModuleParamPreview
  moduleKey="sys:showText"
  focusKeys={['type', 'text', 'autoCloseKey']}
  values={{type: 'NO_WAIT', text: '翻译结果：', autoCloseKey: '='}}
/>

再在 AI 调用里打开流式，并填同一个窗口标识：

<ModuleParamPreview
  moduleKey="sys:ai"
  focusKeys={['stream', 'streamTo']}
  values={{stream: 'true', streamTo: '='}}
/>

<StepProgramView
  data={{
    steps: [
      {
        key: 'sys:showText',
        note: '显示窗口，不等待关闭（立即开始执行后续的步骤）　翻译结果：',
      },
      {key: 'sys:ai'},
    ],
  }}
/>

新内容会追加到窗口。1.43.61+ 若窗口开了 Markdown 高亮，`<think>` 推理过程会显示为灰色。

### 模拟输入到当前窗口

**流式输出窗口标识** 填 `INPUT_TEXT`。一切走焦点就停止输出。

## 历史会话

1.37.17+ 支持自动带上历史消息。

<ModuleParamPreview
  moduleKey="sys:ai"
  focusKeys={['sessionId', 'historyMessages']}
  values={{endpoint: 'chat'}}
/>

**1）自己维护历史**：把 JSON 数组传给 **历史消息**，不要填会话 ID，也不会回写历史。

**2）交给 Quicker**：数据在 `Quicker数据文件夹\AiLogs`。

- **会话ID**：每次会话前用 [生成Guid](/v2/xaction/modules/newguid) 生成，必须是 GUID 格式。
- **历史消息**：回传条数。总 token 有上限，太长要丢掉更早的消息。

建议用会话 ID 当文本窗口标识，避免同一动作连跑多次抢窗。

<StepProgramView example="fb351711-0941-4816-d9b7-08db2ba80230" />

<ShareLinkCard
  code="fb351711-0941-4816-d9b7-08db2ba80230"
  title="AI对话测试"
  description="测试历史消息自动回传"
  author="CL"
/>

## 示例动作

<ShareLinkCard
  items={[
    {
      code: '2ee54fa9-ad5b-4273-6f9b-08db22290442',
      title: 'AI写诗',
      description: '按提示词写诗并输出到当前窗口',
      author: 'CL',
    },
    {
      code: '531dc01c-4b59-42ef-6fbc-08db22290442',
      title: 'AI中英互译',
      description: '按是否含中文自动互译',
      author: 'CL',
    },
  ]}
/>

## 限制与排障

- 密钥、组织 ID 不要写进分享动作。
- 第三方中转必须带 `{1}` 或按 1.44.32+ 规则写完整网址。
- 流式看不到错误和 token；调试先关掉流式。
- 会话 ID 必须是 GUID，否则自动存历史会失败。

## 相关链接

<RelatedDocs
  items={[
    {
      href: '/v2/xaction/modules/http',
      label: 'HTTP请求',
      description: '非 OpenAI 兼容接口，自己处理 SSE。',
    },
    {
      href: '/v2/xaction/modules/showtext',
      label: '文本窗口',
      description: '流式输出要先开一个非等待窗口。',
    },
    {
      href: '/v2/xaction/modules/newguid',
      label: '生成Guid',
      description: '给自动历史会话生成会话 ID。',
    },
    {
      href: '/v2/xaction/modules/translation',
      label: '机器翻译/词典',
      description: '按厂商接口翻译，不必自己写提示词。',
    },
  ]}
/>

## 更新历史

- 20230714 修复 Azure 接口地址。
- 20240327 增加响应格式、附加参数；提示词支持 gpt-4-vision。
- 20241219 增加自定义响应格式说明。
- 20250307 1.43.61 输出 `reasoning_content`；Markdown 窗口灰色显示 `<think>`。
