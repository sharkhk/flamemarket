"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCart();
  const SHIPPING = 30;
  const total = subtotal + SHIPPING;

  return (
    <>
      <Header />
      <main className="flex-1 pt-20">

        {/* Page header */}
        <section className="relative overflow-hidden bg-background">
          <div className="absolute inset-0 grid-bg pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#C9943A]/25 to-transparent pointer-events-none" />

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <p className="text-[#C9943A] text-xs font-semibold uppercase tracking-[0.2em] mb-2">
                Review
              </p>
              <div className="flex items-end gap-4">
                <h1 className="font-heading text-4xl sm:text-5xl font-bold">
                  Your <span className="gradient-text">Cart</span>
                </h1>
                {items.length > 0 && (
                  <span className="mb-1.5 text-sm text-muted-foreground">
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </span>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24">
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center py-28 gap-6 text-center"
            >
              <div className="w-20 h-20 rounded-2xl bg-secondary border border-border flex items-center justify-center">
                <ShoppingBag className="h-9 w-9 text-muted-foreground/30" />
              </div>
              <div>
                <h2 className="font-heading text-xl font-semibold mb-2">
                  Your cart is empty
                </h2>
                <p className="text-muted-foreground text-sm">
                  Discover something worth keeping
                </p>
              </div>
              <Button className="bg-[#C9943A] hover:opacity-90 text-white glow-gold" asChild>
                <Link href="/shop">Browse Collection</Link>
              </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Order summary — top on mobile, right on desktop */}
              <div className="lg:col-span-1 lg:order-last order-first">
                <div
                  className="sticky top-28 rounded-2xl bg-card border border-border p-6 space-y-5"
                  style={{ boxShadow: "0 0 32px rgba(201,148,58,0.06)" }}
                >
                  <h2 className="font-heading font-semibold text-base">Order Summary</h2>

                  {/* Line items */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                      <span className="text-foreground font-medium">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Shipping (Aramex)</span>
                      <span className="text-foreground font-medium">{formatPrice(SHIPPING)}</span>
                    </div>
                  </div>

                  <div
                    className="h-px"
                    style={{ background: "linear-gradient(to right, rgba(201,148,58,0.3), transparent)" }}
                  />

                  <div className="flex justify-between font-heading font-bold text-lg">
                    <span>Total</span>
                    <span className="text-[#C9943A]">{formatPrice(total)}</span>
                  </div>

                  {/* Discount hint */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Tag className="h-3.5 w-3.5" />
                    Add a discount code at checkout
                  </div>

                  <Button
                    className="w-full bg-[#C9943A] hover:opacity-90 text-white font-semibold gap-2 glow-gold"
                    size="lg"
                    asChild
                  >
                    <Link href="/checkout">
                      Checkout
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full hover:border-[#C9943A]/50" asChild>
                    <Link href="/shop">Continue Shopping</Link>
                  </Button>
                </div>
              </div>

              {/* Items */}
              <div className="lg:col-span-2">
                <AnimatePresence initial={false}>
                  <div className="divide-y divide-border rounded-2xl border border-border bg-card overflow-hidden">
                    {items.map((item) => (
                      <motion.div
                        key={`${item.id}-${item.selectedColor}-${item.selectedSize}`}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 40, height: 0 }}
                        className="flex gap-5 p-5"
                      >
                        {/* Image */}
                        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-secondary border border-border shrink-0">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag className="h-8 w-8 text-muted-foreground/30" />
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <Link
                                href={`/shop/${item.slug}`}
                                className="font-heading font-semibold text-sm hover:text-[#C9943A] transition-colors leading-tight block"
                              >
                                {item.name}
                              </Link>
                              {(item.selectedColor || item.selectedSize) && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {[item.selectedColor, item.selectedSize]
                                    .filter(Boolean)
                                    .join(" · ")}
                                </p>
                              )}
                              {item.customizationNotes && (
                                <p className="text-xs text-muted-foreground/70 mt-1 line-clamp-1">
                                  Note: {item.customizationNotes}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="shrink-0 w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            {/* Qty stepper */}
                            <div className="flex items-center border border-border rounded-full overflow-hidden">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-8 text-center text-sm font-semibold tabular-nums">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <span className="font-heading font-bold text-[#C9943A]">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </AnimatePresence>
              </div>

            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
