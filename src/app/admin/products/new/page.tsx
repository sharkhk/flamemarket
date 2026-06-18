"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { X, Upload, Loader2 } from "lucide-react";
import Link from "next/link";

const IS_DEV_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DB === "true";

function mockImageUrl(fileName: string) {
  return `https://placehold.co/800x800/1E1E20/C9943A?text=${encodeURIComponent(fileName.split(".")[0])}`;
}

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [weight, setWeight] = useState("");
  const [dimL, setDimL] = useState("");
  const [dimW, setDimW] = useState("");
  const [dimH, setDimH] = useState("");
  const [colorInput, setColorInput] = useState("");
  const [colors, setColors] = useState<string[]>([]);
  const [sizeInput, setSizeInput] = useState("");
  const [sizes, setSizes] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [modelFile, setModelFile] = useState<File | null>(null);
  const [isActive, setIsActive] = useState(true);

  function handleNameChange(val: string) {
    setName(val);
    setSlug(slugify(val));
  }

  function addTags(
    input: string,
    setInput: (v: string) => void,
    tags: string[],
    setTags: (v: string[]) => void
  ) {
    const newTags = input
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0 && !tags.includes(t));
    setTags([...tags, ...newTags]);
    setInput("");
  }

  function removeTag(
    tag: string,
    tags: string[],
    setTags: (v: string[]) => void
  ) {
    setTags(tags.filter((t) => t !== tag));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !price) {
      toast.error("Name and price are required.");
      return;
    }

    setLoading(true);
    try {
      // In dev-mock mode we can't upload to Supabase Storage — use placeholder URLs
      const imageUrls = IS_DEV_MOCK
        ? imageFiles.map((f) => mockImageUrl(f.name))
        : [];

      if (!IS_DEV_MOCK && imageFiles.length > 0) {
        // Production: upload via Supabase Storage (requires real credentials)
        const { createBrowserClient } = await import("@/lib/supabase");
        const supabase = createBrowserClient();
        for (const file of imageFiles) {
          const ext = file.name.split(".").pop();
          const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
          const { error } = await supabase.storage.from("product-images").upload(path, file, { upsert: true });
          if (error) throw error;
          const { data } = supabase.storage.from("product-images").getPublicUrl(path);
          imageUrls.push(data.publicUrl);
        }
      }

      let modelUrl: string | null = null;
      if (modelFile && !IS_DEV_MOCK) {
        const { createBrowserClient } = await import("@/lib/supabase");
        const supabase = createBrowserClient();
        const ext = modelFile.name.split(".").pop();
        const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await supabase.storage.from("product-models").upload(path, modelFile, { upsert: true });
        if (error) throw error;
        const { data } = supabase.storage.from("product-models").getPublicUrl(path);
        modelUrl = data.publicUrl;
      }

      const dimensions =
        dimL && dimW && dimH
          ? { l: parseFloat(dimL), w: parseFloat(dimW), h: parseFloat(dimH) }
          : null;

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug: slug || slugify(name),
          category: category || null,
          description: description || null,
          price,
          stock,
          weight,
          dimensions,
          colors,
          sizes,
          imageUrls,
          modelUrl,
          isActive,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to create product");

      toast.success("Product created successfully");
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create product");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-semibold tracking-tight">
            New Product
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Add a new product to your store
          </p>
        </div>
        <Button variant="ghost" asChild>
          <Link href="/admin/products">Cancel</Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Basic Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Product name"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="auto-generated"
                  className="font-mono text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. figures, miniatures, custom"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Product description…"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Pricing & Inventory</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="price">Price (AED) *</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Shipping</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="weight">Weight (grams)</Label>
              <Input
                id="weight"
                type="number"
                min="0"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Dimensions (cm) — L × W × H</Label>
              <div className="grid grid-cols-3 gap-3">
                <Input type="number" min="0" step="0.1" value={dimL} onChange={(e) => setDimL(e.target.value)} placeholder="Length" />
                <Input type="number" min="0" step="0.1" value={dimW} onChange={(e) => setDimW(e.target.value)} placeholder="Width" />
                <Input type="number" min="0" step="0.1" value={dimH} onChange={(e) => setDimH(e.target.value)} placeholder="Height" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Variants</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Available Colors</Label>
              <div className="flex gap-2">
                <Input
                  value={colorInput}
                  onChange={(e) => setColorInput(e.target.value)}
                  placeholder="Red, Blue, Gold (comma-separated)"
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTags(colorInput, setColorInput, colors, setColors); } }}
                />
                <Button type="button" variant="outline" onClick={() => addTags(colorInput, setColorInput, colors, setColors)}>Add</Button>
              </div>
              {colors.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {colors.map((c) => (
                    <span key={c} className="inline-flex items-center gap-1 text-xs bg-muted border border-border rounded-full px-3 py-1">
                      {c}
                      <button type="button" onClick={() => removeTag(c, colors, setColors)} className="text-muted-foreground hover:text-foreground"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Available Sizes</Label>
              <div className="flex gap-2">
                <Input
                  value={sizeInput}
                  onChange={(e) => setSizeInput(e.target.value)}
                  placeholder="S, M, L, XL (comma-separated)"
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTags(sizeInput, setSizeInput, sizes, setSizes); } }}
                />
                <Button type="button" variant="outline" onClick={() => addTags(sizeInput, setSizeInput, sizes, setSizes)}>Add</Button>
              </div>
              {sizes.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {sizes.map((s) => (
                    <span key={s} className="inline-flex items-center gap-1 text-xs bg-muted border border-border rounded-full px-3 py-1">
                      {s}
                      <button type="button" onClick={() => removeTag(s, sizes, setSizes)} className="text-muted-foreground hover:text-foreground"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Media</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="images">Product Images</Label>
              {IS_DEV_MOCK && (
                <p className="text-xs text-gold/70">Dev mode: images will use placeholders</p>
              )}
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-gold/40 transition-colors">
                <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">Click or drag images here</p>
                <input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => { if (e.target.files) setImageFiles(Array.from(e.target.files)); }}
                />
                <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById("images")?.click()}>
                  Select Images
                </Button>
                {imageFiles.length > 0 && (
                  <p className="text-xs text-gold mt-2">{imageFiles.length} file{imageFiles.length !== 1 ? "s" : ""} selected</p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="model">3D Model (.glb)</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-gold/40 transition-colors">
                <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">Upload a .glb file for 3D preview</p>
                <input id="model" type="file" accept=".glb" className="sr-only" onChange={(e) => { if (e.target.files?.[0]) setModelFile(e.target.files[0]); }} />
                <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById("model")?.click()}>
                  Select Model
                </Button>
                {modelFile && <p className="text-xs text-gold mt-2">{modelFile.name}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Active</Label>
                <p className="text-xs text-muted-foreground mt-0.5">Visible to customers on the storefront</p>
              </div>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${isActive ? "bg-gold" : "bg-muted"}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${isActive ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3 pb-8">
          <Button type="submit" disabled={loading} className="bg-gold hover:bg-gold/90 text-gold-foreground">
            {loading ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating…</>) : "Create Product"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/products">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
