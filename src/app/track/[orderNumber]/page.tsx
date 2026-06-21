"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  ArrowRight,
  MapPin,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type FulfillmentStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

interface TrackingEvent {
  description: string;
  dateTime: string;
  location: string;
}

interface OrderData {
  order_number: string;
  fulfillment_status: FulfillmentStatus;
  payment_status: string;
  tracking_number: string | null;
  created_at: string;
  customer_name: string;
  item_count: number;
  tracking: {
    status: string;
    updateDescription: string;
    updateDateTime: string;
    trackingEvents: TrackingEvent[];
  } | null;
}

const STEPS: {
  status: FulfillmentStatus;
  label: string;
  sub: string;
  icon: typeof Package;
}[] = [
  { status: "pending", label: "Order Placed", sub: "Confirmed & queued", icon: Clock },
  { status: "processing", label: "Printing", sub: "Being manufactured", icon: Package },
  { status: "shipped", label: "Shipped", sub: "With Aramex courier", icon: Truck },
  { status: "delivered", label: "Delivered", sub: "At your door", icon: CheckCircle },
];

const STATUS_ORDER: FulfillmentStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
];

const STATUS_COLORS: Record<FulfillmentStatus, string> = {
  pending: "text-amber-500 bg-amber-500/10 border-amber-500/30",
  processing: "text-blue-500 bg-blue-500/10 border-blue-500/30",
  shipped: "text-purple-500 bg-purple-500/10 border-purple-500/30",
  delivered: "text-green-500 bg-green-500/10 border-green-500/30",
  cancelled: "text-red-500 bg-red-500/10 border-red-500/30",
};

export default function TrackPage() {
  const params = useParams<{ orderNumber: string }>();
  const orderNumber = params.orderNumber;
  const [data, setData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/orders/${orderNumber}`);
      if (!res.ok) {
        setError("Order not found. Please check your order number.");
        return;
      }
      const json: OrderData = await res.json();
      setData(json);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderNumber]);

  const currentStep = data ? STATUS_ORDER.indexOf(data.fulfillment_status) : -1;

  return (
    <>
      <Header />
      <main className="flex-1 pt-24 pb-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">

          {/* Back + title */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link
              href="/track"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-[#C9943A] transition-colors mb-4"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Track another order
            </Link>
            <h1 className="font-heading text-3xl font-bold">
              Order Status
            </h1>
            <p className="text-muted-foreground text-sm font-mono mt-1">{orderNumber}</p>
          </motion.div>

          {/* Loading */}
          {loading && (
            <div className="space-y-4">
              <Skeleton className="h-32 rounded-2xl" />
              <Skeleton className="h-40 rounded-2xl" />
              <Skeleton className="h-48 rounded-2xl" />
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 space-y-5"
            >
              <div className="w-16 h-16 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center mx-auto">
                <XCircle className="h-8 w-8 text-destructive" />
              </div>
              <div>
                <p className="font-heading font-semibold mb-1">Order not found</p>
                <p className="text-muted-foreground text-sm">{error}</p>
              </div>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={fetchOrder} className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </Button>
                <Button asChild variant="outline">
                  <Link href="/track">Search Again</Link>
                </Button>
              </div>
            </motion.div>
          )}

          {/* Content */}
          {data && !loading && (
            <div className="space-y-5">

              {/* Status card */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-2xl p-6"
                style={{ boxShadow: "0 0 32px rgba(201,148,58,0.06)" }}
              >
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Order number</p>
                    <p className="font-heading font-bold text-2xl text-[#C9943A]">
                      {data.order_number}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border capitalize flex-shrink-0 ${STATUS_COLORS[data.fulfillment_status]}`}
                  >
                    {data.fulfillment_status}
                  </span>
                </div>

                <div
                  className="h-px mb-5"
                  style={{ background: "linear-gradient(to right, rgba(201,148,58,0.2), transparent)" }}
                />

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Placed</p>
                    <p className="font-medium">
                      {new Date(data.created_at).toLocaleDateString("en-AE", { dateStyle: "medium" })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Items</p>
                    <p className="font-medium">{data.item_count} {data.item_count === 1 ? "piece" : "pieces"}</p>
                  </div>
                  {data.tracking_number && (
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">AWB</p>
                      <p className="font-mono font-medium text-xs">{data.tracking_number}</p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Progress tracker */}
              {data.fulfillment_status !== "cancelled" && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 }}
                  className="bg-card border border-border rounded-2xl p-6"
                >
                  <h2 className="font-heading font-semibold mb-8 text-sm uppercase tracking-widest text-muted-foreground">
                    Progress
                  </h2>

                  <div className="relative">
                    {/* Vertical track */}
                    <div className="absolute left-5 top-5 w-px bg-border" style={{ bottom: "1.25rem" }} />
                    {/* Gold fill */}
                    <div
                      className="absolute left-5 top-5 w-px bg-[#C9943A] transition-all duration-700"
                      style={{
                        height: currentStep < 1
                          ? "0%"
                          : `calc(${(currentStep / (STEPS.length - 1)) * 100}% - 0px)`,
                      }}
                    />

                    <div className="space-y-8">
                      {STEPS.map((step, i) => {
                        const done = i <= currentStep;
                        const active = i === currentStep;
                        return (
                          <div key={step.status} className="flex gap-5 relative">
                            <div
                              className={`z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                                done
                                  ? "bg-[#C9943A] border-2 border-[#C9943A] text-white shadow-[0_0_16px_rgba(201,148,58,0.4)]"
                                  : "border-2 border-border bg-background text-muted-foreground"
                              }`}
                            >
                              <step.icon className="h-4 w-4" />
                            </div>
                            <div className="pt-2.5">
                              <p className={`font-semibold text-sm ${active ? "text-[#C9943A]" : done ? "text-foreground" : "text-muted-foreground"}`}>
                                {step.label}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">{step.sub}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Aramex events */}
              {data.tracking?.trackingEvents?.length ? (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.16 }}
                  className="bg-card border border-border rounded-2xl p-6"
                >
                  <h2 className="font-heading font-semibold mb-6 text-sm uppercase tracking-widest text-muted-foreground">
                    Shipping Updates
                  </h2>
                  <div className="relative pl-5">
                    <div className="absolute left-2 top-1.5 bottom-1.5 w-px bg-gradient-to-b from-[#C9943A]/60 to-transparent" />
                    <div className="space-y-5">
                      {data.tracking.trackingEvents.map((event, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + i * 0.05 }}
                          className="relative"
                        >
                          <div className="absolute -left-5 top-1.5 w-2 h-2 rounded-full bg-[#C9943A]" />
                          <p className="text-sm font-medium">{event.description}</p>
                          <div className="flex items-center gap-3 mt-1">
                            {event.location && (
                              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                {event.location}
                              </span>
                            )}
                            {event.dateTime && (
                              <span className="text-xs text-muted-foreground">
                                {new Date(event.dateTime).toLocaleString("en-AE")}
                              </span>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : null}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="gap-2 border-border hover:border-[#C9943A]/50"
                  onClick={fetchOrder}
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>
                <Button
                  className="flex-1 bg-[#C9943A] hover:opacity-90 text-white font-semibold gap-2 glow-gold"
                  asChild
                >
                  <Link href="/shop">
                    Shop More
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
