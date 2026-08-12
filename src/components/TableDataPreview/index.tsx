import {useCallback, useEffect, useState, type ReactNode} from 'react';
import styles from './styles.module.css';

export type TableDataImageCell = {
  image: string;
  width?: number;
  alt?: string;
};

export type TableDataValue = string | number | boolean | null | TableDataImageCell;

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

function isImageCell(value: TableDataValue): value is TableDataImageCell {
  return typeof value === 'object' && value !== null && 'image' in value;
}

function cellKey(value: TableDataValue): string {
  if (isImageCell(value)) return `img:${value.image}`;
  if (value == null) return '';
  return String(value);
}

function renderText(value: TableDataValue): string {
  if (isImageCell(value)) return value.alt ?? '';
  if (value == null) return '';
  if (typeof value === 'boolean') return value ? '是' : '否';
  return String(value);
}

/**
 * Read-only docs sketch of Quicker's TableManageWindow/DataGrid.
 * Sources: Domain/Tables/TableManageWindow.xaml and App.xaml AppDataGridStyle.
 * image:N extra setting → TableDataImageCell (WPF Image.Width/Height = N, Stretch.Uniform).
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
  const [lightbox, setLightbox] = useState<TableDataImageCell | null>(null);

  const closeLightbox = useCallback((): void => setLightbox(null), []);

  useEffect(() => {
    if (!lightbox) return undefined;
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') closeLightbox();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [lightbox, closeLightbox]);

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
                <tr key={`${rowIndex}-${row.map(cellKey).join('|')}`}>
                  {columns.map((column, columnIndex) => {
                    const value = row[columnIndex] ?? null;
                    if (isImageCell(value)) {
                      const size = value.width ?? 50;
                      return (
                        <td
                          key={column}
                          data-preview-from={column}
                        >
                          <button
                            type="button"
                            className={styles.thumbButton}
                            data-preview-handle="from"
                            title="双击查看大图"
                            onDoubleClick={() => setLightbox(value)}
                          >
                            <img
                              className={styles.thumb}
                              src={value.image}
                              alt={value.alt ?? ''}
                              width={size}
                              height={size}
                            />
                          </button>
                        </td>
                      );
                    }
                    return <td key={column}>{renderText(value)}</td>;
                  })}
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

      {lightbox ? (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label="查看大图"
          onClick={closeLightbox}
        >
          <img
            src={lightbox.image}
            alt={lightbox.alt ?? ''}
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      ) : null}
    </div>
  );
}
