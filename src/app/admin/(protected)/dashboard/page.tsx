import { createServiceClient } from "@/lib/supabase-server";
import type { Order, Product } from "@/lib/supabase";
import { formatPrice } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import {
  ShoppingBag,
  DollarSign,
  Clock,
  AlertTriangle,
} from "lucide-react";

async function getDashboardData() {
  const supabase = createServiceClient();

  const [ordersResult, revenueResult, pendingResult, lowStockResult, recentResult] =
    await Promise.all([
      supabase.from("orders").select("id", { count: "exact", head: true }),
      supabase
        .from("orders")
        .select("total")
        .eq("payment_status", "paid"),
      supabase
        .from("orders")
        .select("id", { count: "exact", head: true })
        .eq("fulfillment_status", "pending"),
      supabase
        .from("products")
        .select("id, name, stock")
        .lte("stock", 3),
      supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

  const totalOrders = ordersResult.count ?? 0;
  const totalRevenue = (revenueResult.data as { total: number }[] ?? []).reduce(
    (sum, o) => sum + (o.total ?? 0),
    0
  );
  const pendingOrders = pendingResult.count ?? 0;
  const lowStockProducts = (lowStockResult.data as Pick<Product, "id" | "name" | "stock">[] ?? []);
  const recentOrders = (recentResult.data as Order[] ?? []);

  return { totalOrders, totalRevenue, pendingOrders, lowStockProducts, recentOrders };
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

export default async function DashboardPage() {
  const { totalOrders, totalRevenue, pendingOrders, lowStockProducts, recentOrders } =
    await getDashboardData();

  const stats = [
    {
      label: "Total Orders",
      value: totalOrders.toString(),
      icon: ShoppingBag,
      color: "text-blue-500",
    },
    {
      label: "Total Revenue",
      value: formatPrice(totalRevenue),
      icon: DollarSign,
      color: "text-green-500",
    },
    {
      label: "Pending Orders",
      value: pendingOrders.toString(),
      icon: Clock,
      color: "text-yellow-500",
    },
    {
      label: "Low Stock Items",
      value: lowStockProducts.length.toString(),
      icon: AlertTriangle,
      color: "text-red-500",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-heading font-semibold tracking-tight">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Overview of your store performance
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="border-border">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                    {label}
                  </p>
                  <p className="text-2xl font-heading font-semibold mt-1 tracking-tight">
                    {value}
                  </p>
                </div>
                <div className={`p-2 rounded-lg bg-muted ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {lowStockProducts.length > 0 && (
        <Card className="border-yellow-500/20 bg-yellow-500/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-yellow-600 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Low Stock Warning
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {lowStockProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/admin/products/${p.id}`}
                  className="inline-flex items-center gap-1.5 text-xs bg-background border border-border rounded-full px-3 py-1 hover:border-gold/50 transition-colors"
                >
                  <span>{p.name}</span>
                  <span className="text-red-500 font-medium">({p.stock})</span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base font-medium">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Fulfillment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No orders yet.
                  </TableCell>
                </TableRow>
              ) : (
                recentOrders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-muted/40">
                    <TableCell>
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-mono text-xs text-gold hover:underline"
                      >
                        {order.order_number}
                      </Link>
                    </TableCell>
                    <TableCell className="text-sm">{order.customer_name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString("en-AE", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-sm font-medium">
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
