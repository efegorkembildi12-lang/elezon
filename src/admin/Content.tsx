/* ELEZON — Admin Content + Settings sections */

import { useState, useEffect } from 'react';
import { useStore } from './store';
import {
  AdmIcon, PageHead, Field, TextInput, TextArea, Toggle, useToast, ConfirmModal,
} from './shared';
import { teamList, teamAdd, teamRemove, type TeamMember } from '../lib/db/repo';
import type { AdminSection, ContentData, StoreSettings, AccentKey } from './types';
import type { SiteStat } from '../data/siteStats';

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
  const { content, setContent, stats, setStats } = useStore();
  const toast = useToast();
  const [form, setForm] = useState<ContentData>({ ...content });
  const [statsForm, setStatsForm] = useState<SiteStat[]>(() => stats.map((s) => ({ ...s })));

  const set = (k: keyof ContentData, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const setStat = (i: number, k: keyof SiteStat, v: string) =>
    setStatsForm((p) => p.map((s, idx) => (idx === i ? { ...s, [k]: v } : s)));

  const handleSave = () => {
    setContent(form);
    setStats(statsForm);
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

      <div className="adm-card" style={{ maxWidth: 720, marginTop: 18 }}>
        <div className="adm-card-head">
          <span className="adm-card-title">{t('Статистика')}</span>
          <a href={import.meta.env.BASE_URL} target="_blank" rel="noopener noreferrer"
            className="adm-mini-btn" title={t('Открыть страницу на сайте')} style={{ textDecoration: 'none' }}>
            <AdmIcon.ext width={13} height={13} />
          </a>
        </div>
        <div className="adm-card-body col" style={{ gap: 14 }}>
          <p style={{ fontSize: 13, color: 'var(--t-muted)', margin: 0 }}>
            {t('Блок цифр на главной и «О компании». Заполните оба языка — на сайте показывается версия активного языка.')}
          </p>
          {statsForm.map((s, i) => (
            <div key={i} className="col" style={{ gap: 8, paddingTop: i > 0 ? 14 : 0, borderTop: i > 0 ? '1px solid var(--line)' : 'none' }}>
              <div className="row" style={{ gap: 14, alignItems: 'flex-end' }}>
                <div style={{ width: 170 }}>
                  <Field label={`${t('Значение')} · RU`}>
                    <TextInput value={s.v} onChange={(e) => setStat(i, 'v', e.target.value)} placeholder="1 570+" />
                  </Field>
                </div>
                <div style={{ flex: 1 }}>
                  <Field label={`${t('Подпись')} · RU`}>
                    <TextInput value={s.l} onChange={(e) => setStat(i, 'l', e.target.value)} placeholder="позиций на складе" />
                  </Field>
                </div>
              </div>
              <div className="row" style={{ gap: 14, alignItems: 'flex-end' }}>
                <div style={{ width: 170 }}>
                  <Field label={`${t('Значение')} · EN`}>
                    <TextInput value={s.vEn} onChange={(e) => setStat(i, 'vEn', e.target.value)} placeholder="1 570+" />
                  </Field>
                </div>
                <div style={{ flex: 1 }}>
                  <Field label={`${t('Подпись')} · EN`}>
                    <TextInput value={s.lEn} onChange={(e) => setStat(i, 'lEn', e.target.value)} placeholder="items in stock" />
                  </Field>
                </div>
              </div>
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

const TEAM_ERR: Record<string, string> = {
  invalid_email: 'Некорректный e-mail',
  weak_password: 'Пароль не короче 8 символов',
  cannot_remove_self: 'Нельзя удалить самого себя',
  last_admin: 'Нельзя удалить последнего администратора',
};

function TeamCard({ t }: { t: (s: string) => string }) {
  const toast = useToast();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadErr, setLoadErr] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', name: '', role: 'Менеджер' });
  const [busy, setBusy] = useState(false);
  const [formErr, setFormErr] = useState('');
  const [removeId, setRemoveId] = useState<string | null>(null);

  const refresh = () => {
    setLoading(true);
    teamList()
      .then((m) => { setMembers(m); setLoadErr(''); })
      .catch((e) => setLoadErr(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  };
  useEffect(refresh, []);

  const msg = (code: string) => t(TEAM_ERR[code] ?? code);

  const handleAdd = async () => {
    setFormErr('');
    setBusy(true);
    try {
      await teamAdd(form);
      toast(t('Пользователь добавлен'));
      setOpen(false);
      setForm({ email: '', password: '', name: '', role: 'Менеджер' });
      refresh();
    } catch (e) {
      setFormErr(msg(e instanceof Error ? e.message : String(e)));
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = async (id: string) => {
    setRemoveId(null);
    try {
      await teamRemove(id);
      toast(t('Пользователь удалён'));
      refresh();
    } catch (e) {
      toast(msg(e instanceof Error ? e.message : String(e)));
    }
  };

  return (
    <div className="adm-card">
      <div className="adm-card-head">
        <span className="adm-card-title">{t('Команда')}</span>
        <button className="btn btn-ghost btn-sm" onClick={() => { setFormErr(''); setOpen(true); }}>
          <AdmIcon.plus width={14} height={14} />{t('Добавить пользователя')}
        </button>
      </div>
      {loadErr ? (
        <div className="adm-card-body"><span style={{ fontSize: 13, color: 'oklch(0.55 0.16 25)' }}>{t('Не удалось загрузить команду')}: {loadErr}</span></div>
      ) : loading ? (
        <div className="adm-card-body"><span style={{ fontSize: 13.5, color: 'var(--t-muted)' }}>{t('Загрузка…')}</span></div>
      ) : (
        <table className="adm-table">
          <thead><tr>
            <th>{t('Контакт')}</th>
            <th style={{ width: 150 }}>{t('Роль')}</th>
            <th style={{ width: 60 }} />
          </tr></thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.user_id}>
                <td>
                  <span className="adm-td-strong">{m.name || m.email}</span>
                  <div className="adm-td-sub">{m.email}</div>
                </td>
                <td style={{ color: 'var(--t-muted)', fontSize: 13.5 }}>{t(m.role)}</td>
                <td>
                  <button className="adm-mini-btn danger" title={t('Удалить')} onClick={() => setRemoveId(m.user_id)}>
                    <AdmIcon.trash width={14} height={14} />
                  </button>
                </td>
              </tr>
            ))}
            {members.length === 0 && (
              <tr><td colSpan={3} style={{ color: 'var(--t-faint)', fontSize: 13.5 }}>{t('Нет пользователей')}</td></tr>
            )}
          </tbody>
        </table>
      )}

      {open && (
        <div className="adm-card-body col" style={{ gap: 0, borderTop: '1px solid var(--line)' }}>
          <div className="row" style={{ gap: 14 }}>
            <div style={{ flex: 1 }}>
              <Field label={t('Имя')}>
                <TextInput value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder={t('Имя')} />
              </Field>
            </div>
            <div style={{ flex: 1 }}>
              <Field label={t('Роль')}>
                <TextInput value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))} placeholder={t('Менеджер')} />
              </Field>
            </div>
          </div>
          <div className="row" style={{ gap: 14 }}>
            <div style={{ flex: 1 }}>
              <Field label="E-mail">
                <TextInput type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} placeholder="user@elezon.ru" />
              </Field>
            </div>
            <div style={{ flex: 1 }}>
              <Field label={t('Пароль')}>
                <TextInput type="text" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} placeholder={t('Минимум 8 символов')} />
              </Field>
            </div>
          </div>
          {formErr && <span style={{ fontSize: 12.5, color: 'oklch(0.55 0.16 25)', padding: '0 20px 4px' }}>{formErr}</span>}
          <div className="row" style={{ gap: 10, padding: '8px 20px 16px' }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setOpen(false)} disabled={busy}>{t('Отмена')}</button>
            <button className="btn btn-accent btn-sm" onClick={handleAdd} disabled={busy}>
              {busy ? t('Добавление…') : t('Добавить')}
            </button>
          </div>
        </div>
      )}

      {removeId && (
        <ConfirmModal
          title={t('Удалить пользователя?')}
          body={t('Доступ к панели будет отозван немедленно.')}
          confirmLabel={t('Да, удалить')}
          onConfirm={() => handleRemove(removeId)}
          onClose={() => setRemoveId(null)}
          t={t}
        />
      )}
    </div>
  );
}

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
        <TeamCard t={t} />

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
