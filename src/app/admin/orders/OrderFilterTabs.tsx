"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
] as const;

type FilterValue = (typeof tabs)[number]["value"];

interface Props {
  activeFilter: string;
}

export default function OrderFilterTabs({ activeFilter }: Props) {
  return (
    <div className="flex gap-1 border border-border rounded-lg p-1 w-fit bg-muted/30">
      {tabs.map(({ label, value }) => (
        <Link
          key={value}
          href={value === "all" ? "/admin/orders" : `/admin/orders?filter=${value}`}
          className={cn(
            "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
            activeFilter === value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {label}
        </Link>
      ))}
    </div>
  );
}
