"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Minus, Plus, ShoppingBag, AlertTriangle } from "lucide-react";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/supabase";

interface CustomizationFormProps {
  product: Product;
}

export default function CustomizationForm({ product }: CustomizationFormProps) {
  const { addItem, setOpen } = useCart();

  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product.available_colors.length > 0
      ? product.available_colors[0]
      : undefined
  );
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.available_sizes.length > 0
      ? product.available_sizes[0]
      : undefined
  );
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 3;

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.images[0] ?? "",
      quantity,
      selectedColor,
      selectedSize,
      customizationNotes: notes.trim() || undefined,
    });

    toast.success(`${product.name} added to cart`, {
      description: [
        selectedColor && `Color: ${selectedColor}`,
        selectedSize && `Size: ${selectedSize}`,
        `Qty: ${quantity}`,
      ]
        .filter(Boolean)
        .join(" · ") || undefined,
      action: {
        label: "View cart",
        onClick: () => setOpen(true),
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Color picker */}
      {product.available_colors.length > 0 && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Color
            {selectedColor && (
              <span className="ml-2 font-normal text-muted-foreground capitalize">
                — {selectedColor}
              </span>
            )}
          </Label>
          <div className="flex flex-wrap gap-2.5">
            {product.available_colors.map((color) => (
              <button
                key={color}
                title={color}
                onClick={() => setSelectedColor(color)}
                className={cn(
                  "h-8 w-8 rounded-full border-2 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2",
                  selectedColor === color
                    ? "ring-2 ring-gold ring-offset-2 border-gold/20 scale-110"
                    : "border-border hover:scale-110 hover:border-gold/40"
                )}
                style={{ backgroundColor: color }}
                aria-label={`Select color ${color}`}
                aria-pressed={selectedColor === color}
              />
            ))}
          </div>
        </div>
      )}

      {/* Size picker */}
      {product.available_sizes.length > 0 && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">Size</Label>
          <div className="flex flex-wrap gap-2">
            {product.available_sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-150",
                  selectedSize === size
                    ? "bg-gold text-white border-gold"
                    : "bg-transparent text-muted-foreground border-border hover:border-gold hover:text-foreground"
                )}
                aria-pressed={selectedSize === size}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity stepper */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Quantity</Label>
        <div className="flex items-center gap-0 border border-border rounded-full w-fit overflow-hidden">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1 || isOutOfStock}
            className="h-9 w-9 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Decrease quantity"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="w-10 text-center text-sm font-medium tabular-nums select-none">
            {quantity}
          </span>
          <button
            onClick={() =>
              setQuantity((q) => Math.min(product.stock || 99, q + 1))
            }
            disabled={isOutOfStock || quantity >= product.stock}
            className="h-9 w-9 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Increase quantity"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Notes textarea */}
      <div className="space-y-2">
        <Label htmlFor="customization-notes" className="text-sm font-medium">
          Special Requests{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <Textarea
          id="customization-notes"
          placeholder="Any special requests? e.g. custom color, inscription..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="resize-none text-sm"
          disabled={isOutOfStock}
        />
      </div>

      {/* Stock warning */}
      {isLowStock && (
        <div className="flex items-center gap-2 text-amber-500 text-sm">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          <span>Only {product.stock} left in stock</span>
        </div>
      )}

      {/* Add to Cart / Out of Stock button */}
      {isOutOfStock ? (
        <Button
          size="lg"
          disabled
          className="w-full bg-muted text-muted-foreground border border-border cursor-not-allowed"
        >
          Out of Stock
        </Button>
      ) : (
        <Button
          size="lg"
          onClick={handleAddToCart}
          className="w-full bg-[#C9943A] hover:opacity-90 text-white font-semibold gap-2 glow-gold"
        >
          <ShoppingBag className="h-4 w-4" />
          Add to Cart
        </Button>
      )}
    </div>
  );
}
