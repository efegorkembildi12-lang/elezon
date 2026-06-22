/* ELEZON — FAQ content (bilingual). Drafted from the real Delivery / Company /
   legal facts. Powers the /faq page and its FAQPage JSON-LD. Answers are kept
   short (≈40–60 words) for featured-snippet / voice-answer eligibility.
   NOTE: review/adjust the wording with the business before relying on it. */

import type { Lang } from '../types';

export interface FaqItem {
  q: string;
  a: string;
}

export const FAQ: Record<Lang, FaqItem[]> = {
  ru: [
    {
      q: 'Как сделать заказ в ELEZON?',
      a: 'Отправьте спецификацию или артикулы через форму на сайте, по почте info@elezon.ru или по телефону +7 (495) 147-47-61. Мы проверим наличие, при необходимости подберём аналоги и подготовим коммерческое предложение, затем заключаем договор и отгружаем заказ.',
    },
    {
      q: 'Какие сроки и способы доставки?',
      a: 'Со склада в Москве отгружаем в течение 24 часов после подтверждения заказа. Доставляем по Москве и области, отправляем транспортными компаниями по всей России. Доступен самовывоз со склада по адресу: 121087, Москва, ул. Большая Филёвская, 4.',
    },
    {
      q: 'Как происходит оплата?',
      a: 'Работаем по безналичному расчёту для юридических лиц: выставляем счёт и заключаем договор поставки. Возможна отсрочка платежа по согласованию. Предоставляем полный пакет закрывающих документов.',
    },
    {
      q: 'Вы работаете с физическими лицами?',
      a: 'ELEZON — поставщик B2B и работает с юридическими лицами и индивидуальными предпринимателями. Для оформления заказа потребуются реквизиты компании: название, ИНН и контактное лицо.',
    },
    {
      q: 'Оборудование оригинальное? Есть ли гарантия?',
      a: 'Мы поставляем только оригинальное оборудование официальных производителей — ABB, Siemens, Schneider Electric, Theben и других. На каждую позицию распространяется гарантия производителя.',
    },
    {
      q: 'Можете подобрать аналог, если позиции нет в наличии?',
      a: 'Да. Наши инженеры подберут аналог по техническим характеристикам и проконсультируют по совместимости. Оставьте артикул или спецификацию — рассчитаем стоимость и сроки, в том числе для проектных объёмов.',
    },
    {
      q: 'Какие документы вы предоставляете?',
      a: 'Для юридических лиц предоставляем полный пакет документов: договор поставки, счёт, счёт-фактуру и закрывающие документы. По запросу — технические паспорта и сертификаты на оборудование.',
    },
  ],
  en: [
    {
      q: 'How do I place an order with ELEZON?',
      a: 'Send your specification or part numbers via the website form, by email at info@elezon.ru, or by phone at +7 (495) 147-47-61. We check availability, suggest equivalents if needed and prepare a quote, then sign a contract and ship the order.',
    },
    {
      q: 'What are the delivery times and options?',
      a: 'We ship from our Moscow warehouse within 24 hours of order confirmation. We deliver within Moscow and the region and ship by carrier across Russia. Self-pickup is available at 4 Bolshaya Filyovskaya St., Moscow, 121087.',
    },
    {
      q: 'How does payment work?',
      a: 'We work by bank transfer for legal entities: we issue an invoice and sign a supply contract. Deferred payment is possible by agreement. We provide a full set of accounting documents.',
    },
    {
      q: 'Do you work with individuals?',
      a: 'ELEZON is a B2B supplier and works with legal entities and sole proprietors. To place an order we need company details: name, INN (tax ID) and a contact person.',
    },
    {
      q: 'Is the equipment original? Is there a warranty?',
      a: 'We supply only original equipment from official manufacturers — ABB, Siemens, Schneider Electric, Theben and others. Each item carries the manufacturer warranty.',
    },
    {
      q: 'Can you suggest an equivalent if an item is out of stock?',
      a: 'Yes. Our engineers select an equivalent by technical specifications and advise on compatibility. Send a part number or specification and we will quote price and lead time, including for project volumes.',
    },
    {
      q: 'What documents do you provide?',
      a: 'For legal entities we provide a full document package: supply contract, invoice, VAT invoice and accounting documents. On request — datasheets and certificates for the equipment.',
    },
  ],
};
