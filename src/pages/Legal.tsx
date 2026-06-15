/* ELEZON — combined legal page. Renders all four bilingual documents
   (Consent, Privacy Policy, Cookie Notice, Terms of Use) from src/data/legal.ts
   with a table of contents and hash-anchored sections. Linked from the footer
   ("Политика конфиденциальности" → #privacy, "Пользовательское соглашение" →
   #terms) and the cookie bar ("Learn more" → #cookies). The /privacy URL
   redirects here to #privacy. */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PageHero } from '../components/PageHero';
import { useGo } from '../lib/useGo';
import { useI18n } from '../i18n/I18nContext';
import { LEGAL_DOCS, LEGAL_INTRO, LEGAL_LABELS } from '../data/legal';

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
}

export function Legal() {
  const { lang } = useI18n();
  const go = useGo();
  const { hash } = useLocation();

  const labels = LEGAL_LABELS[lang];
  const docs = LEGAL_DOCS[lang];

  // Deep links such as /legal#privacy land on the matching section. A short
  // timeout lets the page paint before we measure the target's position.
  useEffect(() => {
    const id = hash.replace('#', '');
    if (!id) return;
    const timer = window.setTimeout(() => scrollToId(id), 60);
    return () => window.clearTimeout(timer);
  }, [hash]);

  return (
    <div className="rise">
      <PageHero eyebrow={labels.eyebrow} title={labels.title} sub={LEGAL_INTRO[lang]} />
      <section className="section">
        <div className="wrap" style={{ maxWidth: 860 }}>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); go('home'); }}
            style={{ fontSize: 13.5, color: 'var(--t-muted)', textDecoration: 'none' }}
          >
            ← {labels.back}
          </a>

          {/* Table of contents */}
          <nav className="legal-toc card" aria-label={labels.contents}>
            <span className="eyebrow" style={{ display: 'block', marginBottom: 14 }}>{labels.contents}</span>
            <ol className="col" style={{ gap: 10, margin: 0, padding: 0, listStyle: 'none' }}>
              {docs.map((doc, i) => (
                <li key={doc.id} className="row" style={{ gap: 12, alignItems: 'baseline' }}>
                  <span className="mono" style={{ fontSize: 13, color: 'var(--accent)' }}>{String(i + 1).padStart(2, '0')}</span>
                  <a
                    href={`#${doc.id}`}
                    onClick={(e) => { e.preventDefault(); scrollToId(doc.id); }}
                    style={{ fontSize: 15, color: 'var(--t-body)', textDecoration: 'none' }}
                  >
                    {doc.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* Documents */}
          <div className="col" style={{ gap: 56, marginTop: 48 }}>
            {docs.map((doc) => (
              <article key={doc.id} id={doc.id} style={{ scrollMarginTop: 90 }}>
                <h2 className="display" style={{ fontSize: 27, margin: '0 0 8px', color: 'var(--t-strong)' }}>{doc.title}</h2>
                <hr className="divider" style={{ margin: '0 0 22px' }} />
                <div className="col" style={{ gap: 24 }}>
                  {doc.sections.map((sec, si) => (
                    <div key={si} className="col" style={{ gap: 12 }}>
                      {sec.heading && (
                        <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: 'var(--t-strong)' }}>{sec.heading}</h3>
                      )}
                      {sec.paragraphs.map((p, pi) => (
                        <p key={pi} style={{ margin: 0, fontSize: 14.5, lineHeight: 1.7, color: 'var(--t-body)' }}>{p}</p>
                      ))}
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
