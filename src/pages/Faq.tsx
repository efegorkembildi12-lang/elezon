/* ELEZON — FAQ / AEO page. Question-style <h2> headings with short direct
   answers, plus FAQPage JSON-LD, to win featured snippets and voice answers. */

import { PageHero } from '../components/PageHero';
import { useI18n } from '../i18n/I18nContext';
import { useCatalog } from '../store/CatalogProvider';
import { Seo } from '../components/Seo';
import { PageState } from '../lib/ssg/pageState';
import { faqSchema } from '../lib/seo/schema';
import { FAQ } from '../data/faq';

export function Faq() {
  const { lang } = useI18n();
  const { categories, brands, stats } = useCatalog();
  const items = FAQ[lang];

  const title = lang === 'en' ? 'FAQ' : 'Вопросы и ответы';
  const sub =
    lang === 'en'
      ? 'Delivery, payment, warranty and B2B terms — the most common questions about working with ELEZON.'
      : 'Доставка, оплата, гарантия и условия работы с юридическими лицами — частые вопросы о сотрудничестве с ELEZON.';
  const desc =
    lang === 'en'
      ? 'Frequently asked questions about ELEZON: ordering, delivery from the Moscow warehouse, payment, warranty and B2B terms.'
      : 'Частые вопросы о ELEZON: оформление заказа, доставка со склада в Москве, оплата, гарантия и условия работы с юридическими лицами.';

  return (
    <div className="rise">
      <Seo title={title} description={desc} jsonLd={faqSchema(items)} />
      <PageState data={{ products: [], categories, brands, stats }} />
      <PageHero eyebrow={lang === 'en' ? 'Help' : 'Помощь'} title={title} sub={sub} />
      <section className="section">
        <div className="wrap" style={{ maxWidth: 820 }}>
          <div className="col" style={{ gap: 16 }}>
            {items.map((it, i) => (
              <div key={i} className="card" style={{ padding: '22px 26px' }}>
                <h2 style={{ fontSize: 19, lineHeight: 1.3, margin: '0 0 10px' }}>{it.q}</h2>
                <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: 'var(--t-body)' }}>{it.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
