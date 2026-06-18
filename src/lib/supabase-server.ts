import { createClient } from "@supabase/supabase-js";
import { createMockClient } from "./mock-db";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const IS_DEV_MOCK =
  process.env.USE_MOCK_DB === "true" ||
  !supabaseUrl ||
  supabaseUrl.includes("your-project-id");

// ── Server-auth client (uses cookies) ─────────────────────────────────────
// In dev-mock mode this returns the same mock client.
export async function createSupabaseServerClient() {
  if (IS_DEV_MOCK) return createMockClient() as unknown as Awaited<ReturnType<typeof _realServerClient>>;
  return _realServerClient();
}

async function _realServerClient() {
  const { createServerClient } = await import("@supabase/ssr");
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
}

// ── Service-role client (bypasses RLS) ────────────────────────────────────
export function createServiceClient() {
  if (IS_DEV_MOCK) return createMockClient();

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
