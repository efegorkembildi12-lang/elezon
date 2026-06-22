/* ELEZON — Product detail + quote modal. Ported from product.jsx. */

import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { ProductCard } from '../components/ProductCard';
import { StockNotifyForm } from '../components/StockNotifyForm';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { fmt } from '../lib/format';
import { useGo } from '../lib/useGo';
import { useI18n } from '../i18n/I18nContext';
import { useRequestList } from '../store/RequestListContext';
import { useCatalog } from '../store/CatalogProvider';
import { productName, productDesc, productSpecs, productImage, docUrl } from '../lib/localize';
import { Seo } from '../components/Seo';
import { PageState } from '../lib/ssg/pageState';
import { productSchema, breadcrumbSchema } from '../lib/seo/schema';
import type { Product as ProductType } from '../types';

function QuoteForm({ p, onClose }: { p: ProductType | null; onClose: () => void }) {
  const { t, lang } = useI18n();
  const [sent, setSent] = useState(false);
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'grid', placeItems: 'center', padding: 20, background: 'oklch(0.17 0.012 256 / 0.55)', backdropFilter: 'blur(4px)' }} onClick={onClose}>
      <div className="card" style={{ width: 'min(460px, 100%)', padding: 30 }} onClick={(e) => e.stopPropagation()}>
        {sent ? (
          <div className="col" style={{ alignItems: 'center', gap: 14, textAlign: 'center', padding: '16px 0' }}>
            <span style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--accent-soft)', color: 'var(--accent-press)', display: 'grid', placeItems: 'center' }}><Icon.check width="28" height="28" /></span>
            <h3 style={{ fontSize: 22 }}>{t('Запрос отправлен')}</h3>
            <p style={{ margin: 0, fontSize: 14.5, color: 'var(--t-muted)', lineHeight: 1.55 }}>{t('Менеджер рассчитает цену и сроки и свяжется с вами в течение рабочего дня.')}</p>
            <button className="btn btn-dark" style={{ marginTop: 6 }} onClick={onClose}>{t('Закрыть')}</button>
          </div>
        ) : (
          <div className="col" style={{ gap: 16 }}>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: 22 }}>{t('Запрос цены')}</h3>
              <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--t-muted)', fontSize: 22, lineHeight: 1 }}>×</button>
            </div>
            {p && (
              <div className="row" style={{ gap: 10, padding: 12, background: 'var(--surface-2)', borderRadius: 'var(--r-sm)' }}>
                <span className="mono" style={{ fontSize: 11, color: 'var(--t-faint)' }}>{p.article}</span>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--t-strong)' }}>{productName(p, lang)}</span>
              </div>
            )}
            <div className="col" style={{ gap: 12 }}>
              <div><label className="lbl">{t('Организация *')}</label><input className="field" placeholder={t('ООО «Компания»')} /></div>
              <div className="row" style={{ gap: 12 }}>
                <div style={{ flex: 1 }}><label className="lbl">{t('Имя *')}</label><input className="field" placeholder={t('Иван')} /></div>
                <div style={{ flex: 1 }}><label className="lbl">{t('Телефон *')}</label><input className="field" placeholder="+7 (___) ___-__-__" /></div>
              </div>
              <div><label className="lbl">E-mail</label><input className="field" placeholder="info@company.ru" /></div>
              <div><label className="lbl">{t('Комментарий / количество')}</label><textarea className="field" rows={2} placeholder={t('Кол-во, сроки, требования…')} style={{ resize: 'vertical' }} /></div>
            </div>
            <button className="btn btn-accent" style={{ justifyContent: 'center' }} onClick={() => setSent(true)}>{t('Отправить запрос')} <Icon.arrow width="17" height="17" /></button>
            <span className="mono" style={{ fontSize: 11, color: 'var(--t-faint)', textAlign: 'center' }}>{t('Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности')}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function Product() {
  const go = useGo();
  const { t, lang } = useI18n();
  const rl = useRequestList();
  const { products, categories, brands, stats, loading } = useCatalog();
  const { productId } = useParams<{ productId?: string }>();
  const [tab, setTab] = useState('specs');
  const [quote, setQuote] = useState(false);

  const p = products.find((x) => x.id === productId) ?? products[0];

  if (!p) {
    return (
      <div className="rise">
        <div className="wrap" style={{ padding: '80px 32px', textAlign: 'center' }}>
          <h1 className="display" style={{ fontSize: 28 }}>{loading ? '…' : t('Ничего не найдено')}</h1>
          <button className="btn btn-accent" style={{ marginTop: 16 }} onClick={() => go('catalog')}>{t('Перейти в каталог')}</button>
        </div>
      </div>
    );
  }

  const inList = rl.has(p.id);
  const cat = categories.find((c) => c.id === p.cat) ?? categories[0] ?? null;
  const related = products.filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, 4);

  return (
    <div className="rise">
      <Seo
        title={`${productName(p, lang)} — ${p.brand}`}
        description={`${productName(p, lang)}, ${p.brand} (${p.article}). Оригинальное оборудование со склада в Москве, отгрузка 24 ч, для юридических лиц.`}
        type="product"
        image={productImage(p)}
        jsonLd={[
          productSchema(p, productDesc(p, lang) || `${productName(p, lang)} производства ${p.brand}.`, `/product/${p.id}`),
          breadcrumbSchema([
            { name: 'Главная', path: '/' },
            { name: 'Каталог', path: '/catalog' },
            ...(cat ? [{ name: cat.short, path: `/catalog/${cat.id}` }] : []),
            { name: p.type },
          ]),
        ]}
      />
      <PageState data={{ products: [p, ...related], categories, brands, stats }} />
      <Breadcrumbs items={[
        { label: 'Главная', to: '/' },
        { label: 'Каталог', to: '/catalog' },
        ...(cat ? [{ label: cat.short, to: `/catalog/${cat.id}` }] : []),
        { label: p.type },
      ]} />

      <div className="wrap product-top" style={{ padding: '26px 32px 56px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
        {/* gallery */}
        <div className="col" style={{ gap: 14 }}>
          <div style={{ position: 'relative', width: '100%', aspectRatio: '1 / 1', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', overflow: 'hidden', background: 'var(--surface-2)' }}>
            <img src={productImage(p)} alt={productName(p, lang)} onError={(e) => { e.currentTarget.src = `${import.meta.env.BASE_URL}images/prod-${p.cat}.png`; }} style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', padding: 16 }} />
            <span className="chip" style={{ position: 'absolute', top: 16, left: 16, background: 'var(--surface)', zIndex: 2 }}>{p.brand}</span>
          </div>
          <div className="row" style={{ gap: 12 }}>
            <div className="ph" style={{ width: 80, height: 80, borderRadius: 10, overflow: 'hidden', border: '1px solid var(--line)' }}><img src={productImage(p)} alt="" onError={(e) => { e.currentTarget.src = `${import.meta.env.BASE_URL}images/prod-${p.cat}.png`; }} style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', padding: 6 }} /></div>
          </div>
        </div>

        {/* info */}
        <div className="col" style={{ gap: 18 }}>
          <div className="row" style={{ gap: 10 }}>
            <span className={'chip ' + (p.stock === 'in' ? 'stock' : 'order')}><span className="dot" />{p.stock === 'in' ? t('в наличии') : t('под заказ')}</span>
            <span className="mono" style={{ fontSize: 12, color: 'var(--t-faint)' }}>{t('Артикул:')} {p.article}</span>
          </div>
          <h1 className="display" style={{ fontSize: 34, lineHeight: 1.1 }}>{productName(p, lang)}</h1>
          <div className="row" style={{ gap: 18, fontSize: 13.5, color: 'var(--t-muted)', flexWrap: 'wrap' }}>
            <span>{t('Бренд:')} <b style={{ color: 'var(--t-strong)' }}>{p.brand}</b></span>
            <span>{t('Тип:')} <b style={{ color: 'var(--t-strong)' }}>{t(p.type)}</b></span>
          </div>

          <div className="card" style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div className="col" style={{ gap: 4 }}>
                <span className="mono" style={{ fontSize: 12, color: 'var(--t-muted)' }}>{t('Цена для юр. лиц')}</span>
                {p.price != null
                  ? <span style={{ fontFamily: 'var(--f-mono)', fontWeight: 700, fontSize: 30, color: 'var(--t-strong)' }}>{fmt(p.price)} <span style={{ fontSize: 18, color: 'var(--t-muted)' }}>₽</span></span>
                  : <span style={{ fontWeight: 700, fontSize: 24, color: 'var(--t-strong)' }}>{t('Цена по запросу')}</span>}
              </div>
              {p.stock === 'in' && (
                <div className="col" style={{ alignItems: 'flex-end', gap: 2 }}>
                  <span className="mono" style={{ fontSize: 13, fontWeight: 700, color: 'oklch(0.52 0.13 150)' }}>{p.qty} {t('шт')}</span>
                  <span className="mono" style={{ fontSize: 11.5, color: 'var(--t-muted)' }}>{t('склад Москва')}</span>
                </div>
              )}
            </div>
            <div className="row" style={{ gap: 10, flexWrap: 'wrap' }}>
              <button className="btn btn-accent" style={{ flex: '1 1 140px', justifyContent: 'center' }} onClick={() => setQuote(true)}><Icon.doc width="17" height="17" /> {t('Запрос цены')}</button>
              <button className="btn btn-ghost" style={{ flex: '1 1 120px', justifyContent: 'center', ...(inList ? { borderColor: 'var(--accent)', color: 'var(--accent-press)', background: 'var(--accent-soft)' } : {}) }} onClick={() => rl.toggle(p.id)}>
                {inList ? <><Icon.check width="17" height="17" /> {t('В списке')}</> : <><Icon.plus width="17" height="17" /> {t('В список')}</>}
              </button>
              <a href="tel:+74951474761" className="btn btn-dark"><Icon.phone width="17" height="17" /></a>
            </div>
            {p.stock === 'order' && (
              <div style={{ borderTop: '1px solid var(--line)', paddingTop: 16 }}>
                <StockNotifyForm product={p} />
              </div>
            )}
            <div className="row" style={{ gap: 18, fontSize: 12.5, color: 'var(--t-muted)', flexWrap: 'wrap' }}>
              <span className="row" style={{ gap: 7 }}><Icon.truck width="15" height="15" style={{ color: 'var(--accent-press)' }} /> {t('Отгрузка 24 ч')}</span>
              <span className="row" style={{ gap: 7 }}><Icon.shield width="15" height="15" style={{ color: 'var(--accent-press)' }} /> {t('Гарантия производителя')}</span>
              <span className="row" style={{ gap: 7 }}><Icon.check width="15" height="15" style={{ color: 'var(--accent-press)' }} /> {t('Оригинал')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* tabs */}
      <div className="wrap" style={{ padding: '0 32px 80px' }}>
        <div className="row" style={{ gap: 4, borderBottom: '1px solid var(--line)', marginBottom: 28, overflowX: 'auto' }}>
          {([['specs', 'Характеристики'], ['desc', 'Описание'], ['delivery', 'Доставка']] as const).map(([id, l]) => (
            <button key={id} onClick={() => setTab(id)} style={{ background: 'none', border: 'none', padding: '14px 18px', fontSize: 14.5, fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0, color: tab === id ? 'var(--t-strong)' : 'var(--t-muted)', borderBottom: `2px solid ${tab === id ? 'var(--accent)' : 'transparent'}`, marginBottom: -1 }}>{t(l)}</button>
          ))}
        </div>
        <div className="product-tab" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 48 }}>
          <div>
            {tab === 'specs' && (
              <div className="col" style={{ border: '1px solid var(--line)', borderRadius: 'var(--r-md)', overflow: 'hidden' }}>
                {productSpecs(p, lang).map(([k, v], i) => (
                  <div key={i} className="row" style={{ justifyContent: 'space-between', padding: '14px 18px', background: i % 2 ? 'var(--surface)' : 'var(--surface-2)', fontSize: 14 }}>
                    <span style={{ color: 'var(--t-muted)' }}>{t(k)}</span>
                    <span className="mono" style={{ fontWeight: 600, color: 'var(--t-strong)' }}>{t(v)}</span>
                  </div>
                ))}
              </div>
            )}
            {tab === 'desc' && (
              <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.7, color: 'var(--t-body)', whiteSpace: 'pre-line' }}>
                {productDesc(p, lang)
                  || `${productName(p, lang)} ${t('производства')} ${p.brand} — ${t('оригинальное оборудование для применения в инженерных системах зданий. Поставляется со склада в Москве с полным пакетом документов для юридических лиц. По запросу подберём аналоги и рассчитаем стоимость для проектных объёмов.')}`}
              </p>
            )}
            {tab === 'delivery' && (
              <div className="col" style={{ gap: 14, fontSize: 15, lineHeight: 1.6, color: 'var(--t-body)' }}>
                <p style={{ margin: 0 }}>{t('Отгрузка со склада в Москве в течение 24 часов после подтверждения заказа. Доставка по России транспортными компаниями, самовывоз со склада.')}</p>
                <p style={{ margin: 0 }}>{t('Оплата по счёту для юридических лиц, возможна отсрочка платежа. Полный пакет закрывающих документов.')}</p>
              </div>
            )}
          </div>
          <div className="card" style={{ padding: 22, height: 'fit-content', background: 'var(--surface-2)' }}>
            <span className="eyebrow">{t('Документы')}</span>
            <div className="col" style={{ gap: 8, marginTop: 14 }}>
              {p.documents && p.documents.length ? (
                p.documents.map((d, i) => (
                  <a
                    key={i} href={docUrl(d)} target="_blank" rel="noopener noreferrer" download
                    className="row" style={{ gap: 10, padding: '11px 12px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-sm)', fontSize: 13.5, color: 'var(--t-body)' }}
                  >
                    <Icon.doc width="17" height="17" style={{ color: 'var(--accent-press)', flexShrink: 0 }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.title || t('Документ')}</span>
                  </a>
                ))
              ) : (
                <span style={{ fontSize: 13, color: 'var(--t-faint)' }}>{t('Документы предоставляются по запросу')}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* related */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-head">
            <h2 className="display" style={{ fontSize: 34 }}>{t('Похожие позиции')}</h2>
            {cat && <Link to={`/catalog/${cat.id}`} className="link-arrow">{t('Вся категория')} <Icon.arrow width="18" height="18" /></Link>}
          </div>
          <div className="prod-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18 }}>
            {related.map((r) => <ProductCard key={r.id} p={r} />)}
          </div>
        </div>
      </section>

      {quote && <QuoteForm p={p} onClose={() => setQuote(false)} />}
    </div>
  );
}
