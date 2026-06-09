/* ELEZON — breadcrumbs. Ported from catalog.jsx. */

import { Fragment } from 'react';
import { useI18n } from '../i18n/I18nContext';

export interface Crumb {
  label: string;
  go?: () => void;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const { t } = useI18n();
  return (
    <div className="wrap row" style={{ gap: 8, padding: '20px 32px 0', fontSize: 13, color: 'var(--t-muted)', flexWrap: 'wrap' }}>
      {items.map((it, i) => (
        <Fragment key={i}>
          {it.go ? (
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                it.go!();
              }}
              className="mono"
              style={{ color: 'var(--t-muted)' }}
            >
              {t(it.label)}
            </a>
          ) : (
            <span className="mono" style={{ color: 'var(--t-strong)' }}>{t(it.label)}</span>
          )}
          {i < items.length - 1 && <span style={{ opacity: 0.5 }}>/</span>}
        </Fragment>
      ))}
    </div>
  );
}
