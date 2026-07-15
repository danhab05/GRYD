"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { Logo } from "@/components/logo";

export function Nav() {
  const { cart, open } = useCart();
  const count = cart?.totalQuantity ?? 0;

  return (
    <nav className="nav">
      <Link href="/" className="logo" aria-label="RedLine26 — accueil">
        <Logo />
      </Link>
      <div className="nav-links">
        <Link href="/shop">Shop</Link>
        <Link href="/#drop">Le drop</Link>
        <Link href="/notre-histoire">Notre histoire</Link>
      </div>
      <button className="cart-btn" onClick={open} aria-label={`Ouvrir le panier (${count})`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
          <path d="M3 6h18" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
        {count > 0 && <span className="cart-badge">{count}</span>}
      </button>
    </nav>
  );
}
