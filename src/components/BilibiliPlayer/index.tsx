import type {ReactNode} from 'react';
import styles from './styles.module.css';

export type BilibiliPlayerProps = {
  bvid: string;
  page?: number;
  title?: string;
  caption?: string;
};

export default function BilibiliPlayer({
  bvid,
  page = 1,
  title = 'Bilibili 视频',
  caption,
}: BilibiliPlayerProps): ReactNode {
  const query = new URLSearchParams({
    bvid,
    page: String(page),
    high_quality: '1',
    danmaku: '0',
    as_wide: '1',
  });

  return (
    <figure className={styles.root}>
      <div className={styles.frameWrap}>
        <iframe
          className={styles.frame}
          src={`https://player.bilibili.com/player.html?${query.toString()}`}
          title={title}
          loading="lazy"
          allowFullScreen
        />
      </div>
      {caption ? <figcaption className={styles.caption}>{caption}</figcaption> : null}
    </figure>
  );
}
