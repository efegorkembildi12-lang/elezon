/* ELEZON — "notify when back in stock" email capture for "под заказ" products.
   Inline on the product page; compact popover variant on the catalog card. */

import { useState } from 'react';
import { Icon } from './Icon';
import { useI18n } from '../i18n/I18nContext';
import { addLead } from '../data/stockNotifications';
import type { Product } from '../types';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function StockNotifyForm({ product, compact }: { product: Product; compact?: boolean }) {
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);

  const submit = () => {
    if (!EMAIL_RE.test(email.trim())) { setError(true); return; }
    addLead(product, email, new Date().toISOString());
    setDone(true);
  };

  if (done) {
    return (
      <div className="row" style={{ gap: 9, color: 'var(--accent-press)', fontSize: 13.5, fontWeight: 600 }}>
        <Icon.check width="17" height="17" /> {t('Сообщим, когда товар появится')}
      </div>
    );
  }

  return (
    <div className="col" style={{ gap: 8 }}>
      {!compact && (
        <span className="row" style={{ gap: 8, fontSize: 14, fontWeight: 700, color: 'var(--t-strong)' }}>
          <Icon.bell width="17" height="17" style={{ color: 'var(--accent-press)' }} /> {t('Уведомить о поступлении')}
        </span>
      )}
      <div className="row" style={{ gap: 8 }}>
        <input
          className="field"
          type="email"
          value={email}
          placeholder="info@company.ru"
          onChange={(e) => { setEmail(e.target.value); setError(false); }}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          style={{ flex: 1, padding: compact ? '10px 12px' : undefined }}
        />
        <button className="btn btn-dark" style={{ whiteSpace: 'nowrap' }} onClick={submit}>
          <Icon.bell width="16" height="16" /> {t('Уведомить')}
        </button>
      </div>
      {error && <span style={{ fontSize: 12, color: 'oklch(0.55 0.18 25)' }}>{t('Введите корректный e-mail')}</span>}
    </div>
  );
}
