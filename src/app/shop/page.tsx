import { createServiceClient } from "@/lib/supabase-server";
import type { Product } from "@/lib/supabase";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FilterPanel from "@/components/shop/FilterPanel";
import ProductGrid from "@/components/shop/ProductGrid";

async function getProducts(): Promise<Product[]> {
  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });
    return (data as Product[]) ?? [];
  } catch {
    return [];
  }
}

interface ShopPageProps {
  searchParams: Promise<{ category?: string; sort?: string }>;
}

export const metadata = {
  title: "Shop",
  description:
    "Browse FLAMEMARKET — 3D printed figures, miniatures, and custom prints made to order in the UAE.",
};

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const activeCategory = params.category ?? null;
  const activeSort = params.sort ?? null;

  const allProducts = await getProducts();

  const categories = Array.from(
    new Set(
      allProducts
        .map((p) => p.category)
        .filter((c): c is string => c !== null && c !== "")
    )
  ).sort();

  let filtered = activeCategory
    ? allProducts.filter((p) => p.category === activeCategory)
    : allProducts;

  if (activeSort === "price-asc") {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (activeSort === "price-desc") {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  }

  return (
    <>
      <Header />
      <main className="flex-1">

        {/* ── Shop header ── */}
        <section className="relative pt-20 lg:pt-24 overflow-hidden bg-background">
          <div className="absolute inset-0 grid-bg pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#C9943A]/30 to-transparent pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <p className="text-[#C9943A] text-xs font-semibold uppercase tracking-[0.22em] mb-3">
                  FLAMEMARKET · Made in UAE
                </p>
                <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-none">
                  The{" "}
                  <span className="gradient-text">Catalogue</span>
                </h1>
                <p className="text-muted-foreground text-base mt-3 max-w-md">
                  3D printed figures &amp; miniatures, made to order and shipped
                  from our UAE workshop.
                </p>
              </div>

              {/* Product count badge */}
              <div className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#C9943A]/30 bg-[#C9943A]/8 self-start sm:self-auto">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9943A]" />
                <span className="text-[#C9943A] text-sm font-semibold tabular-nums">
                  {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Sticky filter bar ── */}
        <div className="sticky top-[64px] lg:top-[80px] z-30 bg-background/85 backdrop-blur-xl border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <FilterPanel
              categories={categories}
              activeCategory={activeCategory}
              activeSort={activeSort}
            />
          </div>
        </div>

        {/* ── Grid ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-28">
          <ProductGrid products={filtered} />
        </section>

      </main>
      <Footer />
    </>
  );
}
