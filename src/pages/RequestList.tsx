/* ELEZON — Request list (Список запроса): batch quote for multiple products.
   Ported from request.jsx. Submitting persists a real заявка into the admin panel;
   the list can also be exported as a CSV spec or printed (browser → Save as PDF). */

import { useState } from 'react';
import { Icon } from '../components/Icon';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { fmt } from '../lib/format';
import { useGo } from '../lib/useGo';
import { useI18n } from '../i18n/I18nContext';
import { useRequestList } from '../store/RequestListContext';
import { toSpecCsv, downloadCsv } from '../lib/exportSpec';
import { submitStorefrontRequest } from '../data/incomingRequests';
import { ELEZON_DATA } from '../data/catalog';
import type { Product as ProductType } from '../types';

function QtyStepper({ qty, onChange }: { qty: number; onChange: (q: number) => void }) {
  return (
    <div className="row no-print" style={{ border: '1px solid var(--line-2)', borderRadius: 'var(--r-sm)', overflow: 'hidden' }}>
      <button onClick={() => onChange(qty - 1)} aria-label="-" style={{ width: 32, height: 34, border: 'none', background: 'var(--surface)', color: 'var(--t-muted)', display: 'grid', placeItems: 'center' }}><Icon.minus width="15" height="15" /></button>
      <input
        value={qty}
        onChange={(e) => onChange(parseInt(e.target.value.replace(/\D/g, ''), 10) || 1)}
        style={{ width: 40, height: 34, border: 'none', borderLeft: '1px solid var(--line)', borderRight: '1px solid var(--line)', textAlign: 'center', fontFamily: 'var(--f-mono)', fontWeight: 600, fontSize: 14, color: 'var(--t-strong)', background: 'var(--surface)' }}
      />
      <button onClick={() => onChange(qty + 1)} aria-label="+" style={{ width: 32, height: 34, border: 'none', background: 'var(--surface)', color: 'var(--t-muted)', display: 'grid', placeItems: 'center' }}><Icon.plus width="15" height="15" /></button>
    </div>
  );
}

interface Row {
  id: string;
  qty: number;
  p: ProductType;
}

interface ContactForm {
  org: string;
  name: string;
  phone: string;
  email: string;
  comment: string;
}

const BLANK_FORM: ContactForm = { org: '', name: '', phone: '', email: '', comment: '' };

export function RequestList() {
  const go = useGo();
  const { t, lang } = useI18n();
  const rl = useRequestList();
  const D = ELEZON_DATA;
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState<ContactForm>(BLANK_FORM);
  const set = <K extends keyof ContactForm>(k: K, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const rows: Row[] = rl.items
    .map((it) => ({ ...it, p: D.products.find((x) => x.id === it.id) }))
    .filter((r): r is Row => Boolean(r.p));
  const totalUnits = rows.reduce((s, r) => s + r.qty, 0);

  const valid = form.org.trim() !== '' && form.name.trim() !== '' && form.phone.trim() !== '';

  const handleSubmit = () => {
    if (!valid) return;
    submitStorefrontRequest(
      form,
      rows.map((r) => ({ id: r.id, qty: r.qty, price: r.p.price })),
      new Date().toISOString(),
    );
    setSent(true);
  };

  const handleCsv = () =>
    downloadCsv('elezon-spec-' + new Date().toISOString().slice(0, 10) + '.csv', toSpecCsv(rows, t));

  const today = new Date().toLocaleDateString(lang === 'en' ? 'en-GB' : 'ru-RU');

  return (
    <div className="rise">
      <div className="no-print">
        <Breadcrumbs items={[{ label: 'Главная', go: () => go('home') }, { label: 'Список запроса' }]} />
        <div className="wrap" style={{ padding: '22px 32px 12px' }}>
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-end', gap: 20, flexWrap: 'wrap' }}>
            <div className="col" style={{ gap: 10 }}>
              <span className="eyebrow"><Icon.list width="14" height="14" style={{ verticalAlign: '-2px', marginRight: 6 }} />{t('Список запроса')}</span>
              <h1 className="display" style={{ fontSize: 44 }}>{t('Список запроса')}</h1>
            </div>
            {rows.length > 0 && (
              <button onClick={() => rl.clear()} className="row" style={{ gap: 7, background: 'none', border: 'none', color: 'var(--t-muted)', fontSize: 13.5, fontWeight: 600 }}>
                <Icon.trash width="16" height="16" /> {t('Очистить список')}
              </button>
            )}
          </div>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="wrap" style={{ padding: '30px 32px 100px' }}>
          <div className="card col" style={{ padding: '64px 32px', alignItems: 'center', gap: 16, textAlign: 'center' }}>
            <span style={{ width: 64, height: 64, borderRadius: 16, background: 'var(--surface-2)', color: 'var(--t-faint)', display: 'grid', placeItems: 'center' }}><Icon.list width="30" height="30" /></span>
            <h3 style={{ fontSize: 24 }}>{t('Ваш список пуст')}</h3>
            <p style={{ margin: 0, fontSize: 15, color: 'var(--t-muted)', lineHeight: 1.6, maxWidth: 420 }}>{t('Добавьте товары из каталога, чтобы запросить цену сразу на несколько позиций одним запросом.')}</p>
            <button className="btn btn-accent" style={{ marginTop: 6 }} onClick={() => go('catalog')}>{t('Перейти в каталог')} <Icon.arrow width="17" height="17" /></button>
          </div>
        </div>
      ) : (
        <div className="wrap request-layout" style={{ padding: '26px 32px 96px', display: 'grid', gridTemplateColumns: '1fr 380px', gap: 36, alignItems: 'start' }}>
          {/* print-only spec header */}
          <div className="print-only" style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: 'var(--f-display)', fontWeight: 700, fontSize: 24 }}>ELEZON — {t('Спецификация')}</div>
            <div className="mono" style={{ fontSize: 12, color: 'var(--t-muted)' }}>{today} · {t('Позиций')}: {rows.length} / {totalUnits} {t('шт')}</div>
          </div>

          {/* items */}
          <div className="card" style={{ overflow: 'hidden' }}>
            {/* export toolbar */}
            <div className="row no-print" style={{ gap: 10, padding: '14px 18px', borderBottom: '1px solid var(--line)', flexWrap: 'wrap' }}>
              <button className="btn btn-ghost btn-sm" onClick={handleCsv}><Icon.doc width="16" height="16" /> {t('Скачать CSV')}</button>
              <button className="btn btn-ghost btn-sm" onClick={() => window.print()}><Icon.doc width="16" height="16" /> {t('Печать')}</button>
            </div>
            {rows.map((r, i) => (
              <div key={r.id} className="row request-row" style={{ gap: 16, padding: '16px 18px', borderBottom: i < rows.length - 1 ? '1px solid var(--line)' : 'none' }}>
                <a href="#" onClick={(e) => { e.preventDefault(); go('product', r.p); }} className="ph no-print" style={{ width: 60, height: 60, borderRadius: 8, flex: '0 0 auto', overflow: 'hidden' }}><img src={`/images/prod-${r.p.cat}.png`} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></a>
                <div className="col" style={{ gap: 4, flex: 1, minWidth: 0 }}>
                  <span className="mono" style={{ fontSize: 11, color: 'var(--t-faint)' }}>{r.p.brand} · {r.p.article}</span>
                  <a href="#" onClick={(e) => { e.preventDefault(); go('product', r.p); }} style={{ fontWeight: 600, fontSize: 14.5, color: 'var(--t-strong)' }}>{t(r.p.name)}</a>
                  <span className={'chip ' + (r.p.stock === 'in' ? 'stock' : 'order')} style={{ alignSelf: 'flex-start', marginTop: 2 }}><span className="dot" />{r.p.stock === 'in' ? t('в наличии') : t('под заказ')}</span>
                </div>
                <span className="print-only mono" style={{ fontWeight: 700 }}>{r.qty} {t('шт')}</span>
                <QtyStepper qty={r.qty} onChange={(q) => rl.setQty(r.id, q)} />
                <span style={{ fontFamily: 'var(--f-mono)', fontWeight: 700, fontSize: 15, color: 'var(--t-strong)', minWidth: 110, textAlign: 'right' }}>{r.p.price != null ? `${fmt(r.p.price)} ₽` : <span style={{ fontSize: 12.5, color: 'var(--t-muted)', fontWeight: 600, fontFamily: 'var(--f-sans)' }}>{t('по запросу')}</span>}</span>
                <button onClick={() => rl.remove(r.id)} aria-label={t('Удалить')} className="no-print" style={{ width: 34, height: 34, borderRadius: 7, border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--t-muted)', display: 'grid', placeItems: 'center', flex: '0 0 auto' }}><Icon.trash width="16" height="16" /></button>
              </div>
            ))}
          </div>

          {/* summary + form */}
          <div className="card request-form no-print" style={{ padding: 26, position: 'sticky', top: 120 }}>
            {sent ? (
              <div className="col" style={{ alignItems: 'center', gap: 14, textAlign: 'center', padding: '20px 0' }}>
                <span style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--accent-soft)', color: 'var(--accent-press)', display: 'grid', placeItems: 'center' }}><Icon.check width="28" height="28" /></span>
                <h3 style={{ fontSize: 22 }}>{t('Запрос по списку отправлен')}</h3>
                <p style={{ margin: 0, fontSize: 14.5, color: 'var(--t-muted)', lineHeight: 1.55 }}>{t('Менеджер рассчитает цену и сроки по всем позициям и свяжется с вами в течение рабочего дня.')}</p>
                <button className="btn btn-dark" onClick={() => { rl.clear(); setSent(false); setForm(BLANK_FORM); go('catalog'); }}>{t('Перейти в каталог')}</button>
              </div>
            ) : (
              <div className="col" style={{ gap: 16 }}>
                <div className="row" style={{ justifyContent: 'space-between', paddingBottom: 14, borderBottom: '1px solid var(--line)' }}>
                  <span style={{ fontSize: 14, color: 'var(--t-muted)' }}>{t('Позиций')}</span>
                  <span className="mono" style={{ fontWeight: 700, color: 'var(--t-strong)' }}>{rows.length} <span style={{ color: 'var(--t-faint)', fontWeight: 400 }}>/ {totalUnits} {t('шт')}</span></span>
                </div>
                <h3 style={{ fontSize: 19 }}>{t('Контактные данные')}</h3>
                <div><label className="lbl">{t('Организация *')}</label><input className="field" value={form.org} onChange={(e) => set('org', e.target.value)} placeholder={t('ООО «Компания»')} /></div>
                <div className="row" style={{ gap: 12 }}>
                  <div style={{ flex: 1 }}><label className="lbl">{t('Имя *')}</label><input className="field" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder={t('Иван')} /></div>
                  <div style={{ flex: 1 }}><label className="lbl">{t('Телефон *')}</label><input className="field" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+7 (___) ___-__-__" /></div>
                </div>
                <div><label className="lbl">E-mail</label><input className="field" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="info@company.ru" /></div>
                <div><label className="lbl">{t('Комментарий')}</label><textarea className="field" rows={2} value={form.comment} onChange={(e) => set('comment', e.target.value)} placeholder={t('Сроки, требования, адрес доставки…')} style={{ resize: 'vertical' }} /></div>
                <button className="btn btn-accent" style={{ justifyContent: 'center', opacity: valid ? 1 : 0.55 }} disabled={!valid} onClick={handleSubmit}>{t('Отправить запрос')} ({rows.length}) <Icon.arrow width="17" height="17" /></button>
                <span className="mono" style={{ fontSize: 11, color: 'var(--t-faint)', textAlign: 'center' }}>{t('Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности')}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
