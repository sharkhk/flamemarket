import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";
import { slugify } from "@/lib/utils";

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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  return NextResponse.json(data);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const body = await request.json();
    const supabase = createServiceClient();

    const { data, error } = await supabase
      .from("products")
      .update({
        name: body.name,
        slug: body.slug || slugify(body.name),
        category: body.category || null,
        description: body.description || null,
        price: parseFloat(body.price),
        stock: parseInt(body.stock) || 0,
        weight_grams: body.weight ? parseFloat(body.weight) : 0,
        dimensions: body.dimensions || null,
        available_colors: body.colors ?? [],
        available_sizes: body.sizes ?? [],
        images: body.images ?? [],
        model_url: body.modelUrl || null,
        is_active: body.isActive ?? true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const supabase = createServiceClient();
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
