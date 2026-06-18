import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Unsplash (used for demo product images)
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // Supabase storage (production product images)
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      // Placeholder images (dev fallback)
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
  },
};

export default nextConfig;
