import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Truck, Shield, RotateCcw } from "lucide-react";
import { createServiceClient } from "@/lib/supabase-server";
import type { Product } from "@/lib/supabase";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ImageGallery from "@/components/product/ImageGallery";
import ProductViewer3D from "@/components/product/ProductViewer3D";
import CustomizationForm from "@/components/product/CustomizationForm";
import { formatPrice } from "@/lib/utils";

async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();
    return (data as Product) ?? null;
  } catch {
    return null;
  }
}

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
    description: product.description ?? `Shop ${product.name} at FLAMEMARKET.`,
    openGraph: {
      title: `${product.name} | FLAMEMARKET`,
      description: product.description ?? "",
      images: product.images[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

const TRUST_ITEMS = [
  { icon: Shield, label: "Secure payment", sub: "via Ziina" },
  { icon: Truck, label: "Fast delivery", sub: "Aramex UAE" },
  { icon: RotateCcw, label: "Freshly printed", sub: "Every order" },
];

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const categoryLabel = product.category
    ? product.category.replace(/-/g, " ")
    : null;

  return (
    <>
      <Header />
      <main className="flex-1 pt-20 lg:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-14">

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8">
            <Link href="/shop" className="hover:text-[#C9943A] transition-colors">
              Shop
            </Link>
            <ChevronRight className="h-3 w-3 flex-shrink-0" />
            <span className="text-foreground font-medium truncate max-w-[200px]">
              {product.name}
            </span>
          </nav>

          {/* Product layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">

            {/* Left — sticky image column */}
            <div className="lg:sticky lg:top-28 lg:self-start space-y-5">
              <ImageGallery images={product.images} />
              {product.model_url && (
                <ProductViewer3D modelUrl={product.model_url} />
              )}
            </div>

            {/* Right — product info */}
            <div className="flex flex-col">

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-5">
                {categoryLabel && (
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] px-3 py-1 rounded-full border border-[#C9943A]/40 text-[#C9943A] bg-[#C9943A]/10">
                    {categoryLabel}
                  </span>
                )}
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] px-3 py-1 rounded-full border border-border text-muted-foreground">
                  Made to order
                </span>
                {product.model_url && (
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] px-3 py-1 rounded-full border border-[#C9943A]/30 text-[#C9943A]/80 bg-[#C9943A]/5">
                    3D viewer ↗
                  </span>
                )}
              </div>

              {/* Name */}
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-5">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-2">
                <span className="font-heading text-4xl font-extrabold text-[#C9943A]">
                  {formatPrice(product.price)}
                </span>
                <span className="text-muted-foreground text-sm">AED · incl. VAT</span>
              </div>

              {/* Stock indicator */}
              {product.stock > 0 && product.stock <= 5 && (
                <p className="text-amber-500 text-xs font-medium mb-4">
                  Only {product.stock} left — order soon
                </p>
              )}
              {product.stock === 0 && (
                <p className="text-destructive text-xs font-medium mb-4">
                  Currently out of stock
                </p>
              )}

              {/* Gold divider */}
              <div
                className="my-5 h-px"
                style={{ background: "linear-gradient(to right, #C9943A44, transparent)" }}
              />

              {/* Description */}
              {product.description && (
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  {product.description}
                </p>
              )}

              {/* Delivery row */}
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-secondary/60 border border-border mb-6">
                <Truck className="h-4 w-4 text-[#C9943A] flex-shrink-0" />
                <span className="text-sm text-muted-foreground">
                  Ships in{" "}
                  <strong className="text-foreground font-semibold">3–7 business days</strong>{" "}
                  via Aramex to all UAE emirates
                </span>
              </div>

              {/* Specs */}
              {(product.dimensions || product.weight_grams > 0) && (
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {product.weight_grams > 0 && (
                    <div className="p-3.5 rounded-xl bg-secondary border border-border">
                      <p className="text-muted-foreground text-[10px] uppercase tracking-wider mb-1 font-medium">Weight</p>
                      <p className="font-heading font-semibold text-sm">{product.weight_grams}g</p>
                    </div>
                  )}
                  {product.dimensions && (
                    <div className="p-3.5 rounded-xl bg-secondary border border-border">
                      <p className="text-muted-foreground text-[10px] uppercase tracking-wider mb-1 font-medium">Dimensions</p>
                      <p className="font-heading font-semibold text-sm">
                        {product.dimensions.l} × {product.dimensions.w} × {product.dimensions.h} cm
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Customization + Add to Cart */}
              <CustomizationForm product={product} />

              {/* Trust row */}
              <div className="mt-6 pt-6 border-t border-border grid grid-cols-3 gap-2 text-center">
                {TRUST_ITEMS.map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="flex flex-col items-center gap-1.5">
                    <div className="w-8 h-8 rounded-lg bg-[#C9943A]/10 flex items-center justify-center">
                      <Icon className="h-4 w-4 text-[#C9943A]" />
                    </div>
                    <span className="text-xs font-medium leading-tight">{label}</span>
                    <span className="text-[10px] text-muted-foreground">{sub}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
