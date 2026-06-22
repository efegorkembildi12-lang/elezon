/* ELEZON — wordmark logo. Real <Link> to the homepage (crawlable). */

import { Link } from 'react-router-dom';
import { Icon } from './Icon';

export function Logo({ dark }: { dark?: boolean }) {
  const c = dark ? 'var(--t-on-dark)' : 'var(--t-strong)';
  return (
    <Link to="/" className="row" style={{ gap: 10, textDecoration: 'none' }} aria-label="ELEZON — на главную">
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
    </Link>
  );
}
