// ELEZON — team management Edge Function.
// Creating / deleting Supabase Auth users needs the service role, which must
// never reach the browser. This function does it server-side, but only after
// verifying the CALLER is an admin (valid JWT + is_admin()). Actions: list, add,
// remove. SUPABASE_URL / SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY are
// injected automatically by the Supabase runtime — no secrets to set.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });

const isEmail = (s: unknown): s is string =>
  typeof s === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  // 1) Verify the caller is a signed-in admin.
  const authHeader = req.headers.get("Authorization") ?? "";
  if (!authHeader.startsWith("Bearer ")) return json({ error: "Unauthorized" }, 401);
  const caller = createClient(SUPABASE_URL, ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: userData, error: userErr } = await caller.auth.getUser();
  if (userErr || !userData.user) return json({ error: "Unauthorized" }, 401);
  const { data: isAdmin } = await caller.rpc("is_admin");
  if (isAdmin !== true) return json({ error: "Forbidden" }, 403);
  const callerId = userData.user.id;

  // 2) Service-role client for the privileged operations.
  const svc = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch { /* empty body */ }
  const action = body.action;

  if (action === "list") {
    const { data, error } = await svc
      .from("admins")
      .select("user_id, email, name, role, created_at")
      .order("created_at", { ascending: true });
    if (error) return json({ error: error.message }, 500);
    return json({ members: data });
  }

  if (action === "add") {
    const { email, password, name, role } = body as Record<string, string>;
    if (!isEmail(email)) return json({ error: "invalid_email" }, 400);
    if (!password || password.length < 8) return json({ error: "weak_password" }, 400);

    const { data: created, error: createErr } = await svc.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (createErr || !created.user) return json({ error: createErr?.message ?? "create_failed" }, 400);

    const { data: row, error: insErr } = await svc
      .from("admins")
      .insert({ user_id: created.user.id, email, name: name ?? "", role: role || "Менеджер" })
      .select("user_id, email, name, role, created_at")
      .single();
    if (insErr) {
      // Roll back the auth user so we don't leave an orphan.
      await svc.auth.admin.deleteUser(created.user.id);
      return json({ error: insErr.message }, 500);
    }
    return json({ member: row });
  }

  if (action === "remove") {
    const userId = body.user_id;
    if (typeof userId !== "string") return json({ error: "invalid_user" }, 400);
    if (userId === callerId) return json({ error: "cannot_remove_self" }, 400);

    const { count } = await svc.from("admins").select("user_id", { count: "exact", head: true });
    if ((count ?? 0) <= 1) return json({ error: "last_admin" }, 400);

    const { error: delErr } = await svc.from("admins").delete().eq("user_id", userId);
    if (delErr) return json({ error: delErr.message }, 500);
    await svc.auth.admin.deleteUser(userId); // best-effort; allow-list removal already revokes access
    return json({ ok: true });
  }

  return json({ error: "unknown_action" }, 400);
});
