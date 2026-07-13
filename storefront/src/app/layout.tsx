import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { Nav } from "@/components/nav";
import { MiniCart } from "@/components/mini-cart";
import { SmoothScroll } from "@/components/smooth-scroll";

export const metadata: Metadata = {
  title: "RedLine26 — Franchis la ligne",
  description:
    "Le Mondial en streetwear. T-shirts custom pour l'été 26 — pas des maillots, des pièces. Imprimé à la demande à Paris, séries numérotées.",
  openGraph: {
    title: "RedLine26 — Franchis la ligne",
    description: "L'été 26 en streetwear. Des pièces custom, pas des maillots. Cross the line.",
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
