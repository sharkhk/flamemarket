"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Package, ArrowRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function TrackLookupPage() {
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = orderNumber.trim().toUpperCase();
    if (!trimmed) {
      setError("Please enter an order number.");
      return;
    }
    router.push(`/track/${trimmed}`);
  }

  return (
    <>
      <Header />
      <main className="flex-1 min-h-screen flex flex-col">
        {/* Page header with grid texture */}
        <section className="relative pt-24 pb-16 overflow-hidden bg-background flex-1 flex items-center justify-center">
          <div className="absolute inset-0 grid-bg pointer-events-none" />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(201,148,58,0.07) 0%, transparent 70%)",
            }}
          />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#C9943A]/25 to-transparent pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="relative w-full max-w-md mx-auto px-4"
          >
            {/* Icon */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-[#C9943A]/10 border border-[#C9943A]/25 flex items-center justify-center">
                  <Package className="w-9 h-9 text-[#C9943A]" />
                </div>
                <div
                  className="absolute -inset-2 rounded-3xl pointer-events-none"
                  style={{ boxShadow: "0 0 32px rgba(201,148,58,0.12)" }}
                />
              </div>
            </div>

            {/* Heading */}
            <div className="text-center mb-8">
              <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-3">
                Track Your <span className="gradient-text">Order</span>
              </h1>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Enter your order number to see the current status and live
                shipping updates.
              </p>
            </div>

            {/* Form card */}
            <div
              className="bg-card border border-border rounded-2xl p-6"
              style={{ boxShadow: "0 0 40px rgba(201,148,58,0.06)" }}
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="order-number"
                    className="text-xs font-semibold uppercase tracking-widest text-muted-foreground"
                  >
                    Order Number
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="order-number"
                      placeholder="FLM-0001"
                      value={orderNumber}
                      onChange={(e) => {
                        setOrderNumber(e.target.value);
                        setError("");
                      }}
                      className="h-12 pl-10 font-mono text-sm bg-background border-border focus-visible:ring-[#C9943A]/40"
                      autoFocus
                      autoComplete="off"
                    />
                  </div>
                  {error && (
                    <p className="text-xs text-destructive">{error}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Your order number was emailed to you at checkout.
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-[#C9943A] hover:opacity-90 text-white font-semibold gap-2 glow-gold"
                >
                  Track Order
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
