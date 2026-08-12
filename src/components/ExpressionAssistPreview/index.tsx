/**
 * Read-only Quicker “布尔判断表达式助手”.
 * Source: QuickerPc/Quicker/Domain/ExpressionTester/BoolExpressionHelperWindow.xaml
 */
import type {ReactNode} from 'react';
import styles from './styles.module.css';

export type ExpressionAssistPreviewProps = {
  /** Selected variable label in the first combo. */
  variable?: string;
  /** Selected operation title. */
  operation?: string;
  /** Right-side param group title (e.g. 比较值). */
  paramTitle?: string;
  /** Param literal value. */
  paramValue?: string;
  /** Optional alternate variable shown in param combo. */
  paramVariable?: string;
  /** Active tab. */
  tab?: 'generate' | 'operators';
  className?: string;
};

const OPERATORS: {key: string; label: string}[] = [
  {key: '&&', label: '并且（两边都为真）'},
  {key: '||', label: '或者（任一为真）'},
  {key: '!', label: '取反'},
  {key: '( )', label: '括号分组'},
];

/** Docs sketch of BoolExpressionHelperWindow (no CodeMirror / Host). */
export default function ExpressionAssistPreview({
  variable = 'count',
  operation = '大于',
  paramTitle = '比较值',
  paramValue = '10',
  paramVariable = '（可选）',
  tab = 'generate',
  className,
}: ExpressionAssistPreviewProps): ReactNode {
  return (
    <div
      className={['qk-docs-preview', styles.root, className].filter(Boolean).join(' ')}
      role="dialog"
      aria-label="布尔判断表达式助手示意"
      aria-modal="false">
      <div className={styles.titleBar}>
        <span className={styles.title}>布尔判断表达式助手</span>
        <span className={styles.close} aria-hidden>
          ×
        </span>
      </div>
      <div className={styles.tabs} role="tablist" aria-label="助手分页">
        <span
          className={tab === 'generate' ? styles.tabActive : styles.tab}
          role="tab"
          aria-selected={tab === 'generate'}>
          生成表达式
        </span>
        <span
          className={tab === 'operators' ? styles.tabActive : styles.tab}
          role="tab"
          aria-selected={tab === 'operators'}>
          逻辑运算符
        </span>
      </div>
      <div className={styles.body}>
        {tab === 'generate' ? (
          <>
            <div className={styles.row}>
              <label className={styles.field}>
                <span className={styles.label}>要判断的变量：</span>
                <span className={styles.combo}>{variable}</span>
              </label>
              <label className={styles.field}>
                <span className={styles.label}>判断的类型：</span>
                <span className={styles.combo}>{operation}</span>
              </label>
              <div className={styles.paramBox}>
                <div className={styles.paramHeader}>{paramTitle}</div>
                <span className={styles.miniLabel}>值：</span>
                <span className={styles.input}>{paramValue}</span>
                <span className={styles.miniLabel}>或其它变量：</span>
                <span className={styles.combo}>{paramVariable}</span>
              </div>
            </div>
            <div className={styles.actions}>
              <span className={styles.btnPrimary}>生成表达式(_S)</span>
              <span className={styles.btn}>插入到已有内容中(_I)</span>
            </div>
            <div className={styles.preview}>
              生成结果示意：
              <code>{`$= {${variable}} > ${paramValue}`}</code>
            </div>
          </>
        ) : (
          <div className={styles.ops}>
            <div className={styles.opsHint}>插入逻辑运算符</div>
            {OPERATORS.map((op) => (
              <div key={op.key} className={styles.opRow}>
                <span className={styles.opKey}>{op.key}</span>
                <span className={styles.opLabel}>{op.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
