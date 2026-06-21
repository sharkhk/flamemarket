"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Torus, MeshDistortMaterial, Environment } from "@react-three/drei";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Deep dark gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/20 pointer-events-none" />

      {/* Subtle grid texture */}
      <div className="absolute inset-0 grid-bg opacity-100 pointer-events-none" />

      {/* Ambient glow orbs */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-200px",
          left: "-200px",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "rgba(201,148,58,0.08)",
          filter: "blur(120px)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "-200px",
          right: "-150px",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "rgba(201,148,58,0.06)",
          filter: "blur(120px)",
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
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="h-px w-8 bg-[#C9943A]" />
              <span className="text-[#C9943A] text-xs font-medium uppercase tracking-[0.2em]">
                Handcrafted in UAE
              </span>
            </motion.div>

            <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6">
              Figures forged
              <br />
              layer by{" "}
              <span className="gradient-text relative">
                layer
                <motion.span
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#C9943A] origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                />
              </span>
            </h1>

            <p className="text-muted-foreground text-lg leading-relaxed max-w-md mb-8">
              From fan-favourite characters to custom miniatures — every figure
              printed fresh to your order. Shipped directly from our UAE
              workshop.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-[#C9943A] hover:opacity-90 text-white font-medium group glow-gold"
                asChild
              >
                <Link href="/shop">
                  Shop Collection
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#brand-story">How It Works</Link>
              </Button>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="flex items-center gap-6 mt-12 pt-8 border-t border-border"
            >
              {[
                { value: "100%", label: "Made to order" },
                { value: "3–7", label: "Days delivery" },
                { value: "50+", label: "Models available" },
              ].map((stat, i) => (
                <div key={stat.label} className="flex items-center gap-6">
                  {i > 0 && (
                    <span className="w-1 h-1 rounded-full bg-[#C9943A]/40 shrink-0" />
                  )}
                  <div>
                    <div className="font-heading font-extrabold text-2xl text-[#C9943A]">
                      {stat.value}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* 3D Canvas */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="relative h-80 sm:h-96 lg:h-[520px] w-full"
          >
            <div
              className="absolute inset-0 rounded-3xl overflow-hidden ring-1 ring-[rgba(201,148,58,0.2)]"
              style={{ boxShadow: "0 0 60px rgba(201,148,58,0.12)" }}
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
