"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, setOpen } = useCart();

  return (
    <>
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h1 className="font-heading text-3xl sm:text-4xl font-bold">
              Your Cart
            </h1>
            {items.length > 0 && (
              <p className="text-muted-foreground mt-1">
                {items.length} {items.length === 1 ? "item" : "items"}
              </p>
            )}
          </motion.div>

          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center py-24 gap-6 text-center"
            >
              <ShoppingBag className="h-16 w-16 text-muted-foreground/20" />
              <div>
                <h2 className="font-heading text-xl font-semibold mb-2">
                  Your cart is empty
                </h2>
                <p className="text-muted-foreground text-sm">
                  Discover something worth keeping
                </p>
              </div>
              <Button className="bg-gold hover:opacity-90 text-white" asChild>
                <Link href="/shop">Browse Collection</Link>
              </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Items */}
              <div className="lg:col-span-2 space-y-4">
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.div
                      key={`${item.id}-${item.selectedColor}-${item.selectedSize}`}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 40, height: 0 }}
                      className="flex gap-5 p-4 rounded-2xl bg-card border border-border"
                    >
                      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-secondary shrink-0">
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

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <Link
                              href={`/shop/${item.slug}`}
                              className="font-heading font-semibold text-sm hover:text-gold transition-colors"
                            >
                              {item.name}
                            </Link>
                            {(item.selectedColor || item.selectedSize) && (
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {[item.selectedColor, item.selectedSize]
                                  .filter(Boolean)
                                  .join(" · ")}
                              </p>
                            )}
                            {item.customizationNotes && (
                              <p className="text-xs text-muted-foreground/70 mt-1 line-clamp-2">
                                Note: {item.customizationNotes}
                              </p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <span className="font-heading font-bold text-gold">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-28 rounded-2xl bg-card border border-border p-6 space-y-4">
                  <h2 className="font-heading font-semibold text-lg">
                    Order Summary
                  </h2>
                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span className="text-foreground">
                        {formatPrice(subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Shipping</span>
                      <span>Calculated at checkout</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-heading font-bold text-lg">
                    <span>Total</span>
                    <span className="text-gold">{formatPrice(subtotal)}</span>
                  </div>

                  <Button
                    className="w-full bg-gold hover:opacity-90 text-white font-medium gap-2"
                    size="lg"
                    asChild
                  >
                    <Link href="/checkout">
                      Checkout
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>

                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/shop" onClick={() => setOpen(false)}>
                      Continue Shopping
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
