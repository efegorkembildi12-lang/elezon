/* ELEZON — sticky header (utility bar + main bar + mobile menu) and language toggle.
   Ported from shared.jsx; navigation/active state derived from the router. */

import { useState, type CSSProperties } from 'react';
import { useLocation } from 'react-router-dom';
import { Icon } from './Icon';
import { Logo } from './Logo';
import { SearchBox } from './SearchBox';
import { useGo } from '../lib/useGo';
import { useI18n } from '../i18n/I18nContext';
import { useRequestList } from '../store/RequestListContext';
import type { Lang } from '../types';

function iconBtn(dark: boolean): CSSProperties {
  return {
    width: 40, height: 40, borderRadius: 8,
    border: `1px solid ${dark ? 'var(--ink-line)' : 'var(--line)'}`,
    background: 'transparent', color: dark ? 'var(--t-on-dark)' : 'var(--t-strong)',
    display: 'grid', placeItems: 'center',
  };
}

function LangToggle({ lang, setLang, dark }: { lang: Lang; setLang: (l: Lang) => void; dark: boolean }) {
  const line = dark ? 'var(--ink-line)' : 'var(--line-2)';
  const btn = (code: Lang): CSSProperties => ({
    padding: '3px 9px', fontSize: 11.5, fontWeight: 700, fontFamily: 'var(--f-mono)',
    border: 'none', borderRadius: 5, cursor: 'pointer', letterSpacing: '0.04em',
    background: lang === code ? 'var(--accent)' : 'transparent',
    color: lang === code ? 'var(--accent-ink)' : dark ? 'var(--t-on-dark-muted)' : 'var(--t-muted)',
    transition: 'background .15s, color .15s',
  });
  return (
    <span className="row" style={{ gap: 2, padding: 2, border: `1px solid ${line}`, borderRadius: 7 }}>
      <button style={btn('ru')} onClick={() => setLang('ru')} aria-label="Русский">RU</button>
      <button style={btn('en')} onClick={() => setLang('en')} aria-label="English">EN</button>
    </span>
  );
}

const NAV = [
  { id: 'catalog', label: 'Каталог' },
  { id: 'company', label: 'О компании' },
  { id: 'delivery', label: 'Доставка и оплата' },
  { id: 'contacts', label: 'Контакты' },
];

function activeKey(pathname: string): string {
  if (pathname === '/') return 'home';
  if (pathname.startsWith('/catalog') || pathname.startsWith('/product')) return 'catalog';
  if (pathname.startsWith('/company')) return 'company';
  if (pathname.startsWith('/delivery')) return 'delivery';
  if (pathname.startsWith('/contacts')) return 'contacts';
  return pathname.slice(1);
}

export function Header() {
  const go = useGo();
  const { t, lang, setLang } = useI18n();
  const rl = useRequestList();
  const { pathname } = useLocation();
  const dark = pathname === '/';
  const route = activeKey(pathname);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header
      style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: dark ? 'oklch(0.17 0.012 256 / 0.82)' : 'oklch(1 0 0 / 0.82)',
        backdropFilter: 'blur(14px)',
        borderBottom: `1px solid ${dark ? 'var(--ink-line)' : 'var(--line)'}`,
      }}
    >
      {/* utility bar */}
      <div style={{ borderBottom: `1px solid ${dark ? 'var(--ink-line)' : 'var(--line)'}`, fontSize: 12.5 }}>
        <div className="wrap row" style={{ height: 38, justifyContent: 'space-between', color: dark ? 'var(--t-on-dark-muted)' : 'var(--t-muted)' }}>
          <div className="row" style={{ gap: 18 }}>
            <span className="row mono hide-sm" style={{ gap: 6 }}><Icon.pin width="13" height="13" /> {t('Москва, ул. Большая Филёвская, 4')}</span>
            <span className="row mono hide-sm" style={{ gap: 6, opacity: 0.8 }}><Icon.truck width="13" height="13" /> {t('Отгрузка со склада 24 ч')}</span>
          </div>
          <div className="row" style={{ gap: 18 }}>
            <a href="mailto:info@elezon.ru" className="mono" style={{ color: 'inherit' }}>info@elezon.ru</a>
            <span className="hide-sm">{t('Только для юридических лиц')}</span>
            <span className="hide-sm" style={{ opacity: 0.4 }}>·</span>
            <LangToggle lang={lang} setLang={setLang} dark={dark} />
          </div>
        </div>
      </div>
      {/* main bar */}
      <div className="wrap row" style={{ height: 70, gap: 28, justifyContent: 'space-between' }}>
        <div className="row" style={{ gap: 36 }}>
          <Logo dark={dark} onClick={() => go('home')} />
          <nav className="row hide-sm" style={{ gap: 4 }}>
            {NAV.map((it) => (
              <a
                key={it.id}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  go(it.id);
                }}
                className="row"
                style={{
                  gap: 5, padding: '8px 13px', borderRadius: 7, fontSize: 14.5, fontWeight: 600,
                  color: route === it.id ? 'var(--accent)' : dark ? 'var(--t-on-dark)' : 'var(--t-strong)',
                }}
              >
                {t(it.label)}
              </a>
            ))}
          </nav>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <button className="row hide-sm" onClick={() => setSearchOpen((v) => !v)} aria-label={t('Найти')} aria-expanded={searchOpen} style={iconBtn(dark)}><Icon.search width="19" height="19" /></button>
          <button className="row hide-sm" aria-label="Избранное" style={iconBtn(dark)}><Icon.heart width="19" height="19" /></button>
          <button className="row hide-sm" onClick={() => go('request')} aria-label={t('Список запроса')} style={{ ...iconBtn(dark), position: 'relative' }}>
            <Icon.list width="19" height="19" />
            {rl.count > 0 && (
              <span style={{ position: 'absolute', top: -5, right: -5, minWidth: 18, height: 18, padding: '0 4px', borderRadius: 9, background: 'var(--accent)', color: 'var(--accent-ink)', fontSize: 11, fontWeight: 700, display: 'grid', placeItems: 'center', fontFamily: 'var(--f-mono)', lineHeight: 1 }}>{rl.count}</span>
            )}
          </button>
          <a href="tel:+74951474761" className="btn btn-accent btn-sm row hide-sm" style={{ marginLeft: 6 }}>
            <Icon.phone width="16" height="16" /> +7 (495) 147-47-61
          </a>
          <button className="row show-sm" onClick={() => setSearchOpen((v) => !v)} aria-label={t('Найти')} style={iconBtn(dark)}><Icon.search width="20" height="20" /></button>
          <button className="row show-sm" onClick={() => setOpen(!open)} style={iconBtn(dark)}><Icon.menu width="22" height="22" /></button>
        </div>
      </div>
      {searchOpen && (
        <div className="wrap" style={{ paddingBottom: 16, paddingTop: 2 }}>
          <SearchBox variant="header" autoFocus onClose={() => setSearchOpen(false)} />
        </div>
      )}
      {open && (
        <div className="wrap col show-sm" style={{ paddingBottom: 16, gap: 4 }}>
          {NAV.map((it) => (
            <a
              key={it.id}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                go(it.id);
                setOpen(false);
              }}
              style={{ padding: '11px 4px', fontWeight: 600, color: dark ? 'var(--t-on-dark)' : 'var(--t-strong)', borderBottom: `1px solid ${dark ? 'var(--ink-line)' : 'var(--line)'}` }}
            >
              {t(it.label)}
            </a>
          ))}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              go('request');
              setOpen(false);
            }}
            style={{ padding: '11px 4px', fontWeight: 600, color: dark ? 'var(--t-on-dark)' : 'var(--t-strong)', borderBottom: `1px solid ${dark ? 'var(--ink-line)' : 'var(--line)'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <span className="row" style={{ gap: 8 }}><Icon.list width="17" height="17" /> {t('Список запроса')}</span>
            {rl.count > 0 && <span className="mono" style={{ background: 'var(--accent)', color: 'var(--accent-ink)', borderRadius: 9, minWidth: 20, textAlign: 'center', fontSize: 12, fontWeight: 700, padding: '1px 6px' }}>{rl.count}</span>}
          </a>
          <a href="tel:+74951474761" className="btn btn-accent" style={{ marginTop: 10, justifyContent: 'center' }}><Icon.phone width="16" height="16" /> +7 (495) 147-47-61</a>
        </div>
      )}
    </header>
  );
}
