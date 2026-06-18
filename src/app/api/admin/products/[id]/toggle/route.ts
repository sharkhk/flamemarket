import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";

function isMockMode(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return process.env.USE_MOCK_DB === "true" || !url || url.includes("your-project-id");
}

function isAuthenticated(request: NextRequest): boolean {
  if (isMockMode()) {
    return request.cookies.get("flamemarket-dev-auth")?.value === "authenticated";
  }
  return true;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { isActive } = await request.json();
  const supabase = createServiceClient();

  const { error } = await supabase
    .from("products")
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
