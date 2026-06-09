/* ELEZON — CSV export helpers. Used by the request-list spec download and the
   admin stock-notification leads export. No third-party deps. */

import { fmt } from './format';
import type { Product } from '../types';

type Translate = (s: string) => string;

/** Escape one CSV cell (RFC-4180-ish). */
function csvCell(v: string | number): string {
  const s = String(v ?? '');
  return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** Build a CSV string. Uses ';' delimiter + a UTF-8 BOM so Excel (RU) opens
    Cyrillic correctly and treats columns as separate. */
export function toCsv(headers: string[], rows: (string | number)[][]): string {
  const lines = [headers, ...rows].map((r) => r.map(csvCell).join(';'));
  return '﻿' + lines.join('\r\n');
}

export interface SpecRow {
  qty: number;
  p: Product;
}

/** Request-list spec sheet as CSV. */
export function toSpecCsv(rows: SpecRow[], t: Translate): string {
  const headers = [
    '№', t('Артикул'), t('Бренд'), t('Наименование'), t('Кол-во'), t('Цена, ₽'), t('Наличие'),
  ];
  const matrix = rows.map((r, i) => [
    i + 1,
    r.p.article,
    r.p.brand,
    t(r.p.name),
    r.qty,
    r.p.price != null ? (fmt(r.p.price) ?? '') : t('по запросу'),
    r.p.stock === 'in' ? t('в наличии') : t('под заказ'),
  ]);
  return toCsv(headers, matrix);
}

/** Trigger a client-side download of a CSV string. */
export function downloadCsv(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
