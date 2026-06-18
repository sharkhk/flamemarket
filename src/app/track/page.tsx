"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Package } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
      <main className="flex-1 flex items-center justify-center pt-24 pb-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-gold/30 bg-gold/10 mb-4">
              <Package className="w-6 h-6 text-gold" />
            </div>
            <h1 className="font-heading text-3xl font-bold mb-2">Track Your Order</h1>
            <p className="text-muted-foreground text-sm">
              Enter your order number to see the current status and shipping updates.
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="order-number">Order Number</Label>
                <Input
                  id="order-number"
                  placeholder="FLM-0001"
                  value={orderNumber}
                  onChange={(e) => {
                    setOrderNumber(e.target.value);
                    setError("");
                  }}
                  className="font-mono text-sm"
                  autoFocus
                />
                {error && (
                  <p className="text-xs text-destructive">{error}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Your order number was emailed to you at checkout (e.g. FLM-0001).
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-gold hover:opacity-90 text-white font-medium gap-2"
              >
                <Search className="h-4 w-4" />
                Track Order
              </Button>
            </form>
          </div>
        </motion.div>
      </main>
      <Footer />
    </>
  );
}
