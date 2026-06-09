/* ELEZON — dark "request a quote" CTA band. Ported from home.jsx. Shared by Home/Company/Delivery. */

import { Icon } from './Icon';
import { useGo } from '../lib/useGo';
import { useI18n } from '../i18n/I18nContext';

export function QuoteCTA() {
  const go = useGo();
  const { t } = useI18n();
  return (
    <section className="section">
      <div className="wrap">
        <div className="cta-band" style={{ position: 'relative', overflow: 'hidden', background: 'var(--ink)', borderRadius: 'var(--r-lg)', padding: '60px 56px', display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 40, alignItems: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(115deg, var(--ink-2) 0 1px, transparent 1px 26px)', opacity: 0.5 }} />
          <div className="col" style={{ gap: 18, position: 'relative' }}>
            <span className="eyebrow on-dark">{t('Запрос цены')}</span>
            <h2 className="display" style={{ fontSize: 40, color: 'var(--t-on-dark)' }}>{t('Не нашли позицию или нужен объём?')}</h2>
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: 'var(--t-on-dark-muted)', maxWidth: 460 }}>{t('Отправьте спецификацию — подберём оборудование, аналоги и сроки поставки, рассчитаем цену для вашего проекта.')}</p>
          </div>
          <div className="col" style={{ gap: 12, position: 'relative' }}>
            <button onClick={() => go('contacts')} className="btn btn-accent btn-lg" style={{ justifyContent: 'center' }}>{t('Отправить спецификацию')} <Icon.arrow width="18" height="18" /></button>
            <a href="tel:+74951474761" className="btn btn-ghost on-dark btn-lg" style={{ justifyContent: 'center' }}><Icon.phone width="17" height="17" /> {t('Заказать звонок')}</a>
          </div>
        </div>
      </div>
    </section>
  );
}
