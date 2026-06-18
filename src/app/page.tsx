import { createServiceClient } from "@/lib/supabase-server";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import BrandStory from "@/components/home/BrandStory";
import type { Product } from "@/lib/supabase";

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .gt("stock", 0)
      .order("created_at", { ascending: false })
      .limit(4);
    return (data as Product[]) ?? [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <FeaturedProducts products={featuredProducts} />
        <BrandStory />
      </main>
      <Footer />
    </>
  );
}
