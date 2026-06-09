/* ELEZON — Admin Customers section */

import { useState } from 'react';
import { useStore } from './store';
import {
  afmt, adate, AdmIcon, PageHead, Toolbar, SearchBox, Th, EmptyState,
  Drawer, ConfirmModal, Field, TextInput, SelectInput, CustomerBadge,
  useToast, sortRows,
} from './shared';
import type { AdminSection, AdminCustomer, CustomerStatus, SortState } from './types';

interface Props {
  go: (r: AdminSection, a?: string | null) => void;
  lang: 'ru' | 'en';
  t: (s: string) => string;
}

const BLANK: Omit<AdminCustomer, 'id'> = {
  company: '', inn: '', contact: '', phone: '', email: '', city: '', status: 'lead', requests: 0, turnover: 0, lastDate: '',
};

const CITIES = ['Москва', 'Санкт-Петербург', 'Казань', 'Екатеринбург', 'Новосибирск', 'Нижний Новгород', 'Краснодар', 'Самара'];

function CustomerForm({
  customer, t, lang, onSave, onClose,
}: {
  customer: AdminCustomer | null;
  t: (s: string) => string;
  lang: 'ru' | 'en';
  onSave: (d: Omit<AdminCustomer, 'id'>) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Omit<AdminCustomer, 'id'>>(
    customer
      ? { company: customer.company, inn: customer.inn, contact: customer.contact, phone: customer.phone, email: customer.email, city: customer.city, status: customer.status, requests: customer.requests, turnover: customer.turnover, lastDate: customer.lastDate }
      : { ...BLANK },
  );
  const set = <K extends keyof Omit<AdminCustomer, 'id'>>(k: K, v: Omit<AdminCustomer, 'id'>[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  return (
    <Drawer
      title={customer ? t('Редактировать') : t('Новый клиент')}
      eyebrow={customer ? t(customer.city) : t('Клиенты')}
      onClose={onClose}
      footer={
        <div className="row" style={{ gap: 10 }}>
          <button className="btn btn-ghost" onClick={onClose}>{t('Отмена')}</button>
          <button className="btn btn-accent" style={{ flex: 1 }} onClick={() => onSave(form)}>{t('Сохранить')}</button>
        </div>
      }
    >
      <div className="col" style={{ gap: 0 }}>
        <Field label={t('Организация')} req>
          <TextInput value={form.company} onChange={(e) => set('company', e.target.value)} placeholder="ООО Техника" />
        </Field>
        <div className="row" style={{ gap: 14 }}>
          <div style={{ flex: 1 }}>
            <Field label={t('ИНН')}>
              <TextInput value={form.inn} onChange={(e) => set('inn', e.target.value)} placeholder="7700000000" />
            </Field>
          </div>
          <div style={{ flex: 1 }}>
            <Field label={t('Статус')}>
              <SelectInput value={form.status} onChange={(e) => set('status', e.target.value as CustomerStatus)}>
                <option value="active">{t('Активный')}</option>
                <option value="lead">{t('Лид')}</option>
                <option value="inactive">{t('Неактивный')}</option>
              </SelectInput>
            </Field>
          </div>
        </div>
        <Field label={t('Контактное лицо')}>
          <TextInput value={form.contact} onChange={(e) => set('contact', e.target.value)} placeholder="Иванов Иван Иванович" />
        </Field>
        <div className="row" style={{ gap: 14 }}>
          <div style={{ flex: 1 }}>
            <Field label={t('Телефон')}>
              <TextInput value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+7 900 000 00 00" />
            </Field>
          </div>
          <div style={{ flex: 1 }}>
            <Field label="E-mail">
              <TextInput value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="info@example.com" />
            </Field>
          </div>
        </div>
        <Field label={t('Город')}>
          <SelectInput value={form.city} onChange={(e) => set('city', e.target.value)}>
            <option value="">—</option>
            {CITIES.map((c) => <option key={c} value={c}>{t(c)}</option>)}
          </SelectInput>
        </Field>

        {/* read-only stats when editing */}
        {customer && (
          <div className="adm-dl" style={{ marginTop: 18 }}>
            <dt>{t('Заявок')}</dt><dd className="num">{customer.requests}</dd>
            <dt>{t('Оборот, ₽')}</dt><dd className="num">{afmt(customer.turnover)} ₽</dd>
            {customer.lastDate && (
              <><dt>{t('Последняя заявка')}</dt><dd>{adate(customer.lastDate, lang)}</dd></>
            )}
          </div>
        )}
      </div>
    </Drawer>
  );
}

export default function Customers({ go: _go, lang, t }: Props) {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useStore();
  const toast = useToast();

  const [q, setQ] = useState('');
  const [statusF, setStatusF] = useState<CustomerStatus | 'all'>('all');
  const [cityF, setCityF] = useState('');
  const [sort, setSort] = useState<SortState>({ col: 'company', dir: 'asc' });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const filtered = customers.filter((c) => {
    const ql = q.toLowerCase();
    if (ql && !c.company.toLowerCase().includes(ql) && !c.contact.toLowerCase().includes(ql) && !c.inn.includes(ql)) return false;
    if (statusF !== 'all' && c.status !== statusF) return false;
    if (cityF && c.city !== cityF) return false;
    return true;
  });
  const sorted = sortRows(filtered, sort, {}) as AdminCustomer[];
  const editing = editId ? customers.find((c) => c.id === editId) ?? null : null;

  const handleSave = (data: Omit<AdminCustomer, 'id'>) => {
    if (editId) {
      updateCustomer(editId, data);
      toast(t('Клиент обновлён'));
    } else {
      addCustomer(data);
      toast(t('Клиент добавлен'));
    }
    setDrawerOpen(false); setEditId(null);
  };
  const handleDelete = (id: string) => {
    deleteCustomer(id); toast(t('Запись удалена')); setConfirmId(null);
  };

  return (
    <div className="rise">
      <PageHead
        crumb={<span>{t('Клиенты')}</span>}
        title={t('Клиенты')}
        sub={t('Юридические лица и контакты.')}
        actions={
          <button className="btn btn-accent btn-sm" onClick={() => { setEditId(null); setDrawerOpen(true); }}>
            <AdmIcon.plus width={16} height={16} />{t('Новый клиент')}
          </button>
        }
      />

      <Toolbar>
        <SearchBox value={q} onChange={setQ} placeholder={t('Поиск по панели…')} />
        <SelectInput value={statusF} onChange={(e) => setStatusF(e.target.value as CustomerStatus | 'all')} style={{ width: 160 }}>
          <option value="all">{t('Любой статус')}</option>
          <option value="active">{t('Активный')}</option>
          <option value="lead">{t('Лид')}</option>
          <option value="inactive">{t('Неактивный')}</option>
        </SelectInput>
        <SelectInput value={cityF} onChange={(e) => setCityF(e.target.value)} style={{ width: 170 }}>
          <option value="">{t('Все')}</option>
          {CITIES.map((c) => <option key={c} value={c}>{t(c)}</option>)}
        </SelectInput>
        <span style={{ marginLeft: 'auto', fontFamily: 'var(--f-mono)', fontSize: 12, color: 'var(--t-faint)' }}>
          {sorted.length} {t('из')} {customers.length}
        </span>
      </Toolbar>

      <div className="adm-table-wrap">
        {sorted.length === 0
          ? <EmptyState icon={AdmIcon.users} title={t('Ничего не найдено')} body={t('Измените запрос или фильтры.')} />
          : (
            <table className="adm-table">
              <thead><tr>
                <Th label={t('Организация')}       col="company"  sort={sort} setSort={setSort} />
                <Th label={t('Город')}              col="city"     sort={sort} setSort={setSort} />
                <Th label={t('Заявок')}             col="requests" sort={sort} setSort={setSort} />
                <Th label={t('Оборот, ₽')}          col="turnover" sort={sort} setSort={setSort} />
                <Th label={t('Последняя заявка')}   col="lastDate" sort={sort} setSort={setSort} />
                <Th label={t('Статус')}              col="status"   sort={sort} setSort={setSort} />
                <th style={{ width: 90 }}>{t('Действия')}</th>
              </tr></thead>
              <tbody>
                {sorted.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <span className="adm-td-strong">{c.company}</span>
                      <div className="adm-td-sub">{c.contact} · {c.inn}</div>
                    </td>
                    <td style={{ color: 'var(--t-muted)', fontSize: 13.5 }}>{t(c.city)}</td>
                    <td className="num" style={{ fontWeight: 600 }}>{c.requests}</td>
                    <td className="num">
                      {c.turnover > 0
                        ? <span style={{ fontWeight: 600 }}>{afmt(c.turnover)} ₽</span>
                        : <span style={{ color: 'var(--t-faint)' }}>—</span>}
                    </td>
                    <td style={{ color: 'var(--t-muted)', fontSize: 13.5 }}>
                      {c.lastDate ? adate(c.lastDate, lang) : '—'}
                    </td>
                    <td><CustomerBadge status={c.status} t={t} /></td>
                    <td>
                      <div className="adm-row-actions">
                        <button className="adm-mini-btn" title={t('Редактировать')} onClick={() => { setEditId(c.id); setDrawerOpen(true); }}>
                          <AdmIcon.edit width={14} height={14} />
                        </button>
                        <button className="adm-mini-btn danger" title={t('Удалить')} onClick={() => setConfirmId(c.id)}>
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

      {drawerOpen && (
        <CustomerForm
          customer={editing}
          t={t}
          lang={lang}
          onSave={handleSave}
          onClose={() => { setDrawerOpen(false); setEditId(null); }}
        />
      )}
      {confirmId && (
        <ConfirmModal title={t('Точно удалить?')} body={t('Это действие нельзя отменить.')} confirmLabel={t('Да, удалить')}
          onConfirm={() => handleDelete(confirmId)} onClose={() => setConfirmId(null)} t={t} />
      )}
    </div>
  );
}
