"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { EyeOff, Eye } from "lucide-react";

interface Props {
  id: string;
  isActive: boolean;
}

export default function ProductToggleActive({ id, isActive }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${id}/toggle`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (!res.ok) throw new Error((await res.json()).error ?? "Request failed");

      toast.success(isActive ? "Product deactivated" : "Product activated");
      router.refresh();
    } catch {
      toast.error("Failed to update product status");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 px-2 text-muted-foreground hover:text-foreground"
      onClick={handleToggle}
      disabled={loading}
    >
      {isActive ? (
        <>
          <EyeOff className="w-3.5 h-3.5 mr-1" />
          Deactivate
        </>
      ) : (
        <>
          <Eye className="w-3.5 h-3.5 mr-1" />
          Activate
        </>
      )}
    </Button>
  );
}
