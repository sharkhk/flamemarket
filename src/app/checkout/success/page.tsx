import { Suspense } from "react";
import Link from "next/link";
import { CheckCircle, Package, ArrowRight, Printer, Truck, Star } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

interface Props {
  searchParams: Promise<{ order?: string }>;
}

const NEXT_STEPS = [
  {
    icon: Printer,
    title: "We start printing",
    desc: "Your figure goes into production within 2 hours of payment confirmation.",
  },
  {
    icon: Star,
    title: "Quality check & packaging",
    desc: "Every piece is inspected and packed securely before handoff.",
  },
  {
    icon: Truck,
    title: "Aramex picks up",
    desc: "Your order ships within 1–2 business days and arrives in 3–5 more.",
  },
  {
    icon: Package,
    title: "Delivered to your door",
    desc: "Track your shipment anytime using your order number below.",
  },
];

async function SuccessContent({ order }: { order?: string }) {
  return (
    <>
      {/* Hero section */}
      <section className="relative overflow-hidden bg-background pt-24 pb-14">
        <div className="absolute inset-0 grid-bg pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 60%, rgba(201,148,58,0.07) 0%, transparent 70%)",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#C9943A]/30 to-transparent pointer-events-none" />

        <div className="relative max-w-lg mx-auto px-4 text-center">
          {/* Animated checkmark */}
          <div className="relative inline-flex items-center justify-center mb-8">
            <div
              className="absolute w-28 h-28 rounded-full bg-[#C9943A]/10 animate-ping"
              style={{ animationDuration: "2.5s" }}
            />
            <div className="absolute w-24 h-24 rounded-full bg-[#C9943A]/10" />
            <div className="relative w-20 h-20 rounded-full bg-[#C9943A]/20 border-2 border-[#C9943A]/60 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-[#C9943A]" />
            </div>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl font-bold mb-4">
            Order{" "}
            <span className="gradient-text">Confirmed!</span>
          </h1>

          {order && (
            <div className="inline-flex items-center gap-2 bg-[#C9943A]/10 text-[#C9943A] border border-[#C9943A]/30 rounded-full px-5 py-2 text-sm font-semibold mb-5">
              <Package className="h-4 w-4" />
              {order}
            </div>
          )}

          <p className="text-muted-foreground leading-relaxed">
            Payment received. Your figure is going into production.
            An email confirmation is on its way to you now.
          </p>
        </div>
      </section>

      {/* What's next */}
      <section className="max-w-lg mx-auto px-4 py-12">
        <h2 className="font-heading text-sm font-semibold uppercase tracking-widest text-muted-foreground text-center mb-8">
          What happens next
        </h2>

        <div className="space-y-0">
          {NEXT_STEPS.map((step, i) => (
            <div key={step.title} className="flex gap-4">
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="w-10 h-10 rounded-xl bg-[#C9943A]/10 border border-[#C9943A]/25 flex items-center justify-center">
                  <step.icon className="h-4.5 w-4.5 text-[#C9943A]" style={{ width: "1.125rem", height: "1.125rem" }} />
                </div>
                {i < NEXT_STEPS.length - 1 && (
                  <div
                    className="w-px flex-1 min-h-[28px] mt-1 mb-1"
                    style={{
                      background: "linear-gradient(to bottom, rgba(201,148,58,0.3), rgba(201,148,58,0.05))",
                    }}
                  />
                )}
              </div>
              <div className={i < NEXT_STEPS.length - 1 ? "pb-7" : ""}>
                <p className="font-heading font-semibold text-sm leading-tight">{step.title}</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 mt-10">
          {order && (
            <Button
              variant="outline"
              className="flex-1 gap-2 border-[#C9943A]/30 hover:border-[#C9943A] hover:text-[#C9943A]"
              asChild
            >
              <Link href={`/track/${order}`}>
                <Package className="h-4 w-4" />
                Track Order
              </Link>
            </Button>
          )}
          <Button
            className="flex-1 bg-[#C9943A] hover:opacity-90 text-white font-semibold gap-2 glow-gold"
            asChild
          >
            <Link href="/shop">
              Continue Shopping
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}

export default async function SuccessPage({ searchParams }: Props) {
  const { order } = await searchParams;

  return (
    <>
      <Header />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="py-24 text-center text-muted-foreground">
              Loading…
            </div>
          }
        >
          <SuccessContent order={order} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
