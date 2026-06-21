import Link from "next/link";
import { Share2, Mail, MessageCircle } from "lucide-react";

const shopLinks = [
  { href: "/shop", label: "All Products" },
  { href: "/shop?category=figures", label: "Figures" },
  { href: "/shop?category=miniatures", label: "Miniatures" },
  { href: "/shop?category=custom", label: "Custom Prints" },
];

const infoLinks = [
  { href: "/track", label: "Track Order" },
  { href: "mailto:hello@flamemarket.com", label: "Contact" },
];

const socials = [
  { href: "https://instagram.com", label: "Instagram", icon: Share2 },
  { href: "mailto:hello@flamemarket.com", label: "Email", icon: Mail },
  { href: "https://wa.me/971500000000", label: "WhatsApp", icon: MessageCircle },
];

export default function Footer() {
  return (
    <footer className="mt-auto bg-[#0D0D0F] dark:bg-[#08080A] border-t border-white/6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-18">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand col */}
          <div className="md:col-span-2">
            <Link href="/shop" className="inline-block mb-4">
              <span className="font-heading font-bold text-xl tracking-widest gradient-text">
                FLAMEMARKET
              </span>
            </Link>
            <p className="text-sm text-white/40 leading-relaxed max-w-xs mb-6">
              Precision 3D printed figures made to order from our UAE workshop.
              Every piece crafted fresh — no warehouse, no compromises.
            </p>
            <div className="flex items-center gap-3">
              {socials.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-white/40 hover:text-[#C9943A] hover:border-[#C9943A]/40 transition-all duration-200"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-heading font-semibold text-[10px] uppercase tracking-[0.2em] mb-5 text-white/30">
              Shop
            </h3>
            <ul className="space-y-3">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 hover:text-white/90 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-heading font-semibold text-[10px] uppercase tracking-[0.2em] mb-5 text-white/30">
              Info
            </h3>
            <ul className="space-y-3">
              {infoLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 hover:text-white/90 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div
          className="my-10 h-px"
          style={{ background: "linear-gradient(to right, transparent, rgba(201,148,58,0.25), transparent)" }}
        />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/30">
          <p>© {new Date().getFullYear()} FLAMEMARKET. All rights reserved.</p>
          <p>
            Payments by{" "}
            <span className="text-[#C9943A]/70 font-medium">Ziina</span>
            {" · "}
            Shipping by{" "}
            <span className="text-white/50 font-medium">Aramex</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
