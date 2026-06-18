import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";
import { slugify } from "@/lib/utils";

function isAuthenticated(request: NextRequest): boolean {
  if (process.env.USE_MOCK_DB === "true") {
    return request.cookies.get("flamemarket-dev-auth")?.value === "authenticated";
  }
  return true; // production auth handled by Supabase session middleware
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const supabase = createServiceClient();

    const { data, error } = await supabase
      .from("products")
      .insert({
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
        images: body.imageUrls ?? [],
        model_url: body.modelUrl || null,
        is_active: body.isActive ?? true,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
