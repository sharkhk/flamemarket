"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Box, Eye } from "lucide-react";
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
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group relative rounded-2xl overflow-hidden bg-card border border-border hover:border-[rgba(201,148,58,0.45)] hover:shadow-[0_0_28px_rgba(201,148,58,0.12)] transition-all duration-300"
    >
      <Link href={`/shop/${product.slug}`} className="block">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-secondary">
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-108"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground/20">
              <Box className="h-12 w-12" />
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          {/* Top badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
            {product.category && (
              <span className="bg-black/55 backdrop-blur-sm text-white/80 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/10">
                {product.category.replace(/-/g, " ")}
              </span>
            )}
            {product.model_url && (
              <span className="bg-[rgba(201,148,58,0.25)] backdrop-blur-sm text-[#C9943A] text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-[rgba(201,148,58,0.3)] flex items-center gap-1">
                <Box className="h-2.5 w-2.5" /> 3D
              </span>
            )}
          </div>

          {/* Stock badges */}
          <div className="absolute top-2.5 right-2.5">
            {isLowStock && (
              <span className="bg-amber-500/90 backdrop-blur-sm text-white text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full">
                {product.stock} left
              </span>
            )}
            {isOutOfStock && (
              <span className="bg-red-600/90 backdrop-blur-sm text-white text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full">
                Sold out
              </span>
            )}
          </div>

          {/* Eye hover button */}
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200">
            <div className="h-8 w-8 rounded-xl bg-[#C9943A] flex items-center justify-center shadow-lg">
              <Eye className="h-3.5 w-3.5 text-white" />
            </div>
          </div>
        </div>

        {/* Bottom info strip — always visible */}
        <div className="px-3.5 py-3">
          <h3 className="font-heading font-semibold text-sm leading-tight truncate mb-1">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <span className="font-heading font-bold text-[#C9943A] text-sm">
              {formatPrice(product.price)}
            </span>
            {isOutOfStock && (
              <span className="text-[10px] text-muted-foreground">Out of stock</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
