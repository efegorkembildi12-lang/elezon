/* ELEZON — per-category line-art illustrations for the homepage category cards.
   One scene per supply category, sharing a visual language: rounded line-art on
   `currentColor` (structure) with selective --accent highlights and --ink/--surface
   fills. Rendered inside the category card's right panel; scales via viewBox. */

import type { CSSProperties } from 'react';

const SVG: CSSProperties = { width: '100%', height: '100%', color: 'var(--line-2)', display: 'block' };
const accentStroke: CSSProperties = { stroke: 'var(--accent)' };
const accentFill: CSSProperties = { fill: 'var(--accent)' };
const inkFill: CSSProperties = { fill: 'var(--ink)' };
const surfaceFill: CSSProperties = { fill: 'var(--surface)' };

const COMMON = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.4,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

/* Building automation — wall controller with screen + linked sensor node. */
function BuildingAutomationArt() {
  return (
    <svg viewBox="0 0 320 220" style={SVG} aria-hidden preserveAspectRatio="xMidYMid meet">
      <g {...COMMON}>
        {/* controller body */}
        <rect x="42" y="64" width="132" height="104" rx="14" style={surfaceFill} />
        {/* screen */}
        <rect x="58" y="80" width="100" height="44" rx="8" style={inkFill} stroke="none" />
        <polyline points="68,108 84,96 98,104 114,86 134,98 148,90" style={accentStroke} strokeWidth="2.6" />
        {/* buttons */}
        <circle cx="70" cy="146" r="5" />
        <circle cx="92" cy="146" r="5" />
        <circle cx="148" cy="146" r="6" style={accentFill} stroke="none" />
        {/* dotted link to sensor */}
        <path d="M174 96 C 210 96, 214 70, 240 62" strokeDasharray="2 9" />
        {/* sensor node */}
        <circle cx="252" cy="58" r="26" style={surfaceFill} />
        <circle cx="252" cy="58" r="7" style={accentFill} stroke="none" />
        <path d="M236 40 C 230 50, 230 66, 236 76" strokeWidth="2" />
        <path d="M268 40 C 274 50, 274 66, 268 76" strokeWidth="2" />
      </g>
    </svg>
  );
}

/* Instrumentation (КИП) — round pressure gauge + digital readout. */
function InstrumentationArt() {
  const ticks = Array.from({ length: 11 }, (_, i) => {
    const a = Math.PI * (1 + i / 10); // 180° → 360° sweep across the top arc
    const cx = 112, cy = 118, r1 = 58, r2 = 48;
    const x1 = cx + r1 * Math.cos(a), y1 = cy + r1 * Math.sin(a);
    const x2 = cx + r2 * Math.cos(a), y2 = cy + r2 * Math.sin(a);
    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth={i % 5 === 0 ? 2.6 : 1.6} />;
  });
  return (
    <svg viewBox="0 0 320 220" style={SVG} aria-hidden preserveAspectRatio="xMidYMid meet">
      <g {...COMMON}>
        {/* gauge */}
        <circle cx="112" cy="118" r="70" style={surfaceFill} />
        {ticks}
        {/* needle */}
        <line x1="112" y1="118" x2="78" y2="86" style={accentStroke} strokeWidth="3" />
        <circle cx="112" cy="118" r="7" style={accentFill} stroke="none" />
        {/* digital meter */}
        <rect x="206" y="84" width="84" height="58" rx="10" style={inkFill} stroke="none" />
        <line x1="220" y1="106" x2="248" y2="106" style={accentStroke} strokeWidth="3" />
        <line x1="220" y1="120" x2="276" y2="120" stroke="var(--line-2)" strokeWidth="3" />
        <circle cx="280" cy="96" r="3.4" style={accentFill} stroke="none" />
      </g>
    </svg>
  );
}

/* Low-voltage — DIN rail with three modular circuit breakers (one switched on). */
function LowVoltageArt() {
  const modules = [
    { x: 70, on: false },
    { x: 122, on: true },
    { x: 174, on: false },
  ];
  return (
    <svg viewBox="0 0 320 220" style={SVG} aria-hidden preserveAspectRatio="xMidYMid meet">
      <g {...COMMON}>
        {/* DIN rail */}
        <path d="M40 168 H280" strokeWidth="3" />
        <path d="M40 156 H280" stroke="var(--line)" strokeWidth="8" />
        {modules.map((m, i) => (
          <g key={i}>
            <rect x={m.x} y="60" width="46" height="104" rx="6" style={surfaceFill} />
            {/* terminal screws */}
            <line x1={m.x + 12} y1="70" x2={m.x + 34} y2="70" strokeWidth="2" />
            <line x1={m.x + 12} y1="154" x2={m.x + 34} y2="154" strokeWidth="2" />
            {/* toggle window + lever */}
            <rect x={m.x + 13} y="92" width="20" height="40" rx="4" style={inkFill} stroke="none" />
            <rect
              x={m.x + 16} y={m.on ? 96 : 114} width="14" height="18" rx="3"
              style={m.on ? accentFill : surfaceFill} stroke={m.on ? 'none' : 'currentColor'} strokeWidth="1.8"
            />
          </g>
        ))}
      </g>
    </svg>
  );
}

/* KNX — bus line with branched device nodes + a weather sensor. */
function KnxArt() {
  const nodes = [
    { x: 64, on: false },
    { x: 124, on: true },
    { x: 184, on: false },
    { x: 244, on: false },
  ];
  return (
    <svg viewBox="0 0 320 220" style={SVG} aria-hidden preserveAspectRatio="xMidYMid meet">
      <g {...COMMON}>
        {/* bus line */}
        <path d="M40 150 H284" style={accentStroke} strokeWidth="3" />
        {nodes.map((n, i) => (
          <g key={i}>
            <line x1={n.x} y1="150" x2={n.x} y2="120" strokeWidth="2" />
            <rect
              x={n.x - 16} y="86" width="32" height="34" rx="7"
              style={n.on ? accentFill : surfaceFill} stroke={n.on ? 'none' : 'currentColor'}
            />
            {!n.on && <circle cx={n.x} cy="103" r="4" stroke="var(--line-2)" strokeWidth="2" />}
          </g>
        ))}
        {/* weather sensor on top */}
        <circle cx="124" cy="50" r="16" style={surfaceFill} />
        <path d="M124 34 V20" strokeWidth="2" />
        <circle cx="124" cy="18" r="3.4" style={accentFill} stroke="none" />
        <line x1="124" y1="70" x2="124" y2="86" strokeWidth="2" />
      </g>
    </svg>
  );
}

export const categoryArt: Record<string, () => JSX.Element> = {
  'avtomatizatsiya-zdaniy': BuildingAutomationArt,
  'kip': InstrumentationArt,
  'nizkovoltnoe-oborudovanie': LowVoltageArt,
  'knx': KnxArt,
};
