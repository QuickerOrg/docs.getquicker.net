import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Admonition from '@theme/Admonition';

export type V2PreviewNoticeProps = {
  variant?: 'caution' | 'landing';
};

/** Shared V2 Preview & Pro-only notice so status updates stay single-sourced. */
export default function V2PreviewNotice({
  variant = 'caution',
}: V2PreviewNoticeProps): ReactNode {
  if (variant === 'landing') {
    return (
      <div className="docs-landing__notice">
        <p>
          <strong>V2 目前为 Preview 体验版，仅面向专业版用户。</strong>{' '}
          免费版数据迁移仍在开发，免费账号目前无法登录 2.0。体验前请阅读{' '}
          <Link to="/important-notice">安装前准备</Link>
          ，不建议替换无法中断的 1.x 关键环境。
        </p>
      </div>
    );
  }

  return (
    <Admonition type="caution" title="Preview · 仅专业版">
      <p>
        当前 V2 是 <strong>Preview 体验版</strong>
        ，仅面向专业版用户。免费版数据迁移仍在开发，免费账号目前无法登录
        2.0。不建议用它替换无法中断的 1.x 关键环境。体验前请先读{' '}
        <Link to="/important-notice">安装前准备</Link>。
      </p>
    </Admonition>
  );
}
