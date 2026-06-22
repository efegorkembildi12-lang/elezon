/* ELEZON — breadcrumbs. Real <Link> hrefs (crawlable); the same `to` paths feed
   the BreadcrumbList JSON-LD on Product/Catalog pages. */

import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';

export interface Crumb {
  label: string;
  /** Real path (e.g. '/catalog'); omit for the current, non-linked page. */
  to?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const { t } = useI18n();
  return (
    <div className="wrap row" style={{ gap: 8, padding: '20px 32px 0', fontSize: 13, color: 'var(--t-muted)', flexWrap: 'wrap' }}>
      {items.map((it, i) => (
        <Fragment key={i}>
          {it.to ? (
            <Link to={it.to} className="mono" style={{ color: 'var(--t-muted)' }}>
              {t(it.label)}
            </Link>
          ) : (
            <span className="mono" style={{ color: 'var(--t-strong)' }}>{t(it.label)}</span>
          )}
          {i < items.length - 1 && <span style={{ opacity: 0.5 }}>/</span>}
        </Fragment>
      ))}
    </div>
  );
}
