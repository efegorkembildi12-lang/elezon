/* ELEZON — Home page (Concept A: industrial grid). Ported from home.jsx. */

import { Icon, catIcon } from '../components/Icon';
import { ProductCard } from '../components/ProductCard';
import { QuoteCTA } from '../components/QuoteCTA';
import { SearchBox } from '../components/SearchBox';
import { useGo } from '../lib/useGo';
import { useSiteStats } from '../lib/useSiteStats';
import { useI18n } from '../i18n/I18nContext';
import { useCatalog } from '../store/CatalogProvider';
import { categoryArt } from '../components/CategoryArt';
import { Seo } from '../components/Seo';
import { PageState } from '../lib/ssg/pageState';
import { featuredRail } from '../lib/featured';

function BrandStrip({ dark }: { dark?: boolean }) {
  const { t } = useI18n();
  const { brands } = useCatalog();
  const line = dark ? 'var(--ink-line)' : 'var(--line)';
  const col = dark ? 'var(--t-on-dark-muted)' : 'var(--t-muted)';
  return (
    <div style={{ borderTop: `1px solid ${line}`, borderBottom: `1px solid ${line}` }}>
      <div className="wrap row" style={{ gap: 0, flexWrap: 'wrap' }}>
        <span className="eyebrow" style={{ padding: '22px 28px 22px 0', color: col, borderRight: `1px solid ${line}`, whiteSpace: 'nowrap' }}>{t('Оригинальные бренды')}</span>
        <div className="brand-marquee" style={{ flex: 1, overflow: 'hidden', maskImage: 'linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)' }}>
          <div className="brand-track row" style={{ gap: 44 }}>
            {[...brands, ...brands].map((b, i) => (
              <span key={i} style={{ fontFamily: 'var(--f-display)', fontWeight: 600, fontSize: 18, color: col, opacity: 0.8, whiteSpace: 'nowrap', padding: '22px 0' }}>{b}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TrustBar() {
  const { t } = useI18n();
  const items = [
    { I: Icon.shield, t: 'Только оригинал', d: 'Прямые поставки и официальные каналы. Гарантия производителя на каждую позицию.' },
    { I: Icon.truck, t: 'Склад в Москве', d: 'Отгрузка со склада в течение 24 часов. Доставка по РФ и самовывоз.' },
    { I: Icon.doc, t: 'Работа с юр. лицами', d: 'Полный пакет документов, отсрочка платежа, счёт и закрывающие документы.' },
    { I: Icon.gauge, t: 'Инженерная поддержка', d: 'Подбор аналогов и техническая консультация по проекту.' },
  ];
  return (
    <section className="section" style={{ paddingTop: 76, paddingBottom: 76 }}>
      <div className="wrap">
        <div className="trust-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 0, border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', overflow: 'hidden', background: 'var(--surface)' }}>
          {items.map((it, i) => (
            <div key={i} className="col" style={{ gap: 14, padding: '30px 26px', borderRight: i < 3 ? '1px solid var(--line)' : 'none' }}>
              <span style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--accent-soft)', color: 'var(--accent-press)', display: 'grid', placeItems: 'center' }}><it.I width="22" height="22" /></span>
              <span style={{ fontWeight: 700, fontSize: 16.5, color: 'var(--t-strong)' }}>{t(it.t)}</span>
              <span style={{ fontSize: 13.5, lineHeight: 1.55, color: 'var(--t-muted)' }}>{t(it.d)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductRail({ title, eyebrow }: { title: string; eyebrow: string }) {
  const go = useGo();
  const { t } = useI18n();
  const { products } = useCatalog();
  const items = featuredRail(products);
  return (
    <section className="section" style={{ paddingTop: 20 }}>
      <div className="wrap">
        <div className="section-head">
          <div className="col" style={{ gap: 12 }}>
            <span className="eyebrow">{t(eyebrow)}</span>
            <h2 className="display" style={{ fontSize: 40 }}>{t(title)}</h2>
          </div>
          <a href="#" onClick={(e) => { e.preventDefault(); go('catalog'); }} className="link-arrow">{t('Весь каталог')} <Icon.arrow width="18" height="18" /></a>
        </div>
        <div className="prod-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18 }}>
          {items.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </div>
    </section>
  );
}

export function Home() {
  const go = useGo();
  const { t } = useI18n();
  const { products, categories, brands, stats: rawStats } = useCatalog();
  const stats = useSiteStats();
  return (
    <div className="rise">
      <Seo />
      <PageState data={{ products: featuredRail(products), categories, brands, stats: rawStats }} />
      {/* dark hero band */}
      <section style={{ background: 'var(--ink)', color: 'var(--t-on-dark)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 82% 18%, var(--accent-soft), transparent 42%)' }} />
        <div className="wrap" style={{ position: 'relative', padding: '76px 32px 64px' }}>
          <span className="eyebrow on-dark">{t('Поставка электротехники · B2B')}</span>
          <h1 className="display heroA" style={{ fontSize: 68, color: 'var(--t-on-dark)', margin: '20px 0 0', maxWidth: 980 }}>
            {t('Оборудование для автоматизации зданий')} <span style={{ color: 'var(--accent)' }}>{t('в наличии')}</span>
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.55, color: 'var(--t-on-dark-muted)', maxWidth: 560, margin: '24px 0 0' }}>
            {t('КИП, низковольтное оборудование и KNX оригинальных брендов. Склад в Москве, отгрузка за 24 часа.')}
          </p>
          {/* search */}
          <div style={{ marginTop: 34, maxWidth: 680 }}>
            <SearchBox variant="hero" />
          </div>
          <div className="row stat-row" style={{ gap: 0, marginTop: 48, flexWrap: 'wrap' }}>
            {stats.map((s, i) => (
              <div key={i} className="col" style={{ gap: 4, padding: '0 36px 0 0', marginRight: 36, borderRight: i < 3 ? '1px solid var(--ink-line)' : 'none' }}>
                <span className="display" style={{ fontSize: 32, color: 'var(--accent)' }}>{s.v}</span>
                <span className="mono" style={{ fontSize: 12, color: 'var(--t-on-dark-muted)' }}>{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <BrandStrip dark />

      {/* category grid */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div className="col" style={{ gap: 12 }}>
              <span className="eyebrow">{t('Каталог')}</span>
              <h2 className="display" style={{ fontSize: 42 }}>{t('Четыре направления поставки')}</h2>
            </div>
          </div>
          <div className="cat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 18 }}>
            {categories.map((c) => {
              const CI = catIcon[c.id];
              const Art = categoryArt[c.id];
              return (
                <a key={c.id} href="#" onClick={(e) => { e.preventDefault(); go('category', c); }}
                   className="card cat-card" style={{ padding: 0, overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 1.1fr', minHeight: 230 }}>
                  <div className="col" style={{ padding: '30px 28px', gap: 14, justifyContent: 'space-between' }}>
                    <span style={{ width: 50, height: 50, borderRadius: 12, background: 'var(--ink)', color: 'var(--accent)', display: 'grid', placeItems: 'center' }}>{CI ? <CI width="26" height="26" /> : null}</span>
                    <div className="col" style={{ gap: 10 }}>
                      <div className="row" style={{ gap: 10 }}>
                        <h3 style={{ fontSize: 23 }}>{t(c.name)}</h3>
                      </div>
                      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: 'var(--t-muted)' }}>{t(c.desc)}</p>
                      <span className="row link-arrow" style={{ marginTop: 6, fontSize: 14.5 }}>{c.count} {t('позиций')} <Icon.arrow width="16" height="16" /></span>
                    </div>
                  </div>
                  <div style={{
                    borderLeft: '1px solid var(--line)', position: 'relative', overflow: 'hidden',
                    display: 'grid', placeItems: 'center', padding: '24px 28px',
                    background: 'radial-gradient(circle at 74% 24%, var(--accent-soft), transparent 60%), var(--surface-2)',
                  }}>
                    {Art ? (
                      <Art />
                    ) : CI ? (
                      <span style={{ width: 84, height: 84, borderRadius: 20, background: 'var(--ink)', color: 'var(--accent)', display: 'grid', placeItems: 'center', boxShadow: 'var(--sh-lg)' }}>
                        <CI width="40" height="40" />
                      </span>
                    ) : null}
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <ProductRail eyebrow="Со склада" title="Популярное в наличии" />
      <TrustBar />
      <QuoteCTA />
    </div>
  );
}
