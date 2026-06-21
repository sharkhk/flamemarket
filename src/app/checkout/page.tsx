"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Loader2,
  ShoppingBag,
  ChevronDown,
  Lock,
  Truck,
  Tag,
  ChevronRight,
} from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const SHIPPING_COST = 30;

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  name: z.string().min(2, "Full name is required"),
  phone: z.string().min(9, "Enter a valid phone number"),
  line1: z.string().min(5, "Street address is required"),
  line2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  emirate: z.string().min(2, "Please select an emirate"),
  country: z.string(),
});

type FormData = z.infer<typeof schema>;

const EMIRATES = [
  "Abu Dhabi",
  "Dubai",
  "Sharjah",
  "Ajman",
  "Umm Al Quwain",
  "Ras Al Khaimah",
  "Fujairah",
];

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-xs text-destructive mt-1">{msg}</p>;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
      {children}
    </p>
  );
}

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const total = subtotal + SHIPPING_COST;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { country: "United Arab Emirates" },
  });

  // ── Empty cart ──────────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-4">
        <ShoppingBag className="w-12 h-12 text-muted-foreground/30" />
        <h2 className="font-heading text-xl font-semibold">Your cart is empty</h2>
        <p className="text-sm text-muted-foreground">Add some products before checking out.</p>
        <Button asChild className="bg-gold hover:opacity-90 text-white mt-2">
          <Link href="/shop">Browse Shop</Link>
        </Button>
      </div>
    );
  }

  // ── Submit ──────────────────────────────────────────────────────────────────
  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { name: data.name, email: data.email, phone: data.phone },
          shipping_address: {
            line1: data.line1,
            line2: data.line2 ?? "",
            city: data.city,
            emirate: data.emirate,
            country: data.country,
          },
          items: items.map((i) => ({
            id: i.id,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            image: i.image,
            selectedColor: i.selectedColor,
            selectedSize: i.selectedSize,
          })),
          customization_notes: items
            .map((i) => i.customizationNotes)
            .filter(Boolean)
            .join("; "),
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ?? "Something went wrong. Please try again.");
        return;
      }

      clearCart();
      window.location.href = json.payment_url;
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Order summary content (shared between mobile + desktop) ─────────────────
  const OrderSummaryItems = () => (
    <div className="divide-y divide-border">
      {items.map((item) => (
        <div
          key={`${item.id}-${item.selectedColor}-${item.selectedSize}`}
          className="flex items-center gap-4 py-4"
        >
          <div className="relative shrink-0">
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-muted border border-border">
              {item.image && (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-muted-foreground text-background text-[10px] font-bold flex items-center justify-center leading-none">
              {item.quantity}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium leading-tight truncate">{item.name}</p>
            {(item.selectedColor || item.selectedSize) && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {[item.selectedColor, item.selectedSize].filter(Boolean).join(" · ")}
              </p>
            )}
          </div>
          <p className="text-sm font-medium shrink-0 text-foreground">
            {formatPrice(item.price * item.quantity)}
          </p>
        </div>
      ))}
    </div>
  );

  const OrderSummaryTotals = () => (
    <div className="space-y-2 pt-4">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Subtotal</span>
        <span>{formatPrice(subtotal)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Shipping</span>
        <span>{formatPrice(SHIPPING_COST)}</span>
      </div>
      <div className="flex justify-between font-heading font-bold text-base pt-2 border-t border-border">
        <span>Total</span>
        <span>
          <span className="text-xs font-normal text-muted-foreground mr-1">AED</span>
          {total.toFixed(2)}
        </span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* ── Minimal header ─────────────────────────────────────────────────── */}
      <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-heading font-bold text-lg tracking-tight text-gold">
            FLAMEMARKET
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="w-3.5 h-3.5" />
            Secure checkout
          </div>
        </div>
      </header>

      {/* ── Breadcrumb ─────────────────────────────────────────────────────── */}
      <div className="border-b border-border bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-10 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link href="/cart" className="hover:text-foreground transition-colors">Cart</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-medium">Information</span>
          <ChevronRight className="w-3 h-3" />
          <span>Payment</span>
        </div>
      </div>

      {/* ── Mobile order summary toggle ────────────────────────────────────── */}
      <div className="lg:hidden border-b border-border bg-muted/20">
        <button
          type="button"
          onClick={() => setSummaryOpen((p) => !p)}
          className="w-full px-4 py-3 flex items-center justify-between text-sm"
        >
          <span className="flex items-center gap-2 text-gold font-medium">
            <ShoppingBag className="w-4 h-4" />
            {summaryOpen ? "Hide" : "Show"} order summary
            <ChevronDown
              className={`w-4 h-4 transition-transform ${summaryOpen ? "rotate-180" : ""}`}
            />
          </span>
          <span className="font-heading font-bold">{formatPrice(total)}</span>
        </button>
        <AnimatePresence>
          {summaryOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4">
                <OrderSummaryItems />
                <OrderSummaryTotals />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Main layout ────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col lg:flex-row gap-12">

            {/* ── LEFT: Form ───────────────────────────────────────────────── */}
            <div className="flex-1 min-w-0 space-y-8">

              {/* Contact */}
              <section>
                <SectionLabel>Contact</SectionLabel>
                <div className="space-y-3">
                  <div>
                    <Input
                      type="email"
                      placeholder="Email address"
                      className="h-12 bg-card border-border focus-visible:ring-gold/50"
                      {...register("email")}
                    />
                    <FieldError msg={errors.email?.message} />
                  </div>
                </div>
              </section>

              {/* Delivery */}
              <section>
                <SectionLabel>Delivery</SectionLabel>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Input
                        placeholder="Full name"
                        className="h-12 bg-card border-border focus-visible:ring-gold/50"
                        {...register("name")}
                      />
                      <FieldError msg={errors.name?.message} />
                    </div>
                    <div>
                      <Input
                        type="tel"
                        placeholder="Phone (+971 50 000 0000)"
                        className="h-12 bg-card border-border focus-visible:ring-gold/50"
                        {...register("phone")}
                      />
                      <FieldError msg={errors.phone?.message} />
                    </div>
                  </div>
                  <div>
                    <Input
                      placeholder="Address"
                      className="h-12 bg-card border-border focus-visible:ring-gold/50"
                      {...register("line1")}
                    />
                    <FieldError msg={errors.line1?.message} />
                  </div>
                  <div>
                    <Input
                      placeholder="Apartment, building, floor (optional)"
                      className="h-12 bg-card border-border focus-visible:ring-gold/50"
                      {...register("line2")}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Input
                        placeholder="City / Area"
                        className="h-12 bg-card border-border focus-visible:ring-gold/50"
                        {...register("city")}
                      />
                      <FieldError msg={errors.city?.message} />
                    </div>
                    <div>
                      <select
                        className="w-full h-12 rounded-md border border-border bg-card px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:ring-offset-2"
                        {...register("emirate")}
                      >
                        <option value="">Emirate</option>
                        {EMIRATES.map((e) => (
                          <option key={e} value={e}>{e}</option>
                        ))}
                      </select>
                      <FieldError msg={errors.emirate?.message} />
                    </div>
                  </div>
                  <div>
                    <Input
                      value="United Arab Emirates"
                      readOnly
                      className="h-12 bg-muted border-border text-muted-foreground cursor-not-allowed"
                    />
                  </div>
                </div>
              </section>

              {/* Shipping method */}
              <section>
                <SectionLabel>Shipping method</SectionLabel>
                <div className="border border-gold/40 bg-gold/5 rounded-xl px-4 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border-2 border-gold flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 rounded-full bg-gold" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Standard Shipping</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Truck className="w-3 h-3" />
                        3–7 business days via Aramex
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold">{formatPrice(SHIPPING_COST)}</span>
                </div>
              </section>

              {/* Discount code */}
              <section>
                <SectionLabel>Discount</SectionLabel>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Discount code"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      className="h-12 pl-9 bg-card border-border focus-visible:ring-gold/50"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 px-5 shrink-0"
                    onClick={() => toast.info("No discount code found.")}
                  >
                    Apply
                  </Button>
                </div>
              </section>

              {/* CTA */}
              <div className="space-y-4 pt-2">
                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="w-full h-14 text-base font-semibold bg-gold hover:opacity-90 text-white rounded-xl"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing order…
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Complete Order · {formatPrice(total)}
                    </>
                  )}
                </Button>

                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                  <Link href="/cart" className="hover:text-foreground transition-colors flex items-center gap-1">
                    ← Return to cart
                  </Link>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Payments by Ziina
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Truck className="w-3 h-3" /> Shipped by Aramex
                  </span>
                </div>
              </div>
            </div>

            {/* ── RIGHT: Sticky order summary (desktop only) ───────────────── */}
            <div className="hidden lg:block w-[380px] shrink-0">
              <div className="sticky top-28 bg-muted/30 border border-border rounded-2xl p-6">
                <OrderSummaryItems />

                {/* Discount code - desktop */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <Input
                      placeholder="Discount code"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      className="h-10 pl-8 text-sm bg-background border-border focus-visible:ring-gold/50"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-10 px-4 shrink-0"
                    onClick={() => toast.info("No discount code found.")}
                  >
                    Apply
                  </Button>
                </div>

                <OrderSummaryTotals />

                {/* Trust badges */}
                <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground mt-6 pt-4 border-t border-border">
                  <Lock className="w-3 h-3 shrink-0" />
                  Secured by Ziina · Shipped by Aramex
                </div>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}
