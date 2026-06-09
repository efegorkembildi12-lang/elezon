/* ELEZON — search input with live autocomplete. Used in the hero (variant="hero")
   and the header (variant="header"). Enter → /catalog?q=…; picking a suggestion
   navigates straight to the product or category. */

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from './Icon';
import { useGo } from '../lib/useGo';
import { useI18n } from '../i18n/I18nContext';
import { useDebounce } from '../lib/useDebounce';
import { searchSuggestions } from '../lib/search';

interface SearchBoxProps {
  variant: 'hero' | 'header';
  autoFocus?: boolean;
  onClose?: () => void;
}

const dropdownStyle: CSSProperties = {
  position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, zIndex: 60,
  background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-md)',
  boxShadow: 'var(--sh-lg)', overflow: 'hidden', maxHeight: 420, overflowY: 'auto',
};

const groupLabelStyle: CSSProperties = {
  padding: '9px 14px 5px', fontFamily: 'var(--f-mono)', fontSize: 10.5,
  letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--t-faint)',
};

export function SearchBox({ variant, autoFocus, onClose }: SearchBoxProps) {
  const go = useGo();
  const navigate = useNavigate();
  const { t } = useI18n();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const debounced = useDebounce(query, 140);
  const rootRef = useRef<HTMLDivElement>(null);

  const { products, categories } = searchSuggestions(debounced, t, 6);
  const flatLen = categories.length + products.length;
  const hasResults = flatLen > 0;
  const showPanel = open && debounced.trim().length > 0;

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener('mousedown', onDoc);
    return () => window.removeEventListener('mousedown', onDoc);
  }, []);

  useEffect(() => { setActive(-1); }, [debounced]);

  const submit = (q: string) => {
    const term = q.trim();
    if (!term) return;
    setOpen(false);
    navigate('/catalog?q=' + encodeURIComponent(term));
    onClose?.();
  };

  const choose = (i: number) => {
    if (i < 0 || i >= flatLen) return submit(query);
    setOpen(false);
    if (i < categories.length) go('category', categories[i]);
    else go('product', products[i - categories.length]);
    onClose?.();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setActive((a) => Math.min(a + 1, flatLen - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, -1)); }
    else if (e.key === 'Enter') { e.preventDefault(); if (active >= 0) choose(active); else submit(query); }
    else if (e.key === 'Escape') { setOpen(false); onClose?.(); }
  };

  const isHero = variant === 'hero';
  const wrapStyle: CSSProperties = isHero
    ? { background: 'var(--surface)', borderRadius: 'var(--r-md)', padding: 7, gap: 7, boxShadow: 'var(--sh-lg)' }
    : { background: 'var(--surface)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-sm)', padding: '4px 6px', gap: 7 };

  const renderOption = (i: number, content: JSX.Element, key: string, onPick: () => void) => (
    <button
      key={key}
      type="button"
      role="option"
      aria-selected={active === i}
      onMouseEnter={() => setActive(i)}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onPick}
      style={{
        display: 'flex', width: '100%', textAlign: 'left', alignItems: 'center', gap: 12,
        padding: '10px 14px', border: 'none', cursor: 'pointer',
        background: active === i ? 'var(--surface-2)' : 'transparent',
      }}
    >
      {content}
    </button>
  );

  return (
    <div ref={rootRef} style={{ position: 'relative' }}>
      <div className="row" style={wrapStyle}>
        <span className="row" style={{ paddingLeft: isHero ? 12 : 6, color: 'var(--t-faint)' }}>
          <Icon.search width={isHero ? 20 : 18} height={isHero ? 20 : 18} />
        </span>
        <input
          className="field"
          autoFocus={autoFocus}
          value={query}
          placeholder={t('Артикул, модель или наименование…')}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => { if (query.trim()) setOpen(true); }}
          onKeyDown={onKeyDown}
          role="combobox"
          aria-expanded={showPanel}
          aria-autocomplete="list"
          style={{ border: 'none', boxShadow: 'none', flex: 1, padding: isHero ? undefined : '9px 4px' }}
        />
        {isHero && <button className="btn btn-accent" onClick={() => submit(query)}>{t('Найти')}</button>}
      </div>

      {showPanel && (
        <div style={dropdownStyle} role="listbox">
          {!hasResults && (
            <div style={{ padding: '16px 14px', fontSize: 13.5, color: 'var(--t-muted)' }}>
              {t('Ничего не нашлось по запросу')}
            </div>
          )}

          {categories.length > 0 && <div style={groupLabelStyle}>{t('Категории')}</div>}
          {categories.map((c, ci) =>
            renderOption(
              ci,
              <>
                <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600, color: 'var(--t-strong)' }}>{t(c.name)}</span>
                <span className="chip">{c.count}</span>
              </>,
              'cat-' + c.id,
              () => choose(ci),
            ),
          )}

          {products.length > 0 && <div style={groupLabelStyle}>{t('Товары')}</div>}
          {products.map((p, pi) => {
            const i = categories.length + pi;
            return renderOption(
              i,
              <>
                <span className="mono" style={{ fontSize: 11, color: 'var(--t-faint)', minWidth: 92 }}>{p.brand}</span>
                <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600, color: 'var(--t-strong)' }}>{t(p.name)}</span>
                <span className="mono" style={{ fontSize: 11, color: 'var(--t-faint)' }}>{p.article}</span>
              </>,
              'prod-' + p.id,
              () => choose(i),
            );
          })}
        </div>
      )}
    </div>
  );
}
