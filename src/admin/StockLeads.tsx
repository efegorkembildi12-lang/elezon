/* ELEZON — Admin "Подписки": stock-notification leads captured on the storefront. */

import { useState } from 'react';
import { useStore } from './store';
import {
  adate, AdmIcon, PageHead, Toolbar, SearchBox, Th, EmptyState, ConfirmModal, useToast, sortRows,
} from './shared';
import { toCsv, downloadCsv } from '../lib/exportSpec';
import type { AdminSection, SortState } from './types';
import type { StockLead } from '../data/stockNotifications';

interface Props {
  go: (r: AdminSection, a?: string | null) => void;
  lang: 'ru' | 'en';
  t: (s: string) => string;
}

export default function StockLeads({ go: _go, lang, t }: Props) {
  const { leads, setLeads } = useStore();
  const toast = useToast();

  const [q, setQ] = useState('');
  const [sort, setSort] = useState<SortState>({ col: 'createdAt', dir: 'desc' });
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const filtered = leads.filter((l) => {
    const ql = q.toLowerCase();
    if (!ql) return true;
    return l.email.toLowerCase().includes(ql)
      || l.productName.toLowerCase().includes(ql)
      || l.article.toLowerCase().includes(ql);
  });
  const sorted = sortRows(filtered, sort, {}) as StockLead[];

  const handleDelete = (id: string) => {
    setLeads(leads.filter((l) => l.id !== id));
    toast(t('Запись удалена'));
    setConfirmId(null);
  };

  const exportCsv = () => {
    const headers = [t('Email'), t('Товар'), t('Артикул'), t('Дата подписки')];
    const rows = sorted.map((l) => [l.email, t(l.productName), l.article, l.createdAt.slice(0, 10)]);
    downloadCsv('elezon-stock-leads-' + new Date().toISOString().slice(0, 10) + '.csv', toCsv(headers, rows));
  };

  return (
    <div className="rise">
      <PageHead
        crumb={<span>{t('Подписки')}</span>}
        title={t('Подписки')}
        sub={t('Заявки на уведомление о поступлении товаров «под заказ».')}
        actions={
          leads.length > 0 ? (
            <button className="btn btn-ghost btn-sm" onClick={exportCsv}>
              <AdmIcon.file width={16} height={16} />{t('Экспорт CSV')}
            </button>
          ) : undefined
        }
      />

      <Toolbar>
        <SearchBox value={q} onChange={setQ} placeholder={t('Поиск по панели…')} />
        <span style={{ marginLeft: 'auto', fontFamily: 'var(--f-mono)', fontSize: 12, color: 'var(--t-faint)' }}>
          {sorted.length} {t('из')} {leads.length}
        </span>
      </Toolbar>

      <div className="adm-table-wrap">
        {sorted.length === 0
          ? <EmptyState icon={AdmIcon.bell} title={t('Ничего не найдено')} body={t('Здесь появятся клиенты, подписавшиеся на поступление товаров.')} />
          : (
            <table className="adm-table">
              <thead><tr>
                <Th label={t('Email')}          col="email"       sort={sort} setSort={setSort} />
                <Th label={t('Товар')}          col="productName" sort={sort} setSort={setSort} />
                <Th label={t('Артикул')}        col="article"     sort={sort} setSort={setSort} />
                <Th label={t('Дата подписки')}  col="createdAt"   sort={sort} setSort={setSort} />
                <th style={{ width: 90 }}>{t('Действия')}</th>
              </tr></thead>
              <tbody>
                {sorted.map((l) => (
                  <tr key={l.id}>
                    <td><span className="adm-td-strong">{l.email}</span></td>
                    <td style={{ fontSize: 13.5 }}>{t(l.productName)}</td>
                    <td className="mono" style={{ fontSize: 12.5, color: 'var(--t-muted)' }}>{l.article}</td>
                    <td style={{ color: 'var(--t-muted)', fontSize: 13.5 }}>{l.createdAt ? adate(l.createdAt.slice(0, 10), lang) : '—'}</td>
                    <td>
                      <div className="adm-row-actions">
                        <button className="adm-mini-btn danger" title={t('Удалить')} onClick={() => setConfirmId(l.id)}>
                          <AdmIcon.trash width={14} height={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
      </div>

      {confirmId && (
        <ConfirmModal title={t('Точно удалить?')} body={t('Это действие нельзя отменить.')} confirmLabel={t('Да, удалить')}
          onConfirm={() => handleDelete(confirmId)} onClose={() => setConfirmId(null)} t={t} />
      )}
    </div>
  );
}
