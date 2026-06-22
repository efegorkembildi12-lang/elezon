/* ELEZON — cookie consent bar. Slim fixed bottom banner shown until the visitor
   makes a choice. Per the 2025 requirement it offers an explicit "Decline", not
   only "Accept". The site loads no analytics/trackers, so the choice is simply
   recorded in localStorage; "Learn more" opens the cookie notice (/legal#cookies). */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';
import type { Lang } from '../types';

const STORAGE_KEY = 'elezon_cookie_consent';

type Choice = 'accepted' | 'declined';

interface ConsentRecord {
  choice: Choice;
  ts: string; // ISO-8601 timestamp of the decision
}

const COPY: Record<Lang, { text: string; accept: string; decline: string; more: string; label: string }> = {
  ru: {
    text: 'Мы используем файлы cookie для обеспечения работы сайта, анализа посещаемости и улучшения сервиса. Вы можете принять или отклонить их использование.',
    accept: 'Принять',
    decline: 'Отклонить',
    more: 'Подробнее',
    label: 'Уведомление об использовании файлов cookie',
  },
  en: {
    text: 'We use cookies to ensure the website works, analyse traffic and improve the service. You can accept or decline their use.',
    accept: 'Accept',
    decline: 'Decline',
    more: 'Learn more',
    label: 'Cookie consent notice',
  },
};

function readChoice(): ConsentRecord | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && (parsed.choice === 'accepted' || parsed.choice === 'declined') ? parsed : null;
  } catch {
    return null;
  }
}

export function CookieConsent() {
  const { lang } = useI18n();
  const [decided, setDecided] = useState<boolean>(() => readChoice() !== null);

  if (decided) return null;

  const copy = COPY[lang];

  function record(choice: Choice) {
    const entry: ConsentRecord = { choice, ts: new Date().toISOString() };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entry));
    } catch {
      /* ignore quota / privacy-mode errors — still dismiss the bar */
    }
    setDecided(true);
  }

  return (
    <div className="cookie-bar" role="region" aria-label={copy.label}>
      <div className="cookie-bar__inner wrap">
        <p className="cookie-bar__text">
          {copy.text}{' '}
          <Link to="/legal#cookies" className="cookie-bar__link">
            {copy.more}
          </Link>
        </p>
        <div className="cookie-bar__actions">
          <button type="button" className="btn btn-ghost on-dark btn-sm" onClick={() => record('declined')}>
            {copy.decline}
          </button>
          <button type="button" className="btn btn-accent btn-sm" onClick={() => record('accepted')}>
            {copy.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
