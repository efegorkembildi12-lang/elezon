/* ELEZON — per-page document head (title / description / canonical / Open Graph /
   Twitter Card / JSON-LD). Baked into the prerendered HTML via vite-react-ssg's
   <Head> (react-helmet-async). JSON-LD is non-executable (type="application/ld+json"),
   so the strict `script-src 'self'` CSP does not block it. */

import { Head } from 'vite-react-ssg';
import { useLocation } from 'react-router-dom';

export const SITE_URL = 'https://elezon.ru';

const DEFAULT_TITLE = 'ELEZON — Оборудование для автоматизации зданий, КИП, НВО, KNX';
const DEFAULT_DESCRIPTION =
  'Поставка оригинального оборудования для автоматизации зданий, КИП, низковольтных систем и KNX. Склад в Москве, отгрузка 24 ч. Работаем с юридическими лицами.';
const DEFAULT_OG_IMAGE = `${SITE_URL}/images/og-image.png`;

type JsonLd = Record<string, unknown>;

interface SeoProps {
  /** Page topic; omit on the homepage to use the brand-first default title. */
  title?: string;
  description?: string;
  /** OG/Twitter image (absolute URL or site-root path); defaults to the brand card. */
  image?: string;
  type?: 'website' | 'article' | 'product';
  /** One or more schema.org objects emitted as <script type="application/ld+json">. */
  jsonLd?: JsonLd | JsonLd[];
}

function absolute(url: string): string {
  return /^https?:\/\//.test(url) ? url : `${SITE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}

// Escape '<' so a "</script>" inside the data can't break out of the ld+json block.
function ldJson(data: JsonLd): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function Seo({ title, description, image, type = 'website', jsonLd }: SeoProps) {
  const { pathname } = useLocation();
  const fullTitle = title ? `${title} — ELEZON` : DEFAULT_TITLE;
  const desc = description || DEFAULT_DESCRIPTION;
  // Canonical matches the nested-dirStyle URL GitHub Pages serves (trailing slash
  // except home), normalised regardless of how the page was entered.
  const clean = pathname.replace(/\/+$/, '');
  const canonical = clean === '' ? `${SITE_URL}/` : `${SITE_URL}${encodeURI(clean)}/`;
  const ogImage = image ? absolute(image) : DEFAULT_OG_IMAGE;
  const schemas = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="ELEZON" />
      <meta property="og:locale" content="ru_RU" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={ogImage} />

      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {ldJson(schema)}
        </script>
      ))}
    </Head>
  );
}
