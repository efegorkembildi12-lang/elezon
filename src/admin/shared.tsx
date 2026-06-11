/* ELEZON — Admin shared UI: icons, top bar, tables, drawer, modal, toasts, fields, badges */

import {
  createContext, useContext, useState, useEffect, useCallback,
  type ReactNode, type CSSProperties,
} from 'react';
import { createPortal } from 'react-dom';
import type { AdminStore } from './store';
import type { AdminSection, OrderStatus, SortState } from './types';
import { supabase } from '../lib/supabase';

/* ---- helpers ---- */
export function afmt(n: number | null | undefined): string | null {
  if (n == null) return null;
  return Math.round(n).toLocaleString('ru-RU');
}

export function adate(iso: string | undefined, lang: 'ru' | 'en'): string {
  if (!iso) return '—';
  const d = new Date(iso + 'T00:00:00');
  const mRu = ['янв','фев','мар','апр','мая','июн','июл','авг','сен','окт','ноя','дек'];
  const mEn = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const m = (lang === 'en' ? mEn : mRu)[d.getMonth()];
  return `${d.getDate()} ${m} ${String(d.getFullYear()).slice(2)}`;
}

/* ---- icon type ---- */
export type IC = React.SVGProps<SVGSVGElement>;
export type IconComponent = (p: IC) => JSX.Element;

/* ---- icons ---- */
export const AdmIcon = {
  dash:   (p: IC) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>,
  box:    (p: IC) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 7l9-4 9 4-9 4-9-4z"/><path d="M3 7v10l9 4 9-4V7M12 11v10"/></svg>,
  layers: (p: IC) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/></svg>,
  tag:    (p: IC) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 12V4h8l10 10-8 8L3 12z"/><circle cx="7.5" cy="7.5" r="1.4"/></svg>,
  inbox:  (p: IC) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 13h5l1.5 3h5L21 13"/><path d="M5 5h14l2 8v6H3v-6z"/></svg>,
  users:  (p: IC) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="9" cy="8" r="3.2"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M16 5a3 3 0 0 1 0 6M22 20a6 6 0 0 0-4-5.6"/></svg>,
  file:   (p: IC) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 2h8l4 4v16H6z"/><path d="M14 2v4h4M9 13h6M9 17h5"/></svg>,
  gear:   (p: IC) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/></svg>,
  bell:   (p: IC) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6z"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>,
  search: (p: IC) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...p}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/></svg>,
  plus:   (p: IC) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}><path d="M12 5v14M5 12h14"/></svg>,
  x:      (p: IC) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" {...p}><path d="M6 6l12 12M18 6 6 18"/></svg>,
  edit:   (p: IC) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 20h4L19 9l-4-4L4 16v4z"/><path d="M14 6l4 4"/></svg>,
  trash:  (p: IC) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13h10l1-13"/></svg>,
  copy:   (p: IC) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/></svg>,
  chevR:  (p: IC) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M9 6l6 6-6 6"/></svg>,
  chevD:  (p: IC) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 9l6 6 6-6"/></svg>,
  up:     (p: IC) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 19V5M6 11l6-6 6 6"/></svg>,
  down:   (p: IC) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 5v14M6 13l6 6 6-6"/></svg>,
  check:  (p: IC) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12.5 10 17 19 7"/></svg>,
  ext:    (p: IC) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>,
  logout: (p: IC) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M14 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M9 12h11M16 8l4 4-4 4"/></svg>,
  bolt:   (p: IC) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg>,
  phone:  (p: IC) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>,
  mail:   (p: IC) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>,
  truck:  (p: IC) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 6h11v9H3zM14 9h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/></svg>,
  ruble:  (p: IC) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M8 21V4h5a4.5 4.5 0 0 1 0 9H6M6 17h8"/></svg>,
  spark:  (p: IC) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 17l5-5 4 3 6-7"/><path d="M18 5h3v3"/></svg>,
  warn:   (p: IC) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3 2 20h20L12 3z"/><path d="M12 10v4M12 17h.01"/></svg>,
};

/* ---- category icon mapping ---- */
export const admCatIcon: Record<string, IconComponent> = {
  'avtomatizatsiya-zdaniy': AdmIcon.box,
  'kip': AdmIcon.spark,
  'nizkovoltnoe-oborudovanie': AdmIcon.bolt,
  'knx': AdmIcon.layers,
};

/* ---- status meta ---- */
export const ORDER_STATUS: Record<string, { st: string; label: string }> = {
  new:  { st: 'new',  label: 'Новая' },
  work: { st: 'work', label: 'В работе' },
  ship: { st: 'ship', label: 'Отгружена' },
  done: { st: 'done', label: 'Закрыта' },
  lost: { st: 'lost', label: 'Отменена' },
};
export const ORDER_FLOW: OrderStatus[] = ['new', 'work', 'ship', 'done'];
export const CHANNEL: Record<string, string> = { form: 'Форма сайта', email: 'Почта', phone: 'Телефон' };
export const CHANNEL_ICON: Record<string, IconComponent> = {
  form: AdmIcon.file, email: AdmIcon.mail, phone: AdmIcon.phone,
};
export const CUST_STATUS: Record<string, { st: string; label: string }> = {
  active:   { st: 'ship', label: 'Активный' },
  lead:     { st: 'work', label: 'Лид' },
  inactive: { st: 'done', label: 'Неактивный' },
};

/* ---- badges ---- */
interface BadgeProps { status: string; t: (s: string) => string; }

export function StatusBadge({ status, t }: BadgeProps) {
  const m = ORDER_STATUS[status] ?? ORDER_STATUS['new'];
  return <span className="adm-badge" data-st={m.st}><span className="dot" />{t(m.label)}</span>;
}

export function CustomerBadge({ status, t }: BadgeProps) {
  const m = CUST_STATUS[status] ?? CUST_STATUS['lead'];
  return <span className="adm-badge" data-st={m.st}><span className="dot" />{t(m.label)}</span>;
}

export function StockBadge({ stock, t }: { stock: string; t: (s: string) => string }) {
  return (
    <span className="adm-badge" data-st={stock === 'in' ? 'ship' : 'work'}>
      <span className="dot" />{stock === 'in' ? t('в наличии') : t('под заказ')}
    </span>
  );
}

/* ---- toasts ---- */
export const AdmToastContext = createContext<(msg: string, icon?: IconComponent) => void>(() => {});
export function useToast() { return useContext(AdmToastContext); }

interface Toast { id: string; msg: string; icon?: IconComponent; }

export function ToastHost({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((msg: string, icon?: IconComponent) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, msg, icon }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }, []);
  return (
    <AdmToastContext.Provider value={push}>
      {children}
      <div className="adm-toasts">
        {toasts.map((t) => {
          const I = t.icon ?? AdmIcon.check;
          return (
            <div key={t.id} className="adm-toast">
              <span className="adm-toast-ic"><I width={16} height={16} /></span>
              {t.msg}
            </div>
          );
        })}
      </div>
    </AdmToastContext.Provider>
  );
}

/* ---- Drawer ---- */
interface DrawerProps {
  title: string;
  eyebrow?: string;
  onClose: () => void;
  footer?: ReactNode;
  children: ReactNode;
  width?: number;
}

export function Drawer({ title, eyebrow, onClose, footer, children, width }: DrawerProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return createPortal(
    <>
      <div className="adm-overlay" onClick={onClose} />
      <div className="adm-drawer" style={width ? { width } : undefined} role="dialog" aria-modal="true">
        <div className="adm-drawer-head">
          <div>
            {eyebrow && <div className="adm-drawer-eyebrow">{eyebrow}</div>}
            <div className="adm-drawer-title">{title}</div>
          </div>
          <button className="adm-close" onClick={onClose} aria-label="Close">
            <AdmIcon.x width={18} height={18} />
          </button>
        </div>
        <div className="adm-drawer-body">{children}</div>
        {footer && <div className="adm-drawer-foot">{footer}</div>}
      </div>
    </>,
    document.body,
  );
}

/* ---- ConfirmModal ---- */
interface ConfirmModalProps {
  title: string;
  body: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
  t: (s: string) => string;
}

export function ConfirmModal({ title, body, confirmLabel, onConfirm, onClose, t }: ConfirmModalProps) {
  return createPortal(
    <>
      <div className="adm-overlay" onClick={onClose} />
      <div className="adm-modal" role="dialog" aria-modal="true">
        <div className="col" style={{ gap: 14 }}>
          <span style={{ width: 46, height: 46, borderRadius: 12, background: 'oklch(0.96 0.04 25)', color: 'oklch(0.55 0.18 25)', display: 'grid', placeItems: 'center' }}>
            <AdmIcon.warn width={24} height={24} />
          </span>
          <h3 style={{ fontSize: 20, color: 'var(--t-strong)' }}>{title}</h3>
          <p style={{ margin: 0, fontSize: 14.5, color: 'var(--t-muted)', lineHeight: 1.55 }}>{body}</p>
          <div className="row" style={{ gap: 12, marginTop: 8 }}>
            <button className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={onClose}>{t('Отмена')}</button>
            <button className="btn" style={{ flex: 1, justifyContent: 'center', background: 'oklch(0.55 0.18 25)', color: '#fff' }} onClick={() => { onConfirm(); onClose(); }}>
              {confirmLabel ?? t('Да, удалить')}
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}

/* ---- form fields ---- */
interface FieldProps { label?: string; req?: boolean; span2?: boolean; children: ReactNode; }
export function Field({ label, req, span2, children }: FieldProps) {
  return (
    <div className={'adm-fld' + (span2 ? ' span2' : '')}>
      {label && <label className="adm-fld-label">{label} {req && <span className="req">*</span>}</label>}
      {children}
    </div>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className="field" {...props} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className="field" style={{ resize: 'vertical', minHeight: 80, ...props.style }} {...props} />;
}

interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> { children: ReactNode; }
export function SelectInput({ children, style, ...rest }: SelectInputProps) {
  const selectStyle: CSSProperties = {
    appearance: 'none',
    backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path fill='%238a90a0' d='M0 0h12L6 8z'/></svg>\")",
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 14px center',
    paddingRight: 36,
    ...style,
  };
  return <select className="field" style={selectStyle} {...rest}>{children}</select>;
}

interface ToggleProps { value: boolean; onChange: (v: boolean) => void; }
export function Toggle({ value, onChange }: ToggleProps) {
  return (
    <button type="button" onClick={() => onChange(!value)} aria-checked={value} role="switch"
      style={{ position: 'relative', width: 42, height: 24, borderRadius: 999, border: 'none', cursor: 'pointer', flex: '0 0 auto', background: value ? 'var(--accent)' : 'var(--line-2)', transition: 'background .16s' }}>
      <span style={{ position: 'absolute', top: 3, left: value ? 21 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,.25)', transition: 'left .16s' }} />
    </button>
  );
}

/* ---- PageHead ---- */
interface PageHeadProps { title: string; sub?: string; crumb?: ReactNode; actions?: ReactNode; }
export function PageHead({ title, sub, crumb, actions }: PageHeadProps) {
  return (
    <div className="adm-page-head">
      <div>
        {crumb && <div className="adm-crumb">{crumb}</div>}
        <h1 className="adm-page-title">{title}</h1>
        {sub && <div className="adm-page-sub">{sub}</div>}
      </div>
      {actions && <div className="row" style={{ gap: 10 }}>{actions}</div>}
    </div>
  );
}

/* ---- EmptyState ---- */
interface EmptyStateProps { icon?: IconComponent; title: string; body?: string; action?: ReactNode; }
export function EmptyState({ icon, title, body, action }: EmptyStateProps) {
  const I = icon ?? AdmIcon.search;
  return (
    <div className="adm-empty">
      <span className="adm-empty-ic"><I width={28} height={28} /></span>
      <h3 style={{ fontSize: 19, color: 'var(--t-strong)' }}>{title}</h3>
      {body && <p style={{ margin: 0, fontSize: 14.5, color: 'var(--t-muted)', maxWidth: 360, lineHeight: 1.55 }}>{body}</p>}
      {action}
    </div>
  );
}

export function Toolbar({ children }: { children: ReactNode }) {
  return <div className="adm-toolbar">{children}</div>;
}

interface SearchBoxProps { value: string; onChange: (v: string) => void; placeholder?: string; }
export function SearchBox({ value, onChange, placeholder }: SearchBoxProps) {
  return (
    <div className="adm-search">
      <AdmIcon.search width={17} height={17} />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder ?? 'Поиск…'} />
    </div>
  );
}

/* ---- sortable th ---- */
interface ThProps {
  label: string;
  col?: string;
  sort?: SortState;
  setSort?: React.Dispatch<React.SetStateAction<SortState>>;
  align?: 'right' | 'left' | 'center';
  className?: string;
}
export function Th({ label, col, sort, setSort, align, className }: ThProps) {
  const active = !!(sort && col && sort.col === col);
  return (
    <th className={(setSort && col ? 'sortable ' : '') + (className ?? '')}
      style={align ? { textAlign: align } : undefined}
      onClick={setSort && col ? () => setSort((s) => ({ col: col, dir: s.col === col && s.dir === 'asc' ? 'desc' : 'asc' })) : undefined}>
      {label}
      {setSort && col && (
        <span className="th-arrow" style={{ transform: active && sort?.dir === 'desc' ? 'rotate(180deg)' : 'none', opacity: active ? 1 : .35 }}>
          {active ? '▲' : '↕'}
        </span>
      )}
    </th>
  );
}

export function sortRows<T extends object>(rows: T[], sort: SortState, accessors: Record<string, (r: T) => number | string | null | undefined>): T[] {
  if (!sort.col) return rows;
  const acc = accessors[sort.col] ?? ((r: T) => (r as Record<string, unknown>)[sort.col] as string | number | null | undefined);
  const dir = sort.dir === 'desc' ? -1 : 1;
  return [...rows].sort((a, b) => {
    const rawA = acc(a);
    const rawB = acc(b);
    const va: number | string = rawA == null ? -Infinity : rawA;
    const vb: number | string = rawB == null ? -Infinity : rawB;
    if (typeof va === 'string' && typeof vb === 'string') return va.localeCompare(vb, 'ru') * dir;
    return ((va as number) - (vb as number)) * dir;
  });
}

/* ---- nav definition ---- */
interface NavItem { id: AdminSection; label: string; icon: IconComponent; }
export const ADM_NAV: NavItem[] = [
  { id: 'dashboard',  label: 'Дашборд',   icon: AdmIcon.dash },
  { id: 'products',   label: 'Товары',    icon: AdmIcon.box },
  { id: 'categories', label: 'Категории', icon: AdmIcon.layers },
  { id: 'brands',     label: 'Бренды',    icon: AdmIcon.tag },
  { id: 'requests',   label: 'Заявки',    icon: AdmIcon.inbox },
  { id: 'customers',  label: 'Клиенты',   icon: AdmIcon.users },
  { id: 'leads',      label: 'Подписки',  icon: AdmIcon.bell },
  { id: 'content',    label: 'Контент',   icon: AdmIcon.file },
];

/* ---- TopBar ---- */
interface TopBarProps {
  route: AdminSection;
  go: (r: AdminSection, a?: string | null) => void;
  lang: 'ru' | 'en';
  setLang: (l: 'ru' | 'en') => void;
  store: AdminStore;
  t: (s: string) => string;
}

export function TopBar({ route, go, lang, setLang, store, t }: TopBarProps) {
  const [menu, setMenu] = useState<'user' | 'bell' | null>(null);
  const newCount = store.orders.filter((o) => o.status === 'new').length;
  const popStyle: CSSProperties = { position: 'relative' };

  useEffect(() => {
    const close = () => setMenu(null);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, []);

  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <header className="adm-top">
      <div className="adm-top-row">
        <a className="adm-brand" href={import.meta.env.BASE_URL} title={t('Вернуться на сайт')}>
          <span className="adm-brand-badge"><AdmIcon.bolt width={18} height={18} /></span>
          <span className="col">
            <span className="adm-brand-name">ELEZON</span>
            <span className="adm-brand-tag">{t('Панель управления')}</span>
          </span>
        </a>

        <nav className="adm-nav">
          {ADM_NAV.map((it) => {
            const I = it.icon;
            const isReq = it.id === 'requests';
            return (
              <button key={it.id} className={'adm-nav-item' + (route === it.id ? ' active' : '')} onClick={() => go(it.id)} title={t(it.label)}>
                <I width={17} height={17} />
                <span className="adm-nav-label">{t(it.label)}</span>
                {isReq && newCount > 0 && <span className="adm-nav-count">{newCount}</span>}
              </button>
            );
          })}
        </nav>

        <div className="adm-top-actions">
          <span className="adm-lang">
            <button className={lang === 'ru' ? 'on' : ''} onClick={() => setLang('ru')}>RU</button>
            <button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>EN</button>
          </span>

          <div style={popStyle} onClick={stop}>
            <button className="adm-ic-btn" onClick={() => setMenu(menu === 'bell' ? null : 'bell')} aria-label={t('Уведомления')}>
              <AdmIcon.bell width={19} height={19} />
              {newCount > 0 && <span className="adm-ic-dot" />}
            </button>
            {menu === 'bell' && (
              <div className="adm-pop" style={{ minWidth: 300 }}>
                <div style={{ padding: '13px 15px', borderBottom: '1px solid var(--line)', fontWeight: 700, color: 'var(--t-strong)', fontSize: 14 }}>{t('Уведомления')}</div>
                {store.orders.filter((o) => o.status === 'new').slice(0, 4).map((o) => (
                  <button key={o.id} className="adm-pop-item" onClick={() => { go('requests'); setMenu(null); }}
                    style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 3 }}>
                    <span style={{ fontSize: 13.5 }}>{t('Новая')} · {o.num}</span>
                    <span style={{ fontWeight: 500, fontSize: 12.5, color: 'var(--t-muted)' }}>{o.company}</span>
                  </button>
                ))}
                {newCount === 0 && <div style={{ padding: '18px 15px', color: 'var(--t-muted)', fontSize: 13.5 }}>{t('Ничего не найдено')}</div>}
              </div>
            )}
          </div>

          <button className="adm-ic-btn" onClick={() => go('settings')} aria-label={t('Настройки')} title={t('Настройки')}>
            <AdmIcon.gear width={19} height={19} />
          </button>

          <div style={popStyle} onClick={stop}>
            <button className="adm-user" onClick={() => setMenu(menu === 'user' ? null : 'user')}>
              <span className="adm-avatar">АК</span>
              <span className="adm-user-meta">
                <span className="adm-user-name">{t('Антон Кречет')}</span>
                <span className="adm-user-role">{t('Владелец')}</span>
              </span>
              <AdmIcon.chevD width={15} height={15} style={{ color: 'var(--t-on-dark-muted)' }} />
            </button>
            {menu === 'user' && (
              <div className="adm-pop">
                <button className="adm-pop-item" onClick={() => { go('settings'); setMenu(null); }}>
                  <AdmIcon.gear width={17} height={17} />{t('Настройки')}
                </button>
                <a className="adm-pop-item" href={import.meta.env.BASE_URL}>
                  <AdmIcon.ext width={17} height={17} />{t('Открыть сайт')}
                </a>
                <button className="adm-pop-item danger" onClick={() => { supabase?.auth.signOut(); }}>
                  <AdmIcon.logout width={17} height={17} />{t('Выйти')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
