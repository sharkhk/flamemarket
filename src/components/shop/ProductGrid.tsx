"use client";

import { motion, type Variants } from "framer-motion";
import { PackageSearch } from "lucide-react";
import ProductCard from "@/components/shop/ProductCard";
import type { Product } from "@/lib/supabase";

interface ProductGridProps {
  products: Product[];
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center justify-center py-24 text-center"
      >
        <PackageSearch className="h-12 w-12 text-muted-foreground/40 mb-4" />
        <h3 className="font-heading text-lg font-semibold text-muted-foreground mb-1">
          No products found
        </h3>
        <p className="text-sm text-muted-foreground/60 max-w-xs">
          Try selecting a different category or check back later for new
          additions to the collection.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      key={products.map((p) => p.id).join(",")}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={itemVariants}>
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
}
