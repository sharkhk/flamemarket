"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Order } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Truck, Loader2, ExternalLink } from "lucide-react";

interface Props {
  order: Order;
}

const fulfillmentStatuses = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export default function OrderActions({ order }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(order.fulfillment_status);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [creatingShipment, setCreatingShipment] = useState(false);

  async function handleStatusChange(newStatus: string | null) {
    if (!newStatus) return;
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fulfillment_status: newStatus }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Failed to update status");
      }

      setStatus(newStatus as Order["fulfillment_status"]);
      toast.success("Fulfillment status updated");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setUpdatingStatus(false);
    }
  }

  async function handleCreateShipment() {
    setCreatingShipment(true);
    try {
      const res = await fetch("/api/admin/ship", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Failed to create shipment");
      }

      const { trackingNumber } = await res.json();
      toast.success(`Shipment created! Tracking: ${trackingNumber}`);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Shipment creation failed");
    } finally {
      setCreatingShipment(false);
    }
  }

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Truck className="w-4 h-4" />
          Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground font-medium">
            Update Fulfillment Status
          </label>
          <Select
            value={status}
            onValueChange={handleStatusChange}
            disabled={updatingStatus}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fulfillmentStatuses.map((s) => (
                <SelectItem key={s} value={s}>
                  <span className="capitalize">{s}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {updatingStatus && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" />
              Updating…
            </p>
          )}
        </div>

        <div className="pt-1">
          {order.aramex_tracking_number ? (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-medium">
                Aramex Tracking
              </p>
              <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
                <span className="text-xs font-mono flex-1">
                  {order.aramex_tracking_number}
                </span>
                <a
                  href={`https://www.aramex.com/track/?ShipmentNumber=${order.aramex_tracking_number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold hover:text-gold/80"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ) : (
            <Button
              onClick={handleCreateShipment}
              disabled={creatingShipment || order.payment_status !== "paid"}
              className="w-full bg-gold hover:bg-gold/90 text-gold-foreground"
            >
              {creatingShipment ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Shipment…
                </>
              ) : (
                <>
                  <Truck className="w-4 h-4 mr-2" />
                  Create Aramex Shipment
                </>
              )}
            </Button>
          )}
          {order.payment_status !== "paid" && !order.aramex_tracking_number && (
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Payment must be confirmed before shipping
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
