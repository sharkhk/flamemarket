"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Package, Truck, CheckCircle, Clock, XCircle, RefreshCw } from "lucide-react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

const STEPS: { status: FulfillmentStatus; label: string; icon: typeof Package }[] = [
  { status: "pending", label: "Order Placed", icon: Clock },
  { status: "processing", label: "Printing", icon: Package },
  { status: "shipped", label: "Shipped", icon: Truck },
  { status: "delivered", label: "Delivered", icon: CheckCircle },
];

const STATUS_ORDER: FulfillmentStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
];

function statusBadge(status: FulfillmentStatus) {
  const map: Record<FulfillmentStatus, string> = {
    pending: "bg-yellow-500/10 text-yellow-600",
    processing: "bg-blue-500/10 text-blue-500",
    shipped: "bg-purple-500/10 text-purple-500",
    delivered: "bg-green-500/10 text-green-500",
    cancelled: "bg-red-500/10 text-red-500",
  };
  return map[status] ?? "bg-muted text-muted-foreground";
}

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

  const currentStep = data
    ? STATUS_ORDER.indexOf(data.fulfillment_status)
    : -1;

  return (
    <>
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="font-heading text-3xl font-bold mb-1">
              Track Order
            </h1>
            <p className="text-muted-foreground text-sm">{orderNumber}</p>
          </motion.div>

          {loading && (
            <div className="space-y-4">
              <Skeleton className="h-32 rounded-2xl" />
              <Skeleton className="h-24 rounded-2xl" />
              <Skeleton className="h-48 rounded-2xl" />
            </div>
          )}

          {error && !loading && (
            <div className="text-center py-16 space-y-4">
              <XCircle className="h-12 w-12 text-destructive mx-auto" />
              <p className="text-muted-foreground">{error}</p>
              <Button variant="outline" onClick={fetchOrder} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            </div>
          )}

          {data && !loading && (
            <div className="space-y-6">
              {/* Status card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-2xl p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Order</p>
                    <p className="font-heading font-bold text-xl text-gold">
                      {data.order_number}
                    </p>
                  </div>
                  <Badge
                    className={`${statusBadge(data.fulfillment_status)} border-0 capitalize`}
                  >
                    {data.fulfillment_status}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>
                    Placed:{" "}
                    {new Date(data.created_at).toLocaleDateString("en-AE", {
                      dateStyle: "long",
                    })}
                  </p>
                  <p>
                    {data.item_count} {data.item_count === 1 ? "item" : "items"}
                  </p>
                  {data.tracking_number && (
                    <p>
                      Aramex AWB:{" "}
                      <span className="font-mono text-foreground">
                        {data.tracking_number}
                      </span>
                    </p>
                  )}
                </div>
              </motion.div>

              {/* Progress steps */}
              {data.fulfillment_status !== "cancelled" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-card border border-border rounded-2xl p-6"
                >
                  <h2 className="font-heading font-semibold mb-6">Progress</h2>
                  <div className="relative">
                    {/* Track line */}
                    <div className="absolute left-5 top-5 bottom-5 w-px bg-border" />
                    <div
                      className="absolute left-5 top-5 w-px bg-gold transition-all duration-500"
                      style={{
                        height: `${Math.min(
                          ((currentStep) / (STEPS.length - 1)) * 100,
                          100
                        )}%`,
                      }}
                    />

                    <div className="space-y-6">
                      {STEPS.map((step, i) => {
                        const done = i <= currentStep;
                        const active = i === currentStep;
                        return (
                          <div key={step.status} className="flex gap-4 relative">
                            <div
                              className={`z-10 w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                                done
                                  ? "border-gold bg-gold text-white"
                                  : "border-border bg-background text-muted-foreground"
                              }`}
                            >
                              <step.icon className="h-4 w-4" />
                            </div>
                            <div className="pt-2">
                              <p
                                className={`font-medium text-sm ${
                                  active ? "text-gold" : done ? "" : "text-muted-foreground"
                                }`}
                              >
                                {step.label}
                              </p>
                              {active && (
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  Current status
                                </p>
                              )}
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
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-card border border-border rounded-2xl p-6"
                >
                  <h2 className="font-heading font-semibold mb-4">
                    Shipping Updates
                  </h2>
                  <div className="space-y-4">
                    {data.tracking.trackingEvents.map((event, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="shrink-0 w-2 h-2 rounded-full bg-gold mt-1.5" />
                        <div>
                          <p className="text-sm">{event.description}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {event.location && `${event.location} · `}
                            {event.dateTime &&
                              new Date(event.dateTime).toLocaleString("en-AE")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : null}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={fetchOrder}
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>
                <Button className="bg-gold hover:opacity-90 text-white" asChild>
                  <Link href="/shop">Shop More</Link>
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
