/**
 * Read-only “添加/编辑变量” dialog for docs.
 * Source: QuickerPc/Quicker/View/X/VariableEditorWindow.xaml
 */
import type {ReactNode} from 'react';
import {DocsStepIcon} from '@site/src/components/StepProgramView/DocsStepIcon';
import {VarTypeIcon, varTypeZhLabel} from '@site/src/components/VarTypeIcon';
import styles from './styles.module.css';

export type VariableDefPreviewProps = {
  /** Variable name, e.g. number / dict */
  name: string;
  /**
   * Catalog / C# type (`Integer`, `Text`…) — drives icon + Chinese label.
   * Prefer this over `typeLabel` when known.
   */
  type?: string;
  /** Display type label when `type` is omitted, e.g. 词典 / 文本 */
  typeLabel?: string;
  remark?: string;
  /** Default value text (simple mode or JSON). */
  defaultValue?: string;
  /** Show “作为状态使用” checked. */
  asState?: boolean;
  /** Optional title bar text. */
  title?: string;
  className?: string;
};

/**
 * Lightweight stand-in for the “添加/编辑变量” dialog — for docs screenshots.
 * Supports PreviewMarks via `data-preview-from` on each field.
 */
export default function VariableDefPreview({
  name,
  type,
  typeLabel,
  remark = '',
  defaultValue = '',
  asState = false,
  title = '添加/编辑变量',
  className,
}: VariableDefPreviewProps): ReactNode {
  const resolvedTypeLabel = type ? varTypeZhLabel(type) : (typeLabel ?? '文本');
  const typeIcon = type ?? typeLabel ?? 'Text';

  return (
    <div
      className={['qk-docs-preview', styles.root, className].filter(Boolean).join(' ')}
      role="dialog"
      aria-label={title}
      aria-modal="false">
      <div className={styles.titleBar}>
        <span className={styles.logo} aria-hidden />
        <span className={styles.titleText}>{title}</span>
        <span className={styles.titleClose} aria-hidden>
          ×
        </span>
      </div>
      <div className={styles.body}>
        <Field markKey="name" label="变量名" hint="尽量使用便于识别的名字。">
          <div className={styles.input} data-preview-handle="from">
            {name}
          </div>
        </Field>
        <Field markKey="type" label="类型">
          <div className={styles.typeChip} data-preview-handle="from">
            <VarTypeIcon className={styles.typeIcon} type={typeIcon} size={16} />
            <span>{resolvedTypeLabel}</span>
          </div>
        </Field>
        <Field markKey="remark" label="备注" hint="变量的注释">
          <div className={styles.input} data-preview-handle="from">
            {remark || '\u00a0'}
          </div>
        </Field>
        <Field markKey="defaultValue" label="默认值" hint="变量的初始值">
          <div className={styles.defaultRow} data-preview-handle="from">
            <pre className={styles.defaultValue}>{defaultValue || ' '}</pre>
            <span className={styles.expandBtn} title="在编辑器中修改" aria-hidden>
              <DocsStepIcon spec="fa:Light_ExternalLinkSquare:#2b7abf" size={12} />
            </span>
          </div>
        </Field>
        <div className={styles.advanced} data-preview-from="asState">
          <div className={styles.advancedLabel}>高级选项</div>
          <div className={styles.advancedBody} data-preview-handle="from">
            <label className={styles.checkRow}>
              <input type="checkbox" checked={asState} readOnly tabIndex={-1} />
              <span>作为状态使用</span>
            </label>
            <p className={styles.hint}>
              运行动作后保存变量的值，并在下次运行时加载。仅在特殊情况下使用。
            </p>
          </div>
        </div>
      </div>
      <div className={styles.footer}>
        <span className={styles.help}>
          <DocsStepIcon spec="fa:Light_QuestionCircle:#2b7abf" size={14} />
          查看帮助
        </span>
        <div className={styles.actions}>
          <span className={styles.btnPrimary}>保存(S)</span>
          <span className={styles.btn}>取消(C)</span>
        </div>
      </div>
    </div>
  );
}

function Field({
  markKey,
  label,
  hint,
  children,
}: {
  markKey: string;
  label: string;
  hint?: string;
  children: ReactNode;
}): ReactNode {
  return (
    <div className={styles.field} data-preview-from={markKey}>
      <div className={styles.label}>{label}</div>
      <div className={styles.control}>
        {children}
        {hint ? <div className={styles.hint}>{hint}</div> : null}
      </div>
    </div>
  );
}
