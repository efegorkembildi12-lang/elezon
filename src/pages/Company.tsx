/* ELEZON — Company / About page. Ported from pages.jsx. */

import { Icon } from '../components/Icon';
import { PageHero } from '../components/PageHero';
import { QuoteCTA } from '../components/QuoteCTA';
import { useI18n } from '../i18n/I18nContext';
import { useSiteStats } from '../lib/useSiteStats';
import { ELEZON_DATA } from '../data/catalog';

export function Company() {
  const { t } = useI18n();
  const D = ELEZON_DATA;
  const stats = useSiteStats();
  const values = [
    { I: Icon.shield, t: 'Только оригинал', d: 'Поставляем оборудование официальных производителей с гарантией и документами.' },
    { I: Icon.gauge, t: 'Инженерный подход', d: '14 лет в проектировании и монтаже инженерных систем — понимаем задачу заказчика.' },
    { I: Icon.truck, t: 'Склад в Москве', d: 'Держим востребованные позиции в наличии и отгружаем в течение суток.' },
    { I: Icon.doc, t: 'Прозрачно для юр. лиц', d: 'Работаем по договору, счёт и закрывающие документы, отсрочка платежа.' },
  ];
  return (
    <div className="rise">
      <PageHero
        eyebrow="О компании"
        title="Инженерная поставка электротехнического оборудования"
        sub="ELEZON — поставщик оборудования для автоматизации зданий, КИП, низковольтных систем и KNX. Мы соединяем инженерную экспертизу с надёжной логистикой."
      />

      <section className="section">
        <div className="wrap">
          <div className="about-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 0, border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', overflow: 'hidden', background: 'var(--surface)', marginBottom: 64 }}>
            {stats.map((s, i) => (
              <div key={i} className="col" style={{ gap: 6, padding: '32px 26px', borderRight: i < 3 ? '1px solid var(--line)' : 'none' }}>
                <span className="display" style={{ fontSize: 38, color: 'var(--accent-press)' }}>{t(s.v)}</span>
                <span className="mono" style={{ fontSize: 12.5, color: 'var(--t-muted)' }}>{t(s.l)}</span>
              </div>
            ))}
          </div>

          <div className="company-split" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center', marginBottom: 80 }}>
            <div className="col" style={{ gap: 18 }}>
              <span className="eyebrow">{t('Чем мы занимаемся')}</span>
              <h2 className="display" style={{ fontSize: 36 }}>{t('Поставка, подбор и сопровождение')}</h2>
              <p style={{ margin: 0, fontSize: 16, lineHeight: 1.7, color: 'var(--t-body)' }}>{t('Мы помогаем проектным организациям, монтажным компаниям и интеграторам быстро находить нужное оборудование. Подбираем аналоги, консультируем по совместимости и комплектуем объекты — от единичных позиций до проектных объёмов.')}</p>
              <div className="col" style={{ gap: 10, marginTop: 6 }}>
                {['Автоматизация зданий и диспетчеризация', 'Контрольно-измерительные приборы (КИП)', 'Низковольтное оборудование и щиты', 'Системы KNX «под ключ»'].map((x) => (
                  <span key={x} className="row" style={{ gap: 10, fontSize: 15, color: 'var(--t-body)' }}><Icon.check width="18" height="18" style={{ color: 'var(--accent-press)' }} /> {t(x)}</span>
                ))}
              </div>
            </div>
            <div style={{ width: '100%', aspectRatio: '4 / 3', borderRadius: 'var(--r-lg)', overflow: 'hidden', border: '1px solid var(--line)' }}>
              <img src="/images/warehouse.png" alt={t('фото склада / команды')} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
          </div>

          <span className="eyebrow">{t('Принципы')}</span>
          <div className="values-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18, marginTop: 20 }}>
            {values.map((v, i) => (
              <div key={i} className="card col" style={{ padding: 24, gap: 14 }}>
                <span style={{ width: 46, height: 46, borderRadius: 11, background: 'var(--accent-soft)', color: 'var(--accent-press)', display: 'grid', placeItems: 'center' }}><v.I width="23" height="23" /></span>
                <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--t-strong)' }}>{t(v.t)}</span>
                <span style={{ fontSize: 13.5, lineHeight: 1.55, color: 'var(--t-muted)' }}>{t(v.d)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* brands */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-head"><div className="col" style={{ gap: 12 }}><span className="eyebrow">{t('Производители')}</span><h2 className="display" style={{ fontSize: 34 }}>{t('Работаем с оригинальными брендами')}</h2></div></div>
          <div className="brand-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 14 }}>
            {D.brands.map((b) => (
              <div key={b} className="card row" style={{ height: 88, justifyContent: 'center', padding: '0 18px', overflow: 'hidden' }}>
                <img src={`/images/brand-${b.toLowerCase().replace(/\s+/g, '-')}.png`} alt={b} style={{ maxWidth: '100%', maxHeight: 52, objectFit: 'contain', display: 'block' }} />
              </div>
            ))}
          </div>
        </div>
      </section>
      <QuoteCTA />
    </div>
  );
}
