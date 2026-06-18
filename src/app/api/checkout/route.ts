import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";
import { createPaymentIntent } from "@/lib/ziina";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customer, shipping_address, items, customization_notes } = body;

    if (!customer || !shipping_address || !items?.length) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    // Calculate totals
    const subtotal = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    );

    // Flat shipping rate — Aramex will handle actual calculation
    const shipping_cost = 30;
    const total = subtotal + shipping_cost;

    // Generate order number
    const { count } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true });
    const orderIndex = (count ?? 0) + 1;
    const order_number = `FLM-${String(orderIndex).padStart(4, "0")}`;

    // Create order in DB (payment_status: pending)
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number,
        customer_name: customer.name,
        customer_email: customer.email,
        customer_phone: customer.phone,
        shipping_address,
        items,
        subtotal,
        shipping_cost,
        total,
        payment_status: "pending",
        fulfillment_status: "pending",
        customization_notes: customization_notes ?? null,
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error("Order insert error:", orderError);
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 }
      );
    }

    const origin = req.headers.get("origin") ?? process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

    // Create Ziina payment intent
    const isTest = process.env.NODE_ENV !== "production";
    const payment = await createPaymentIntent({
      amount: Math.round(total * 100), // Ziina uses fils (1 AED = 100 fils)
      currency_code: "AED",
      message: `FLAMEMARKET Order ${order_number}`,
      success_url: `${origin}/checkout/success?order=${order_number}`,
      cancel_url: `${origin}/checkout?cancelled=1`,
      test: isTest,
    });

    // In dev mock mode, mark as paid immediately (no real Ziina redirect)
    const _supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
    const isMock = process.env.USE_MOCK_DB === "true" || !_supabaseUrl || _supabaseUrl.includes("your-project-id");
    await supabase
      .from("orders")
      .update({
        ziina_payment_id: payment.id,
        ziina_payment_url: payment.checkout_url,
        ...(isMock ? { payment_status: "paid", fulfillment_status: "processing" } : {}),
      })
      .eq("id", (order as Record<string, unknown>).id);

    return NextResponse.json({
      order_number,
      payment_url: payment.checkout_url,
    });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
