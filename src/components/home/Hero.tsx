"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Torus, MeshDistortMaterial, Environment } from "@react-three/drei";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Zap, Shield, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Mesh } from "three";

function FloatingShape() {
  const meshRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = clock.getElapsedTime() * 0.15;
    meshRef.current.rotation.y = clock.getElapsedTime() * 0.2;
    meshRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.6) * 0.15;
  });

  return (
    <Torus ref={meshRef} args={[1, 0.38, 64, 128]}>
      <MeshDistortMaterial
        color="#C9943A"
        distort={0.3}
        speed={1.5}
        roughness={0.15}
        metalness={0.9}
        envMapIntensity={1.5}
      />
    </Torus>
  );
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-background">
      {/* Grid texture — visible in both modes */}
      <div className="absolute inset-0 grid-bg pointer-events-none" />

      {/* Light mode warm accent */}
      <div
        className="absolute inset-0 pointer-events-none dark:opacity-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 60% 50%, rgba(201,148,58,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Dark mode gold orbs */}
      <div
        className="absolute pointer-events-none opacity-0 dark:opacity-100"
        style={{
          top: "-200px",
          left: "-200px",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "rgba(201,148,58,0.12)",
          filter: "blur(120px)",
        }}
      />
      <div
        className="absolute pointer-events-none opacity-0 dark:opacity-100"
        style={{
          bottom: "-200px",
          right: "-150px",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "rgba(201,148,58,0.08)",
          filter: "blur(120px)",
        }}
      />

      {/* Gold accent stripe — visible in both modes */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent, #C9943A 30%, #F0C060 60%, #C9943A 80%, transparent)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center pt-24 pb-16">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-[#C9943A]/30 bg-[#C9943A]/10"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9943A] animate-pulse" />
              <span className="text-[#C9943A] text-xs font-semibold uppercase tracking-[0.18em]">
                Handcrafted in UAE · Made to order
              </span>
            </motion.div>

            <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6">
              Figures forged
              <br />
              <span className="gradient-text">layer by layer</span>
            </h1>

            <p className="text-muted-foreground text-lg leading-relaxed max-w-md mb-8">
              From fan-favourite characters to custom miniatures — every figure
              printed fresh to your order. Shipped directly from our UAE
              workshop.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Button
                size="lg"
                className="bg-[#C9943A] hover:opacity-90 text-white font-semibold group glow-gold"
                asChild
              >
                <Link href="/shop">
                  Shop Collection
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-[#C9943A]/40 hover:border-[#C9943A] hover:bg-[#C9943A]/5" asChild>
                <Link href="#brand-story">How It Works</Link>
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-4">
              {[
                { icon: Star, label: "Premium quality" },
                { icon: Zap, label: "3–7 day delivery" },
                { icon: Shield, label: "Secure checkout" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Icon className="h-3.5 w-3.5 text-[#C9943A]" />
                  {label}
                </div>
              ))}
            </div>
          </motion.div>

          {/* 3D Canvas */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="relative h-80 sm:h-96 lg:h-[520px] w-full"
          >
            {/* Decorative corner frames */}
            <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-[#C9943A]/60 rounded-tl-lg pointer-events-none z-10" />
            <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#C9943A]/60 rounded-tr-lg pointer-events-none z-10" />
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#C9943A]/60 rounded-bl-lg pointer-events-none z-10" />
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-[#C9943A]/60 rounded-br-lg pointer-events-none z-10" />

            <div
              className="absolute inset-0 rounded-3xl overflow-hidden ring-1 ring-[rgba(201,148,58,0.25)] bg-secondary/30"
              style={{ boxShadow: "0 0 60px rgba(201,148,58,0.15), inset 0 0 40px rgba(201,148,58,0.05)" }}
            >
              <Canvas
                camera={{ position: [0, 0, 3.5], fov: 45 }}
                gl={{ antialias: true, alpha: true }}
                style={{ background: "transparent" }}
              >
                <Suspense fallback={null}>
                  <ambientLight intensity={0.5} />
                  <directionalLight position={[5, 5, 5]} intensity={1} />
                  <pointLight position={[-5, -5, -5]} intensity={0.3} color="#C9943A" />
                  <FloatingShape />
                  <Environment preset="city" />
                  <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    autoRotate
                    autoRotateSpeed={0.5}
                  />
                </Suspense>
              </Canvas>
            </div>

            {/* Stats card overlay */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute -bottom-4 -left-4 bg-card border border-border rounded-2xl px-5 py-4 shadow-xl z-20"
            >
              <div className="flex items-center gap-4">
                {[
                  { value: "100%", label: "Made to order" },
                  { value: "50+", label: "Models" },
                ].map((stat, i) => (
                  <div key={stat.label} className="flex items-center gap-4">
                    {i > 0 && <div className="w-px h-8 bg-border" />}
                    <div>
                      <div className="font-heading font-extrabold text-xl text-[#C9943A]">
                        {stat.value}
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-px h-10 bg-gradient-to-b from-[rgba(201,148,58,0.6)] to-transparent"
        />
      </motion.div>
    </section>
  );
}
