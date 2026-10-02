import crypto from 'node:crypto';

export const start = '{/* script-api:start */}';
export const end = '{/* script-api:end */}';
export const labels = {
  qk: '根成员与运行上下文', Selection: '选区', State: '动作状态', Actions: '动作与子程序',
  Ui: '对话框与界面', Window: '窗口', Keyboard: '键盘', Mouse: '鼠标', Clipboard: '剪贴板',
  Files: '文件', Http: 'HTTP 请求', Process: '进程', Image: '图片', Screen: '截屏', Vision: '找图与 OCR',
  Browser: '浏览器', Apps: '外部程序', Ai: 'AI 与翻译', Uia: '界面自动化', Quicker: 'Quicker 服务',
  Text: '文本工具', Sys: '系统', Steps: '组合动作步骤',
};
const capabilities = {
  None: '无基础能力授权要求', ActionInvoke: '调用或停止其他动作', AiInvoke: '调用 AI 或翻译服务',
  BrowserControl: '操作浏览器页面', ClipboardRead: '读取剪贴板', ClipboardWrite: '修改剪贴板',
  ExternalScript: '在外部程序中执行脚本或命令（高风险）', FileRead: '读取文件', FileWrite: '修改文件',
  InteractiveCapture: '交互式截图', Keyboard: '键盘自动化', KeyboardMonitor: '监听按键', LocalDecrypt: '自用解密',
  Mouse: '鼠标自动化', Network: '访问网络', TempShare: '上传临时分享', QuickerCloud: '读写账号云端数据',
  ProcessStart: '启动程序或打开文件/网址', ProcessTerminate: '强制结束程序', ScreenObserve: '读取屏幕图像',
  OcrLocal: '本机文字识别', SelectionPaths: '读取资源管理器路径', SelectionText: '读取选中文本',
  SystemInfo: '读取系统信息', UiControl: '操作其他程序的界面元素', UiObserve: '读取其他程序的界面元素',
  WindowArrange: '改变窗口状态或位置', WindowFocus: '激活窗口', WindowMessage: '发送任意窗口消息（高风险）',
  WindowObserve: '读取窗口信息', XActionStep: '调用组合动作步骤（按步骤确认，高风险）',
};
export const slug = value => value.toLowerCase();
// 中文说明中保留 Markdown 内联代码；其余文本转义 MDX 的 JSX/表达式字符。
export function prose(value) {
  return String(value ?? '').split(/(`[^`]*`)/g).map((s, i) => i % 2 ? s : s.replace(/</g, '&lt;').replace(/{/g, '&#123;').replace(/}/g, '&#125;')).join('');
}
const cell = value => prose(value).replace(/\|/g, '&#124;').replace(/\r?\n/g, '<br/>');
const code = value => '`' + String(value).replaceAll('`', '\\`') + '`';
function groupBy(items, key) {
  const groups = new Map();
  for (const item of items) {
    const k = key(item);
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(item);
  }
  return groups;
}
export function validate(catalog) {
  if (catalog.schemaVersion !== 1 || !/^[a-f0-9]{40}$/.test(catalog.sourceCommit)) throw new Error('目录版本或来源提交无效');
  const domains = new Set();
  const signatures = new Set();
  for (const domain of catalog.domains) {
    if (!labels[domain.name] || domains.has(domain.name)) throw new Error(`未登记或重复的域：${domain.name}`);
    domains.add(domain.name);
    for (const m of domain.methods) {
      const id = `${domain.name}:${m.signature}`;
      if (signatures.has(id)) throw new Error(`重复签名：${id}`);
      signatures.add(id);
      for (const flag of (m.capability ?? '').split(', ').filter(Boolean)) if (!capabilities[flag]) throw new Error(`能力缺少中文映射：${flag}`);
    }
  }
  const types = new Set();
  for (const type of catalog.types) {
    if (!/^[A-Za-z][A-Za-z0-9]*$/.test(type.name) || types.has(type.name)) throw new Error(`类型无效或重复：${type.name}`);
    types.add(type.name);
  }
  if (!domains.has('qk') || !types.has('Ctx') || !Array.isArray(catalog.errors) || !Array.isArray(catalog.missingDescriptions)) throw new Error('目录不完整');
}
export function replaceGenerated(original, body) {
  const a = original.indexOf(start), b = original.indexOf(end);
  if (a < 0 || b < a || original.indexOf(start, a + start.length) >= 0 || original.indexOf(end, b + end.length) >= 0) throw new Error('生成区标记缺失、重复或顺序错误，拒绝覆盖人工正文');
  return original.slice(0, a + start.length) + '\n\n' + body.trim() + '\n\n' + original.slice(b);
}
export function freshPage(title, description, key, position = 10) {
  return `---\ntitle: ${JSON.stringify(title)}\ndescription: ${JSON.stringify(description)}\nquickerDocKey: ${key}\ncomments: false\nsidebar_position: ${position}\n---\n\n${start}\n\n${end}\n`;
}
function methodBody(method, security = '../security.md') {
  let text = '```csharp\n' + method.signature + '\n```\n\n';
  text += prose(method.description ?? '该成员的独立说明尚待补充；请结合参数声明、所在域的约定和编辑器检查使用。') + '\n\n';
  if (method.parameters.length) {
    text += '| 参数声明 | 说明 |\n|---|---|\n';
    for (const p of method.parameters) {
      const enumeration = p.values ? ` 取值：${p.values.values.map(code).join('、')}。${p.values.open ? '也接受其他值，详见成员说明。' : ''}` : '';
      text += `| ${cell(code(p.declaration))} | ${cell(p.description ?? '见本成员和所在域的说明。')}${cell(enumeration)} |\n`;
    }
    text += '\n';
  }
  text += `返回类型：${code(method.returns)}。空值、用户取消和异常行为以成员及域说明为准。\n\n`;
  if (method.capability !== null) text += '基础能力：' + method.capability.split(', ').map(v => capabilities[v]).join('；') + `。某些参数或数据来源会追加能力，详见[安全与授权](${security})。\n\n`;
  return text;
}
export function pages(catalog) {
  validate(catalog);
  const result = new Map();
  for (const domain of catalog.domains) {
    let body = prose(domain.description ?? '本页列出公开成员。') + '\n\n';
    if (domain.name === 'qk') body += '`qk.Context` 返回本次运行的上下文，字段见 [Ctx](./types/ctx.md)。\n\n';
    const groups = groupBy(domain.methods, m => m.key);
    for (const [key, methods] of groups) {
      body += `<a id="${key.toLowerCase().replaceAll('.', '-')}" />\n\n## ${key}\n\n`;
      body += methods.map(m => methodBody(m)).join('\n');
    }
    result.set(`api/${slug(domain.name)}.md`, {title: `qk${domain.name === 'qk' ? '' : '.' + domain.name}：${labels[domain.name]}`, body});
  }
  for (const type of catalog.types) {
    let body = prose(type.description ?? '字段与构造方法如下。') + '\n\n';
    if (type.constructors.length) body += '## 构造\n\n```csharp\n' + type.constructors.join('\n') + '\n```\n\n';
    if (type.properties.length) {
      body += '## 属性\n\n| 属性 | 类型 | 说明 |\n|---|---|---|\n';
      for (const p of type.properties) body += `| ${code(p.name)} | ${cell(code(p.type))} | ${cell(p.description ?? '见类型说明。')} |\n`;
      body += '\n';
    }
    for (const [key, methods] of groupBy(type.methods, m => m.key)) body += `<a id="${key.toLowerCase().replaceAll('.', '-')}" />\n\n## ${key}\n\n` + methods.map(m => methodBody(m, '../../security.md')).join('\n');
    result.set(`api/types/${slug(type.name)}.md`, {title: type.name, body});
  }
  result.set('api/types/index.md', {title: '公共类型', body: '脚本中的数据与句柄类型。窗口、图片和界面元素等句柄属于本次运行，不能当作普通数据跨运行保存。\n\n' + catalog.types.map(t => `- [${t.name}](./${slug(t.name)}.md)`).join('\n')});
  result.set('api/enums.md', {title: '字符串取值', body: '| 成员或类型 | 参数或字段 | 取值 | 是否接受其他值 |\n|---|---|---|---|\n' + catalog.enumSets.map(e => `| ${code(e.owner)} | ${code(e.target)} | ${cell(e.values.map(code).join('、'))} | ${e.open ? '是，见成员说明' : '否'} |`).join('\n')});
  result.set('api/errors.md', {title: '错误码索引', body: '用 `e.Code.Value` 判断失败原因，不要解析中文消息。调用名见 `e.OperationId`，扩展信息见 `e.Detail`。排查步骤见[常见问题](../troubleshooting.md)。\n\n| 错误码 | 常量名 |\n|---|---|\n' + catalog.errors.map(e => `| ${code(e.code)} | ${code(e.name)} |`).join('\n')});
  result.set('api/index.md', {title: 'API 参考', body: '通过 `qk` 调用 Quicker 能力。方法签名、默认值和下列说明来自当前产品 API；未提供独立说明的参数应结合域与成员说明查阅。\n\n' + catalog.domains.map(d => `- [${d.name === 'qk' ? 'qk' : 'qk.' + d.name}：${labels[d.name]}](./${slug(d.name)}.md)`).join('\n') + '\n\n- [公共类型](./types/index.md)\n- [字符串取值](./enums.md)\n- [错误码索引](./errors.md)\n- [运行限额](../limits.md)\n\n## 可用的纯计算类型\n\n```csharp\n' + catalog.pureTypes.join(', ') + '\n```'});
  return result;
}
export function contract(c) {
  const {sourceCommit, productVersion, assemblySha256, ...rest} = c;
  return rest;
}
export const hash = value => crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
