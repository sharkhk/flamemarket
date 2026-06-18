import Link from "next/link";
import { Share2, Mail, MessageCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="font-heading font-bold text-xl text-gold tracking-widest">
                FLAMEMARKET
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Handcrafted 3D printed objects made with precision and care.
              Every piece is unique, every order is made directly by the maker.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-gold transition-colors"
                aria-label="Instagram"
              >
                <Share2 className="h-5 w-5" />
              </a>
              <a
                href="mailto:hello@flamemarket.com"
                className="text-muted-foreground hover:text-gold transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
              <a
                href="https://wa.me/971500000000"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-gold transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-heading font-semibold text-sm uppercase tracking-widest mb-4 text-muted-foreground">
              Shop
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/shop", label: "All Products" },
                { href: "/shop?category=figures", label: "Figures" },
                { href: "/shop?category=miniatures", label: "Miniatures" },
                { href: "/shop?category=custom", label: "Custom Prints" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-heading font-semibold text-sm uppercase tracking-widest mb-4 text-muted-foreground">
              Info
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/track", label: "Track Order" },
                { href: "mailto:hello@flamemarket.com", label: "Contact" },
                { href: "/faq", label: "FAQ" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} FLAMEMARKET. All rights reserved.</p>
          <p>
            Payments secured by{" "}
            <span className="text-gold font-medium">Ziina</span> · Shipping by{" "}
            <span className="font-medium">Aramex</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
