import type {ReactNode} from 'react';

type Props = {
  value: unknown;
};

function formatLegacyDate(raw: unknown): {iso: string; label: string} | null {
  if (typeof raw !== 'string' || raw.trim().length === 0) {
    return null;
  }
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return {
    iso: date.toISOString(),
    label: new Intl.DateTimeFormat('zh-CN', {
      timeZone: 'Asia/Shanghai',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date),
  };
}

/** Footer line for migrated pages: old help last-edit date from front matter. */
export default function DocLegacyUpdated({value}: Props): ReactNode {
  const formatted = formatLegacyDate(value);
  if (!formatted) {
    return null;
  }

  return (
    <p className="doc-legacy-updated">
      更新于 <time dateTime={formatted.iso}>{formatted.label}</time>
    </p>
  );
}
