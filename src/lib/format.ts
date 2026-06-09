/* ELEZON — small formatting helpers */

/** Russian-grouped number, or null for "price on request". */
export const fmt = (n: number | null): string | null =>
  n == null ? null : n.toLocaleString('ru-RU');
