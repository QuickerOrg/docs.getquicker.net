/**
 * Read-only Quicker “用户输入” runtime window (WPF UserInputWindow sketch).
 * Source: QuickerPc/Quicker/View/UI/UserInputWindow.xaml
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

export type UserInputTool = {
  key: string;
  icon?: string;
  tooltip: string;
  /** Extra-menu ellipsis (TextToolType.ExtraSelectMenu). */
  more?: boolean;
};

export type UserInputPreviewProps = {
  title?: string;
  prompt?: string;
  value?: string;
  /** Highlight the value like SelectTextOnFocus after the window loads. */
  selectValue?: boolean;
  type?: 'text' | 'multiline' | 'number';
  /** Gray help text under the field (form HelpText / similar). */
  hint?: string;
  /** Catalog `texttools`: comma-separated TextToolType names. */
  texttools?: string;
  tools?: UserInputTool[];
  /** Show the hover tool strip (defaults to on when tools/texttools exist). */
  showTools?: boolean;
  /** Hovered tool key; shows the WPF tooltip when `showToolTooltip`. */
  activeTool?: string;
  showToolTooltip?: boolean;
  /** Catalog `help`: any non-empty markdown shows the 帮助 button. */
  help?: string;
  showHelp?: boolean;
  /** Footer Enter tip (UserInputWindow); hide for form-like scenes. */
  showEnterTip?: boolean;
  submitWithReturn?: boolean;
  className?: string;
};

const DEFAULT_SCENE_TOOLS: UserInputTool[] = [
  {
    key: 'SelectProcessPath',
    icon: 'fa:Light_Window:#4dabf7',
    tooltip: '选择窗口的进程路径',
  },
  {
    key: 'SelectSingleFolder',
    icon: 'fa:Light_FolderOpen:#4dabf7',
    tooltip: '选取文件夹',
  },
  {
    key: 'ExtraSelectMenu',
    tooltip: '更多',
    more: true,
  },
];

const TOOL_PRESETS: Record<string, UserInputTool> = {
  SelectSingleFile: {
    key: 'SelectSingleFile',
    icon: 'fa:Light_Paperclip:#4dabf7',
    tooltip: '选取文件',
  },
  SelectMultiFile: {
    key: 'SelectMultiFile',
    icon: 'fa:Light_Paperclip:#4dabf7',
    tooltip: '选取(多个)文件',
  },
  SelectSingleFolder: {
    key: 'SelectSingleFolder',
    icon: 'fa:Light_FolderOpen:#4dabf7',
    tooltip: '选取文件夹',
  },
  SelectSavePath: {
    key: 'SelectSavePath',
    icon: 'fa:Light_Save:#4dabf7',
    tooltip: '选择保存路径',
  },
  SelectProcessPath: {
    key: 'SelectProcessPath',
    icon: 'fa:Light_Window:#4dabf7',
    tooltip: '选择窗口的进程路径',
  },
  SelectProcessName: {
    key: 'SelectProcessName',
    icon: 'fa:Light_Window:#4dabf7',
    tooltip: '选择进程名',
  },
  ExtraSelectMenu: {
    key: 'ExtraSelectMenu',
    tooltip: '更多',
    more: true,
  },
};

function parseTools(texttools: string | undefined): UserInputTool[] {
  if (!texttools?.trim()) return [];
  return texttools
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((key) => TOOL_PRESETS[key] ?? {key, tooltip: key});
}

function tipForType(type: string, submitWithReturn: boolean): string {
  if (type === 'multiline') {
    return submitWithReturn
      ? 'Enter 快速确认, Shift+Enter换行'
      : 'Ctrl+Enter/Alt+S 快速确认';
  }
  return 'Enter 快速确认';
}

function bindFromLive(
  snapshot: PreviewLiveSnapshot,
  fallback: UserInputPreviewProps,
): UserInputPreviewProps {
  const {values} = snapshot;
  const typeRaw = (values.type ?? fallback.type ?? 'text').trim().toLowerCase();
  const type: UserInputPreviewProps['type'] =
    typeRaw === 'multiline' || typeRaw === 'number' ? typeRaw : 'text';
  const help = values.help ?? fallback.help;
  return {
    ...fallback,
    prompt: values.prompt ?? fallback.prompt,
    value: values.defaultValue ?? fallback.value,
    type,
    texttools: values.texttools ?? fallback.texttools,
    help,
    showHelp: help != null ? help.trim() !== '' : fallback.showHelp,
    submitWithReturn:
      values.submitWithReturn != null
        ? /^(1|true)$/i.test(values.submitWithReturn.trim())
        : fallback.submitWithReturn,
  };
}

function PinIcon(): ReactNode {
  return (
    <svg viewBox="0 0 16 16" width="11" height="11" aria-hidden>
      <path
        fill="currentColor"
        d="M9.6 1.4 8.4 2.6l.7 2.6-2.3 2.3-1.7-.5-1.2 1.2 2.8 1.3 1.3 2.8 1.2-1.2-.5-1.7 2.3-2.3 2.6.7 1.2-1.2-4.2-4.2zM4.2 12.3 2 14.5"
      />
    </svg>
  );
}

function HelpIcon(): ReactNode {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden>
      <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path
        fill="currentColor"
        d="M6.4 6.1c.15-1 1-1.6 2-1.6 1.1 0 1.9.6 1.9 1.6 0 .8-.4 1.2-1.1 1.6-.7.4-.9.7-.9 1.4v.2H7c0-1 .3-1.4 1.1-1.8.6-.3.8-.6.8-1.1 0-.5-.4-.8-.9-.8s-.9.3-1 .9l-1.6-.4zM7.2 11.6h1.7V10H7.2v1.6z"
      />
    </svg>
  );
}

function LightbulbIcon(): ReactNode {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden>
      <path
        fill="currentColor"
        d="M8 1.4A4.4 4.4 0 0 0 3.6 5.8c0 1.7.9 3.1 2.2 3.9v1.4h4.4V9.7c1.3-.8 2.2-2.2 2.2-3.9A4.4 4.4 0 0 0 8 1.4zm-1.6 11.2h3.2v.8a.8.8 0 0 1-.8.8H7.2a.8.8 0 0 1-.8-.8v-.8z"
      />
    </svg>
  );
}

function EllipsisIcon(): ReactNode {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden>
      <circle cx="3.2" cy="8" r="1.4" fill="#1e90ff" />
      <circle cx="8" cy="8" r="1.4" fill="#1e90ff" />
      <circle cx="12.8" cy="8" r="1.4" fill="#1e90ff" />
    </svg>
  );
}

/**
 * Read-only Quicker user-input dialog for docs.
 */
export default function UserInputPreview(props: UserInputPreviewProps): ReactNode {
  const snapshot = usePreviewLiveSnapshot();
  const bound = snapshot ? bindFromLive(snapshot, props) : props;
  const {
    title = 'Quicker',
    prompt = '请输入：',
    value = '',
    selectValue = true,
    type = 'text',
    hint,
    texttools,
    tools,
    showTools,
    activeTool = 'SelectProcessPath',
    showToolTooltip = true,
    help,
    showHelp,
    showEnterTip = true,
    submitWithReturn = false,
    className,
  } = bound;

  const parsedTools = tools?.length ? tools : parseTools(texttools);
  const visibleTools = parsedTools.length
    ? parsedTools
    : showTools
      ? DEFAULT_SCENE_TOOLS
      : [];
  const toolsVisible = visibleTools.length > 0;
  const helpVisible = showHelp ?? Boolean(help?.trim());
  const tip = tipForType(type, submitWithReturn);
  const selected = selectValue && value !== '';
  const active = visibleTools.find((tool) => tool.key === activeTool) ?? visibleTools[0];
  const showTooltip = toolsVisible && showToolTooltip && Boolean(active?.tooltip);
  const tooltipText = active?.tooltip
    ? /[\r\n]/.test(active.tooltip) || active.tooltip.endsWith('。')
      ? active.tooltip.replace(/\r\n/g, '\n')
      : `${active.tooltip}。`
    : '';

  return (
    <div
      className={['qk-docs-preview', styles.root, className].filter(Boolean).join(' ')}
      role="dialog"
      aria-label="用户输入窗口示意"
      aria-modal="false">
      <div className={styles.titleBar} data-preview-drag-handle>
        <span className={styles.logo} aria-hidden>
          ⚡
        </span>
        <span className={styles.title}>{title}</span>
        <span className={styles.titleTools} aria-hidden>
          <span className={styles.pin} title="置顶">
            <PinIcon />
          </span>
          <span className={styles.close}>×</span>
        </span>
      </div>
      <div className={styles.body}>
        <div className={styles.prompt} data-preview-from="prompt" data-preview-to="prompt">
          <span data-preview-handle="from">{prompt}</span>
        </div>
        <div
          className={[
            styles.field,
            type === 'multiline' ? styles.fieldMultiline : '',
            showTooltip ? styles.fieldHasTooltip : '',
          ]
            .filter(Boolean)
            .join(' ')}>
          <div
            className={styles.valueHost}
            data-preview-from="defaultValue"
            data-preview-to="defaultValue">
            <span data-preview-handle="from" className={styles.valueHandle}>
              {value ? (
                <span className={selected ? styles.selected : undefined}>{value}</span>
              ) : (
                <span className={styles.placeholder}> </span>
              )}
            </span>
          </div>
          {toolsVisible ? (
            <div className={styles.tools}>
              {showTooltip && active ? (
                <span className={styles.tooltip} role="tooltip">
                  {tooltipText}
                </span>
              ) : null}
              <div data-preview-from="texttools" data-preview-to="texttools">
                <div data-preview-handle="from" className={styles.toolRow}>
                  {visibleTools.map((tool) => {
                    const isActive = tool.key === active?.key;
                    return (
                      <span
                        key={tool.key}
                        className={[styles.tool, isActive ? styles.toolActive : '']
                          .filter(Boolean)
                          .join(' ')}
                        title={tool.tooltip}>
                        {tool.more ? (
                          <EllipsisIcon />
                        ) : (
                          <DocsStepIcon spec={tool.icon} size={16} title={tool.tooltip} />
                        )}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : null}
        </div>
        {hint ? <div className={styles.hint}>{hint}</div> : null}
        <div className={styles.footer}>
          <div className={styles.footerStart}>
            {helpVisible ? (
              <span
                className={styles.help}
                data-preview-from="help"
                data-preview-to="help">
                <span data-preview-handle="from" className={styles.helpHost}>
                  <span className={styles.helpHandle}>
                    <span className={styles.helpIcon}>
                      <HelpIcon />
                    </span>
                    帮助
                  </span>
                </span>
              </span>
            ) : (
              <span />
            )}
          </div>
          <div className={styles.footerEnd}>
            {showEnterTip ? (
              <span className={styles.tip} aria-hidden>
                <span className={styles.tipIcon}>
                  <LightbulbIcon />
                </span>
                {tip}
              </span>
            ) : null}
            <span className={styles.btnPrimary}>确认(S)</span>
            <span className={styles.btn}>取消(C)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
