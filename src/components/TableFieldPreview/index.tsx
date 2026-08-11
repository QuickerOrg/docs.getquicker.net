import type {ReactNode} from 'react';
import styles from './styles.module.css';

export type TableFieldDefinition = {
  key: string;
  title?: string;
  type?: string;
  primary?: boolean;
  unique?: boolean;
  autoIncrement?: boolean;
  allowNull?: boolean;
  inputMode?: string;
  help?: string;
  maxLength?: number;
  validation?: string;
  defaultValue?: string;
};

export type TableFieldPreviewProps = {
  fields?: TableFieldDefinition[];
  field?: TableFieldDefinition;
  className?: string;
};

function Check({value}: {value?: boolean}): ReactNode {
  return (
    <span className={styles.checkCell}>
      <span
        className={value ? styles.checkOn : styles.checkOff}
        role="img"
        aria-label={value ? '已勾选' : '未勾选'}
      >
        {value ? (
          <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden>
            <path
              d="M2.2 6.2 4.8 8.8 9.8 3.2"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : null}
      </span>
    </span>
  );
}

function FieldList({fields}: {fields: TableFieldDefinition[]}): ReactNode {
  return (
    <div className={styles.listBody}>
      <div className={styles.tableTitle}>表格字段</div>
      <div className={styles.grid} role="table" aria-label="表格字段设置示意">
        <div className={styles.gridHead} role="row">
          <span>列名</span>
          <span>标题</span>
          <span>键</span>
          <span>唯一</span>
          <span>自增</span>
          <span>类型</span>
          <span>操作</span>
        </div>
        {fields.map((item) => (
          <div className={styles.gridRow} role="row" key={item.key}>
            <span>{item.key}</span>
            <span>{item.title || item.key}</span>
            <Check value={item.primary} />
            <Check value={item.unique} />
            <Check value={item.autoIncrement} />
            <span>{item.type || '文本'}</span>
            <span className={styles.rowActions}>
              <span className={styles.smallButton}>编辑</span>
              <span className={styles.deleteButton}>删除</span>
            </span>
          </div>
        ))}
      </div>
      <div className={styles.footer}>
        <span className={styles.primaryButton}>添加列(A)</span>
        <span className={styles.footerSpacer} />
        <span className={styles.primaryButton}>保存(S)</span>
        <span className={styles.button}>取消(C)</span>
      </div>
    </div>
  );
}

function ReadonlyInput({value}: {value?: string | number}): ReactNode {
  return <span className={styles.input}>{value ?? ''}</span>;
}

function FieldEditor({field}: {field: TableFieldDefinition}): ReactNode {
  return (
    <div className={styles.editorBody}>
      <section>
        <h4>基础信息</h4>
        <label>
          <span>列名</span>
          <ReadonlyInput value={field.key} />
        </label>
        <label>
          <span>标题</span>
          <ReadonlyInput value={field.title || field.key} />
        </label>
        <label>
          <span>数据类型</span>
          <ReadonlyInput value={field.type || '文本'} />
        </label>
        <div className={styles.optionList}>
          <span><Check value={field.primary} />主键列</span>
          <span><Check value={field.unique} />值唯一</span>
          <span><Check value={field.autoIncrement} />自增长</span>
          <span><Check value={field.allowNull} />允许空(Null)</span>
        </div>
      </section>
      <section>
        <h4>编辑设置</h4>
        <label>
          <span>输入方式</span>
          <ReadonlyInput value={field.inputMode || '单行文本框'} />
        </label>
        <label>
          <span>帮助提示</span>
          <ReadonlyInput value={field.help} />
        </label>
        <label>
          <span>最大长度</span>
          <ReadonlyInput value={field.maxLength ?? 0} />
        </label>
        <label>
          <span>验证表达式</span>
          <ReadonlyInput value={field.validation} />
        </label>
        <label>
          <span>默认值</span>
          <ReadonlyInput value={field.defaultValue} />
        </label>
      </section>
      <div className={styles.footer}>
        <span className={styles.footerSpacer} />
        <span className={styles.primaryButton}>保存(S)</span>
        <span className={styles.button}>取消(C)</span>
      </div>
    </div>
  );
}

/** Read-only table schema / field editor preview for docs. */
export default function TableFieldPreview({
  fields,
  field,
  className,
}: TableFieldPreviewProps): ReactNode {
  return (
    <div className={['qk-docs-preview', styles.root, className].filter(Boolean).join(' ')}>
      <div className={styles.titleBar}>
        <span className={styles.logo} aria-hidden>⚡</span>
        <span>{field ? '添加表格字段' : '表格字段设置'}</span>
        <span className={styles.close} aria-hidden>×</span>
      </div>
      {field ? <FieldEditor field={field} /> : <FieldList fields={fields ?? []} />}
    </div>
  );
}
