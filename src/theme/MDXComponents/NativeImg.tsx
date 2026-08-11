import type {ComponentProps, ReactNode} from 'react';
import clsx from 'clsx';

const SVG_SRC = /\.svg(?:$|[?#])/i;

/**
 * Markdown screenshots are 1x bitmaps. Unsized img uses CSS pixels, so
 * Windows 125% (devicePixelRatio=1.25) paints them 1.25x larger.
 * `.qk-native-img` maps 1 bitmap pixel to 1 device pixel.
 */
export default function NativeImg({
  className,
  src,
  ...rest
}: ComponentProps<'img'>): ReactNode {
  const raster = typeof src === 'string' && src.length > 0 && !SVG_SRC.test(src);
  return (
    <img
      {...rest}
      src={src}
      className={clsx(className, raster && 'qk-native-img')}
    />
  );
}
