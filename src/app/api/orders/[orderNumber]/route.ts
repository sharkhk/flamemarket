import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";
import { getTracking } from "@/lib/aramex";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  const { orderNumber } = await params;

  const supabase = createServiceClient();
  const { data: rawOrder, error } = await supabase
    .from("orders")
    .select(
      "order_number,fulfillment_status,payment_status,aramex_tracking_number,created_at,customer_name,items"
    )
    .eq("order_number", orderNumber)
    .single();

  if (error || !rawOrder) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const order = rawOrder as {
    order_number: string;
    fulfillment_status: string;
    payment_status: string;
    aramex_tracking_number: string | null;
    created_at: string;
    customer_name: string;
    items: unknown[];
  };

  let trackingInfo = null;
  if (order.aramex_tracking_number) {
    try {
      trackingInfo = await getTracking(order.aramex_tracking_number);
    } catch {
      // Don't fail the whole request if tracking fails
    }
  }

  return NextResponse.json({
    order_number: order.order_number,
    fulfillment_status: order.fulfillment_status,
    payment_status: order.payment_status,
    tracking_number: order.aramex_tracking_number,
    created_at: order.created_at,
    customer_name: order.customer_name,
    item_count: Array.isArray(order.items) ? order.items.length : 0,
    tracking: trackingInfo,
  });
}
