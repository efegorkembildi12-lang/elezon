/* ELEZON — Delivery & payment page. Ported from pages.jsx. */

import { Icon } from '../components/Icon';
import { PageHero } from '../components/PageHero';
import { QuoteCTA } from '../components/QuoteCTA';
import { useI18n } from '../i18n/I18nContext';

export function Delivery() {
  const { t } = useI18n();
  const steps = [
    { n: '01', t: 'Запрос', d: 'Вы отправляете спецификацию или артикулы через форму, почту или по телефону.' },
    { n: '02', t: 'Расчёт', d: 'Подбираем позиции и аналоги, проверяем наличие, готовим коммерческое предложение.' },
    { n: '03', t: 'Договор', d: 'Заключаем договор, выставляем счёт. Возможна отсрочка платежа для юр. лиц.' },
    { n: '04', t: 'Отгрузка', d: 'Отгрузка со склада в Москве за 24 ч. Доставка по РФ или самовывоз.' },
  ];
  return (
    <div className="rise">
      <PageHero
        eyebrow="Доставка и оплата"
        title="Прозрачные условия для юридических лиц"
        sub="Работаем по договору с полным пакетом документов. Отгрузка со склада в Москве в течение суток."
      />
      <section className="section">
        <div className="wrap">
          <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18, marginBottom: 64 }}>
            {steps.map((s) => (
              <div key={s.n} className="card col" style={{ padding: 26, gap: 12 }}>
                <span className="display" style={{ fontSize: 30, color: 'var(--accent-press)' }}>{s.n}</span>
                <span style={{ fontWeight: 700, fontSize: 17, color: 'var(--t-strong)' }}>{t(s.t)}</span>
                <span style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--t-muted)' }}>{t(s.d)}</span>
              </div>
            ))}
          </div>
          <div className="pay-split" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div className="card col" style={{ padding: 30, gap: 16 }}>
              <span style={{ width: 46, height: 46, borderRadius: 11, background: 'var(--accent-soft)', color: 'var(--accent-press)', display: 'grid', placeItems: 'center' }}><Icon.truck width="23" height="23" /></span>
              <h3 style={{ fontSize: 22 }}>{t('Доставка')}</h3>
              <div className="col" style={{ gap: 10 }}>
                {['Самовывоз со склада — Москва, Большая Филёвская, 4', 'Доставка по Москве и области', 'Отправка ТК по всей России', 'Отгрузка в течение 24 часов'].map((x) => (
                  <span key={x} className="row" style={{ gap: 10, fontSize: 14.5, color: 'var(--t-body)' }}><Icon.check width="17" height="17" style={{ color: 'var(--accent-press)' }} /> {t(x)}</span>
                ))}
              </div>
            </div>
            <div className="card col" style={{ padding: 30, gap: 16 }}>
              <span style={{ width: 46, height: 46, borderRadius: 11, background: 'var(--accent-soft)', color: 'var(--accent-press)', display: 'grid', placeItems: 'center' }}><Icon.doc width="23" height="23" /></span>
              <h3 style={{ fontSize: 22 }}>{t('Оплата')}</h3>
              <div className="col" style={{ gap: 10 }}>
                {['Безналичный расчёт по счёту', 'Работа по договору поставки', 'Отсрочка платежа по согласованию', 'Полный пакет закрывающих документов'].map((x) => (
                  <span key={x} className="row" style={{ gap: 10, fontSize: 14.5, color: 'var(--t-body)' }}><Icon.check width="17" height="17" style={{ color: 'var(--accent-press)' }} /> {t(x)}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <QuoteCTA />
    </div>
  );
}
