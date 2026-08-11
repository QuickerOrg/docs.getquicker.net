import React, {type ReactNode} from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import {
  findFirstSidebarItemLink,
  useDocById,
} from "@docusaurus/plugin-content-docs/client";
import {useDocCardDescriptionCategoryItemsPlural} from "@docusaurus/theme-common/internal";
import {ThemeClassNames} from "@docusaurus/theme-common";
import type {Props} from "@theme/DocCard";
import type {
  PropSidebarItemCategory,
  PropSidebarItemLink,
} from "@docusaurus/plugin-content-docs";
import {lookupDocGallery, useDocGallery} from "@site/src/data/docGallery";

function isBoilerplateDescription(text: string | undefined, title: string): boolean {
  const value = (text ?? "").trim();
  if (!value) return true;
  if (value === title) return true;
  if (/的 Quicker 2\.0 使用说明\.?$/.test(value)) return true;
  if (/模块参考/.test(value) && /参数表由/.test(value)) return true;
  return false;
}

function resolveHref(
  item: PropSidebarItemLink | PropSidebarItemCategory,
): string | undefined {
  if (item.type === "link") return item.href;
  return item.href ?? findFirstSidebarItemLink(item) ?? undefined;
}

function Cover({
  covers,
  title,
  excerpt,
  hints,
}: {
  covers: string[];
  title: string;
  excerpt?: string;
  hints?: string[];
}): ReactNode {
  const shown = covers.slice(0, 4);
  if (shown.length > 0) {
    return (
      <div
        className={clsx(
          "theme-doc-card__cover",
          shown.length > 1 && "theme-doc-card__cover--mosaic",
          shown.length === 2 && "theme-doc-card__cover--two",
        )}
      >
        {shown.map((src) => (
          <img key={src} src={src} alt="" loading="lazy" />
        ))}
      </div>
    );
  }

  const fields = (hints ?? []).slice(0, 3);
  if (fields.length > 0 || excerpt) {
    return (
      <div className="theme-doc-card__cover theme-doc-card__cover--text">
        <div className="theme-doc-card__sheet">
          {fields.length > 0 ? (
            <ul className="theme-doc-card__fields">
              {fields.map((hint) => (
                <li key={hint}>
                  <span>{hint}</span>
                  <i aria-hidden />
                </li>
              ))}
            </ul>
          ) : (
            <p className="theme-doc-card__excerpt">{excerpt}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="theme-doc-card__cover">
      <span className="theme-doc-card__cover-fallback" aria-hidden>
        {title.slice(0, 1)}
      </span>
    </div>
  );
}

function GalleryCard({
  href,
  title,
  description,
  className,
}: {
  href: string;
  title: string;
  description?: string;
  className?: string;
}): ReactNode {
  const galleryMap = useDocGallery();
  const gallery = lookupDocGallery(galleryMap, href);
  const covers = gallery?.covers ?? [];
  const text =
    gallery?.description && !isBoilerplateDescription(gallery.description, title)
      ? gallery.description
      : description && !isBoilerplateDescription(description, title)
        ? description
        : undefined;
  return (
    <Link
      href={href}
      className={clsx(
        "card padding--lg",
        "theme-doc-card--gallery",
        ThemeClassNames.docs.docCard.container,
        className,
      )}
    >
      <Cover
        covers={covers}
        title={title}
        excerpt={gallery?.excerpt}
        hints={gallery?.hints}
      />
      <div className="theme-doc-card__body">
        <h2 className={clsx("theme-doc-card-heading", ThemeClassNames.docs.docCard.heading)}>
          <span className={ThemeClassNames.docs.docCard.title}>{title}</span>
        </h2>
        {text ? (
          <p className={clsx("theme-doc-card-description", ThemeClassNames.docs.docCard.description)}>
            {text}
          </p>
        ) : null}
      </div>
    </Link>
  );
}

function CardCategory({item}: {item: PropSidebarItemCategory}): ReactNode {
  const href = resolveHref(item);
  const categoryItemsPlural = useDocCardDescriptionCategoryItemsPlural();
  if (!href) return null;
  return (
    <GalleryCard
      href={href}
      title={item.label}
      description={item.description ?? categoryItemsPlural(item.items.length)}
      className={item.className}
    />
  );
}

function CardLink({item}: {item: PropSidebarItemLink}): ReactNode {
  const doc = useDocById(item.docId ?? undefined);
  return (
    <GalleryCard
      href={item.href}
      title={item.label}
      description={item.description ?? doc?.description}
      className={item.className}
    />
  );
}

export default function DocCard({item}: Props): ReactNode {
  switch (item.type) {
    case "link":
      return <CardLink item={item} />;
    case "category":
      return <CardCategory item={item} />;
    default:
      throw new Error(`unknown item type ${JSON.stringify(item)}`);
  }
}
