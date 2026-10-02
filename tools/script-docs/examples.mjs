import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export function collect(directory) {
  if (directory instanceof URL) directory = fileURLToPath(directory);
  return fs.readdirSync(directory, {withFileTypes: true}).flatMap(e => {
    const file = path.join(directory, e.name);
    return e.isDirectory() ? collect(file) : [file];
  }).sort();
}
export function examples() {
  const docs = path.join(root, 'docs/v2/script-action');
  const result = [];
  for (const file of collect(docs).filter(f => f.endsWith('.md'))) {
    const text = fs.readFileSync(file, 'utf8');
    let i = 0;
    for (const match of text.matchAll(/```csharp\r?\n([\s\S]*?)```/g)) {
      if (!/\bMain\s*\(/.test(match[1])) continue; // API 签名不是完整脚本。
      const name = path.relative(docs, file).replace(/\.md$/, '').replaceAll(path.sep, '-') + '-' + (++i);
      result.push({name, code: match[1].trimEnd() + '\n'});
    }
  }
  return result;
}
if (process.argv.includes('--out')) {
  const directory = path.resolve(process.argv[process.argv.indexOf('--out') + 1]);
  fs.mkdirSync(directory, {recursive: true});
  // 不递归删除目标目录；只移除本工具写入的带前缀文件，避免旧示例混入本次检查。
  for (const file of fs.readdirSync(directory)) if (/^script-doc-.+\.cs$/.test(file)) fs.unlinkSync(path.join(directory, file));
  const list = examples();
  for (const e of list) fs.writeFileSync(path.join(directory, 'script-doc-' + e.name + '.cs'), e.code);
  console.log(`已提取 ${list.length} 个文档内完整脚本到 ${directory}`);
}
