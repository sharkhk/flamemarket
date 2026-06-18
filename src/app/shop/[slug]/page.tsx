import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { createServiceClient } from "@/lib/supabase-server";
import type { Product } from "@/lib/supabase";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ImageGallery from "@/components/product/ImageGallery";
import ProductViewer3D from "@/components/product/ProductViewer3D";
import CustomizationForm from "@/components/product/CustomizationForm";
import { Badge } from "@/components/ui/badge";
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

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const categoryLabel = product.category
    ? product.category.replace(/-/g, " ")
    : null;

  return (
    <>
      <Header />
      <main className="flex-1 pt-20 lg:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8"
          >
            <Link
              href="/"
              className="hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <ChevronRight className="h-3 w-3 flex-shrink-0" />
            <Link
              href="/shop"
              className="hover:text-foreground transition-colors"
            >
              Shop
            </Link>
            <ChevronRight className="h-3 w-3 flex-shrink-0" />
            <span className="text-foreground font-medium truncate max-w-[200px]">
              {product.name}
            </span>
          </nav>

          {/* Product layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Left column: images + 3D viewer */}
            <div className="space-y-6">
              <ImageGallery images={product.images} />
              {product.model_url && (
                <ProductViewer3D modelUrl={product.model_url} />
              )}
            </div>

            {/* Right column: product info + form */}
            <div className="flex flex-col">
              {/* Category badge */}
              {categoryLabel && (
                <Badge
                  variant="secondary"
                  className="self-start mb-4 capitalize text-xs tracking-wide"
                >
                  {categoryLabel}
                </Badge>
              )}

              {/* Name */}
              <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3">
                {product.name}
              </h1>

              {/* Price */}
              <p className="font-heading text-2xl font-bold text-gold mb-5">
                {formatPrice(product.price)}
              </p>

              {/* Description */}
              {product.description && (
                <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                  {product.description}
                </p>
              )}

              {/* Dimensions / weight metadata */}
              {(product.dimensions || product.weight_grams > 0) && (
                <div className="grid grid-cols-2 gap-3 mb-8 p-4 bg-secondary rounded-xl text-sm">
                  {product.weight_grams > 0 && (
                    <div>
                      <p className="text-muted-foreground text-xs uppercase tracking-wider mb-0.5">
                        Weight
                      </p>
                      <p className="font-medium">{product.weight_grams}g</p>
                    </div>
                  )}
                  {product.dimensions && (
                    <div>
                      <p className="text-muted-foreground text-xs uppercase tracking-wider mb-0.5">
                        Dimensions
                      </p>
                      <p className="font-medium">
                        {product.dimensions.l} × {product.dimensions.w} ×{" "}
                        {product.dimensions.h} cm
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Customization form */}
              <CustomizationForm product={product} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
