import type {ReactNode} from 'react';
import styles from './styles.module.css';

export type TableDataValue = string | number | boolean | null;

export type TableDataPreviewProps = {
  title?: string;
  columns: string[];
  rows: TableDataValue[][];
  editable?: boolean;
  compact?: boolean;
  showAddRow?: boolean;
  showActions?: boolean;
  className?: string;
};

function renderValue(value: TableDataValue): string {
  if (value == null) return '';
  if (typeof value === 'boolean') return value ? '是' : '否';
  return String(value);
}

/**
 * Read-only docs sketch of Quicker's TableManageWindow/DataGrid.
 * Sources: Domain/Tables/TableManageWindow.xaml and App.xaml AppDataGridStyle.
 */
export default function TableDataPreview({
  title = '表格数据',
  columns,
  rows,
  editable = false,
  compact = false,
  showAddRow,
  showActions,
  className,
}: TableDataPreviewProps): ReactNode {
  const withActions = showActions ?? editable;
  const withAddRow = showAddRow ?? editable;

  return (
    <div
      className={[
        'qk-docs-preview',
        styles.root,
        compact ? styles.compact : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {!compact ? (
        <div className={styles.titleBar}>
          <span className={styles.logo} aria-hidden>⚡</span>
          <span>{title}</span>
          <span className={styles.close} aria-hidden>×</span>
        </div>
      ) : null}

      <div className={styles.body}>
        {withAddRow ? <div className={styles.addButton}>添加行(A)</div> : null}
        <div className={styles.tableFrame}>
          <table aria-label={`${title}预览`}>
            <thead>
              <tr>
                {columns.map((column) => <th key={column}>{column}</th>)}
                {withActions ? <th>操作</th> : null}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={`${rowIndex}-${row.map(renderValue).join('|')}`}>
                  {columns.map((_, columnIndex) => (
                    <td key={columnIndex}>{renderValue(row[columnIndex] ?? null)}</td>
                  ))}
                  {withActions ? (
                    <td className={styles.actions}>
                      <span className={styles.editButton}>编辑</span>
                      <span className={styles.deleteButton}>删除</span>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!compact ? (
          <div className={styles.footer}>
            {editable ? (
              <>
                <span className={styles.spacer} />
                <span className={styles.button}>还原(R)</span>
                <span className={styles.primaryButton}>确认(S)</span>
                <span className={styles.button}>取消(C)</span>
              </>
            ) : (
              <>
                <span className={styles.spacer} />
                <span className={styles.button}>关闭(C)</span>
              </>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
