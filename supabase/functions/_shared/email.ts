// ELEZON — shared helpers for the notification Edge Functions
// (notify-order, notify-lead). Sends mail through the Resend HTTP API and
// guards the function with a shared-secret header. No SDK dependency — the
// Resend REST endpoint is called with fetch.

const RESEND_ENDPOINT = "https://api.resend.com/emails";

export interface MailInput {
  subject: string;
  html: string;
  text: string;
}

/**
 * Returns true if the request is allowed. When WEBHOOK_SECRET is configured,
 * the caller (the database webhook) must send a matching `x-webhook-secret`
 * header. If the secret is unset the check is skipped — set it to lock down.
 */
export function authorize(req: Request): boolean {
  const expected = Deno.env.get("WEBHOOK_SECRET");
  if (!expected) return true;
  return req.headers.get("x-webhook-secret") === expected;
}

/** Escapes a value for safe interpolation into the HTML email body. */
export function esc(value: unknown): string {
  return String(value ?? "").replace(/[&<>"']/g, (c) => {
    switch (c) {
      case "&": return "&amp;";
      case "<": return "&lt;";
      case ">": return "&gt;";
      case '"': return "&quot;";
      default: return "&#39;";
    }
  });
}

export async function sendMail({ subject, html, text }: MailInput): Promise<void> {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  const to = Deno.env.get("NOTIFY_EMAIL");
  // Until a domain is verified in Resend, the sender must be onboarding@resend.dev
  // and the recipient must be the Resend account owner's email.
  const from = Deno.env.get("NOTIFY_FROM") ?? "ELEZON <onboarding@resend.dev>";

  if (!apiKey) throw new Error("RESEND_API_KEY is not set");
  if (!to) throw new Error("NOTIFY_EMAIL is not set");

  const res = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: [to], subject, html, text }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Resend ${res.status}: ${detail}`);
  }
}

/** Wraps inner HTML in a minimal, email-client-safe shell. */
export function emailShell(title: string, inner: string): string {
  return `<!doctype html><html><body style="margin:0;background:#f4f5f6;padding:24px;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#1a1c1e">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
    <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:14px;overflow:hidden;border:1px solid #e6e8ea">
      <tr><td style="background:#16181a;padding:18px 24px;color:#d6ff3f;font-weight:700;letter-spacing:.5px;font-size:18px">ELEZON</td></tr>
      <tr><td style="padding:24px">
        <h1 style="margin:0 0 16px;font-size:18px">${esc(title)}</h1>
        ${inner}
      </td></tr>
      <tr><td style="padding:16px 24px;border-top:1px solid #eef0f1;color:#8b9094;font-size:12px">Это автоматическое уведомление от сайта ELEZON.</td></tr>
    </table>
  </td></tr></table>
</body></html>`;
}
