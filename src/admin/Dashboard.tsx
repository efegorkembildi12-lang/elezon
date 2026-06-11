/* ELEZON — Admin Dashboard */

import { useStore } from './store';
import {
  afmt, adate, AdmIcon, PageHead, StatusBadge,
} from './shared';
import type { AdminSection } from './types';

interface Props {
  go: (r: AdminSection, a?: string | null) => void;
  lang: 'ru' | 'en';
  t: (s: string) => string;
}

const DASH_NOW = new Date('2026-06-04T10:00:00');
const daysAgo = (iso: string) => Math.floor((DASH_NOW.getTime() - new Date(iso + 'T00:00:00').getTime()) / 86400000);

const donutColors = ['var(--accent)', 'oklch(0.62 0.03 256)', 'oklch(0.78 0.025 256)', 'oklch(0.46 0.035 256)'];

export default function Dashboard({ go, lang, t }: Props) {
  const { products, categories, orders } = useStore();

  const newCount = orders.filter((o) => o.status === 'new').length;
  const revenue = orders.filter((o) => o.status === 'done').reduce((s, o) => s + o.total, 0);
  const conversion = orders.length ? Math.round(orders.filter((o) => o.status === 'done').length / orders.length * 100) : 0;

  const kpis = [
    { label: 'Новых заявок',      value: String(newCount),         icon: AdmIcon.inbox, delta: '+3',   dir: 'up'   as const },
    { label: 'Выручка, ₽',        value: afmt(revenue) ?? '0',     icon: AdmIcon.ruble, delta: '+18%', dir: 'up'   as const },
    { label: 'Позиций в каталоге', value: String(products.length),  icon: AdmIcon.box,   delta: '+2',   dir: 'up'   as const },
    { label: 'Конверсия заявок',   value: conversion + '%',         icon: AdmIcon.spark, delta: '−4%',  dir: 'down' as const },
  ];

  // weekly bars (last 6 weeks)
  const weekCounts = Array.from({ length: 6 }, (_, i) => 5 - i).map((w) =>
    orders.filter((o) => Math.floor(daysAgo(o.date) / 7) === w).length,
  );
  const maxWeek = Math.max(1, ...weekCounts);

  // category donut
  const catData = categories.map((c) => ({
    name: t(c.short || c.name),
    count: products.filter((p) => p.cat === c.id).length,
    id: c.id,
  }));
  const totalCat = Math.max(1, catData.reduce((s, c) => s + c.count, 0));
  let acc = 0;
  const stops = catData.map((c, i) => {
    const from = acc / totalCat * 360;
    acc += c.count;
    const to = acc / totalCat * 360;
    return `${donutColors[i % 4]} ${from}deg ${to}deg`;
  }).join(', ');

  const recent = [...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  const low = products
    .filter((p) => p.stock === 'in' && p.qty > 0 && p.qty <= 12)
    .sort((a, b) => a.qty - b.qty)
    .slice(0, 5);

  const brandVol: Record<string, number> = {};
  orders.forEach((o) => o.items.forEach((it) => {
    const p = products.find((x) => x.id === it.id);
    if (p) brandVol[p.brand] = (brandVol[p.brand] ?? 0) + it.qty;
  }));
  const topBrands = Object.entries(brandVol).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxBrand = Math.max(1, ...topBrands.map((b) => b[1]));

  return (
    <div className="rise">
      <PageHead
        crumb={<span>{t('Дашборд')}</span>}
        title={t('С возвращением, Антон')}
        sub={t('Обзор за последние 30 дней')}
        actions={<>
          <a className="btn btn-ghost btn-sm" href={import.meta.env.BASE_URL}><AdmIcon.ext width={16} height={16} />{t('Открыть сайт')}</a>
          <button className="btn btn-accent btn-sm" onClick={() => go('products')}><AdmIcon.plus width={16} height={16} />{t('Добавить товар')}</button>
        </>}
      />

      {/* KPIs */}
      <div className="adm-kpi-grid" style={{ marginBottom: 22 }}>
        {kpis.map((k, i) => {
          const I = k.icon;
          return (
            <div key={i} className="adm-kpi">
              <div className="adm-kpi-top">
                <span className="adm-kpi-ic"><I width={20} height={20} /></span>
                <span className={'adm-kpi-delta ' + k.dir}>
                  {k.dir === 'up' ? <AdmIcon.up width={13} height={13} /> : <AdmIcon.down width={13} height={13} />}
                  {k.delta}
                </span>
              </div>
              <div className="col" style={{ gap: 6 }}>
                <span className="adm-kpi-value">{k.value}</span>
                <span className="adm-kpi-label">
                  {t(k.label)}{' '}
                  <span style={{ textTransform: 'none', letterSpacing: 0, fontWeight: 500, color: 'var(--t-faint)' }}>· {t('за неделю')}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* charts row */}
      <div className="adm-dash-grid" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 18, marginBottom: 18 }}>
        <div className="adm-card">
          <div className="adm-card-head"><span className="adm-card-title">{t('Заявки по неделям')}</span><span className="adm-tag">{t('Нед.')} 18–23</span></div>
          <div className="adm-card-body">
            <div className="adm-bars">
              {weekCounts.map((c, i) => (
                <div key={i} className="adm-bar-col">
                  <div className="adm-bar" style={{ height: `${c / maxWeek * 100}%` }}>
                    <span className="adm-bar-val">{c}</span>
                  </div>
                  <span className="adm-bar-lbl">{t('Нед.')} {18 + i}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="adm-card">
          <div className="adm-card-head"><span className="adm-card-title">{t('Структура каталога')}</span></div>
          <div className="adm-card-body row" style={{ gap: 22, alignItems: 'center' }}>
            <div className="adm-donut" style={{ background: `conic-gradient(${stops})` }}>
              <div className="adm-donut-center">
                <div className="col" style={{ alignItems: 'center', gap: 0 }}>
                  <span style={{ fontFamily: 'var(--f-display)', fontWeight: 700, fontSize: 26, color: 'var(--t-strong)' }}>{products.length}</span>
                  <span style={{ fontFamily: 'var(--f-mono)', fontSize: 10.5, color: 'var(--t-faint)', textTransform: 'uppercase', letterSpacing: '.08em' }}>{t('товаров')}</span>
                </div>
              </div>
            </div>
            <div className="adm-legend" style={{ flex: 1 }}>
              {catData.map((c, i) => (
                <div key={c.id} className="adm-legend-row">
                  <span className="adm-legend-sw" style={{ background: donutColors[i % 4] }} />
                  <span style={{ flex: 1, color: 'var(--t-body)' }}>{c.name}</span>
                  <span className="num" style={{ fontWeight: 700, color: 'var(--t-strong)' }}>{c.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* lower row */}
      <div className="adm-dash-grid" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 18 }}>
        <div className="adm-card">
          <div className="adm-card-head">
            <span className="adm-card-title">{t('Последние заявки')}</span>
            <button className="link-arrow" style={{ fontSize: 13.5, color: 'var(--accent-press)' }} onClick={() => go('requests')}>
              {t('Смотреть все')} <AdmIcon.chevR width={15} height={15} />
            </button>
          </div>
          <table className="adm-table">
            <tbody>
              {recent.map((o) => (
                <tr key={o.id} onClick={() => go('requests', o.id)}>
                  <td style={{ width: 1, whiteSpace: 'nowrap' }}><span className="num adm-td-strong">{o.num}</span></td>
                  <td>
                    <span className="adm-td-strong" style={{ fontWeight: 600 }}>{o.company}</span>
                    <div className="adm-td-sub">{adate(o.date, lang)} · {o.items.length} {t('поз.')}</div>
                  </td>
                  <td className="num" style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                    {o.total
                      ? afmt(o.total) + ' ₽'
                      : <span style={{ color: 'var(--t-faint)', fontFamily: 'var(--f-sans)' }}>{t('по запросу')}</span>}
                  </td>
                  <td style={{ textAlign: 'right', width: 1 }}><StatusBadge status={o.status} t={t} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="col" style={{ gap: 18 }}>
          <div className="adm-card">
            <div className="adm-card-head">
              <span className="adm-card-title">{t('Заканчивается на складе')}</span>
              <AdmIcon.warn width={18} height={18} style={{ color: 'oklch(0.6 0.14 70)' }} />
            </div>
            <div className="col">
              {low.map((p, i) => (
                <button key={p.id} onClick={() => go('products', p.id)} className="row"
                  style={{ gap: 12, padding: '11px 18px', borderBottom: i < low.length - 1 ? '1px solid var(--line)' : 'none', background: 'none', border: 'none', borderBottomWidth: i < low.length - 1 ? 1 : 0, textAlign: 'left', cursor: 'pointer', width: '100%' }}>
                  <span className="col" style={{ flex: 1, gap: 2, minWidth: 0 }}>
                    <span style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--t-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t(p.name)}</span>
                    <span className="adm-td-sub" style={{ margin: 0 }}>{p.brand} · {p.article}</span>
                  </span>
                  <span className="adm-badge" data-st="work" style={{ flex: '0 0 auto' }}>{p.qty} {t('шт')}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="adm-card">
            <div className="adm-card-head"><span className="adm-card-title">{t('Топ брендов по заявкам')}</span></div>
            <div className="adm-card-body col" style={{ gap: 13 }}>
              {topBrands.map(([name, vol]) => (
                <div key={name} className="col" style={{ gap: 6 }}>
                  <div className="row" style={{ justifyContent: 'space-between', fontSize: 13.5 }}>
                    <span style={{ fontWeight: 600, color: 'var(--t-strong)' }}>{name}</span>
                    <span className="num" style={{ color: 'var(--t-muted)' }}>{afmt(vol)} {t('шт')}</span>
                  </div>
                  <div className="adm-progress"><i style={{ width: `${vol / maxBrand * 100}%` }} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
