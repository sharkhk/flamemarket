import { NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const IS_DEV_MOCK =
  process.env.USE_MOCK_DB === "true" ||
  !supabaseUrl ||
  supabaseUrl.includes("your-project-id");

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin/** routes; let /admin (login page) and /api/admin/login through
  const isAdminRoute = pathname.startsWith("/admin/");
  if (!isAdminRoute) return NextResponse.next();

  // Dev mock: check for the dev auth cookie
  if (IS_DEV_MOCK) {
    const devAuth = request.cookies.get("flamemarket-dev-auth")?.value;
    if (devAuth !== "authenticated") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  // Production: check Supabase session
  const { createServerClient } = await import("@supabase/ssr");
  const response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path+"],
};
