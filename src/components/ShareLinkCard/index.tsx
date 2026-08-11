import type {ReactNode} from 'react';
import styles from './styles.module.css';

export type ShareLinkKind = 'subprogram' | 'action';

export type ShareLinkItem = {
  /** Full getquicker.net URL; kind/id/code inferred when omitted. */
  href?: string;
  kind?: ShareLinkKind;
  /** Subprogram id (`/subprogram?id=`). */
  id?: string;
  /** Shared action code (`/Sharedaction?code=`). */
  code?: string;
  title: string;
  description?: string;
  author?: string;
  category?: string;
};

export type ShareLinkCardProps = ShareLinkItem & {
  items?: ShareLinkItem[];
  className?: string;
};

function parseHref(href: string): {kind: ShareLinkKind; id?: string; code?: string} | null {
  try {
    const url = new URL(href);
    if (!/(^|\.)getquicker\.net$/i.test(url.hostname)) return null;
    const path = url.pathname.toLowerCase();
    const id = url.searchParams.get('id')?.trim() || undefined;
    const code = url.searchParams.get('code')?.trim() || undefined;
    if (path.includes('subprogram') && id) return {kind: 'subprogram', id};
    if (path.includes('sharedaction') && code) return {kind: 'action', code};
    return null;
  } catch {
    return null;
  }
}

function resolveItem(item: ShareLinkItem): {
  href: string;
  kind: ShareLinkKind;
  title: string;
  description?: string;
  author?: string;
  category?: string;
} {
  const parsed = item.href ? parseHref(item.href) : null;
  const kind = item.kind ?? parsed?.kind ?? (item.id ? 'subprogram' : 'action');
  const id = item.id ?? parsed?.id;
  const code = item.code ?? parsed?.code;
  const href =
    item.href ??
    (kind === 'subprogram' && id
      ? `https://getquicker.net/subprogram?id=${id}`
      : code
        ? `https://getquicker.net/Sharedaction?code=${code}`
        : '#');
  return {
    href,
    kind,
    title: item.title,
    description: item.description,
    author: item.author,
    category: item.category,
  };
}

function Card({item}: {item: ShareLinkItem}): ReactNode {
  const resolved = resolveItem(item);
  const kindLabel = resolved.kind === 'subprogram' ? '子程序' : '动作';
  return (
    <a
      className={styles.card}
      href={resolved.href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className={styles.kind} data-kind={resolved.kind}>
        {kindLabel}
      </span>
      <span className={styles.body}>
        <span className={styles.titleRow}>
          <span className={styles.title}>{resolved.title}</span>
          <span className={styles.arrow} aria-hidden>
            ↗
          </span>
        </span>
        {resolved.description ? (
          <span className={styles.description}>{resolved.description}</span>
        ) : null}
        {resolved.author || resolved.category ? (
          <span className={styles.meta}>
            {[resolved.author, resolved.category].filter(Boolean).join(' · ')}
          </span>
        ) : null}
      </span>
    </a>
  );
}

/** Compact card for getquicker.net shared actions / subprograms. */
export default function ShareLinkCard({
  items,
  className,
  ...single
}: ShareLinkCardProps): ReactNode {
  const list = items?.length ? items : [single];
  return (
    <div className={['qk-docs-preview', styles.list, className].filter(Boolean).join(' ')}>
      {list.map((item, index) => (
        <Card key={`${item.href ?? item.id ?? item.code ?? item.title}-${index}`} item={item} />
      ))}
    </div>
  );
}
