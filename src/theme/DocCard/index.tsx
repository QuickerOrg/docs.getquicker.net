import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import {findFirstSidebarItemLink} from '@docusaurus/plugin-content-docs/client';
import {useDocCardDescriptionCategoryItemsPlural} from '@docusaurus/theme-common/internal';
import {ThemeClassNames} from '@docusaurus/theme-common';
import type {Props} from '@theme/DocCard';
import type {PropSidebarItemCategory, PropSidebarItemLink} from '@docusaurus/plugin-content-docs';
import {lookupDocGallery, useDocGallery} from '@site/src/data/docGallery';

function isUsefulDescription(text: string | undefined, title: string): boolean {
  const value = (text ?? '').trim();
  return Boolean(value && value !== title &&
    !/的 Quicker 2\.0 使用说明\.?$/.test(value) &&
    !(/模块参考/.test(value) && /参数表由/.test(value)));
}

function DirectoryCard({item}: {item: PropSidebarItemLink | PropSidebarItemCategory}): ReactNode {
  const gallery = useDocGallery();
  const categoryItemsPlural = useDocCardDescriptionCategoryItemsPlural();
  const href = item.type === 'link' ? item.href : item.href ?? findFirstSidebarItemLink(item);
  if (!href) return null;
  const description = lookupDocGallery(gallery, href)?.description ?? item.description;
  return (
    <Link href={href} className={clsx('card padding--lg theme-doc-card--directory',
      ThemeClassNames.docs.docCard.container, item.className)}>
      <div className="theme-doc-card__heading-row">
        <h2 className={clsx('theme-doc-card-heading', ThemeClassNames.docs.docCard.heading)}>
          <span className={ThemeClassNames.docs.docCard.title}>{item.label}</span>
        </h2>
        <span className="theme-doc-card__arrow" aria-hidden>→</span>
      </div>
      {isUsefulDescription(description, item.label) ? (
        <p className={clsx('theme-doc-card-description', ThemeClassNames.docs.docCard.description)}>
          {description}
        </p>
      ) : null}
      {item.type === 'category' ? (
        <span className="theme-doc-card__count">{categoryItemsPlural(item.items.length)}</span>
      ) : null}
    </Link>
  );
}

/** 目录只显示标题和说明，避免把正文、章节标签或截图拼成封面。 */
export default function DocCard({item}: Props): ReactNode {
  if (item.type !== 'link' && item.type !== 'category') return null;
  return <DirectoryCard item={item} />;
}
