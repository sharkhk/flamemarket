import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export function createBrowserClient() {
  return createClient(supabaseUrl, supabaseAnonKey);
}

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  category: string | null;
  images: string[];
  model_url: string | null;
  weight_grams: number;
  dimensions: { l: number; w: number; h: number } | null;
  stock: number;
  available_colors: string[];
  available_sizes: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: {
    line1: string;
    line2?: string;
    city: string;
    emirate: string;
    country: string;
  };
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    selectedColor?: string;
    selectedSize?: string;
  }>;
  subtotal: number;
  shipping_cost: number;
  total: number;
  payment_status: "pending" | "paid" | "failed" | "refunded";
  ziina_payment_id: string | null;
  ziina_payment_url: string | null;
  fulfillment_status:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  aramex_shipment_id: string | null;
  aramex_tracking_number: string | null;
  customization_notes: string | null;
  created_at: string;
  updated_at: string;
};
