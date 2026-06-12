/* ELEZON — Catalog & Category listing with horizontal filter bar. Ported from catalog.jsx. */

import { useEffect, useState, type CSSProperties } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { ProductCard } from '../components/ProductCard';
import { Breadcrumbs, type Crumb } from '../components/Breadcrumbs';
import { fmt } from '../lib/format';
import { useGo } from '../lib/useGo';
import { matchProduct } from '../lib/search';
import { useI18n } from '../i18n/I18nContext';
import { productName } from '../lib/localize';
import { useCatalog } from '../store/CatalogProvider';

function FilterChip({ label, count, active, onClick, dot }: { label: string; count?: number; active: boolean; onClick: () => void; dot?: boolean }) {
  const style: CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 14px', borderRadius: 'var(--r-pill)',
    border: `1px solid ${active ? 'var(--accent-press)' : 'var(--line-2)'}`,
    background: active ? 'var(--accent-soft)' : 'var(--surface)',
    color: active ? 'var(--accent-press)' : 'var(--t-body)',
    fontSize: 13.5, fontWeight: 600, fontFamily: 'var(--f-sans)', cursor: 'pointer', transition: 'border-color .12s, background .12s, color .12s',
  };
  return (
    <button onClick={onClick} style={style}>
      {dot && <span className="dot" style={{ background: active ? 'var(--accent-press)' : 'var(--t-faint)' }} />}
      {label}
      {count != null && <span className="mono" style={{ fontSize: 11, color: active ? 'var(--accent-press)' : 'var(--t-faint)', opacity: 0.85 }}>{count}</span>}
    </button>
  );
}

export function Catalog() {
  const go = useGo();
  const { t, lang } = useI18n();
  const D = useCatalog();
  const { categoryId } = useParams<{ categoryId?: string }>();
  const category = categoryId ? D.categories.find((c) => c.id === categoryId) ?? null : null;

  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const clearQ = () => {
    const next = new URLSearchParams(params);
    next.delete('q');
    setParams(next, { replace: true });
  };

  const [cats, setCats] = useState<string[]>(category ? [category.id] : []);
  const [brands, setBrands] = useState<string[]>([]);
  const [stockOnly, setStockOnly] = useState(false);
  const [sort, setSort] = useState('pop');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  // Reset filters when navigating between categories.
  useEffect(() => {
    setCats(category ? [category.id] : []);
    setBrands([]);
    setStockOnly(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);

  const toggle = (arr: string[], set: (v: string[]) => void, v: string) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  let items = D.products.filter(
    (p) =>
      (cats.length === 0 || cats.includes(p.cat)) &&
      (brands.length === 0 || brands.includes(p.brand)) &&
      (!stockOnly || p.stock === 'in') &&
      matchProduct(p, q, t),
  );
  if (sort === 'price-asc') items = [...items].sort((a, b) => (a.price ?? 9e9) - (b.price ?? 9e9));
  if (sort === 'price-desc') items = [...items].sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
  if (sort === 'name-asc') items = [...items].sort((a, b) => productName(a, lang).localeCompare(productName(b, lang), lang));
  if (sort === 'name-desc') items = [...items].sort((a, b) => productName(b, lang).localeCompare(productName(a, lang), lang));

  const activeBrands = [...new Set(D.products.filter((p) => cats.length === 0 || cats.includes(p.cat)).map((p) => p.brand))];
  const title = category ? category.name : 'Каталог';
  const crumbs: Crumb[] = [
    { label: 'Главная', go: () => go('home') },
    { label: 'Каталог', go: category ? () => go('catalog') : undefined },
  ];
  if (category) crumbs.push({ label: category.name });

  const hasFilters = cats.length > 0 || brands.length > 0 || stockOnly || q.length > 0;

  return (
    <div className="rise">
      <Breadcrumbs items={crumbs} />
      <div className="wrap" style={{ padding: '22px 32px 12px' }}>
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap' }}>
          <div className="col" style={{ gap: 12 }}>
            <h1 className="display" style={{ fontSize: 46 }}>{t(title)}</h1>
            {category && <p style={{ margin: 0, fontSize: 15.5, color: 'var(--t-muted)', maxWidth: 620, lineHeight: 1.5 }}>{t(category.desc)}</p>}
          </div>
          {category && (
            <div className="row sub-chips" style={{ gap: 8, flexWrap: 'wrap', maxWidth: 520 }}>
              {category.sub.map((s) => <span key={s} className="chip" style={{ background: 'var(--surface)' }}>{t(s)}</span>)}
            </div>
          )}
        </div>
      </div>

      <div className="wrap" style={{ padding: '24px 32px 80px' }}>
        {/* horizontal filter bar */}
        <div className="card" style={{ padding: '16px 18px', marginBottom: 22 }}>
          {!category && (
            <div className="col" style={{ gap: 9, paddingBottom: 14, borderBottom: '1px solid var(--line)', marginBottom: 14 }}>
              <span className="flt-label">{t('Категория')}</span>
              <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
                <FilterChip label={t('Все')} active={cats.length === 0} onClick={() => setCats([])} />
                {D.categories.map((c) => <FilterChip key={c.id} label={t(c.short)} count={c.count} active={cats.includes(c.id)} onClick={() => toggle(cats, setCats, c.id)} />)}
              </div>
            </div>
          )}
          <div className="filter-bar-row" style={{ display: 'flex', gap: 28, alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <div className="col" style={{ gap: 9, flex: 1, minWidth: 240 }}>
              <span className="flt-label">{t('Бренд')}</span>
              <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
                {activeBrands.map((b) => <FilterChip key={b} label={b} active={brands.includes(b)} onClick={() => toggle(brands, setBrands, b)} />)}
              </div>
            </div>
            <div className="col" style={{ gap: 9 }}>
              <span className="flt-label">{t('Наличие')}</span>
              <div className="row" style={{ gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                <FilterChip label={t('Только в наличии')} active={stockOnly} onClick={() => setStockOnly(!stockOnly)} dot />
                {hasFilters ? (
                  <button onClick={() => { setCats(category ? [category.id] : []); setBrands([]); setStockOnly(false); clearQ(); }} className="row" style={{ gap: 6, background: 'none', border: 'none', color: 'var(--accent-press)', fontSize: 13, fontWeight: 600, padding: '8px 6px', cursor: 'pointer' }}><Icon.minus width="14" height="14" /> {t('Сбросить')}</button>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* results */}
        <div className="col" style={{ gap: 20 }}>
          <div className="row" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div className="row" style={{ gap: 12, flexWrap: 'wrap' }}>
              <span className="mono" style={{ fontSize: 13, color: 'var(--t-muted)' }}>{t('Найдено')} <span style={{ color: 'var(--t-strong)', fontWeight: 700 }}>{items.length}</span> {t('позиций')}</span>
              {q && (
                <button onClick={clearQ} className="row" style={{ gap: 8, padding: '5px 10px 5px 12px', borderRadius: 'var(--r-pill)', border: '1px solid var(--accent-press)', background: 'var(--accent-soft)', color: 'var(--accent-press)', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>
                  {t('Результаты по запросу')} «{q}»
                  <span style={{ fontSize: 16, lineHeight: 1 }}>×</span>
                </button>
              )}
            </div>
            <div className="row" style={{ gap: 10 }}>
              <select className="field" value={sort} onChange={(e) => setSort(e.target.value)} style={{ width: 'auto', padding: '9px 14px', fontSize: 13.5 }}>
                <option value="pop">{t('По популярности')}</option>
                <option value="price-asc">{t('Сначала дешевле')}</option>
                <option value="price-desc">{t('Сначала дороже')}</option>
                <option value="name-asc">{t('По названию (А–Я)')}</option>
                <option value="name-desc">{t('По названию (Я–А)')}</option>
              </select>
              <div className="row" style={{ border: '1px solid var(--line-2)', borderRadius: 'var(--r-sm)', overflow: 'hidden' }}>
                {(['grid', 'list'] as const).map((v) => (
                  <button key={v} onClick={() => setView(v)} style={{ width: 38, height: 38, display: 'grid', placeItems: 'center', background: view === v ? 'var(--ink)' : 'var(--surface)', color: view === v ? 'var(--t-on-dark)' : 'var(--t-muted)', border: 'none' }}>
                    {v === 'grid' ? <Icon.grid width="16" height="16" /> : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M3 6h18M3 12h18M3 18h18" /></svg>}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="card col" style={{ padding: 48, alignItems: 'center', gap: 12, textAlign: 'center' }}>
              <Icon.search width="32" height="32" style={{ color: 'var(--line-2)' }} />
              <span style={{ fontWeight: 700, color: 'var(--t-strong)' }}>{t('Ничего не найдено')}</span>
              <span style={{ fontSize: 14, color: 'var(--t-muted)' }}>{t('Измените фильтры или отправьте запрос — подберём аналог.')}</span>
            </div>
          ) : view === 'grid' ? (
            <div className="prod-grid-cat" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }}>
              {items.map((p) => <ProductCard key={p.id} p={p} />)}
            </div>
          ) : (
            <div className="col card" style={{ overflow: 'hidden' }}>
              {items.map((p, i) => (
                <a key={p.id} href="#" onClick={(e) => { e.preventDefault(); go('product', p); }}
                   className="row list-row" style={{ gap: 18, padding: '16px 18px', borderBottom: i < items.length - 1 ? '1px solid var(--line)' : 'none' }}>
                  <span className="ph" style={{ width: 64, height: 64, borderRadius: 8, flex: '0 0 auto', overflow: 'hidden' }}><img src={`${import.meta.env.BASE_URL}images/prod-${p.cat}.png`} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></span>
                  <span className="col" style={{ gap: 4, flex: 1, minWidth: 0 }}>
                    <span className="mono" style={{ fontSize: 11, color: 'var(--t-faint)' }}>{p.brand} · {p.article}</span>
                    <span style={{ fontWeight: 600, fontSize: 15, color: 'var(--t-strong)' }}>{productName(p, lang)}</span>
                  </span>
                  <span className={'chip ' + (p.stock === 'in' ? 'stock' : 'order')}><span className="dot" />{p.stock === 'in' ? `${p.qty} ${t('шт')}` : t('под заказ')}</span>
                  <span style={{ fontFamily: 'var(--f-mono)', fontWeight: 700, fontSize: 16, color: 'var(--t-strong)', minWidth: 120, textAlign: 'right' }}>{p.price != null ? `${fmt(p.price)} ₽` : <span style={{ fontSize: 13, color: 'var(--t-muted)', fontWeight: 600, fontFamily: 'var(--f-sans)' }}>{t('по запросу')}</span>}</span>
                </a>
              ))}
            </div>
          )}

          {/* spec CTA banner */}
          <div className="spec-banner" style={{ marginTop: 14, background: 'var(--ink)', borderRadius: 'var(--r-lg)', padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
            <div className="row" style={{ gap: 16 }}>
              <span style={{ width: 46, height: 46, borderRadius: 11, background: 'var(--accent-soft)', color: 'var(--accent)', display: 'grid', placeItems: 'center', flex: '0 0 auto' }}><Icon.doc width="23" height="23" /></span>
              <div className="col" style={{ gap: 3 }}>
                <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--t-on-dark)' }}>{t('Нужна спецификация?')}</span>
                <span style={{ fontSize: 13.5, color: 'var(--t-on-dark-muted)' }}>{t('Загрузите перечень — подберём и рассчитаем цену.')}</span>
              </div>
            </div>
            <button className="btn btn-accent" onClick={() => go('contacts')}>{t('Запрос цены')} <Icon.arrow width="17" height="17" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
