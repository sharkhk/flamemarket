"use client";

import { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";
import { Box, RotateCcw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type * as THREE from "three";

interface ModelProps {
  url: string;
}

function Model({ url }: ModelProps) {
  const { scene } = useGLTF(url);
  const ref = useRef<THREE.Group>(null);
  return <primitive ref={ref} object={scene} dispose={null} />;
}

function ModelErrorFallback() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/40 gap-3">
      <Box className="h-10 w-10" />
      <span className="text-sm">3D preview unavailable</span>
    </div>
  );
}

function CanvasSkeleton() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <Skeleton className="w-32 h-32 rounded-full" />
      <Skeleton className="w-24 h-3 rounded" />
    </div>
  );
}

function SceneContent({ url }: { url: string }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 8, 4]} intensity={1.2} castShadow />
      <directionalLight position={[-4, 4, -4]} intensity={0.4} />
      <Environment preset="studio" />
      <Suspense fallback={null}>
        <Model url={url} />
      </Suspense>
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={1}
        maxDistance={8}
        autoRotate
        autoRotateSpeed={1.2}
      />
    </>
  );
}

interface ProductViewer3DProps {
  modelUrl: string;
}

export default function ProductViewer3D({ modelUrl }: ProductViewer3DProps) {
  if (!modelUrl) return null;

  return (
    <div className="space-y-2">
      <div className="relative w-full h-[400px] rounded-2xl bg-secondary overflow-hidden">
        <Suspense
          fallback={
            <div className="absolute inset-0">
              <CanvasSkeleton />
            </div>
          }
        >
          <Canvas
            camera={{ position: [0, 1, 4], fov: 45 }}
            style={{ width: "100%", height: "100%" }}
            onError={() => {}}
          >
            <SceneContent url={modelUrl} />
          </Canvas>
        </Suspense>
      </div>
      <div className="flex items-center gap-1.5 justify-center text-xs text-muted-foreground">
        <RotateCcw className="h-3 w-3" />
        <span>Drag to rotate · Scroll to zoom</span>
      </div>
    </div>
  );
}
