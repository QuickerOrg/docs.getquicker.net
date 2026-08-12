/**
 * Read-only Quicker search window sketch for docs.
 * Source: QuickerPc/Quicker/Domain/Searching/UI/SearchWindow.xaml
 */
import {useEffect, useState, type ReactNode} from 'react';
import {DocsStepIcon} from '@site/src/components/StepProgramView/DocsStepIcon';
import styles from './styles.module.css';

export type SearchBoxResultItem = {
  title: string;
  description?: string;
  tag?: string;
  icon?: string;
};

export type SearchBoxPreviewProps = {
  /**
   * `pick` — keyword search list (before Tab).
   * `param` — action selected via Tab; query becomes parameter input.
   * `live` — live-search result list while typing.
   */
  mode?: 'pick' | 'param' | 'live';
  /** Search / parameter text shown in the header field. */
  query?: string;
  /** Selected action title (param mode chip). */
  selectedAction?: string;
  selectedIcon?: string;
  results?: readonly SearchBoxResultItem[];
  selectedIndex?: number;
  /** Cycle pick → param (or live query growth) when motion allowed. */
  animate?: boolean;
  className?: string;
};

const DEFAULT_PICK: SearchBoxResultItem[] = [
  {
    title: '翻译',
    description: '全能型翻译动作',
    tag: '[_global]',
    icon: 'fa:Solid_Language:#7b61ff',
  },
  {
    title: '实时搜索示例',
    description: '实时搜索示例',
    tag: '[示例]',
    icon: 'fa:Solid_Search:#2b7abf',
  },
  {
    title: '快速素材',
    description: '快速粘贴网页图片，粘贴选中文字',
    tag: '[测试 #1]',
    icon: 'fa:Light_Rocket:#39b54d',
  },
];

const DEFAULT_LIVE: SearchBoxResultItem[] = [
  {title: '大写', description: '转为大写', icon: 'fa:Solid_Font:#2b7abf'},
  {title: '复制', description: '复制到剪贴板', icon: 'fa:Light_Copy:#6aaded'},
  {title: '粘贴', description: '粘贴剪贴板', icon: 'fa:Light_Paste:#6aaded'},
  {title: '运行', description: '运行匹配项', icon: 'fa:Light_Play:#39b54d'},
];

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/** Docs sketch of Quicker search (Tab 传参 / 实时搜索). */
export default function SearchBoxPreview({
  mode = 'pick',
  query,
  selectedAction = '翻译',
  selectedIcon = 'fa:Solid_Language:#7b61ff',
  results,
  selectedIndex = 0,
  animate = true,
  className,
}: SearchBoxPreviewProps): ReactNode {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!animate || prefersReducedMotion()) {
      return undefined;
    }
    const id = window.setInterval(() => setPhase((n) => n + 1), 1600);
    return () => window.clearInterval(id);
  }, [animate]);

  let effectiveMode = mode;
  let effectiveQuery = query;
  let effectiveSelected = selectedIndex;
  let list = results;

  if (mode === 'pick' && animate && !prefersReducedMotion()) {
    // 0 pick list → 1 param entry
    effectiveMode = phase % 2 === 0 ? 'pick' : 'param';
    effectiveQuery =
      effectiveMode === 'pick' ? (query ?? '翻译') : (query ?? 'Quick');
    effectiveSelected = 0;
  } else if (mode === 'live' && animate && !prefersReducedMotion()) {
    const steps = ['', 'h', 'he', 'hel'];
    effectiveQuery = query ?? steps[phase % steps.length]!;
  }

  if (!list) {
    list = effectiveMode === 'live' ? DEFAULT_LIVE : DEFAULT_PICK;
  }
  if (effectiveQuery === undefined) {
    effectiveQuery =
      effectiveMode === 'param' ? 'Quick' : effectiveMode === 'live' ? 'h' : '翻译';
  }

  const showResults = effectiveMode !== 'param';

  return (
    <div
      className={['qk-docs-preview', styles.root, className].filter(Boolean).join(' ')}
      role="dialog"
      aria-label="Quicker 搜索示意"
      aria-modal="false">
      <div className={styles.header}>
        {effectiveMode === 'param' ? (
          <span className={styles.chip}>
            <DocsStepIcon spec={selectedIcon} size={14} />
            <span>{selectedAction}</span>
          </span>
        ) : (
          <span className={styles.brand}>Quicker 搜索</span>
        )}
        <span className={styles.query}>{effectiveQuery}</span>
        {effectiveMode === 'param' ? (
          <span className={styles.hint}>Tab 已选定 · Enter 运行</span>
        ) : effectiveMode === 'live' ? (
          <span className={styles.hint}>实时结果</span>
        ) : (
          <span className={styles.hint}>Tab 传参</span>
        )}
      </div>
      {showResults ? (
        <ul className={styles.list}>
          {list.map((item, index) => (
            <li
              key={`${item.title}-${index}`}
              className={
                index === effectiveSelected ? styles.itemSelected : styles.item
              }>
              <span className={styles.icon}>
                <DocsStepIcon
                  spec={item.icon ?? 'fa:Light_Bolt:#2b7abf'}
                  size={16}
                />
              </span>
              <span className={styles.meta}>
                <span className={styles.title}>{item.title}</span>
                {item.description ? (
                  <span className={styles.desc}>{item.description}</span>
                ) : null}
              </span>
              {item.tag ? <span className={styles.tag}>{item.tag}</span> : null}
            </li>
          ))}
        </ul>
      ) : (
        <div className={styles.paramBody}>
          参数将写入 <code>{'{quicker_in_param}'}</code>，回车运行「{selectedAction}」。
        </div>
      )}
    </div>
  );
}
