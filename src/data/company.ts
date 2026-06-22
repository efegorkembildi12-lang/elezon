/* ELEZON — single source of company identity (NAP: name, address, phone).
   Used by the UI (header/footer/contacts/delivery/legal) and by the JSON-LD
   schema helpers (src/lib/seo/schema.ts) so the brand's name, address, phone and
   email stay consistent everywhere — important for the GEO brand-entity signal. */

export const COMPANY = {
  name: 'ELEZON',
  url: 'https://elezon.ru',
  email: 'info@elezon.ru',
  phone: '+7 (495) 147-47-61',
  phoneHref: 'tel:+74951474761',
  /** Logo used in Organization JSON-LD. */
  logo: 'https://elezon.ru/favicon.svg',

  address: {
    postalCode: '121087',
    locality: 'Москва',
    localityEn: 'Moscow',
    street: 'ул. Большая Филёвская, 4',
    streetEn: 'Bolshaya Filyovskaya St., 4',
    country: 'RU',
    /** One-line address for display / meta. */
    fullRu: '121087, Москва, ул. Большая Филёвская, 4',
    fullEn: '121087, Moscow, Bolshaya Filyovskaya St., 4',
  },

  /** Human-readable opening hours (display). */
  hoursRu: 'Пн–Пт 9:00–18:00',
  hoursEn: 'Mon–Fri 9:00–18:00',
  /** schema.org openingHours value. */
  openingHours: 'Mo-Fr 09:00-18:00',
} as const;
