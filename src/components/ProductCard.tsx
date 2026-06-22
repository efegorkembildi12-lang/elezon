/* ELEZON — product card. Real <Link> to the product page (crawlable). */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from './Icon';
import { StockNotifyForm } from './StockNotifyForm';
import { fmt } from '../lib/format';
import { useI18n } from '../i18n/I18nContext';
import { productName, productImage } from '../lib/localize';
import { useRequestList } from '../store/RequestListContext';
import type { Product } from '../types';

export function ProductCard({ p }: { p: Product }) {
  const { t, lang } = useI18n();
  const rl = useRequestList();
  const [hover, setHover] = useState(false);
  const [notify, setNotify] = useState(false);
  const inList = rl.has(p.id);

  return (
    <Link
      to={`/product/${p.id}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="card col"
      style={{
        position: 'relative',
        overflow: 'hidden',
        transition: 'border-color .15s, box-shadow .15s, transform .15s',
        borderColor: hover ? 'var(--line-2)' : 'var(--line)',
        boxShadow: hover ? 'var(--sh-md)' : 'none',
        transform: hover ? 'translateY(-2px)' : 'none',
      }}
    >
      <div style={{ position: 'relative', aspectRatio: '1 / 1', borderBottom: '1px solid var(--line)', overflow: 'hidden', background: 'var(--surface-2)' }}>
        <img src={productImage(p)} alt={productName(p, lang)} loading="lazy" onError={(e) => { e.currentTarget.src = `${import.meta.env.BASE_URL}images/prod-${p.cat}.png`; }} style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', padding: 8 }} />
        <span className="chip" style={{ position: 'absolute', top: 12, left: 12, background: 'var(--surface)' }}>{p.brand}</span>
        <span className={'chip ' + (p.stock === 'in' ? 'stock' : 'order')} style={{ position: 'absolute', top: 12, right: 12 }}>
          <span className="dot" /> {p.stock === 'in' ? t('в наличии') : t('под заказ')}
        </span>
      </div>
      <div className="col" style={{ padding: '16px 17px 18px', gap: 10, flex: 1 }}>
        <span className="mono" style={{ fontSize: 11, color: 'var(--t-faint)' }}>{t(p.type)} · {p.article}</span>
        <span style={{ fontWeight: 600, fontSize: 15, color: 'var(--t-strong)', lineHeight: 1.25, flex: 1 }}>{productName(p, lang)}</span>
        <div className="row" style={{ justifyContent: 'space-between', marginTop: 4 }}>
          <span style={{ fontWeight: 700, fontSize: 17, color: 'var(--t-strong)', fontFamily: 'var(--f-mono)' }}>
            {p.price != null ? (
              <>{fmt(p.price)} <span style={{ fontSize: 13, color: 'var(--t-muted)' }}>₽</span></>
            ) : (
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--t-muted)', fontFamily: 'var(--f-sans)' }}>{t('Цена по запросу')}</span>
            )}
          </span>
          <div className="row" style={{ gap: 8 }}>
            {p.stock === 'order' && (
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setNotify((v) => !v); }}
                aria-label={t('Уведомить о поступлении')}
                title={t('Уведомить о поступлении')}
                style={{
                  width: 34, height: 34, borderRadius: 7, border: '1px solid var(--line-2)',
                  background: notify ? 'var(--accent-soft)' : 'var(--surface)',
                  color: notify ? 'var(--accent-press)' : 'var(--t-muted)',
                  display: 'grid', placeItems: 'center', transition: 'background .15s, color .15s',
                }}
              >
                <Icon.bell width="17" height="17" />
              </button>
            )}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                rl.toggle(p.id);
              }}
              aria-label={inList ? t('В списке') : t('В список запроса')}
              title={inList ? t('В списке') : t('В список запроса')}
              style={{
                width: 34, height: 34, borderRadius: 7, border: 'none',
                background: inList ? 'var(--accent)' : hover ? 'var(--ink)' : 'var(--surface-2)',
                color: inList ? 'var(--accent-ink)' : hover ? 'var(--t-on-dark)' : 'var(--t-muted)',
                display: 'grid', placeItems: 'center', transition: 'background .15s, color .15s',
              }}
            >
              {inList ? <Icon.check width="17" height="17" /> : <Icon.plus width="17" height="17" />}
            </button>
          </div>
        </div>
      </div>

      {notify && (
        <div
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          style={{
            position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 4,
            background: 'var(--surface)', borderTop: '1px solid var(--line)',
            padding: '14px 16px', boxShadow: 'var(--sh-lg)',
          }}
        >
          <StockNotifyForm product={p} compact />
        </div>
      )}
    </Link>
  );
}
