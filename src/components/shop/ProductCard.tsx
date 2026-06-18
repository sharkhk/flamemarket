"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, Box } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/supabase";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const isLowStock = product.stock > 0 && product.stock <= 3;
  const isOutOfStock = product.stock === 0;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:border-gold/40 hover:shadow-lg hover:shadow-gold/5 transition-all duration-300"
    >
      {/* Image */}
      <Link href={`/shop/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-secondary">
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground/30">
              <Box className="h-10 w-10" />
              <span className="text-xs">No image</span>
            </div>
          )}

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.model_url && (
              <Badge
                variant="secondary"
                className="text-[10px] py-0.5 px-2 gap-1 bg-background/80 backdrop-blur-sm"
              >
                <Box className="h-2.5 w-2.5" />
                3D Preview
              </Badge>
            )}
            {isLowStock && (
              <Badge className="text-[10px] py-0.5 px-2 bg-amber-500 text-white border-0">
                Only {product.stock} left
              </Badge>
            )}
            {isOutOfStock && (
              <Badge className="text-[10px] py-0.5 px-2 bg-destructive text-white border-0">
                Sold out
              </Badge>
            )}
          </div>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4">
        <Link href={`/shop/${product.slug}`}>
          <h3 className="font-heading font-semibold text-sm leading-tight mb-1 hover:text-gold transition-colors">
            {product.name}
          </h3>
        </Link>
        {product.category && (
          <p className="text-xs text-muted-foreground mb-3 capitalize">
            {product.category.replace(/-/g, " ")}
          </p>
        )}

        <div className="flex items-center justify-between gap-2">
          <span className="font-heading font-bold text-base text-gold">
            {formatPrice(product.price)}
          </span>

          <Button
            size="sm"
            variant="outline"
            className="h-8 px-3 text-xs hover:bg-gold hover:text-white hover:border-gold transition-colors gap-1.5"
            asChild
            disabled={isOutOfStock}
          >
            <Link href={`/shop/${product.slug}`}>
              <ShoppingBag className="h-3 w-3" />
              {isOutOfStock ? "Sold Out" : "Add to Cart"}
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
