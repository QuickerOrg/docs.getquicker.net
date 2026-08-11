import {useEffect, useLayoutEffect, useRef, useState, type ReactNode} from 'react';
import {DocsStepIcon} from '@site/src/components/StepProgramView/DocsStepIcon';
import styles from './styles.module.css';

function isFaSpec(spec: string): boolean {
  return spec.trim().toLowerCase().startsWith('fa:');
}

export type ContextMenuItem = {
  type?: 'item' | 'separator';
  label?: string;
  /** `fa:Light_Flag` / `fa:Light_Wrench:#f57e42`, or a short fallback glyph. */
  icon?: string;
  /** CSS color for the icon glyph. */
  iconColor?: string;
  children?: ContextMenuItem[];
  danger?: boolean;
  /** Hover tip, same role as Quicker menu item tooltip. */
  tooltip?: string;
};

export type ContextMenuPreviewProps = {
  items: ContextMenuItem[];
  /** Labels path to highlight and open nested flyouts. Also the reset target. */
  openPath?: string[];
  /** Optional tooltip on the current hover leaf when the item has no tooltip. */
  tooltip?: string;
  /** Hover to open flyouts. Default true. */
  interactive?: boolean;
  /** Use this preview as the DocCard gallery cover snapshot target. */
  galleryCover?: boolean;
  /** Scene behind the menu, usually a selected StepProgramView. */
  children?: ReactNode;
  className?: string;
};

type PanelProps = {
  items: ContextMenuItem[];
  pathPrefix: string[];
  openPath: string[];
  pickedPath: string[] | null;
  fallbackTooltip?: string;
  interactive: boolean;
  onHover: (path: string[]) => void;
  onPick: (path: string[]) => void;
};

function samePath(left: string[], right: string[]): boolean {
  return left.length === right.length && left.every((part, index) => part === right[index]);
}

function MenuPanel({
  items,
  pathPrefix,
  openPath,
  pickedPath,
  fallbackTooltip,
  interactive,
  onHover,
  onPick,
}: PanelProps): ReactNode {
  const depth = pathPrefix.length;
  const openLabel = openPath[depth];
  const openItem = items.find((it) => it.type !== 'separator' && it.label === openLabel);
  const showFlyout = Boolean(openItem?.children?.length);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const openItemRef = useRef<HTMLButtonElement | null>(null);
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
          const itemPath = [...pathPrefix, label];
          const isOpen = openLabel === label;
          const isPicked = pickedPath ? samePath(pickedPath, itemPath) : false;
          const hasChildren = Boolean(item.children?.length);
          const tip =
            item.tooltip ??
            (isOpen && !hasChildren && depth === openPath.length - 1 ? fallbackTooltip : undefined);
          return (
            <button
              key={`${label}-${i}`}
              ref={isOpen ? openItemRef : undefined}
              type="button"
              className={[
                styles.item,
                isOpen ? styles.itemOpen : '',
                isPicked ? styles.itemPicked : '',
                item.danger ? styles.itemDanger : '',
              ]
                .filter(Boolean)
                .join(' ')}
              role="menuitem"
              aria-haspopup={hasChildren ? 'menu' : undefined}
              aria-expanded={hasChildren ? isOpen : undefined}
              onPointerEnter={() => {
                if (interactive) onHover(itemPath);
              }}
              onClick={() => {
                if (!interactive) return;
                onHover(itemPath);
                if (!hasChildren) onPick(itemPath);
              }}>
              <span
                className={styles.icon}
                style={item.iconColor ? {color: item.iconColor} : undefined}
                aria-hidden>
                {item.icon && isFaSpec(item.icon) ? (
                  <DocsStepIcon spec={item.icon} size={14} />
                ) : (
                  item.icon ?? ''
                )}
              </span>
              <span className={styles.label}>{label}</span>
              {hasChildren ? (
                <span className={styles.chevron} aria-hidden>
                  ›
                </span>
              ) : (
                <span className={styles.chevronSpacer} aria-hidden />
              )}
              {tip && isOpen && !hasChildren ? (
                <span className={styles.itemTooltip}>{tip}</span>
              ) : null}
            </button>
          );
        })}
      </div>
      {showFlyout && openItem?.children ? (
        <div className={styles.flyout} style={{marginTop: flyoutTop}}>
          <MenuPanel
            items={openItem.children}
            pathPrefix={[...pathPrefix, openItem.label ?? '']}
            openPath={openPath}
            pickedPath={pickedPath}
            fallbackTooltip={fallbackTooltip}
            interactive={interactive}
            onHover={onHover}
            onPick={onPick}
          />
        </div>
      ) : null}
    </div>
  );
}

/**
 * Quicker context / action menu cascade for docs.
 * Hover opens flyouts (ActionListMenuPopup); leave resets to openPath.
 */
export default function ContextMenuPreview({
  items,
  openPath = [],
  tooltip,
  interactive = true,
  galleryCover = false,
  children,
  className,
}: ContextMenuPreviewProps): ReactNode {
  const [path, setPath] = useState(openPath);
  const [pickedPath, setPickedPath] = useState<string[] | null>(null);
  const resetTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current != null) window.clearTimeout(resetTimer.current);
    };
  }, []);

  const clearReset = (): void => {
    if (resetTimer.current != null) {
      window.clearTimeout(resetTimer.current);
      resetTimer.current = null;
    }
  };

  const scheduleReset = (): void => {
    if (!interactive) return;
    clearReset();
    resetTimer.current = window.setTimeout(() => {
      setPath(openPath);
      setPickedPath(null);
    }, 220);
  };

  return (
    <div
      className={[
        'qk-docs-preview',
        styles.root,
        children ? styles.rootScene : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      data-gallery-cover={galleryCover ? '' : undefined}
      aria-label="菜单示意，可悬停展开子菜单">
      {children ? <div className={styles.scene}>{children}</div> : null}
      <div
        className={children ? styles.overlay : undefined}
        onPointerEnter={interactive ? clearReset : undefined}
        onPointerLeave={interactive ? scheduleReset : undefined}>
        <MenuPanel
          items={items}
          pathPrefix={[]}
          openPath={interactive ? path : openPath}
          pickedPath={pickedPath}
          fallbackTooltip={tooltip}
          interactive={interactive}
          onHover={setPath}
          onPick={setPickedPath}
        />
      </div>
    </div>
  );
}
