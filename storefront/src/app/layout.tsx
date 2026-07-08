import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { Nav } from "@/components/nav";
import { MiniCart } from "@/components/mini-cart";
import { SmoothScroll } from "@/components/smooth-scroll";

export const metadata: Metadata = {
  title: "RedLine26 — Franchis la ligne",
  description:
    "Maillots de foot 100% originaux, imprimés à la demande à Paris. Séries numérotées, zéro copie. Cross the line.",
  openGraph: {
    title: "RedLine26 — Franchis la ligne",
    description: "Maillots de foot originaux, édition 2026. Zéro copie. Cross the line.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <CartProvider>
          <SmoothScroll />
          <div className="grid-overlay" aria-hidden />
          <Nav />
          <MiniCart />
          <main>{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
