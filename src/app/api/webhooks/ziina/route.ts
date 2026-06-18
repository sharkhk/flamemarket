import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";
import { verifyWebhookSignature } from "@/lib/ziina";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-ziina-signature") ?? "";

  // Verify signature
  const isValid = await verifyWebhookSignature(body, signature);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(body);
  const eventType: string = event.event_type ?? event.type ?? "";

  if (
    eventType === "payment_intent.paid" ||
    eventType === "payment_intent.succeeded"
  ) {
    const paymentId: string = event.data?.id ?? event.data?.payment_intent_id ?? "";

    if (!paymentId) {
      return NextResponse.json({ error: "Missing payment ID" }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { error } = await supabase
      .from("orders")
      .update({
        payment_status: "paid",
        fulfillment_status: "processing",
        updated_at: new Date().toISOString(),
      })
      .eq("ziina_payment_id", paymentId);

    if (error) {
      console.error("Webhook DB update error:", error);
      return NextResponse.json({ error: "DB update failed" }, { status: 500 });
    }
  }

  if (eventType === "payment_intent.failed") {
    const paymentId: string = event.data?.id ?? "";
    if (paymentId) {
      const supabase = createServiceClient();
      await supabase
        .from("orders")
        .update({
          payment_status: "failed",
          updated_at: new Date().toISOString(),
        })
        .eq("ziina_payment_id", paymentId);
    }
  }

  return NextResponse.json({ received: true });
}
