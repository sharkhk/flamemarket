"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterPanelProps {
  categories: string[];
  activeCategory: string | null;
  activeSort: string | null;
}

const SORT_OPTIONS = [
  { value: "", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

function formatCategoryLabel(cat: string): string {
  return cat
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function FilterPanel({
  categories,
  activeCategory,
  activeSort,
}: FilterPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParams = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/shop?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handleCategoryClick = (cat: string | null) => {
    updateParams("category", cat);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateParams("sort", e.target.value || null);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
      {/* Category pills — horizontally scrollable */}
      <div className="flex-1 overflow-x-auto pb-1 -mb-1 scrollbar-none">
        <div className="flex items-center gap-2 w-max">
          {/* All pill */}
          <button
            onClick={() => handleCategoryClick(null)}
            className={cn(
              "inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap border",
              activeCategory === null
                ? "bg-gold text-white border-gold shadow-sm"
                : "bg-transparent text-muted-foreground border-border hover:border-gold hover:text-foreground"
            )}
          >
            All
          </button>

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={cn(
                "inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap border",
                activeCategory === cat
                  ? "bg-gold text-white border-gold shadow-sm"
                  : "bg-transparent text-muted-foreground border-border hover:border-gold hover:text-foreground"
              )}
            >
              {formatCategoryLabel(cat)}
            </button>
          ))}
        </div>
      </div>

      {/* Sort dropdown */}
      <div className="relative flex-shrink-0">
        <select
          value={activeSort ?? ""}
          onChange={handleSortChange}
          className={cn(
            "appearance-none pl-3 pr-8 py-1.5 rounded-full text-sm font-medium",
            "bg-transparent border border-border text-muted-foreground",
            "hover:border-gold hover:text-foreground",
            "focus:outline-none focus:border-gold focus:text-foreground",
            "transition-all duration-200 cursor-pointer"
          )}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
      </div>
    </div>
  );
}
