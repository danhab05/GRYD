"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { Logo } from "@/components/logo";

export function Nav() {
  const { cart, open } = useCart();
  const count = cart?.totalQuantity ?? 0;

  return (
    <nav className="nav">
      <Link href="/" className="logo" aria-label="Redline — accueil">
        <Logo />
      </Link>
      <div className="nav-links">
        <Link href="/shop">Shop</Link>
        <Link href="/#drop">Le Drop</Link>
        <Link href="/notre-histoire">Notre histoire</Link>
      </div>
      <button className="cart-btn" onClick={open} aria-label="Ouvrir le panier">
        PANIER ({count})
      </button>
    </nav>
  );
}
