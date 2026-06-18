/* ELEZON — small formatting helpers */

/** Russian-grouped number (space thousands separator), or null for "price on request".
   Grouped manually rather than via toLocaleString: Node (SSG) and the browser use
   different ICU group separators for ru-RU (U+00A0 vs U+202F), which breaks hydration.
   A fixed separator keeps the prerendered HTML and the client render identical. */
export const fmt = (n: number | null): string | null => {
  if (n == null) return null;
  const [int, frac] = String(n).split('.');
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return frac ? `${grouped},${frac}` : grouped;
};
