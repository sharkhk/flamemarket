"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Loader2, ShoppingBag, ArrowLeft } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const checkoutSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(9, "Enter a valid phone number"),
  line1: z.string().min(5, "Enter your street address"),
  line2: z.string().optional(),
  city: z.string().min(2, "Enter your city"),
  emirate: z.string().min(2, "Select your emirate"),
  country: z.string(),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

const EMIRATES = [
  "Abu Dhabi",
  "Dubai",
  "Sharjah",
  "Ajman",
  "Umm Al Quwain",
  "Ras Al Khaimah",
  "Fujairah",
];

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { country: "AE" },
  });

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="flex-1 flex items-center justify-center pt-24 pb-16">
          <div className="text-center space-y-4">
            <ShoppingBag className="h-12 w-12 text-muted-foreground/20 mx-auto" />
            <h2 className="font-heading font-semibold text-xl">
              Your cart is empty
            </h2>
            <Button asChild>
              <Link href="/shop">Browse Shop</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const onSubmit = async (data: CheckoutForm) => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: data.name,
            email: data.email,
            phone: data.phone,
          },
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
      // Redirect to Ziina payment page
      window.location.href = json.payment_url;
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
            <Link
              href="/cart"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to cart
            </Link>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold">
              Checkout
            </h1>
          </motion.div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Form */}
              <div className="lg:col-span-2 space-y-8">
                {/* Contact */}
                <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
                  <h2 className="font-heading font-semibold text-lg">
                    Contact Information
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="Ahmed Al Mansouri"
                        className="mt-1.5"
                        {...register("name")}
                      />
                      {errors.name && (
                        <p className="text-xs text-destructive mt-1">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="ahmed@example.com"
                        className="mt-1.5"
                        {...register("email")}
                      />
                      {errors.email && (
                        <p className="text-xs text-destructive mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+971 50 000 0000"
                        className="mt-1.5"
                        {...register("phone")}
                      />
                      {errors.phone && (
                        <p className="text-xs text-destructive mt-1">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Shipping */}
                <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
                  <h2 className="font-heading font-semibold text-lg">
                    Shipping Address
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="line1">Street Address</Label>
                      <Input
                        id="line1"
                        placeholder="Villa 12, Street 5, Al Barsha"
                        className="mt-1.5"
                        {...register("line1")}
                      />
                      {errors.line1 && (
                        <p className="text-xs text-destructive mt-1">
                          {errors.line1.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="line2">
                        Apartment / Building{" "}
                        <span className="text-muted-foreground font-normal">
                          (optional)
                        </span>
                      </Label>
                      <Input
                        id="line2"
                        placeholder="Apt 301, Tower B"
                        className="mt-1.5"
                        {...register("line2")}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City / Area</Label>
                        <Input
                          id="city"
                          placeholder="Dubai"
                          className="mt-1.5"
                          {...register("city")}
                        />
                        {errors.city && (
                          <p className="text-xs text-destructive mt-1">
                            {errors.city.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="emirate">Emirate</Label>
                        <select
                          id="emirate"
                          className="mt-1.5 w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          {...register("emirate")}
                        >
                          <option value="">Select emirate</option>
                          {EMIRATES.map((e) => (
                            <option key={e} value={e}>
                              {e}
                            </option>
                          ))}
                        </select>
                        {errors.emirate && (
                          <p className="text-xs text-destructive mt-1">
                            {errors.emirate.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-28 rounded-2xl bg-card border border-border p-6 space-y-4">
                  <h2 className="font-heading font-semibold text-lg">
                    Order Summary
                  </h2>
                  <Separator />

                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {items.map((item) => (
                      <div
                        key={`${item.id}-${item.selectedColor}-${item.selectedSize}`}
                        className="flex gap-3"
                      >
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-secondary shrink-0">
                          {item.image && (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">
                            {item.name}
                          </p>
                          {(item.selectedColor || item.selectedSize) && (
                            <p className="text-[10px] text-muted-foreground">
                              {[item.selectedColor, item.selectedSize]
                                .filter(Boolean)
                                .join(" · ")}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="text-xs font-medium text-gold shrink-0">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

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
                      <span>Calculated by Aramex</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-heading font-bold">
                    <span>Total</span>
                    <span className="text-gold">{formatPrice(subtotal)}</span>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    You&apos;ll be redirected to Ziina to complete payment
                    securely.
                  </p>

                  <Button
                    type="submit"
                    className="w-full bg-gold hover:opacity-90 text-white font-medium"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing…
                      </>
                    ) : (
                      "Pay with Ziina"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
