"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function CartDrawer() {
  const { items, isOpen, setOpen, removeItem, updateQuantity, subtotal } =
    useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-background border-l border-border flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#C9943A]/10 flex items-center justify-center">
                  <ShoppingBag className="h-4 w-4 text-[#C9943A]" />
                </div>
                <h2 className="font-heading font-semibold">Cart</h2>
                {items.length > 0 && (
                  <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                    {items.length}
                  </span>
                )}
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence initial={false}>
                {items.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-full gap-5 text-center px-6 py-20"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-secondary border border-border flex items-center justify-center">
                      <ShoppingBag className="h-7 w-7 text-muted-foreground/40" />
                    </div>
                    <div>
                      <p className="font-heading font-semibold mb-1">Your cart is empty</p>
                      <p className="text-sm text-muted-foreground">Add something from the shop</p>
                    </div>
                    <Button
                      variant="outline"
                      className="border-[#C9943A]/40 hover:border-[#C9943A] hover:text-[#C9943A]"
                      onClick={() => setOpen(false)}
                      asChild
                    >
                      <Link href="/shop">Browse Shop</Link>
                    </Button>
                  </motion.div>
                ) : (
                  <div className="divide-y divide-border">
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 40, height: 0 }}
                        className="flex gap-4 px-5 py-4"
                      >
                        {/* Image */}
                        <div className="relative w-18 h-18 w-[72px] h-[72px] rounded-xl overflow-hidden bg-secondary border border-border shrink-0">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag className="h-5 w-5 text-muted-foreground/30" />
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-1">
                            <p className="font-medium text-sm leading-tight truncate">
                              {item.name}
                            </p>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="shrink-0 w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors rounded"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          {(item.selectedColor || item.selectedSize) && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {[item.selectedColor, item.selectedSize]
                                .filter(Boolean)
                                .join(" · ")}
                            </p>
                          )}

                          <div className="flex items-center justify-between mt-2.5">
                            {/* Qty stepper */}
                            <div className="flex items-center gap-1 border border-border rounded-full overflow-hidden">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-6 text-center text-xs font-semibold tabular-nums">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>

                            <span className="text-sm font-bold text-[#C9943A]">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border p-5 space-y-3 bg-background">
                {/* Subtotal */}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Subtotal</span>
                  <span className="font-heading font-bold text-lg text-[#C9943A]">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Shipping (AED 30) calculated at checkout
                </p>

                {/* Checkout CTA */}
                <Button
                  className="w-full bg-[#C9943A] hover:opacity-90 text-white font-semibold gap-2 glow-gold"
                  size="lg"
                  asChild
                  onClick={() => setOpen(false)}
                >
                  <Link href="/checkout">
                    Checkout
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>

                <button
                  onClick={() => setOpen(false)}
                  className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
                >
                  Continue shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
