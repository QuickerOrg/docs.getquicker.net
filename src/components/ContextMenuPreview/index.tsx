import {useLayoutEffect, useRef, useState, type ReactNode} from 'react';
import styles from './styles.module.css';

export type ContextMenuItem = {
  type?: 'item' | 'separator';
  label?: string;
  /** Short glyph shown in the icon slot (e.g. ✎ ▶ ⚙). */
  icon?: string;
  /** CSS color for the icon glyph. */
  iconColor?: string;
  children?: ContextMenuItem[];
  danger?: boolean;
};

export type ContextMenuPreviewProps = {
  items: ContextMenuItem[];
  /** Labels path to highlight and open nested flyouts. */
  openPath?: string[];
  /** Optional tooltip near the open leaf. */
  tooltip?: string;
  className?: string;
};

type PanelProps = {
  items: ContextMenuItem[];
  pathPrefix: string[];
  openPath: string[];
  tooltip?: string;
};

function MenuPanel({items, pathPrefix, openPath, tooltip}: PanelProps): ReactNode {
  const depth = pathPrefix.length;
  const openLabel = openPath[depth];
  const openItem = items.find((it) => it.type !== 'separator' && it.label === openLabel);
  const showFlyout = Boolean(openItem?.children?.length);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const openItemRef = useRef<HTMLDivElement | null>(null);
  const [flyoutTop, setFlyoutTop] = useState(0);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const item = openItemRef.current;
    if (!wrap || !item) {
      setFlyoutTop(0);
      return;
    }
    // Match Quicker: flyout top aligns with the open ancestor item.
    setFlyoutTop(item.getBoundingClientRect().top - wrap.getBoundingClientRect().top);
  }, [openLabel, items]);

  return (
    <div ref={wrapRef} className={styles.panelWrap}>
      <div className={styles.panel} role="menu">
        {items.map((item, i) => {
          if (item.type === 'separator') {
            return <div key={`sep-${i}`} className={styles.separator} role="separator" />;
          }
          const label = item.label ?? '';
          const isOpen = openLabel === label;
          const hasChildren = Boolean(item.children?.length);
          return (
            <div
              key={`${label}-${i}`}
              ref={isOpen ? openItemRef : undefined}
              className={[
                styles.item,
                isOpen ? styles.itemOpen : '',
                item.danger ? styles.itemDanger : '',
              ]
                .filter(Boolean)
                .join(' ')}
              role="menuitem">
              <span
                className={styles.icon}
                style={item.iconColor ? {color: item.iconColor} : undefined}
                aria-hidden>
                {item.icon ?? ''}
              </span>
              <span className={styles.label}>{label}</span>
              {hasChildren ? (
                <span className={styles.chevron} aria-hidden>
                  ›
                </span>
              ) : (
                <span className={styles.chevronSpacer} aria-hidden />
              )}
            </div>
          );
        })}
      </div>
      {showFlyout && openItem?.children ? (
        <div className={styles.flyout} style={{marginTop: flyoutTop}}>
          <MenuPanel
            items={openItem.children}
            pathPrefix={[...pathPrefix, openItem.label ?? '']}
            openPath={openPath}
            tooltip={tooltip}
          />
        </div>
      ) : null}
      {tooltip && openLabel && depth === openPath.length - 1 ? (
        <div className={showFlyout ? styles.tooltipBelow : styles.tooltip}>{tooltip}</div>
      ) : null}
    </div>
  );
}

/**
 * Read-only Quicker context / action menu cascade for docs.
 */
export default function ContextMenuPreview({
  items,
  openPath = [],
  tooltip,
  className,
}: ContextMenuPreviewProps): ReactNode {
  return (
    <div
      className={[styles.root, className].filter(Boolean).join(' ')}
      aria-label="右键菜单示意">
      <MenuPanel items={items} pathPrefix={[]} openPath={openPath} tooltip={tooltip} />
    </div>
  );
}
