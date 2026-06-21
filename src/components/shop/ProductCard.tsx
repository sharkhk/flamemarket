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
      whileHover={{
        y: -6,
        boxShadow: "0 0 28px rgba(201,148,58,0.2), 0 8px 32px rgba(0,0,0,0.4)",
      }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group relative rounded-2xl overflow-hidden bg-card border border-border hover:border-[rgba(201,148,58,0.5)] transition-colors duration-300"
    >
      <Link
        href={`/shop/${product.slug}`}
        className="block relative aspect-square overflow-hidden bg-secondary"
      >
        {/* Image */}
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground/20">
            <Box className="h-12 w-12" />
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent transition-opacity duration-300 group-hover:from-black/90" />

        {/* Top-left badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.category && (
            <span className="bg-black/50 backdrop-blur-sm text-white/80 text-[10px] font-medium px-2.5 py-1 rounded-full capitalize border border-white/10">
              {product.category.replace(/-/g, " ")}
            </span>
          )}
          {product.model_url && (
            <span className="bg-[rgba(201,148,58,0.2)] backdrop-blur-sm text-[#C9943A] text-[10px] font-medium px-2.5 py-1 rounded-full border border-[rgba(201,148,58,0.3)] flex items-center gap-1">
              <Box className="h-2.5 w-2.5" /> 3D
            </span>
          )}
        </div>

        {/* Top-right badges */}
        <div className="absolute top-3 right-3">
          {isLowStock && (
            <span className="bg-amber-500/90 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
              {product.stock} left
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-red-600/90 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
              Sold out
            </span>
          )}
        </div>

        {/* Bottom info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-end justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="font-heading font-semibold text-white text-sm leading-tight truncate">
                {product.name}
              </h3>
              <p className="text-[#C9943A] text-sm font-bold mt-1">
                {formatPrice(product.price)}
              </p>
            </div>
            {/* View button — fades + slides up on hover */}
            <div className="opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 shrink-0">
              <div className="h-9 w-9 rounded-xl bg-[#C9943A] flex items-center justify-center shadow-lg">
                <Eye className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
