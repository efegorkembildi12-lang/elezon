/* ELEZON — "notify when back in stock" email capture for "под заказ" products.
   Inline on the product page; compact popover variant on the catalog card.
   Submits to Supabase (stock_leads) via addLead. */

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
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (busy) return;
    if (!EMAIL_RE.test(email.trim())) { setError(t('Введите корректный e-mail')); return; }
    setBusy(true);
    setError(null);
    try {
      await addLead(product, email);
      setDone(true);
    } catch {
      setError(t('Не удалось отправить, попробуйте позже'));
    } finally {
      setBusy(false);
    }
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
          onChange={(e) => { setEmail(e.target.value); setError(null); }}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          style={{ flex: 1, padding: compact ? '10px 12px' : undefined }}
        />
        <button className="btn btn-dark" style={{ whiteSpace: 'nowrap', opacity: busy ? 0.6 : 1 }} disabled={busy} onClick={submit}>
          <Icon.bell width="16" height="16" /> {busy ? '…' : t('Уведомить')}
        </button>
      </div>
      {error && <span style={{ fontSize: 12, color: 'oklch(0.55 0.18 25)' }}>{error}</span>}
    </div>
  );
}
