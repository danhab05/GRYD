import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { Nav } from "@/components/nav";
import { MiniCart } from "@/components/mini-cart";
import { SmoothScroll } from "@/components/smooth-scroll";

export const metadata: Metadata = {
  title: "redline26 — Porte la ville",
  description:
    "Maillots de foot originaux, imprimés à la demande à Paris. Séries limitées numérotées. Chaque maillot est une case de la grille.",
  openGraph: {
    title: "redline26 — Porte la ville",
    description: "Maillots originaux, édition Paris. Séries numérotées.",
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
