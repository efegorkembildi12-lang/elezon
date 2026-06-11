// ELEZON — notify-lead Edge Function.
// Invoked by a database webhook on INSERT into public.stock_leads. Emails the
// company when a customer subscribes to a restock alert for an "on order" item.

import { authorize, emailShell, esc, sendMail } from "../_shared/email.ts";

interface LeadRecord {
  email?: string;
  product_name?: string;
  article?: string;
  product_id?: string;
  created_at?: string;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ ok: false, error: "method" }, 405);
  if (!authorize(req)) return json({ ok: false, error: "unauthorized" }, 401);

  let record: LeadRecord;
  try {
    const body = await req.json();
    record = (body?.record ?? body) as LeadRecord;
  } catch {
    return json({ ok: false, error: "bad payload" }, 400);
  }

  const field = (label: string, value: unknown) =>
    value
      ? `<tr><td style="padding:3px 0;color:#8b9094;width:140px">${esc(label)}</td><td style="padding:3px 0;font-weight:600">${esc(value)}</td></tr>`
      : "";

  const inner = `
    <p style="font-size:14px;margin:0 0 16px;color:#41464a">Клиент подписался на уведомление о поступлении товара «под заказ».</p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:14px">
      ${field("Товар", record.product_name)}
      ${field("Артикул", record.article)}
      ${field("E-mail клиента", record.email)}
    </table>
  `;

  const subject = `Подписка на поступление${record.product_name ? " — " + record.product_name : ""}`;
  const html = emailShell("Новая подписка на поступление", inner);
  const text = [
    subject,
    record.product_name ? `Товар: ${record.product_name}` : "",
    record.article ? `Артикул: ${record.article}` : "",
    record.email ? `E-mail клиента: ${record.email}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  try {
    await sendMail({ subject, html, text });
  } catch (e) {
    console.error("notify-lead failed:", e);
    return json({ ok: false, error: String(e) }, 500);
  }
  return json({ ok: true });
});
