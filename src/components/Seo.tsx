/* ELEZON — per-page document head (title / description / canonical).

   Baked into the prerendered HTML via vite-react-ssg's <Head> (react-helmet-async).
   This is the foundation the next SEO pass extends with Open Graph, Twitter Card
   and JSON-LD structured data. */

import { Head } from 'vite-react-ssg';
import { useLocation } from 'react-router-dom';

export const SITE_URL = 'https://elezon.ru';

const DEFAULT_TITLE = 'ELEZON — Оборудование для автоматизации зданий, КИП, НВО, KNX';
const DEFAULT_DESCRIPTION =
  'Поставка оригинального оборудования для автоматизации зданий, КИП, низковольтных систем и KNX. Склад в Москве, отгрузка 24 ч. Работаем с юридическими лицами.';

interface SeoProps {
  /** Page topic; omit on the homepage to use the brand-first default title. */
  title?: string;
  description?: string;
}

export function Seo({ title, description }: SeoProps) {
  const { pathname } = useLocation();
  const fullTitle = title ? `${title} — ELEZON` : DEFAULT_TITLE;
  // Canonical matches the nested-dirStyle URL GitHub Pages serves: a trailing
  // slash for every route except the homepage. Normalised so it's identical
  // whether the page was entered with or without a trailing slash.
  const clean = pathname.replace(/\/+$/, '');
  const canonical = clean === '' ? `${SITE_URL}/` : `${SITE_URL}${encodeURI(clean)}/`;
  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description || DEFAULT_DESCRIPTION} />
      <link rel="canonical" href={canonical} />
    </Head>
  );
}
