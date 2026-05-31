import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

export type GuardResult =
  | { ok: true; userEmail: string; supabaseAdmin: ReturnType<typeof createClient> }
  | { ok: false; status: number; message: string };

export async function adminGuard(req: Request): Promise<GuardResult> {
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const ADMIN_EMAIL = (Deno.env.get("ADMIN_EMAIL") || "").toLowerCase();

  if (!SUPABASE_URL || !SERVICE_ROLE) {
    return { ok: false, status: 500, message: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY" };
  }

  const authHeader = req.headers.get("authorization") || req.headers.get("Authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!token) return { ok: false, status: 401, message: "Missing Bearer token" };

  const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data?.user) return { ok: false, status: 401, message: "Invalid token" };

  const email = (data.user.email || "").toLowerCase();
  if (!email || (ADMIN_EMAIL && email !== ADMIN_EMAIL)) return { ok: false, status: 403, message: "Not authorized" };

  return { ok: true, userEmail: email, supabaseAdmin };
}

export function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" }
  });
}