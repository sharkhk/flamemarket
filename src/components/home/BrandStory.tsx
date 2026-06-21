"use client";

import { motion } from "framer-motion";
import { Layers, Cpu, Package } from "lucide-react";

const pillars = [
  {
    icon: Layers,
    title: "Printed to order",
    description:
      "Every figure is printed fresh when you order — no pre-made stock, no compromises. You get a crisp, clean print every time.",
  },
  {
    icon: Cpu,
    title: "High-detail FDM",
    description:
      "We print at 0.05mm layer height — fine enough to capture armour engravings, facial detail, and weapon textures sharp enough to paint.",
  },
  {
    icon: Package,
    title: "Ready to paint or display",
    description:
      "Ships unprimed or primed grey. Collectors can display as-is; painters get a surface that takes primer and acrylics cleanly.",
  },
];

export default function BrandStory() {
  return (
    <section
      id="brand-story"
      className="relative py-20 lg:py-28 bg-background border-y border-border overflow-hidden"
    >
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 grid-bg opacity-60 pointer-events-none" />

      {/* Ambient orb */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "50%",
          right: "-200px",
          transform: "translateY(-50%)",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "rgba(201,148,58,0.05)",
          filter: "blur(100px)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[#C9943A] text-xs uppercase tracking-[0.2em] mb-4">
              About FLAMEMARKET
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold leading-tight mb-6">
              Characters you love,{" "}
              <span className="gradient-text">printed for you</span>
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                FLAMEMARKET prints the figures and miniatures that collectors,
                tabletop gamers, and display enthusiasts actually want — without
                the wait, the scalpers, or the import fees.
              </p>
              <p>
                Every model is printed in our UAE workshop using high-detail
                FDM at 0.05mm layer height. The result is surface detail sharp
                enough to paint competition-level, or clean enough to display
                straight out of the box.
              </p>
              <p>
                Browse the catalogue, pick your scale and finish, and we ship
                directly to your door. Simple as that.
              </p>
            </div>

            <div className="mt-8 pt-8 border-t border-border">
              {/* Quote with vertical line accent */}
              <div className="flex gap-4">
                <div className="w-0.5 shrink-0 bg-gradient-to-b from-[#C9943A] to-[rgba(201,148,58,0.1)] rounded-full" />
                <div>
                  <p className="text-xl font-heading font-semibold italic gradient-text mb-2">
                    &ldquo;Shape it. Fire it. Own it.&rdquo;
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Every figure printed fresh — no warehouse, no shortcuts.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Pillars */}
          <div className="space-y-5">
            {pillars.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="card-glass flex gap-5 p-5 rounded-2xl hover:border-[rgba(201,148,58,0.25)] transition-all duration-300"
                style={{
                  ["--tw-shadow" as string]: "none",
                }}
                whileHover={{
                  boxShadow: "0 4px 24px rgba(201,148,58,0.08)",
                } as Record<string, string>}
              >
                <div
                  className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ring-1 ring-[rgba(201,148,58,0.2)]"
                  style={{
                    background: "linear-gradient(135deg, rgba(201,148,58,0.2) 0%, rgba(201,148,58,0.05) 100%)",
                  }}
                >
                  <pillar.icon className="h-5 w-5 text-[#C9943A]" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold mb-1">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
