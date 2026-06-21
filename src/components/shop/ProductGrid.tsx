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
  visible: { transition: { staggerChildren: 0.07 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center justify-center py-32 text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-5">
          <PackageSearch className="h-8 w-8 text-muted-foreground/40" />
        </div>
        <h3 className="font-heading text-lg font-semibold mb-2">Nothing here yet</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Try a different category or check back later for new additions.
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
      className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5"
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={itemVariants}>
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
}
