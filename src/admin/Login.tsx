/* ELEZON — Admin login gate. Supabase Auth email/password. After sign-in we
   verify the user is in the admins allow-list (is_admin RPC); non-admins are
   signed out immediately. */

import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { isCurrentUserAdmin } from '../lib/db/repo';
import { AdmIcon } from './shared';

export default function Login({ onAuthed }: { onAuthed: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (busy) return;
    if (!supabase) { setError('Supabase не настроен (отсутствует .env).'); return; }
    setBusy(true);
    setError(null);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (signInError) { setError('Неверный e-mail или пароль.'); setBusy(false); return; }
    const ok = await isCurrentUserAdmin();
    if (!ok) {
      await supabase.auth.signOut();
      setError('У этого аккаунта нет прав администратора.');
      setBusy(false);
      return;
    }
    onAuthed();
    setBusy(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 20, background: 'var(--bg)' }}>
      <div className="card" style={{ width: 'min(400px, 100%)', padding: 32 }}>
        <div className="row" style={{ gap: 10, marginBottom: 22 }}>
          <span className="adm-brand-badge" style={{ display: 'grid', placeItems: 'center', width: 36, height: 36, borderRadius: 9, background: 'var(--accent)', color: 'var(--accent-ink)' }}>
            <AdmIcon.bolt width={20} height={20} />
          </span>
          <div className="col">
            <span style={{ fontFamily: 'var(--f-display)', fontWeight: 700, fontSize: 18, color: 'var(--t-strong)' }}>ELEZON</span>
            <span className="mono" style={{ fontSize: 11.5, color: 'var(--t-muted)' }}>Панель управления</span>
          </div>
        </div>
        <div className="col" style={{ gap: 14 }}>
          <div>
            <label className="lbl">E-mail</label>
            <input className="field" type="email" value={email} autoFocus
              onChange={(e) => { setEmail(e.target.value); setError(null); }}
              onKeyDown={(e) => e.key === 'Enter' && submit()} placeholder="admin@elezon.ru" />
          </div>
          <div>
            <label className="lbl">Пароль</label>
            <input className="field" type="password" value={password}
              onChange={(e) => { setPassword(e.target.value); setError(null); }}
              onKeyDown={(e) => e.key === 'Enter' && submit()} placeholder="••••••••" />
          </div>
          {error && <span style={{ fontSize: 12.5, color: 'oklch(0.55 0.18 25)' }}>{error}</span>}
          <button className="btn btn-accent" style={{ justifyContent: 'center', opacity: busy ? 0.6 : 1 }} disabled={busy} onClick={submit}>
            {busy ? '…' : 'Войти'}
          </button>
        </div>
      </div>
    </div>
  );
}
