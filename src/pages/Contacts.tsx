/* ELEZON — Contacts page with quote form. Ported from pages.jsx. */

import { useState } from 'react';
import { Icon, type IconComponent } from '../components/Icon';
import { PageHero } from '../components/PageHero';
import { useI18n } from '../i18n/I18nContext';
import { useCatalog } from '../store/CatalogProvider';
import { Seo } from '../components/Seo';
import { PageState } from '../lib/ssg/pageState';
import { localBusinessSchema } from '../lib/seo/schema';

interface ContactItem {
  I: IconComponent;
  t: string;
  v: string;
  h?: string;
}

export function Contacts() {
  const { t } = useI18n();
  const { categories, brands, stats } = useCatalog();
  const [sent, setSent] = useState(false);

  const items: ContactItem[] = [
    { I: Icon.phone, t: 'Телефон', v: '+7 (495) 147-47-61', h: 'tel:+74951474761' },
    { I: Icon.mail, t: 'E-mail', v: 'info@elezon.ru', h: 'mailto:info@elezon.ru' },
    { I: Icon.pin, t: 'Адрес', v: '121087, Москва, ул. Большая Филёвская, 4' },
    { I: Icon.truck, t: 'Склад', v: 'Самовывоз и отгрузка ТК · Пн–Пт 9:00–18:00' },
  ];

  return (
    <div className="rise">
      <Seo
        title="Контакты"
        description="Контакты ELEZON: +7 (495) 147-47-61, info@elezon.ru, склад 121087, Москва, ул. Большая Филёвская, 4. Запрос цены и спецификации для юридических лиц."
        jsonLd={localBusinessSchema()}
      />
      <PageState data={{ products: [], categories, brands, stats }} />
      <PageHero eyebrow="Контакты" title="Свяжитесь с нами" sub="Отправьте запрос или спецификацию — рассчитаем цену, сроки и подберём аналоги." />
      <section className="section">
        <div className="wrap contacts-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 48 }}>
          <div className="col" style={{ gap: 18 }}>
            {items.map((c, i) => (
              <a key={i} href={c.h || '#'} onClick={(e) => !c.h && e.preventDefault()} className="card row" style={{ padding: 20, gap: 16, alignItems: 'center' }}>
                <span style={{ width: 46, height: 46, borderRadius: 11, background: 'var(--ink)', color: 'var(--accent)', display: 'grid', placeItems: 'center', flex: '0 0 auto' }}><c.I width="22" height="22" /></span>
                <span className="col" style={{ gap: 3 }}>
                  <span className="mono" style={{ fontSize: 11.5, color: 'var(--t-faint)' }}>{t(c.t)}</span>
                  <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--t-strong)' }}>{t(c.v)}</span>
                </span>
              </a>
            ))}
            <div style={{ width: '100%', height: 200, borderRadius: 'var(--r-md)', overflow: 'hidden', border: '1px solid var(--line)' }}>
              <img src={`${import.meta.env.BASE_URL}images/map.png`} alt={t('карта · Москва')} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
          </div>

          <div className="card" style={{ padding: 32 }}>
            {sent ? (
              <div className="col" style={{ alignItems: 'center', gap: 14, textAlign: 'center', padding: '30px 0' }}>
                <span style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--accent-soft)', color: 'var(--accent-press)', display: 'grid', placeItems: 'center' }}><Icon.check width="28" height="28" /></span>
                <h3 style={{ fontSize: 24 }}>{t('Спасибо! Запрос принят')}</h3>
                <p style={{ margin: 0, fontSize: 15, color: 'var(--t-muted)', lineHeight: 1.6, maxWidth: 360 }}>{t('Менеджер свяжется с вами в течение рабочего дня. Для срочных вопросов — звоните по телефону.')}</p>
                <button className="btn btn-dark" onClick={() => setSent(false)}>{t('Отправить ещё один')}</button>
              </div>
            ) : (
              <div className="col" style={{ gap: 16 }}>
                <div className="col" style={{ gap: 6 }}>
                  <h3 style={{ fontSize: 24 }}>{t('Запрос цены')}</h3>
                  <p style={{ margin: 0, fontSize: 14, color: 'var(--t-muted)' }}>{t('Поля со звёздочкой обязательны')}</p>
                </div>
                <div className="row form-row" style={{ gap: 12 }}>
                  <div style={{ flex: 1 }}><label className="lbl">{t('Организация *')}</label><input className="field" placeholder={t('ООО «Компания»')} /></div>
                  <div style={{ flex: 1 }}><label className="lbl">{t('ИНН')}</label><input className="field" placeholder="7700000000" /></div>
                </div>
                <div className="row form-row" style={{ gap: 12 }}>
                  <div style={{ flex: 1 }}><label className="lbl">{t('Имя *')}</label><input className="field" placeholder={t('Иван')} /></div>
                  <div style={{ flex: 1 }}><label className="lbl">{t('Телефон *')}</label><input className="field" placeholder="+7 (___) ___-__-__" /></div>
                </div>
                <div><label className="lbl">E-mail</label><input className="field" placeholder="info@company.ru" /></div>
                <div><label className="lbl">{t('Спецификация / комментарий')}</label><textarea className="field" rows={4} placeholder={t('Перечислите позиции, артикулы, количество и сроки…')} style={{ resize: 'vertical' }} /></div>
                <div className="row" style={{ gap: 12, alignItems: 'center' }}>
                  <button className="btn btn-accent" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setSent(true)}>{t('Отправить запрос')} <Icon.arrow width="17" height="17" /></button>
                  <button className="btn btn-ghost" style={{ padding: '13px 16px' }}><Icon.doc width="18" height="18" /> {t('Файл')}</button>
                </div>
                <span className="mono" style={{ fontSize: 11, color: 'var(--t-faint)' }}>{t('Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности.')}</span>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
