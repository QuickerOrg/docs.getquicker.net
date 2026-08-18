import type {ComponentProps, CSSProperties, ReactNode} from 'react';
import clsx from 'clsx';

const SVG_SRC = /\.svg(?:$|[?#])/i;

function parsePxWidth(width: unknown): number | undefined {
  if (typeof width === 'number' && Number.isFinite(width) && width > 0) {
    return width;
  }
  if (typeof width === 'string') {
    const parsed = Number.parseFloat(width);
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }
  }
  return undefined;
}

/**
 * Markdown screenshots are 1x bitmaps. Size them to
 * min(container, natural / devicePixelRatio) so 1 bitmap pixel maps to 1
 * device pixel without overflowing the doc column.
 */
export default function NativeImg({
  className,
  src,
  style,
  width,
  ...rest
}: ComponentProps<'img'>): ReactNode {
  const raster = typeof src === 'string' && src.length > 0 && !SVG_SRC.test(src);
  const px = parsePxWidth(width);
  const nativeStyle: CSSProperties | undefined = raster
    ? {
        ...style,
        maxWidth: '100%',
        height: 'auto',
        ...(px != null
          ? {width: `min(100%, calc(${px}px / var(--qk-dpr, 1)))`}
          : null),
      }
    : style;

  return (
    <img
      {...rest}
      width={width}
      src={src}
      style={nativeStyle}
      className={clsx(className, raster && 'qk-native-img')}
    />
  );
}
