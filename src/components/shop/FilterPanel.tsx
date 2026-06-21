"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterPanelProps {
  categories: string[];
  activeCategory: string | null;
  activeSort: string | null;
}

const SORT_OPTIONS = [
  { value: "", label: "Newest" },
  { value: "price-asc", label: "Price ↑" },
  { value: "price-desc", label: "Price ↓" },
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

  return (
    <div className="flex items-center gap-3">
      {/* Category pills */}
      <div className="flex-1 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-2 w-max">
          <button
            onClick={() => updateParams("category", null)}
            className={cn(
              "inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 whitespace-nowrap border",
              activeCategory === null
                ? "bg-[#C9943A] text-white border-[#C9943A] shadow-[0_0_12px_rgba(201,148,58,0.4)]"
                : "bg-transparent text-muted-foreground border-border hover:border-[#C9943A]/60 hover:text-foreground"
            )}
          >
            ALL
          </button>

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => updateParams("category", cat)}
              className={cn(
                "inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 whitespace-nowrap border",
                activeCategory === cat
                  ? "bg-[#C9943A] text-white border-[#C9943A] shadow-[0_0_12px_rgba(201,148,58,0.4)]"
                  : "bg-transparent text-muted-foreground border-border hover:border-[#C9943A]/60 hover:text-foreground"
              )}
            >
              {formatCategoryLabel(cat).toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="w-px h-5 bg-border flex-shrink-0" />

      {/* Sort */}
      <div className="relative flex-shrink-0 flex items-center gap-1.5">
        <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
        <select
          value={activeSort ?? ""}
          onChange={(e) => updateParams("sort", e.target.value || null)}
          className={cn(
            "appearance-none pl-1 pr-6 py-1 text-xs font-medium",
            "bg-transparent text-muted-foreground",
            "hover:text-foreground",
            "focus:outline-none focus:text-foreground",
            "transition-colors duration-200 cursor-pointer"
          )}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
      </div>
    </div>
  );
}
