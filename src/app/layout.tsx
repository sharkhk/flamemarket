import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { CartProvider } from "@/lib/cart";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "FLAMEMARKET — Handcrafted 3D Printed Art",
    template: "%s | FLAMEMARKET",
  },
  description:
    "3D printed figures, miniatures, and custom prints made to order. Shop characters, tabletop minis, and more — shipped from the UAE.",
  keywords: ["3D printing", "figures", "miniatures", "collectibles", "UAE", "custom", "tabletop"],
  openGraph: {
    title: "FLAMEMARKET — Handcrafted 3D Printed Art",
    description: "Unique 3D printed objects crafted with precision.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <CartProvider>
            {children}
            <Toaster position="bottom-right" />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
