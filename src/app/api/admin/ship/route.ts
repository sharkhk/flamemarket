import { NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";
import { createShipment } from "@/lib/aramex";
import type { Order } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId } = body as { orderId: string };

    if (!orderId) {
      return Response.json({ error: "orderId is required" }, { status: 400 });
    }

    const supabase = createServiceClient();

    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (fetchError || !order) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    const typedOrder = order as Order;

    if (typedOrder.aramex_tracking_number) {
      return Response.json(
        {
          error: "Shipment already created",
          trackingNumber: typedOrder.aramex_tracking_number,
        },
        { status: 409 }
      );
    }

    const addr = typedOrder.shipping_address;
    const totalWeightGrams = typedOrder.items.reduce(
      (sum: number, item: { quantity: number }) => sum + item.quantity * 500,
      0
    );
    const weightKg = Math.max(totalWeightGrams / 1000, 0.1);

    const itemDescriptions = typedOrder.items
      .map((item: { name: string; quantity: number }) => `${item.quantity}x ${item.name}`)
      .join(", ");

    const shipmentResult = await createShipment({
      recipientName: typedOrder.customer_name,
      recipientPhone: typedOrder.customer_phone,
      addressLine1: addr.line1,
      city: addr.city,
      countryCode: addr.country === "United Arab Emirates" ? "AE" : addr.country.slice(0, 2).toUpperCase(),
      weightKg,
      description: itemDescriptions || "FLAMEMARKET Products",
      reference: typedOrder.order_number,
    });

    const { error: updateError } = await supabase
      .from("orders")
      .update({
        aramex_shipment_id: shipmentResult.shipmentId,
        aramex_tracking_number: shipmentResult.trackingNumber,
        fulfillment_status: "shipped",
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    if (updateError) {
      return Response.json(
        { error: "Shipment created but failed to update order record" },
        { status: 500 }
      );
    }

    return Response.json({
      trackingNumber: shipmentResult.trackingNumber,
      shipmentId: shipmentResult.shipmentId,
      labelUrl: shipmentResult.labelUrl,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return Response.json({ error: message }, { status: 500 });
  }
}
