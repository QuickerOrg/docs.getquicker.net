import type {ReactNode} from 'react';
import styles from './styles.module.css';

export type VariableDefPreviewProps = {
  /** Variable name, e.g. 词典变量 / dict */
  name: string;
  /** Display type label, e.g. 词典 / 文本 */
  typeLabel: string;
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
 * Not a full WPF clone; focuses on name / type / default value.
 */
export default function VariableDefPreview({
  name,
  typeLabel,
  remark = '',
  defaultValue = '',
  asState = false,
  title = '添加/编辑变量',
  className,
}: VariableDefPreviewProps): ReactNode {
  return (
    <div className={['qk-docs-preview', styles.root, className].filter(Boolean).join(' ')}>
      <div className={styles.titleBar}>{title}</div>
      <div className={styles.body}>
        <Field label="变量名" hint="尽量使用便于识别的名字。">
          <div className={styles.input}>{name}</div>
        </Field>
        <Field label="类型">
          <div className={styles.typeChip}>
            <span className={styles.typeIcon} aria-hidden>
              ab
            </span>
            <span>{typeLabel}</span>
          </div>
        </Field>
        <Field label="备注" hint="变量的注释">
          <div className={styles.input}>{remark || '\u00a0'}</div>
        </Field>
        <Field label="默认值" hint="变量的初始值">
          <pre className={styles.defaultValue}>{defaultValue || ' '}</pre>
        </Field>
        <div className={styles.advanced}>
          <div className={styles.advancedTitle}>高级选项</div>
          <label className={styles.checkRow}>
            <input type="checkbox" checked={asState} readOnly tabIndex={-1} />
            <span>作为状态使用</span>
          </label>
          <p className={styles.hint}>
            运行动作后保存变量的值，并在下次运行时加载。仅在特殊情况下使用。
          </p>
        </div>
      </div>
      <div className={styles.footer}>
        <span className={styles.help}>查看帮助</span>
        <div className={styles.actions}>
          <span className={styles.btnPrimary}>保存(S)</span>
          <span className={styles.btn}>取消(C)</span>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}): ReactNode {
  return (
    <div className={styles.field}>
      <div className={styles.label}>{label}</div>
      <div className={styles.control}>
        {children}
        {hint ? <div className={styles.hint}>{hint}</div> : null}
      </div>
    </div>
  );
}
