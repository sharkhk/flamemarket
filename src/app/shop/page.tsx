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

  // Extract unique categories
  const categories = Array.from(
    new Set(
      allProducts
        .map((p) => p.category)
        .filter((c): c is string => c !== null && c !== "")
    )
  ).sort();

  // Filter by category
  let filtered = activeCategory
    ? allProducts.filter((p) => p.category === activeCategory)
    : allProducts;

  // Sort
  if (activeSort === "price-asc") {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (activeSort === "price-desc") {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  }
  // default: newest (already ordered by created_at desc from Supabase)

  return (
    <>
      <Header />
      <main className="flex-1 pt-20 lg:pt-24">
        {/* Hero text */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="mb-2">
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-gold">
              FLAMEMARKET
            </span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-4">
            The Catalogue
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-xl">
            Figures, miniatures, and custom prints — all made to order and
            shipped directly from our UAE workshop.
          </p>
        </section>

        {/* Filter + Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <FilterPanel
            categories={categories}
            activeCategory={activeCategory}
            activeSort={activeSort}
          />
          <div className="mt-8">
            <ProductGrid products={filtered} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
