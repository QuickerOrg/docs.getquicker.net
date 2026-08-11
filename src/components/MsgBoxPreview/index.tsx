/**
 * Read-only Quicker confirm / message dialog (WPF ConfirmDialog sketch).
 * Source: QuickerPc/Quicker/View/UI/ConfirmDialog.xaml
 *
 * Inside PreviewMap, live form values override the static MDX props.
 */
import type {ReactNode} from 'react';
import {
  usePreviewLiveSnapshot,
  type PreviewLiveSnapshot,
} from '@site/src/components/PreviewLive';
import {DocsStepIcon} from '@site/src/components/StepProgramView/DocsStepIcon';
import styles from './styles.module.css';

export type MsgBoxIcon = 'info' | 'question' | 'warning' | 'error' | 'none';

export type MsgBoxButton = {
  label: string;
  icon?: string;
  value?: string;
  shortcut?: string;
};

export type MsgBoxPreviewProps = {
  title?: string;
  /** Body text; newlines preserved. */
  message: string;
  /**
   * Preset (`info` / `question` / `warning` / `error` / `none`),
   * catalog enum (`Information`…), or a Quicker `fa:` spec.
   */
  icon?: MsgBoxIcon | string;
  /** Title-bar action icon (`fa:` spec). */
  actionIcon?: string;
  /** Button labels left → right. First is primary by default. */
  buttons?: Array<string | MsgBoxButton>;
  /**
   * Quicker custom-mode button defs, one per line:
   * `[fa:Light_Check:#28a745]是(_Y)|Yes`
   */
  buttonDefs?: string;
  /** Custom-mode default button value (highlights that button). */
  defaultButton?: string;
  /** Index of highlighted primary button. Ignored when defaultButton matches. */
  primaryIndex?: number;
  className?: string;
};

const ICON_GLYPH: Record<Exclude<MsgBoxIcon, 'none'>, string> = {
  info: 'i',
  question: '?',
  warning: '!',
  error: '×',
};

const PRESET_BY_CATALOG: Record<string, MsgBoxIcon> = {
  none: 'none',
  information: 'info',
  info: 'info',
  question: 'question',
  warning: 'warning',
  error: 'error',
};

const BUTTON_PRESETS: Record<string, string[]> = {
  OK: ['确定'],
  OKCancel: ['确定', '取消'],
  YesNo: ['是', '否'],
};

function bindFromLive(
  snapshot: PreviewLiveSnapshot,
  fallback: MsgBoxPreviewProps,
): MsgBoxPreviewProps {
  const {values, extras} = snapshot;
  const operation = (values.operation ?? 'default').trim().toLowerCase();
  const title = values.title ?? fallback.title;
  const message = values.message ?? fallback.message;
  if (operation === 'custom') {
    const customIcon = (values.customIcon ?? '').trim();
    return {
      ...fallback,
      title,
      message,
      actionIcon: extras.actionIcon ?? fallback.actionIcon,
      icon: customIcon || 'none',
      buttons: undefined,
      buttonDefs: values.customButtons,
      defaultButton: values.defaultButton ?? fallback.defaultButton,
    };
  }
  const buttonsKey = (values.buttons ?? '').trim();
  return {
    ...fallback,
    title,
    message,
    actionIcon: undefined,
    icon: values.icon ?? fallback.icon,
    buttons: BUTTON_PRESETS[buttonsKey] ?? fallback.buttons,
    buttonDefs: undefined,
    defaultButton: undefined,
  };
}

export function parseMsgBoxButtonDef(line: string): MsgBoxButton | null {
  const raw = line.trim();
  if (!raw) return null;

  let rest = raw;
  let icon: string | undefined;
  const iconMatch = /^\[([^\]]+)\]/.exec(rest);
  if (iconMatch) {
    icon = iconMatch[1].trim();
    rest = rest.slice(iconMatch[0].length);
  }

  let value: string | undefined;
  const pipe = rest.lastIndexOf('|');
  if (pipe >= 0) {
    value = rest.slice(pipe + 1).trim();
    rest = rest.slice(0, pipe).trim();
  }

  let shortcut: string | undefined;
  const shortcutMatch = /\(_([A-Za-z])\)\s*$/.exec(rest);
  if (shortcutMatch) {
    shortcut = shortcutMatch[1].toUpperCase();
    rest = rest.slice(0, shortcutMatch.index).trim();
  }

  rest = rest.replace(/\([^)]*\)\s*$/, '').trim();
  const label = rest || value || '';
  if (!label) return null;
  return {icon, label, shortcut, value: value || label};
}

function resolvePreset(icon: string | undefined): MsgBoxIcon | null {
  if (!icon) return 'question';
  const key = icon.trim().toLowerCase();
  if (!key) return 'question';
  if (key.startsWith('fa:')) return null;
  return PRESET_BY_CATALOG[key] ?? null;
}

function normalizeButtons(
  buttons: Array<string | MsgBoxButton> | undefined,
  buttonDefs: string | undefined,
): MsgBoxButton[] {
  if (buttonDefs?.trim()) {
    return buttonDefs
      .split(/\r?\n/)
      .map((line) => parseMsgBoxButtonDef(line))
      .filter((item): item is MsgBoxButton => item != null);
  }
  const list = buttons?.length ? buttons : ['确定', '取消'];
  return list.map((item) => (typeof item === 'string' ? {label: item, value: item} : item));
}

function resolvePrimaryIndex(
  items: MsgBoxButton[],
  defaultButton: string | undefined,
  primaryIndex: number | undefined,
): number {
  const wanted = defaultButton?.trim();
  if (wanted) {
    const byValue = items.findIndex((item) => (item.value ?? item.label) === wanted);
    if (byValue >= 0) return byValue;
    const byLabel = items.findIndex((item) => item.label === wanted);
    if (byLabel >= 0) return byLabel;
  }
  if (primaryIndex == null) return 0;
  if (primaryIndex < 0 || primaryIndex >= items.length) return 0;
  return primaryIndex;
}

/**
 * Read-only Quicker MsgBox / confirm dialog for docs.
 */
export default function MsgBoxPreview(props: MsgBoxPreviewProps): ReactNode {
  const snapshot = usePreviewLiveSnapshot();
  const bound = snapshot ? bindFromLive(snapshot, props) : props;
  const {
    title = 'Quicker',
    message,
    icon = 'question',
    actionIcon,
    buttons,
    buttonDefs,
    defaultButton,
    primaryIndex = 0,
    className,
  } = bound;
  const items = normalizeButtons(buttons, buttonDefs);
  const active = resolvePrimaryIndex(items, defaultButton, primaryIndex);
  const preset = resolvePreset(icon);
  const faSpec = !preset && icon && !icon.toLowerCase().startsWith('none') ? icon : '';

  return (
    <div
      className={['qk-docs-preview', styles.root, className].filter(Boolean).join(' ')}
      role="dialog"
      aria-label="弹窗提示示意"
      aria-modal="false">
      <div className={styles.titleBar} data-preview-drag-handle>
        <span className={styles.titleStart}>
          {actionIcon ? (
            <span data-preview-to="actionIcon">
              <DocsStepIcon spec={actionIcon} size={16} title="动作图标" />
            </span>
          ) : null}
          <span className={styles.titleText} data-preview-to="title">
            {title}
          </span>
        </span>
        <span className={styles.titleClose} aria-hidden>
          ×
        </span>
      </div>
      <div className={styles.body}>
        {preset && preset !== 'none' ? (
          <span
            className={[styles.icon, styles[`icon_${preset}`]].join(' ')}
            data-preview-to="icon"
            aria-hidden>
            {ICON_GLYPH[preset]}
          </span>
        ) : null}
        {faSpec ? (
          <span className={styles.iconFa} data-preview-to="icon">
            <DocsStepIcon spec={faSpec} size={32} />
          </span>
        ) : null}
        <div className={styles.message} data-preview-to="message">
          {message}
        </div>
      </div>
      <div className={styles.footer} data-preview-to="buttons">
        {items.map((item, i) => {
          const text = item.shortcut ? `${item.label}(${item.shortcut})` : item.label;
          return (
            <span
              key={`${item.value ?? item.label}-${i}`}
              className={i === active ? styles.btnPrimary : styles.btn}
              data-preview-to={i === active ? 'primaryButton' : undefined}>
              {item.icon ? <DocsStepIcon spec={item.icon} size={13} /> : null}
              {text}
            </span>
          );
        })}
      </div>
    </div>
  );
}
