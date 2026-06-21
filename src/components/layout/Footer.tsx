import Link from "next/link";
import { Share2, Mail, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="mt-auto border-t"
      style={{
        backgroundColor: "#08080A",
        borderTopColor: "rgba(255,255,255,0.06)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="font-heading font-bold text-xl tracking-widest gradient-text">
                FLAMEMARKET
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Precision 3D printed figures made to order from our UAE workshop.
              Every piece crafted fresh — no warehouse, no compromises.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-all duration-200 hover:text-[#C9943A]"
                style={{ ["--tw-drop-shadow" as string]: "none" }}
                aria-label="Instagram"
              >
                <Share2
                  className="h-5 w-5 hover:drop-shadow-[0_0_6px_rgba(201,148,58,0.6)]"
                  style={{ transition: "filter 0.2s ease" }}
                />
              </a>
              <a
                href="mailto:hello@flamemarket.com"
                className="text-muted-foreground transition-all duration-200 hover:text-[#C9943A]"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
              <a
                href="https://wa.me/971500000000"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-all duration-200 hover:text-[#C9943A]"
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
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
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
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Gradient separator line */}
        <div
          className="my-8 h-px"
          style={{
            background: "linear-gradient(to right, transparent, rgba(201,148,58,0.2), transparent)",
          }}
        />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} FLAMEMARKET. All rights reserved.</p>
          <p>
            Payments secured by{" "}
            <span className="text-[#C9943A] font-medium">Ziina</span> · Shipping by{" "}
            <span className="font-medium text-foreground/60">Aramex</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
