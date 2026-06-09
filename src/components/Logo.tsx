/* ELEZON — wordmark logo. Ported from shared.jsx. */

import { Icon } from './Icon';

export function Logo({ dark, onClick }: { dark?: boolean; onClick?: () => void }) {
  const c = dark ? 'var(--t-on-dark)' : 'var(--t-strong)';
  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick?.();
      }}
      className="row"
      style={{ gap: 10, textDecoration: 'none' }}
    >
      <span
        style={{
          width: 30, height: 30, borderRadius: 7, background: 'var(--accent)',
          display: 'grid', placeItems: 'center', color: 'var(--accent-ink)', flex: '0 0 auto',
        }}
      >
        <Icon.bolt width="18" height="18" />
      </span>
      <span style={{ fontFamily: 'var(--f-display)', fontWeight: 700, fontSize: 21, letterSpacing: '-0.03em', color: c }}>
        ELEZON
      </span>
    </a>
  );
}
