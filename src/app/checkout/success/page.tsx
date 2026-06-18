import { Suspense } from "react";
import Link from "next/link";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

interface Props {
  searchParams: Promise<{ order?: string }>;
}

async function SuccessContent({ order }: { order?: string }) {
  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
          <CheckCircle className="h-10 w-10 text-green-500" />
        </div>
      </div>

      <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-3">
        Order Confirmed!
      </h1>

      {order && (
        <div className="inline-flex items-center gap-2 bg-gold/10 text-gold border border-gold/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
          <Package className="h-4 w-4" />
          {order}
        </div>
      )}

      <p className="text-muted-foreground leading-relaxed mb-8">
        Thank you for your order. We&apos;ve received your payment and your
        items are being prepared. You&apos;ll receive an email confirmation
        shortly.
      </p>

      <div className="space-y-4 text-sm text-muted-foreground bg-card border border-border rounded-2xl p-6 mb-8 text-left">
        <h2 className="font-heading font-semibold text-foreground text-base mb-3">
          What happens next?
        </h2>
        {[
          "We print your item(s) to order — this takes 1–2 business days.",
          "Quality check and packaging.",
          "Aramex courier picks up and delivers within 3–5 business days.",
          "You can track your order using your order number.",
        ].map((step, i) => (
          <div key={i} className="flex gap-3">
            <span className="shrink-0 w-5 h-5 rounded-full bg-gold/20 text-gold text-xs flex items-center justify-center font-bold">
              {i + 1}
            </span>
            <span>{step}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {order && (
          <Button
            variant="outline"
            className="gap-2"
            asChild
          >
            <Link href={`/track/${order}`}>
              Track Order
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        )}
        <Button className="bg-gold hover:opacity-90 text-white" asChild>
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  );
}

export default async function SuccessPage({ searchParams }: Props) {
  const { order } = await searchParams;

  return (
    <>
      <Header />
      <main className="flex-1 pt-16">
        <Suspense fallback={<div className="py-24 text-center text-muted-foreground">Loading…</div>}>
          <SuccessContent order={order} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
