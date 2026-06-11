/* ELEZON — footer. Ported from shared.jsx. */

import { Icon } from './Icon';
import { Logo } from './Logo';
import { useGo } from '../lib/useGo';
import { useI18n } from '../i18n/I18nContext';
import { useCatalog } from '../store/CatalogProvider';

export function Footer() {
  const go = useGo();
  const { t } = useI18n();
  const { categories } = useCatalog();

  const companyLinks: [string, string][] = [
    ['company', 'О компании'],
    ['delivery', 'Доставка и оплата'],
    ['contacts', 'Контакты'],
    ['company', 'Производители'],
  ];

  return (
    <footer style={{ background: 'var(--ink)', color: 'var(--t-on-dark-muted)', marginTop: 'auto' }}>
      <div className="wrap" style={{ padding: '64px 32px 36px' }}>
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1.3fr', gap: 40 }}>
          <div className="col" style={{ gap: 18, maxWidth: 320 }}>
            <Logo dark />
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6 }}>{t('Поставка оригинального оборудования для автоматизации зданий, КИП, НВО и систем KNX. Работаем с юридическими лицами.')}</p>
            <a href="tel:+74951474761" className="btn btn-ghost on-dark btn-sm" style={{ alignSelf: 'flex-start' }}><Icon.phone width="15" height="15" /> +7 (495) 147-47-61</a>
          </div>
          <div className="col" style={{ gap: 12 }}>
            <span className="eyebrow on-dark" style={{ marginBottom: 4 }}>{t('Каталог')}</span>
            {categories.map((c) => (
              <a key={c.id} href="#" onClick={(e) => { e.preventDefault(); go('category', c); }} style={{ fontSize: 14, color: 'var(--t-on-dark-muted)' }}>{t(c.name)}</a>
            ))}
          </div>
          <div className="col" style={{ gap: 12 }}>
            <span className="eyebrow on-dark" style={{ marginBottom: 4 }}>{t('Компания')}</span>
            {companyLinks.map(([id, l], i) => (
              <a key={i} href="#" onClick={(e) => { e.preventDefault(); go(id); }} style={{ fontSize: 14, color: 'var(--t-on-dark-muted)' }}>{t(l)}</a>
            ))}
          </div>
          <div className="col" style={{ gap: 14 }}>
            <span className="eyebrow on-dark" style={{ marginBottom: 4 }}>{t('Контакты')}</span>
            <span className="row" style={{ gap: 9, fontSize: 14 }}><Icon.pin width="16" height="16" style={{ color: 'var(--accent)' }} /> {t('121087, Москва,')}<br />{t('ул. Большая Филёвская, 4')}</span>
            <a href="mailto:info@elezon.ru" className="row" style={{ gap: 9, fontSize: 14, color: 'var(--t-on-dark-muted)' }}><Icon.mail width="16" height="16" style={{ color: 'var(--accent)' }} /> info@elezon.ru</a>
          </div>
        </div>
        <hr className="divider on-dark" style={{ margin: '40px 0 22px' }} />
        <div className="row foot-bottom" style={{ justifyContent: 'space-between', fontSize: 12.5, gap: 16 }}>
          <span className="mono">{t('© 2026 ELEZON · Все права защищены')}</span>
          <span className="row" style={{ gap: 18 }}>
            <a href="#" onClick={(e) => { e.preventDefault(); go('privacy'); }} style={{ color: 'inherit' }}>{t('Политика конфиденциальности')}</a>
            <a href="#" style={{ color: 'inherit' }}>{t('Публичная оферта')}</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
