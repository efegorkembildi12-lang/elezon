# ELEZON — B2B equipment catalog

A modern, bilingual (RU/EN) B2B catalog site for **Elezon**, a Russian engineering supplier of
building-automation, instrumentation (КИП), low-voltage and KNX equipment. There is **no direct
checkout** — every action routes to a price request (Запрос цены) or stock check, matching the B2B
model. Implemented in **Vite + React + TypeScript** from a Claude Design handoff (Concept A).

This repo contains two apps built from one design system:

- **Storefront** (`index.html` → `src/main.tsx`) — public catalog
- **Admin panel** (`admin.html` → `src/admin/main.tsx`) — localStorage-backed management console

## Stack

- Vite 5 (multi-page build), React 18, TypeScript (strict)
- React Router 6 (real URLs for SEO)
- No CSS framework — hand-authored design tokens (`src/styles/tokens.css`) using OKLCH colors;
  fonts Onest / Unbounded / JetBrains Mono

## Getting started

```bash
npm install
npm run dev          # storefront at /, admin at /admin.html
npm run build        # typechecks (tsc -b) then builds both entries
npm run preview      # preview the production build
npm run typecheck
```

## Design system

| Token group | Where |
|-------------|-------|
| Colors / type / radii / shadows | `src/styles/tokens.css` (OKLCH graphite + electric-lime accent) |
| Global storefront styles | `src/styles/global.css` |
| Admin chrome | `src/styles/admin.css` |

Dark graphite surfaces for hero/CTA bands; clean light surfaces for browsing. The accent is a single
electric-lime hue (`--accent-h: 128`) used semantically (in-stock, primary actions).

## Storefront structure

```
src/
├── main.tsx                 # entry: BrowserRouter + I18n + RequestList providers
├── App.tsx                  # header / routed pages / footer + scroll-to-top
├── types.ts                 # Product, Category, Stock, CatalogData, Lang
├── data/catalog.ts          # ELEZON_DATA (demo catalog; preserves original article ids)
├── i18n/
│   ├── translations.ts      # RU → EN dictionary (Russian is the source language)
│   └── I18nContext.tsx      # useI18n() / I18nProvider; persists `elezon_lang`
├── store/RequestListContext.tsx  # "Список запроса" batch-quote list; persists `elezon_rl`
├── lib/{format.ts,useGo.ts} # number formatting; go(route, arg) → router navigation
├── components/              # Icon, Logo, Header, Footer, ProductCard, Breadcrumbs, QuoteCTA, PageHero
└── pages/                   # Home, Catalog, Product, RequestList, Company, Delivery, Contacts
```

### Routes

| Path | Page |
|------|------|
| `/` | Home (Concept A: industrial grid) |
| `/catalog` · `/catalog/:categoryId` | Catalog / category listing (horizontal filter bar) |
| `/product/:productId` | Product detail + quote modal |
| `/request` | Request list (batch quote) |
| `/company` · `/delivery` · `/contacts` | Inner pages |

## Key behaviors

- **Bilingual:** RU is the source language; EN comes from one dictionary. The toggle (top-right) is
  persisted to `localStorage` and shared between storefront and admin.
- **Request list:** the B2B alternative to a cart. Add from product cards (`+`) or the product page,
  manage quantities on `/request`, submit one batched price request. Persisted to `localStorage`.
- **No checkout:** all CTAs lead to "Запрос цены / Request price" or stock/contact.

## Admin panel

Served at `/admin.html`. Light content area + dark graphite top bar, same tokens and i18n. Eight
sections — dashboard, products, categories, brands, requests (заявки), customers (юр. лица),
content, settings — all working against a `localStorage` store seeded from the catalog data
(it's a prototype; there is no backend). Reset to demo data from Settings.

## Notes

- Images in `public/images/` are representative placeholders generated for the mockup. Replace files
  in place (same names) to drop in real product photos / brand logos.
- This was recreated from an HTML/CSS/JS design prototype; the goal was visual parity with
  production-grade React, not a literal port of the prototype's internals.
