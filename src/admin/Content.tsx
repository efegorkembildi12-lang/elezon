/* ELEZON — Admin Content + Settings sections */

import { useState } from 'react';
import { useStore } from './store';
import {
  AdmIcon, PageHead, Field, TextInput, TextArea, Toggle, useToast,
} from './shared';
import type { AdminSection, ContentData, StoreSettings, AccentKey } from './types';

interface Props {
  section: 'content' | 'settings';
  go: (r: AdminSection, a?: string | null) => void;
  t: (s: string) => string;
}

/* ===================== CONTENT ===================== */

const CONTENT_PAGES: Array<{
  key: keyof ContentData;
  label: string;
  href: string;
  rows: number;
}> = [
  { key: 'homeSub',        label: 'Главная — подзаголовок', href: '/',         rows: 2  },
  { key: 'aboutHeading',   label: 'О компании — заголовок', href: '/about',    rows: 2  },
  { key: 'aboutBody',      label: 'О компании — текст',     href: '/about',    rows: 6  },
  { key: 'deliveryBody',   label: 'Доставка — текст',       href: '/delivery', rows: 5  },
  { key: 'contactAddress', label: 'Контакты — адрес',       href: '/contacts', rows: 2  },
  { key: 'contactPhone',   label: 'Контакты — телефон',     href: '/contacts', rows: 1  },
  { key: 'contactEmail',   label: 'Контакты — e-mail',      href: '/contacts', rows: 1  },
  { key: 'requisites',     label: 'Реквизиты',              href: '/contacts', rows: 5  },
];

function ContentSection({ t }: { t: (s: string) => string }) {
  const { content, setContent } = useStore();
  const toast = useToast();
  const [form, setForm] = useState<ContentData>({ ...content });

  const set = (k: keyof ContentData, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleSave = () => {
    setContent(form);
    toast(t('Контент сохранён'));
  };

  return (
    <>
      <PageHead
        crumb={<span>{t('Контент')}</span>}
        title={t('Контент')}
        sub={t('Тексты страниц сайта.')}
        actions={
          <button className="btn btn-accent btn-sm" onClick={handleSave}>
            <AdmIcon.check width={16} height={16} />{t('Сохранить изменения')}
          </button>
        }
      />
      <div className="adm-card" style={{ maxWidth: 720 }}>
        <div className="adm-card-body col" style={{ gap: 0 }}>
          {CONTENT_PAGES.map((p) => (
            <div key={p.key} style={{ marginBottom: 18 }}>
              <div className="row" style={{ gap: 8, marginBottom: 6 }}>
                <label className="adm-fld-label" style={{ flex: 1, margin: 0 }}>{t(p.label)}</label>
                <a href={p.href} target="_blank" rel="noopener noreferrer"
                  className="adm-mini-btn" title={t('Открыть страницу на сайте')} style={{ textDecoration: 'none' }}>
                  <AdmIcon.ext width={13} height={13} />
                </a>
              </div>
              {p.rows === 1
                ? <TextInput value={form[p.key]} onChange={(e) => set(p.key, e.target.value)} placeholder={t(p.label)} />
                : <TextArea value={form[p.key]} onChange={(e) => set(p.key, e.target.value)} rows={p.rows} placeholder={t(p.label)} />}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ===================== SETTINGS ===================== */

const ACCENTS: { value: AccentKey; label: string; color: string }[] = [
  { value: 'lime',   label: 'Лайм',   color: 'oklch(0.82 0.2 145)'  },
  { value: 'cyan',   label: 'Циан',   color: 'oklch(0.78 0.18 205)' },
  { value: 'amber',  label: 'Янтарь', color: 'oklch(0.8 0.18 80)'   },
  { value: 'violet', label: 'Виолет', color: 'oklch(0.72 0.2 295)'  },
];

const TEAM = [
  { name: 'Антон Кречет',  role: 'Владелец',         email: 'anton@elezon.ru' },
  { name: 'Мария Лозова',  role: 'Контент-менеджер', email: 'maria@elezon.ru' },
  { name: 'Игорь Дёмин',   role: 'Контент-менеджер', email: 'igor@elezon.ru'  },
];

const TOGGLE_KEYS: Array<[keyof StoreSettings, string]> = [
  ['notifyNew',   'Уведомления о новых заявках'],
  ['priceNoVat',  'Показывать цены без НДС'],
  ['autoPublish', 'Авто-публикация новых товаров'],
];

function SettingsSection({ t }: { t: (s: string) => string }) {
  const { settings, setSettings, resetAll } = useStore();
  const toast = useToast();
  const [form, setForm] = useState<StoreSettings>({ ...settings });

  const set = <K extends keyof StoreSettings>(k: K, v: StoreSettings[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleSave = () => {
    setSettings(form);
    toast(t('Настройки сохранены'));
  };

  const handleReset = () => {
    resetAll();
    toast(t('Изменения сохранены'));
    setTimeout(() => window.location.reload(), 600);
  };

  return (
    <>
      <PageHead
        crumb={<span>{t('Настройки')}</span>}
        title={t('Настройки')}
        sub={t('Параметры панели и магазина.')}
        actions={
          <button className="btn btn-accent btn-sm" onClick={handleSave}>
            <AdmIcon.check width={16} height={16} />{t('Сохранить изменения')}
          </button>
        }
      />

      <div className="col" style={{ gap: 18, maxWidth: 720 }}>
        {/* Store */}
        <div className="adm-card">
          <div className="adm-card-head"><span className="adm-card-title">{t('Магазин')}</span></div>
          <div className="adm-card-body col" style={{ gap: 0 }}>
            <Field label={t('Название магазина')}>
              <TextInput value={form.storeName} onChange={(e) => set('storeName', e.target.value)} placeholder="ELEZON" />
            </Field>
            <div className="row" style={{ gap: 14 }}>
              <div style={{ flex: 1 }}>
                <Field label={t('E-mail для заявок')}>
                  <TextInput value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="info@elezon.ru" />
                </Field>
              </div>
              <div style={{ flex: 1 }}>
                <Field label={t('Телефон магазина')}>
                  <TextInput value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+7 800 000 00 00" />
                </Field>
              </div>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="adm-card">
          <div className="adm-card-head"><span className="adm-card-title">{t('Оформление')}</span></div>
          <div className="adm-card-body col" style={{ gap: 18 }}>
            <Field label={t('Акцентный цвет')}>
              <div className="row" style={{ gap: 10 }}>
                {ACCENTS.map((a) => (
                  <button
                    key={a.value}
                    type="button"
                    onClick={() => set('accent', a.value)}
                    title={t(a.label)}
                    style={{
                      width: 36, height: 36, borderRadius: 8,
                      background: a.color,
                      border: form.accent === a.value ? '3px solid var(--t-strong)' : '3px solid transparent',
                      cursor: 'pointer', outline: 'none', flexShrink: 0,
                    }}
                  />
                ))}
              </div>
            </Field>
            <Field label={t('Язык по умолчанию')}>
              <select
                className="field"
                value={form.defaultLang}
                onChange={(e) => set('defaultLang', e.target.value as 'ru' | 'en')}
                style={{ width: 200 }}
              >
                <option value="ru">{t('Русский')}</option>
                <option value="en">{t('Английский')}</option>
              </select>
            </Field>
          </div>
        </div>

        {/* Toggles */}
        <div className="adm-card">
          <div className="adm-card-head"><span className="adm-card-title">{t('Данные')}</span></div>
          <div className="col" style={{ gap: 0 }}>
            {TOGGLE_KEYS.map(([k, label]) => (
              <div key={k} className="row" style={{ padding: '14px 20px', borderBottom: '1px solid var(--line)', gap: 14 }}>
                <span style={{ flex: 1, fontSize: 14, color: 'var(--t-body)' }}>{t(label)}</span>
                <Toggle value={form[k] as boolean} onChange={(v) => set(k, v as StoreSettings[typeof k])} />
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="adm-card">
          <div className="adm-card-head">
            <span className="adm-card-title">{t('Команда')}</span>
            <button className="btn btn-ghost btn-sm" disabled style={{ cursor: 'not-allowed', opacity: .5 }}>
              <AdmIcon.plus width={14} height={14} />{t('Пригласить')}
            </button>
          </div>
          <table className="adm-table">
            <thead><tr>
              <th>{t('Контакт')}</th>
              <th style={{ width: 180 }}>{t('Роль')}</th>
            </tr></thead>
            <tbody>
              {TEAM.map((m) => (
                <tr key={m.email}>
                  <td>
                    <span className="adm-td-strong">{t(m.name)}</span>
                    <div className="adm-td-sub">{m.email}</div>
                  </td>
                  <td style={{ color: 'var(--t-muted)', fontSize: 13.5 }}>{t(m.role)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Reset */}
        <div className="adm-card">
          <div className="adm-card-body col" style={{ gap: 12 }}>
            <p style={{ fontSize: 13.5, color: 'var(--t-muted)', margin: 0 }}>
              {t('Все изменения сохраняются локально в этом браузере. Сброс вернёт демо-каталог и заявки к исходному состоянию.')}
            </p>
            <button className="btn btn-ghost btn-sm" onClick={handleReset} style={{ alignSelf: 'flex-start', color: 'oklch(0.55 0.16 25)' }}>
              <AdmIcon.trash width={14} height={14} />{t('Сбросить')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ===================== EXPORT ===================== */

export default function Content({ section, go: _go, t }: Props) {
  return (
    <div className="rise">
      {section === 'content' ? <ContentSection t={t} /> : <SettingsSection t={t} />}
    </div>
  );
}
