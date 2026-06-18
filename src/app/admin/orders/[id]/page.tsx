import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase-server";
import type { Order } from "@/lib/supabase";
import { formatPrice } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Package, MapPin, User, CreditCard } from "lucide-react";
import OrderActions from "./OrderActions";

async function getOrder(id: string): Promise<Order | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data as Order;
}

const fulfillmentColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  processing: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  shipped: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
  delivered: "bg-green-500/10 text-green-600 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-600 border-red-500/20",
};

const paymentColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  paid: "bg-green-500/10 text-green-600 border-green-500/20",
  failed: "bg-red-500/10 text-red-600 border-red-500/20",
  refunded: "bg-purple-500/10 text-purple-600 border-purple-500/20",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) notFound();

  const addr = order.shipping_address;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/orders"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-heading font-semibold tracking-tight flex items-center gap-3">
            Order{" "}
            <span className="font-mono text-gold">{order.order_number}</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Placed on{" "}
            {new Date(order.created_at).toLocaleDateString("en-AE", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Package className="w-4 h-4" />
                Order Items
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items.map((item, i) => (
                <div key={item.id ?? i}>
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted border border-border shrink-0">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                          No img
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{item.name}</p>
                      <div className="flex gap-3 mt-1">
                        {item.selectedColor && (
                          <span className="text-xs text-muted-foreground">
                            Color: {item.selectedColor}
                          </span>
                        )}
                        {item.selectedSize && (
                          <span className="text-xs text-muted-foreground">
                            Size: {item.selectedSize}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-sm font-medium shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                  {i < order.items.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}

              <Separator />

              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>
                    {order.shipping_cost === 0
                      ? "Free"
                      : formatPrice(order.shipping_cost)}
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-base pt-1">
                  <span>Total</span>
                  <span className="text-gold">{formatPrice(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {order.customization_notes && (
            <Card className="border-border border-gold/20 bg-gold/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gold">
                  Customization Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">
                  {order.customization_notes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <User className="w-4 h-4" />
                Customer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="font-medium">{order.customer_name}</p>
              <p className="text-muted-foreground">{order.customer_email}</p>
              <p className="text-muted-foreground">{order.customer_phone}</p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-0.5">
              <p>{addr.line1}</p>
              {addr.line2 && <p>{addr.line2}</p>}
              <p>
                {addr.city}, {addr.emirate}
              </p>
              <p>{addr.country}</p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Payment & Fulfillment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Payment</span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                    paymentColors[order.payment_status] ?? ""
                  }`}
                >
                  {order.payment_status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Fulfillment</span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                    fulfillmentColors[order.fulfillment_status] ?? ""
                  }`}
                >
                  {order.fulfillment_status}
                </span>
              </div>
              {order.ziina_payment_id && (
                <div className="pt-1">
                  <p className="text-xs text-muted-foreground">Ziina Payment ID</p>
                  <p className="text-xs font-mono mt-0.5 break-all">
                    {order.ziina_payment_id}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <OrderActions order={order} />
        </div>
      </div>
    </div>
  );
}
