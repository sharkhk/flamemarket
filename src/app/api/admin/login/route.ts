import { NextRequest, NextResponse } from "next/server";

function isMockMode(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return (
    process.env.USE_MOCK_DB === "true" ||
    !url ||
    url.includes("your-project-id")
  );
}

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }

  if (isMockMode()) {
    const validEmail = process.env.ADMIN_EMAIL;
    const validPassword = process.env.ADMIN_PASSWORD;

    if (email !== validEmail || password !== validPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set("flamemarket-dev-auth", "authenticated", {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
    });
    return res;
  }

  // Production: authenticate via Supabase
  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
