"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export function Nav() {
  const { cart, open } = useCart();
  const count = cart?.totalQuantity ?? 0;

  return (
    <nav className="nav">
      <Link href="/" className="logo">
        GRYD
      </Link>
      <div className="nav-links">
        <Link href="/">Boutique</Link>
        <Link href="/#drop">Le Drop</Link>
        <Link href="/#manifeste">Manifeste</Link>
      </div>
      <button className="cart-btn" onClick={open} aria-label="Ouvrir le panier">
        PANIER ({count})
      </button>
    </nav>
  );
}
