/**
 * Read-only Quicker “用户选择” list dialog (WPF SelectOperationWindow sketch).
 * Inside PreviewMap, live form values override the static MDX props.
 */
import type {ReactNode} from 'react';
import {
  usePreviewLiveSnapshot,
  type PreviewLiveSnapshot,
} from '@site/src/components/PreviewLive';
import {DocsStepIcon} from '@site/src/components/StepProgramView/DocsStepIcon';
import {
  parseSelectGlobalChrome,
  parseSelectItems,
  resolveSelectIndex,
  type ParsedSelectItem,
} from './parseSelectItems';
import styles from './styles.module.css';

export type ChoiceListGlobalButton = string | {label: string; tone?: 'primary' | 'default'};

export type ChoiceListPreviewProps = {
  title?: string;
  options?: string[];
  /** Show 1-based index prefix like Quicker UI. */
  showIndex?: boolean;
  selectedIndex?: number;
  /** When set, show filter input filled with this text. */
  filterText?: string;
  /** Force the filter row even when `filterText` is empty. */
  showFilter?: boolean;
  hint?: string;
  /** Extra footer buttons before OK/Cancel (e.g. global menu buttons). */
  globalButtons?: ChoiceListGlobalButton[];
  showMoreMenu?: boolean;
  primaryLabel?: string;
  secondaryLabel?: string;
  className?: string;
};

type BoundChoice = {
  title: string;
  items: ParsedSelectItem[];
  selectedIndex?: number;
  filterText: string;
  showFilter: boolean;
  hint: string;
  globalButtons: ChoiceListGlobalButton[];
  showMoreMenu: boolean;
};

function itemsFromOptions(options: string[] | undefined): ParsedSelectItem[] {
  return (options ?? []).map((label) => ({label, value: label}));
}

function shouldShowFilter(showFilter: string, count: number): boolean {
  const raw = showFilter.trim().toLowerCase();
  if (raw === '1' || raw === 'true') return true;
  if (raw === '0' || raw === 'false') return false;
  return count > 10;
}

function bindFromLive(
  snapshot: PreviewLiveSnapshot,
  fallback: ChoiceListPreviewProps,
): BoundChoice {
  const {values} = snapshot;
  const parsed = values.items != null ? parseSelectItems(values.items) : [];
  const items = parsed.length > 0 ? parsed : itemsFromOptions(fallback.options);
  const type = (values.type ?? 'single').trim().toLowerCase();
  const defaultValue =
    type === 'multi' ? values.defaultValueMulti : values.defaultValue;
  const chrome = parseSelectGlobalChrome(values.operations ?? '');
  const filterText = values.filterContent ?? fallback.filterText ?? '';
  const showFilter =
    fallback.showFilter === true ||
    filterText !== '' ||
    shouldShowFilter(values.showFilter ?? '', items.length);
  return {
    title: values.prompt || fallback.title || '请选择',
    items,
    selectedIndex: resolveSelectIndex(items, defaultValue) ?? fallback.selectedIndex,
    filterText,
    showFilter,
    hint: values.note ?? fallback.hint ?? '',
    globalButtons:
      chrome.buttons.length > 0 ? chrome.buttons : (fallback.globalButtons ?? []),
    showMoreMenu: chrome.showMoreMenu || fallback.showMoreMenu === true,
  };
}

function bindStatic(props: ChoiceListPreviewProps): BoundChoice {
  const filterText = props.filterText ?? '';
  return {
    title: props.title || '请选择',
    items: itemsFromOptions(props.options),
    selectedIndex: props.selectedIndex,
    filterText,
    showFilter: props.showFilter === true || filterText !== '',
    hint: props.hint ?? '',
    globalButtons: props.globalButtons ?? [],
    showMoreMenu: props.showMoreMenu === true,
  };
}

export default function ChoiceListPreview(props: ChoiceListPreviewProps): ReactNode {
  const snapshot = usePreviewLiveSnapshot();
  const bound = snapshot ? bindFromLive(snapshot, props) : bindStatic(props);
  const {
    title,
    items,
    selectedIndex,
    filterText,
    showFilter,
    hint,
    globalButtons,
    showMoreMenu,
  } = bound;
  const {
    showIndex = true,
    primaryLabel = '确定(S)',
    secondaryLabel = '取消(C)',
    className,
  } = props;

  return (
    <div
      className={['qk-docs-preview', styles.root, className].filter(Boolean).join(' ')}
      role="dialog"
      aria-label="用户选择示意"
      aria-modal="false">
      <div className={styles.titleBar} data-preview-drag-handle>
        <span className={styles.logo} aria-hidden />
        <span className={styles.titleText} data-preview-to="prompt">
          {title}
        </span>
        <span className={styles.titleControls} aria-hidden>
          <span>−</span>
          <span>×</span>
        </span>
      </div>
      {showFilter ? (
        <div className={styles.filterRow} data-preview-from="filter" data-preview-to="filterContent">
          <div className={styles.filterInput} data-preview-handle="from">
            <span>{filterText || '\u00a0'}</span>
            <span className={styles.filterClear} aria-hidden>
              ×
            </span>
          </div>
        </div>
      ) : null}
      <div className={styles.list} data-preview-to="items">
        {items.map((item, i) => {
          const selected = selectedIndex === i;
          return (
            <div
              key={`${i}-${item.value}`}
              className={[styles.item, selected ? styles.itemSelected : ''].filter(Boolean).join(' ')}>
              {showIndex ? <span className={styles.index}>{i + 1}</span> : null}
              {item.icon ? <DocsStepIcon spec={item.icon} size={14} /> : null}
              <span className={styles.itemLabel}>{item.label}</span>
            </div>
          );
        })}
      </div>
      {hint ? (
        <div className={styles.hint} data-preview-to="note">
          {hint}
        </div>
      ) : null}
      <div className={styles.footer} data-preview-to="operations">
        <div className={styles.footerExtra}>
          {globalButtons.map((btn, i) => {
            const label = typeof btn === 'string' ? btn : btn.label;
            const tone = typeof btn === 'string' ? 'primary' : (btn.tone ?? 'primary');
            return (
              <span
                key={`${label}-${i}`}
                className={tone === 'primary' ? styles.btnPrimary : styles.btn}>
                {label}
              </span>
            );
          })}
          {showMoreMenu ? (
            <span className={styles.btnPrimary} aria-hidden>
              …
            </span>
          ) : null}
        </div>
        <div className={styles.footerActions}>
          <span className={styles.btnPrimary}>{primaryLabel}</span>
          <span className={styles.btn}>{secondaryLabel}</span>
        </div>
      </div>
    </div>
  );
}
