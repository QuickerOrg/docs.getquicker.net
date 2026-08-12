/**
 * Read-only Quicker text window (WPF TextWindow sketch).
 * Source: QuickerPc/Quicker/View/UI/TextWindow.xaml
 */
import type {ReactNode} from 'react';
import {DocsStepIcon} from '@site/src/components/StepProgramView/DocsStepIcon';
import styles from './styles.module.css';

export type TextWindowPreviewProps = {
  title?: string;
  text: string;
  showLineNum?: boolean;
  showToolbar?: boolean;
  className?: string;
};

const TOOLS: {spec: string; title: string}[] = [
  {spec: 'fa:Light_SearchPlus', title: '字体变大'},
  {spec: 'fa:Light_SearchMinus', title: '字体变小'},
  {spec: 'fa:Light_Copy', title: '复制选中的文本'},
  {spec: 'fa:Light_VolumeUp', title: '朗读选中的文本'},
  {spec: 'fa:Light_Search', title: '查找(Ctrl+F)与替换(Ctrl+H)'},
  {spec: 'fa:Light_Reply', title: '撤销'},
];

export default function TextWindowPreview({
  title = '文本窗口',
  text,
  showLineNum = true,
  showToolbar = true,
  className,
}: TextWindowPreviewProps): ReactNode {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  return (
    <div className={[styles.root, 'qk-docs-preview', className ?? ''].filter(Boolean).join(' ')}>
      <div className={styles.titleBar}>
        <span className={styles.titleText}>{title}</span>
        <span className={styles.titleClose} aria-hidden>
          ×
        </span>
      </div>
      {showToolbar ? (
        <div className={styles.toolbar} role="toolbar" aria-label="文本窗口工具栏">
          {TOOLS.map((tool) => (
            <span key={tool.title} className={styles.tool} title={tool.title}>
              <DocsStepIcon spec={tool.spec} size={14} />
            </span>
          ))}
        </div>
      ) : null}
      <div className={styles.body}>
        {showLineNum ? (
          <div className={styles.gutter} aria-hidden>
            {lines.map((_, index) => (
              <div key={index}>{index + 1}</div>
            ))}
          </div>
        ) : null}
        <pre className={styles.text}>{text}</pre>
      </div>
    </div>
  );
}
