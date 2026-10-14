import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';

// Git 历史不足时，逐页更新时间会错误地落到浅克隆边界提交上。
export function ensureGitHistory(cwd = process.cwd()) {
  const git = (args) => execFileSync('git', args, {cwd, encoding: 'utf8'}).trim();
  if (git(['rev-parse', '--is-shallow-repository']) !== 'true') {
    return;
  }
  console.info('[docs] 补齐 Git 历史，以便获取各文档的真实更新时间。');
  execFileSync('git', ['fetch', '--unshallow', 'origin'], {cwd, stdio: 'inherit'});
  if (git(['rev-parse', '--is-shallow-repository']) === 'true') {
    throw new Error('Git 历史仍不完整，停止构建，避免显示错误的文档更新时间。');
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  ensureGitHistory();
}
