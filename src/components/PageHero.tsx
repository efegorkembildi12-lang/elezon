/* ELEZON — dark page hero used on inner pages. Ported from pages.jsx. */

import { useI18n } from '../i18n/I18nContext';

export function PageHero({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  const { t } = useI18n();
  return (
    <section style={{ background: 'var(--ink)', color: 'var(--t-on-dark)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 85% 30%, var(--accent-soft), transparent 45%)' }} />
      <div className="wrap" style={{ position: 'relative', padding: '64px 32px' }}>
        <span className="eyebrow on-dark">{t(eyebrow)}</span>
        <h1 className="display ph-title" style={{ fontSize: 52, color: 'var(--t-on-dark)', margin: '18px 0 0', maxWidth: 820 }}>{t(title)}</h1>
        {sub && <p style={{ fontSize: 17, lineHeight: 1.6, color: 'var(--t-on-dark-muted)', maxWidth: 560, margin: '20px 0 0' }}>{t(sub)}</p>}
      </div>
    </section>
  );
}
