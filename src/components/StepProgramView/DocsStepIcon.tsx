import type {CSSProperties, JSX, ReactNode} from 'react';
import faIconPack from '@site/data/step-render/fa-icons.json';

export type DocsStepIconProps = {
  /** Raw catalog icon: fa: / data: / http(s) / map key / res: path. */
  spec?: string | null;
  /** Optional offline map (catalog.icons or caller-provided). */
  icons?: Readonly<Record<string, string>>;
  size?: number;
  className?: string;
  title?: string;
  fallback?: ReactNode;
};

type FaGlyph = {path: string; width: number; height: number};

const FA_GLYPHS = (faIconPack as {icons?: Record<string, FaGlyph>}).icons ?? {};
const FA_DEFAULT_FILL = '#a0a0a0';

function parseFaSpec(spec: string): {name: string; fill: string} | null {
  const raw = spec.trim();
  if (!raw.toLowerCase().startsWith('fa:')) return null;
  const body = raw.slice(3).trim();
  if (!body) return null;
  const colon = body.indexOf(':');
  if (colon < 0) return {name: body, fill: 'currentColor'};
  const name = body.slice(0, colon).trim();
  const fillRaw = body.slice(colon + 1).trim();
  if (!name) return null;
  if (!fillRaw || fillRaw.toLowerCase() === FA_DEFAULT_FILL) {
    return {name, fill: 'currentColor'};
  }
  return {name, fill: fillRaw};
}

function resolveIconSrc(
  spec: string,
  icons: Readonly<Record<string, string>> | undefined,
): string | null {
  const mapped = icons?.[spec]?.trim();
  if (mapped) return mapped;

  const lower = spec.toLowerCase();
  if (lower.startsWith('data:') || /^https?:\/\//i.test(spec)) {
    return spec;
  }

  const resPath = lower.startsWith('res:') ? spec.slice(4).trim() : spec;
  if (icons) {
    for (const key of [resPath, `res:${resPath}`, resPath.replace(/\\/g, '/')]) {
      const hit = icons[key]?.trim();
      if (hit) return hit;
    }
  }
  return null;
}

function faGlyphFallback(spec: string): string {
  const body = spec.replace(/^fa:/i, '').replace(/^solid\/|^regular\/|^brands\//i, '');
  const leaf = body.split(/[/:._-]/).filter(Boolean).pop() ?? '?';
  return leaf.slice(0, 2).toUpperCase();
}

/** Prefer exact enum; Solid/Light share names so a missing weight can still paint. */
function lookupFaGlyph(name: string): FaGlyph | undefined {
  const exact = FA_GLYPHS[name];
  if (exact?.path) return exact;
  const alt = name.startsWith('Solid_')
    ? `Light_${name.slice(6)}`
    : name.startsWith('Light_')
      ? `Solid_${name.slice(6)}`
      : name.startsWith('Regular_')
        ? `Light_${name.slice(8)}`
        : '';
  const fallback = alt ? FA_GLYPHS[alt] : undefined;
  return fallback?.path ? fallback : undefined;
}

/**
 * Host-free icon slot: local FA SVG paths (extracted from Quicker), else data/http img.
 */
export function DocsStepIcon({
  spec,
  icons,
  size = 16,
  className,
  title,
  fallback,
}: DocsStepIconProps): JSX.Element {
  const raw = spec?.trim() ?? '';
  const frame: CSSProperties = {
    width: size,
    height: size,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    lineHeight: 1,
  };

  if (!raw) {
    return (
      <span className={className} title={title} style={frame} aria-hidden={title ? undefined : true}>
        {fallback ?? '·'}
      </span>
    );
  }

  const fa = parseFaSpec(raw);
  const glyph = fa ? lookupFaGlyph(fa.name) : undefined;
  if (fa && glyph?.path) {
    const w = glyph.width > 0 ? glyph.width : 512;
    const h = glyph.height > 0 ? glyph.height : 512;
    return (
      <span className={className} title={title} style={frame}>
        <svg
          viewBox={`0 0 ${w} ${h}`}
          width={size}
          height={size}
          aria-hidden
          style={{display: 'block', maxWidth: '100%', maxHeight: '100%', color: 'currentColor'}}
        >
          <path d={glyph.path} fill={fa.fill} />
        </svg>
      </span>
    );
  }

  const src = resolveIconSrc(raw, icons);
  if (src) {
    return (
      <span className={className} title={title} style={frame}>
        <img
          src={src}
          alt=""
          width={size}
          height={size}
          style={{width: size, height: size, objectFit: 'contain', display: 'block'}}
          loading="lazy"
          decoding="async"
        />
      </span>
    );
  }

  const isFa = raw.toLowerCase().startsWith('fa:');
  return (
    <span
      className={['qk-sr-icon-glyph', isFa ? 'qk-sr-icon-glyph--fa' : '', className ?? '']
        .filter(Boolean)
        .join(' ')}
      title={title ?? raw}
      style={{
        ...frame,
        borderRadius: 3,
        fontSize: Math.max(9, size - 5),
        fontWeight: 700,
        letterSpacing: '-0.02em',
      }}
      aria-label={title ?? raw}
    >
      {fallback ?? (isFa ? faGlyphFallback(raw) : raw.slice(0, 1).toUpperCase())}
    </span>
  );
}
