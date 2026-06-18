import { NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";

const validStatuses = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;

type FulfillmentStatus = (typeof validStatuses)[number];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const body = await request.json();
    const { fulfillment_status } = body as { fulfillment_status: string };

    if (!fulfillment_status || !validStatuses.includes(fulfillment_status as FulfillmentStatus)) {
      return Response.json(
        {
          error: `Invalid fulfillment_status. Must be one of: ${validStatuses.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    const { data, error } = await supabase
      .from("orders")
      .update({
        fulfillment_status: fulfillment_status as FulfillmentStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return Response.json(
        { error: error.message ?? "Failed to update order" },
        { status: 500 }
      );
    }

    if (!data) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    return Response.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return Response.json({ error: message }, { status: 500 });
  }
}
