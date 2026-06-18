import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import AdminSidebar from "./AdminSidebar";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const IS_DEV_MOCK =
  process.env.USE_MOCK_DB === "true" ||
  !supabaseUrl ||
  supabaseUrl.includes("your-project-id");

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Dev mock: use a simple cookie for auth instead of Supabase session
  if (IS_DEV_MOCK) {
    const cookieStore = await cookies();
    const devAuth = cookieStore.get("flamemarket-dev-auth")?.value;
    if (devAuth !== "authenticated") {
      redirect("/admin");
    }
  } else {
    const supabase = await createSupabaseServerClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) redirect("/admin");
  }

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      <main className="flex-1 ml-60 min-h-screen overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
