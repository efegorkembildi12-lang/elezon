/* ELEZON — JSON-LD (schema.org) builders.
   Plain objects emitted as <script type="application/ld+json"> via <Seo jsonLd>.
   Each builder includes its own @context so several can be rendered per page.
   Identity comes from the single COMPANY source so it stays consistent. */

import { COMPANY } from '../../data/company';
import { productImage } from '../localize';
import type { Product } from '../../types';

const SITE = COMPANY.url;

/** Canonical absolute URL for a route path: trailing slash (nested dirStyle),
    matching what <Seo> emits as <link rel="canonical">. */
export function canonicalUrl(path: string): string {
  const clean = path.replace(/\/+$/, '');
  return clean === '' ? `${SITE}/` : `${SITE}${encodeURI(clean)}/`;
}

function postalAddress() {
  return {
    '@type': 'PostalAddress',
    streetAddress: COMPANY.address.street,
    addressLocality: COMPANY.address.locality,
    postalCode: COMPANY.address.postalCode,
    addressCountry: COMPANY.address.country,
  };
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: COMPANY.name,
    url: `${SITE}/`,
    logo: COMPANY.logo,
    email: COMPANY.email,
    telephone: COMPANY.phone,
    address: postalAddress(),
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: COMPANY.phone,
      email: COMPANY.email,
      contactType: 'sales',
      areaServed: 'RU',
      availableLanguage: ['Russian', 'English'],
    },
  };
}

export function webSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: COMPANY.name,
    url: `${SITE}/`,
    inLanguage: 'ru',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE}/catalog?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: COMPANY.name,
    url: `${SITE}/contacts/`,
    image: COMPANY.logo,
    email: COMPANY.email,
    telephone: COMPANY.phone,
    address: postalAddress(),
    areaServed: 'RU',
    openingHours: COMPANY.openingHours,
  };
}

/** Absolute product image URL (Supabase URLs are already absolute). */
function productImageAbs(p: Product): string {
  const img = productImage(p);
  return /^https?:\/\//.test(img) ? img : `${SITE}${img}`;
}

export function productSchema(p: Product, description: string, path: string) {
  const url = canonicalUrl(path);
  const offers: Record<string, unknown> = {
    '@type': 'Offer',
    url,
    availability: p.stock === 'in' ? 'https://schema.org/InStock' : 'https://schema.org/BackOrder',
    seller: { '@type': 'Organization', name: COMPANY.name },
  };
  if (p.price != null) {
    offers.price = p.price;
    offers.priceCurrency = 'RUB';
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    sku: p.article,
    image: productImageAbs(p),
    description,
    brand: { '@type': 'Brand', name: p.brand },
    offers,
  };
}

export interface Crumb {
  name: string;
  path?: string; // omit for the current (non-linked) page
}

export function breadcrumbSchema(items: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      ...(it.path ? { item: canonicalUrl(it.path) } : {}),
    })),
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  };
}
