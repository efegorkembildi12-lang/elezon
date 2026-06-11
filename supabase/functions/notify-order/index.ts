// ELEZON — notify-order Edge Function.
// Invoked by a database webhook on INSERT into public.orders. Emails the
// company a formatted summary of the new price request via Resend.

import { authorize, emailShell, esc, sendMail } from "../_shared/email.ts";

interface OrderItem {
  name?: string;
  article?: string;
  qty?: number;
}

interface OrderRecord {
  num?: string;
  date?: string;
  company?: string;
  contact?: string;
  phone?: string;
  email?: string;
  comment?: string;
  total?: number | null;
  items?: OrderItem[];
  channel?: string;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ ok: false, error: "method" }, 405);
  if (!authorize(req)) return json({ ok: false, error: "unauthorized" }, 401);

  let record: OrderRecord;
  try {
    const body = await req.json();
    record = (body?.record ?? body) as OrderRecord;
  } catch {
    return json({ ok: false, error: "bad payload" }, 400);
  }

  const items = Array.isArray(record.items) ? record.items : [];
  const rows = items
    .map(
      (it) =>
        `<tr>
          <td style="padding:6px 10px;border-bottom:1px solid #eef0f1">${esc(it.name)}</td>
          <td style="padding:6px 10px;border-bottom:1px solid #eef0f1;color:#8b9094;font-family:monospace">${esc(it.article)}</td>
          <td style="padding:6px 10px;border-bottom:1px solid #eef0f1;text-align:right">${esc(it.qty)}</td>
        </tr>`,
    )
    .join("");

  const itemsTable = items.length
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 18px;border:1px solid #eef0f1;border-radius:10px;border-collapse:separate;border-spacing:0;overflow:hidden">
        <tr style="background:#f8f9fa">
          <th align="left" style="padding:8px 10px;font-size:12px;color:#8b9094;text-transform:uppercase;letter-spacing:.4px">Наименование</th>
          <th align="left" style="padding:8px 10px;font-size:12px;color:#8b9094;text-transform:uppercase;letter-spacing:.4px">Артикул</th>
          <th align="right" style="padding:8px 10px;font-size:12px;color:#8b9094;text-transform:uppercase;letter-spacing:.4px">Кол-во</th>
        </tr>
        ${rows}
      </table>`
    : `<p style="color:#8b9094">Список позиций пуст.</p>`;

  const field = (label: string, value: unknown) =>
    value
      ? `<tr><td style="padding:3px 0;color:#8b9094;width:140px">${esc(label)}</td><td style="padding:3px 0;font-weight:600">${esc(value)}</td></tr>`
      : "";

  const inner = `
    <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:14px;margin-bottom:18px">
      ${field("Номер", record.num)}
      ${field("Дата", record.date)}
      ${field("Организация", record.company)}
      ${field("Контакт", record.contact)}
      ${field("Телефон", record.phone)}
      ${field("E-mail", record.email)}
    </table>
    <div style="font-size:13px;color:#8b9094;text-transform:uppercase;letter-spacing:.4px;margin-bottom:4px">Состав заявки (${items.length})</div>
    ${itemsTable}
    ${record.comment ? `<div style="font-size:13px;color:#8b9094;margin-bottom:4px">Комментарий клиента</div><div style="padding:10px 12px;background:#f8f9fa;border-radius:8px;font-size:14px">${esc(record.comment)}</div>` : ""}
  `;

  const subject = `Новая заявка${record.num ? " " + record.num : ""}${record.company ? " — " + record.company : ""}`;
  const html = emailShell("Новая заявка с сайта", inner);
  const text = [
    subject,
    record.date ? `Дата: ${record.date}` : "",
    record.company ? `Организация: ${record.company}` : "",
    record.contact ? `Контакт: ${record.contact}` : "",
    record.phone ? `Телефон: ${record.phone}` : "",
    record.email ? `E-mail: ${record.email}` : "",
    "",
    "Позиции:",
    ...items.map((it) => ` - ${it.name ?? ""} [${it.article ?? ""}] × ${it.qty ?? ""}`),
    record.comment ? `\nКомментарий: ${record.comment}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  try {
    await sendMail({ subject, html, text });
  } catch (e) {
    console.error("notify-order failed:", e);
    return json({ ok: false, error: String(e) }, 500);
  }
  return json({ ok: true });
});
