/* ELEZON — footer. Real <Link> hrefs (crawlable). NAP from the single COMPANY source. */

import { Link } from 'react-router-dom';
import { Icon } from './Icon';
import { Logo } from './Logo';
import { routePath } from '../lib/useGo';
import { useI18n } from '../i18n/I18nContext';
import { useCatalog } from '../store/CatalogProvider';
import { COMPANY } from '../data/company';

export function Footer() {
  const { t } = useI18n();
  const { categories } = useCatalog();

  const companyLinks: [string, string][] = [
    ['company', 'О компании'],
    ['delivery', 'Доставка и оплата'],
    ['contacts', 'Контакты'],
    ['faq', 'Вопросы и ответы'],
  ];

  return (
    <footer style={{ background: 'var(--ink)', color: 'var(--t-on-dark-muted)', marginTop: 'auto' }}>
      <div className="wrap" style={{ padding: '64px 32px 36px' }}>
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1.3fr', gap: 40 }}>
          <div className="col" style={{ gap: 18, maxWidth: 320 }}>
            <Logo dark />
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6 }}>{t('Поставка оригинального оборудования для автоматизации зданий, КИП, НВО и систем KNX. Работаем с юридическими лицами.')}</p>
            <a href={COMPANY.phoneHref} className="btn btn-ghost on-dark btn-sm" style={{ alignSelf: 'flex-start' }}><Icon.phone width="15" height="15" /> {COMPANY.phone}</a>
          </div>
          <div className="col" style={{ gap: 12 }}>
            <span className="eyebrow on-dark" style={{ marginBottom: 4 }}>{t('Каталог')}</span>
            {categories.map((c) => (
              <Link key={c.id} to={routePath('category', c)} style={{ fontSize: 14, color: 'var(--t-on-dark-muted)' }}>{t(c.name)}</Link>
            ))}
          </div>
          <div className="col" style={{ gap: 12 }}>
            <span className="eyebrow on-dark" style={{ marginBottom: 4 }}>{t('Компания')}</span>
            {companyLinks.map(([id, l]) => (
              <Link key={id} to={routePath(id)} style={{ fontSize: 14, color: 'var(--t-on-dark-muted)' }}>{t(l)}</Link>
            ))}
          </div>
          <div className="col" style={{ gap: 14 }}>
            <span className="eyebrow on-dark" style={{ marginBottom: 4 }}>{t('Контакты')}</span>
            <span className="row" style={{ gap: 9, fontSize: 14 }}><Icon.pin width="16" height="16" style={{ color: 'var(--accent)' }} /> {t('121087, Москва,')}<br />{t('ул. Большая Филёвская, 4')}</span>
            <a href={`mailto:${COMPANY.email}`} className="row" style={{ gap: 9, fontSize: 14, color: 'var(--t-on-dark-muted)' }}><Icon.mail width="16" height="16" style={{ color: 'var(--accent)' }} /> {COMPANY.email}</a>
          </div>
        </div>
        <hr className="divider on-dark" style={{ margin: '40px 0 22px' }} />
        <div className="row foot-bottom" style={{ justifyContent: 'space-between', fontSize: 12.5, gap: 16 }}>
          <span className="mono">{t('© 2026 ELEZON · Все права защищены')}</span>
          <span className="row" style={{ gap: 18 }}>
            <Link to={routePath('privacy')} style={{ color: 'inherit' }}>{t('Политика конфиденциальности')}</Link>
            <Link to={routePath('terms')} style={{ color: 'inherit' }}>{t('Пользовательское соглашение')}</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
