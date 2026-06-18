import { createServiceClient } from "@/lib/supabase-server";
import type { Order } from "@/lib/supabase";
import { formatPrice } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import OrderFilterTabs from "./OrderFilterTabs";

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

type FulfillmentFilter =
  | "all"
  | "pending"
  | "processing"
  | "shipped"
  | "delivered";

async function getOrders(filter?: FulfillmentFilter): Promise<Order[]> {
  const supabase = createServiceClient();
  let query = supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (filter && filter !== "all") {
    query = query.eq("fulfillment_status", filter);
  }

  const { data } = await query;
  return (data as Order[]) ?? [];
}

interface Props {
  searchParams: Promise<{ filter?: string }>;
}

export default async function OrdersPage({ searchParams }: Props) {
  const { filter } = await searchParams;
  const activeFilter = (filter as FulfillmentFilter) ?? "all";
  const orders = await getOrders(activeFilter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-semibold tracking-tight">
          Orders
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {orders.length} order{orders.length !== 1 ? "s" : ""}{" "}
          {activeFilter !== "all" ? `(${activeFilter})` : "total"}
        </p>
      </div>

      <OrderFilterTabs activeFilter={activeFilter} />

      <Card className="border-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Fulfillment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center text-muted-foreground py-12"
                  >
                    No orders found.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-muted/40">
                    <TableCell>
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-mono text-xs text-gold hover:underline"
                      >
                        {order.order_number}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">{order.customer_name}</div>
                      <div className="text-xs text-muted-foreground">
                        {order.customer_email}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {new Date(order.created_at).toLocaleDateString("en-AE", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-sm text-center">
                      {Array.isArray(order.items) ? order.items.length : 0}
                    </TableCell>
                    <TableCell className="text-sm font-medium whitespace-nowrap">
                      {formatPrice(order.total)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                          paymentColors[order.payment_status] ?? ""
                        }`}
                      >
                        {order.payment_status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                          fulfillmentColors[order.fulfillment_status] ?? ""
                        }`}
                      >
                        {order.fulfillment_status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-xs text-gold hover:underline font-medium"
                      >
                        View
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
