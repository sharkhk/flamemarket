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
    <section id="brand-story" className="py-20 lg:py-28 bg-card border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-gold text-xs uppercase tracking-[0.2em] mb-4">
              About FLAMEMARKET
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold leading-tight mb-6">
              Characters you love,{" "}
              <span className="text-gold">printed for you</span>
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
              <p className="text-lg font-heading font-semibold text-gold/70 mb-2">
                &ldquo;Shape it. Fire it. Own it.&rdquo;
              </p>
              <p className="text-xs text-muted-foreground">
                Every figure printed fresh — no warehouse, no shortcuts.
              </p>
            </div>
          </motion.div>

          {/* Pillars */}
          <div className="space-y-6">
            {pillars.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="flex gap-5 p-5 rounded-2xl bg-background border border-border hover:border-gold/30 transition-colors"
              >
                <div className="shrink-0 w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                  <pillar.icon className="h-5 w-5 text-gold" />
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
