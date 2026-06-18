import { createServiceClient } from "@/lib/supabase-server";
import type { Product } from "@/lib/supabase";
import { formatPrice } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import Image from "next/image";
import ProductToggleActive from "./ProductToggleActive";

async function getAllProducts(): Promise<Product[]> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  return (data as Product[]) ?? [];
}

export default async function ProductsPage() {
  const products = await getAllProducts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-semibold tracking-tight">
            Products
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {products.length} product{products.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <Button asChild className="bg-gold hover:bg-gold/90 text-gold-foreground">
          <Link href="/admin/products/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Link>
        </Button>
      </div>

      <Card className="border-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-muted-foreground py-12"
                  >
                    No products yet.{" "}
                    <Link
                      href="/admin/products/new"
                      className="text-gold hover:underline"
                    >
                      Add your first product
                    </Link>
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id} className="hover:bg-muted/40">
                    <TableCell>
                      <div className="w-10 h-10 rounded-md overflow-hidden bg-muted border border-border shrink-0">
                        {product.images?.[0] ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                            No img
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-sm">{product.name}</span>
                      <p className="text-xs text-muted-foreground font-mono mt-0.5">
                        {product.slug}
                      </p>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {product.category ?? "—"}
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {formatPrice(product.price)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-sm font-medium ${
                          product.stock <= 0
                            ? "text-red-500"
                            : product.stock <= 3
                            ? "text-yellow-500"
                            : "text-foreground"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          product.is_active
                            ? "border-green-500/30 text-green-600 bg-green-500/10"
                            : "border-border text-muted-foreground"
                        }
                      >
                        {product.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <ProductToggleActive
                          id={product.id}
                          isActive={product.is_active}
                        />
                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2"
                        >
                          <Link href={`/admin/products/${product.id}`}>
                            <Pencil className="w-3.5 h-3.5 mr-1" />
                            Edit
                          </Link>
                        </Button>
                      </div>
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
