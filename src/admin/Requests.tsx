/* ELEZON — Admin Requests (Orders) section */

import { useState, useEffect } from 'react';
import { useStore } from './store';
import {
  afmt, adate, AdmIcon, PageHead, Toolbar, SearchBox, Th, EmptyState,
  Drawer, ConfirmModal, SelectInput, StatusBadge, useToast, sortRows,
  ORDER_STATUS, ORDER_FLOW, CHANNEL, CHANNEL_ICON,
} from './shared';
import type { AdminSection, AdminOrder, OrderStatus, SortState } from './types';

interface Props {
  go: (r: AdminSection, a?: string | null) => void;
  lang: 'ru' | 'en';
  t: (s: string) => string;
  openId?: string | null;
}

const FLOW_STEPS = ['new', 'work', 'ship', 'done'] as const;
type FlowStep = typeof FLOW_STEPS[number];

/* ---- OrderDrawer ---- */

function OrderDrawer({
  order, products, t, lang, onClose, onSave,
}: {
  order: AdminOrder;
  products: { id: string; name: string; brand: string; article: string; price: number | null }[];
  t: (s: string) => string;
  lang: 'ru' | 'en';
  onClose: () => void;
  onSave: (o: AdminOrder) => void;
}) {
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [confirmStatus, setConfirmStatus] = useState<OrderStatus | null>(null);

  /* next valid status transitions */
  const curIdx = ORDER_FLOW.indexOf(order.status as OrderStatus);
  const nextStatus: OrderStatus | null = curIdx >= 0 && curIdx < ORDER_FLOW.length - 1 ? ORDER_FLOW[curIdx + 1] ?? null : null;

  const applyStatus = (s: OrderStatus) => {
    onSave({ ...order, status: s });
    setStatus(s);
    setConfirmStatus(null);
  };

  const itemsTotal = order.items.reduce((s, it) => {
    const p = products.find((x) => x.id === it.id);
    return s + (p?.price ?? 0) * it.qty;
  }, 0);

  const ChanIcon = CHANNEL_ICON[order.channel] ?? AdmIcon.bolt;
  const stepIdx = FLOW_STEPS.indexOf(status as FlowStep);

  const STATUS_ACTIONS: Record<string, string> = {
    new: 'Перевести в работу', work: 'Отгрузить', ship: 'Закрыть заявку',
  };
  const STATUS_STEPS: Record<string, string> = {
    new: 'Принята', work: 'Расчёт', ship: 'Договор', done: 'Отгрузка',
  };

  return (
    <>
      <Drawer
        title={`${t('Заявка')} ${order.num}`}
        eyebrow={adate(order.date, lang)}
        onClose={onClose}
        width={560}
        footer={
          nextStatus && order.status !== 'done' && order.status !== 'lost'
            ? (
              <div className="row" style={{ gap: 10 }}>
                <button className="btn btn-accent btn-sm" style={{ flex: 1 }} onClick={() => setConfirmStatus(nextStatus)}>
                  {t(STATUS_ACTIONS[order.status] ?? ORDER_STATUS[nextStatus]?.label ?? nextStatus)}
                </button>
              </div>
            )
            : undefined
        }
      >
        <div className="col" style={{ gap: 0 }}>
          {/* status timeline */}
          <div className="adm-steps" style={{ marginBottom: 20 }}>
            {FLOW_STEPS.map((s, i) => {
              const done = stepIdx >= i;
              return (
                <div key={s} className={'adm-step' + (done ? ' done' : '')}>
                  <div className="adm-step-dot">{done ? <AdmIcon.check width={10} height={10} /> : null}</div>
                  <span className="adm-step-label">{t(STATUS_STEPS[s] ?? s)}</span>
                  {i < FLOW_STEPS.length - 1 && <div className="adm-step-line" />}
                </div>
              );
            })}
          </div>

          {/* status badge + channel */}
          <div className="row" style={{ gap: 12, marginBottom: 18, padding: '0 20px' }}>
            <StatusBadge status={status} t={t} />
            <span className="row" style={{ gap: 6, fontSize: 13, color: 'var(--t-muted)' }}>
              <ChanIcon width={15} height={15} />
              {t(CHANNEL[order.channel] ?? order.channel)}
            </span>
            <span style={{ marginLeft: 'auto', fontFamily: 'var(--f-mono)', fontSize: 13, color: 'var(--t-muted)' }}>
              {t('Менеджер')}: {order.manager}
            </span>
          </div>

          {/* client block */}
          <div className="adm-dl" style={{ margin: '0 20px 20px' }}>
            <dt>{t('Организация')}</dt><dd>{order.company}</dd>
            <dt>{t('Контакт')}</dt><dd>{order.contact}</dd>
            <dt>{t('Телефон')}</dt><dd><a href={`tel:${order.phone}`} style={{ color: 'var(--accent-press)' }}>{order.phone}</a></dd>
            <dt>{t('Почта')}</dt><dd><a href={`mailto:${order.email}`} style={{ color: 'var(--accent-press)' }}>{order.email}</a></dd>
          </div>

          {/* items */}
          <div className="adm-card-head" style={{ padding: '12px 20px', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
            <span className="adm-card-title">{t('Состав заявки')}</span>
            <span style={{ fontFamily: 'var(--f-mono)', fontSize: 12, color: 'var(--t-faint)' }}>{order.items.length} {t('поз.')}</span>
          </div>
          <table className="adm-table">
            <tbody>
              {order.items.map((it) => {
                const p = products.find((x) => x.id === it.id);
                return (
                  <tr key={it.id}>
                    <td>
                      <span className="adm-td-strong" style={{ fontWeight: 600 }}>{p ? t(p.name) : it.id}</span>
                      {p && <div className="adm-td-sub">{p.brand} · {p.article}</div>}
                    </td>
                    <td className="num" style={{ width: 60 }}>{it.qty} {t('шт')}</td>
                    <td className="num" style={{ width: 110, textAlign: 'right' }}>
                      {p?.price != null
                        ? <span style={{ fontWeight: 600 }}>{afmt(p.price * it.qty)} ₽</span>
                        : <span style={{ color: 'var(--t-faint)' }}>{t('по запросу')}</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {itemsTotal > 0 && (
              <tfoot>
                <tr>
                  <td colSpan={2} style={{ fontWeight: 700, fontSize: 14, paddingTop: 10, paddingBottom: 10 }}>{t('Итого позиций')}</td>
                  <td className="num" style={{ fontWeight: 700, fontSize: 14, textAlign: 'right' }}>{afmt(itemsTotal)} ₽</td>
                </tr>
              </tfoot>
            )}
          </table>

          {order.comment && (
            <div style={{ margin: '16px 20px 0', padding: '14px 16px', background: 'var(--surface-2)', borderRadius: 10, fontSize: 13.5, color: 'var(--t-body)' }}>
              <div style={{ fontWeight: 600, marginBottom: 6, color: 'var(--t-muted)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '.06em' }}>{t('Комментарий клиента')}</div>
              {order.comment}
            </div>
          )}
        </div>
      </Drawer>

      {confirmStatus && (
        <ConfirmModal
          title={t('Изменить статус')}
          body={`→ ${t(ORDER_STATUS[confirmStatus]?.label ?? confirmStatus)}`}
          confirmLabel={t('Применить')}
          onConfirm={() => applyStatus(confirmStatus)}
          onClose={() => setConfirmStatus(null)}
          t={t}
        />
      )}
    </>
  );
}

/* ---- main export ---- */

export default function Requests({ go: _go, lang, t, openId }: Props) {
  const { orders, products, updateOrder } = useStore();
  const toast = useToast();

  const [q, setQ] = useState('');
  const [statusF, setStatusF] = useState<OrderStatus | 'all'>('all');
  const [chanF, setChanF] = useState<string>('all');
  const [sort, setSort] = useState<SortState>({ col: 'date', dir: 'desc' });
  const [activeId, setActiveId] = useState<string | null>(openId ?? null);

  useEffect(() => { if (openId) setActiveId(openId); }, [openId]);

  const filtered = orders.filter((o) => {
    const ql = q.toLowerCase();
    if (ql && !o.company.toLowerCase().includes(ql) && !o.num.toLowerCase().includes(ql) && !o.contact.toLowerCase().includes(ql)) return false;
    if (statusF !== 'all' && o.status !== statusF) return false;
    if (chanF !== 'all' && o.channel !== chanF) return false;
    return true;
  });
  const sorted = sortRows(filtered, sort, {}) as AdminOrder[];
  const active = activeId ? orders.find((o) => o.id === activeId) ?? null : null;

  const handleSave = (o: AdminOrder) => {
    updateOrder(o.id, { status: o.status });
    toast(t('Статус обновлён'));
  };

  const newCount = orders.filter((o) => o.status === 'new').length;

  return (
    <div className="rise">
      <PageHead
        crumb={<span>{t('Заявки')}</span>}
        title={t('Заявки')}
        sub={t('Входящие запросы цен и спецификации.')}
        actions={newCount > 0
          ? <span className="adm-badge" data-st="new">{newCount} {t('Ожидают обработки')}</span>
          : undefined}
      />

      <Toolbar>
        <SearchBox value={q} onChange={setQ} placeholder={t('Поиск по панели…')} />
        <SelectInput value={statusF} onChange={(e) => setStatusF(e.target.value as OrderStatus | 'all')} style={{ width: 160 }}>
          <option value="all">{t('Любой статус')}</option>
          {(['new', 'work', 'ship', 'done', 'lost'] as OrderStatus[]).map((s) => (
            <option key={s} value={s}>{t(ORDER_STATUS[s]?.label ?? s)}</option>
          ))}
        </SelectInput>
        <SelectInput value={chanF} onChange={(e) => setChanF(e.target.value)} style={{ width: 140 }}>
          <option value="all">{t('Все')}</option>
          <option value="form">{t(CHANNEL.form)}</option>
          <option value="email">{t(CHANNEL.email)}</option>
          <option value="phone">{t(CHANNEL.phone)}</option>
        </SelectInput>
        <span style={{ marginLeft: 'auto', fontFamily: 'var(--f-mono)', fontSize: 12, color: 'var(--t-faint)' }}>
          {sorted.length} {t('из')} {orders.length}
        </span>
      </Toolbar>

      <div className="adm-table-wrap">
        {sorted.length === 0
          ? <EmptyState icon={AdmIcon.inbox} title={t('Ничего не найдено')} body={t('Измените запрос или фильтры.')} />
          : (
            <table className="adm-table">
              <thead><tr>
                <Th label={t('Номер')}    col="num"     sort={sort} setSort={setSort} />
                <Th label={t('Дата')}     col="date"    sort={sort} setSort={setSort} />
                <Th label={t('Клиент')}   col="company" sort={sort} setSort={setSort} />
                <Th label={t('Канал')}    col="channel" sort={sort} setSort={setSort} />
                <Th label={t('Менеджер')} col="manager" sort={sort} setSort={setSort} />
                <Th label={t('Сумма')}    col="total"   sort={sort} setSort={setSort} />
                <Th label={t('Статус')}   col="status"  sort={sort} setSort={setSort} />
              </tr></thead>
              <tbody>
                {sorted.map((o) => {
                  const ChanIcon = CHANNEL_ICON[o.channel] ?? AdmIcon.bolt;
                  return (
                    <tr key={o.id} onClick={() => setActiveId(o.id)} style={{ cursor: 'pointer' }}>
                      <td><span className="num adm-td-strong">{o.num}</span></td>
                      <td style={{ color: 'var(--t-muted)', fontSize: 13.5 }}>{adate(o.date, lang)}</td>
                      <td>
                        <span className="adm-td-strong">{o.company}</span>
                        <div className="adm-td-sub">{o.contact} · {o.items.length} {t('поз.')}</div>
                      </td>
                      <td>
                        <span className="row" style={{ gap: 6, fontSize: 13.5, color: 'var(--t-muted)' }}>
                          <ChanIcon width={15} height={15} />
                          {t(CHANNEL[o.channel] ?? o.channel)}
                        </span>
                      </td>
                      <td style={{ color: 'var(--t-muted)', fontSize: 13.5 }}>{o.manager}</td>
                      <td className="num">
                        {o.total
                          ? <span style={{ fontWeight: 600 }}>{afmt(o.total)} ₽</span>
                          : <span style={{ color: 'var(--t-faint)', fontFamily: 'var(--f-sans)' }}>{t('по запросу')}</span>}
                      </td>
                      <td><StatusBadge status={o.status} t={t} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
      </div>

      {active && (
        <OrderDrawer
          order={active}
          products={products}
          t={t}
          lang={lang}
          onClose={() => setActiveId(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
