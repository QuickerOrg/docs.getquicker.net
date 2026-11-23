import test from 'node:test';
import assert from 'node:assert/strict';
import {fixLine, fixMarkdown} from './fix-cjk-emphasis.mjs';

test('将紧贴汉字前的闭合句读移出加粗边界', () => {
  assert.equal(fixLine('**内容：**要发送到窗口'), '**内容**：要发送到窗口');
  assert.equal(
    fixLine('**从 1.x 升级到 2.x 前需要备份什么？**先在 1.x 完成同步'),
    '**从 1.x 升级到 2.x 前需要备份什么**？先在 1.x 完成同步',
  );
  assert.equal(fixLine('**【表达式】**表示'), '**【表达式】** 表示');
  assert.equal(fixLine('**`var`：**要生效'), '**`var`**：要生效');
});

test('同行多段加粗与标点混排不发生跨段错配', () => {
  const aiLine =
    '桌面工作台不再需要开启实验开关。2.3.10–2.3.12 曾保留 **在网页版中打开** 入口；**2.3.13 起已退役**，请使用桌面工作台，已有桌面对话继续保留。';
  assert.equal(fixLine(aiLine), aiLine);

  const volumeLine =
    '- **音量倍率**（2.3.32 起）：仅用于内置提示音和本地/网络音频，不控制 TTS 朗读。范围 **0～4**，支持小数；默认或空值为 **1**（原始音量），**0** 为静音，**0.5** 为减弱，**2** 为放大。';
  assert.equal(fixLine(volumeLine), volumeLine);

  const mcpLine =
    '- 2.3.19 起，MCP 的 **AI 自动配置** 页签精简了操作，**HTTP 连接** 可显示完整密钥。';
  assert.equal(fixLine(mcpLine), mcpLine);
});

test('句末标点与代码内的标记保持原样', () => {
  assert.equal(fixLine('**重要：**'), '**重要：**');
  assert.equal(fixLine('示例 `**内容：**要` 不改'), '示例 `**内容：**要` 不改');
  assert.equal(
    fixLine('示例 `` `**内容：**要` `` 不改'),
    '示例 `` `**内容：**要` `` 不改',
  );

  const doc = [
    '```md',
    '**内容：**要保留',
    '```',
    '',
    '**内容：**要修复',
  ].join('\n');
  assert.equal(
    fixMarkdown(doc),
    ['```md', '**内容：**要保留', '```', '', '**内容**：要修复'].join('\n'),
  );
});
