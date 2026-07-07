"use client";

/**
 * Page panier complète (/cart).
 * -----------------------------
 * Version "pleine page" du mini-cart drawer : gestion des quantités,
 * retrait, sous-total, puis redirection vers le checkout Shopify hébergé.
 * Le panier vit dans le CartContext (client) — cette page ne fait que le rendre.
 */

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";

const money = (amount?: string, code = "EUR") =>
  amount
    ? new Intl.NumberFormat("fr-FR", { style: "currency", currency: code }).format(Number(amount))
    : "—";

export default function CartPage() {
  const { cart, updateQuantity, remove, checkout, isLoading } = useCart();
  const lines = cart?.lines ?? [];
  const currency = cart?.cost.subtotalAmount.currencyCode ?? "EUR";

  return (
    <div className="cart">
      <Link href="/#drop" className="cart-back">← Continuer sur la grille</Link>

      <header className="cart-head">
        <h1 className="display">Panier</h1>
        <span className="cart-count">
          {lines.length === 0
            ? "0 pièce"
            : `${cart?.totalQuantity} pièce${(cart?.totalQuantity ?? 0) > 1 ? "s" : ""}`}
        </span>
      </header>

      {lines.length === 0 ? (
        <div className="cart-empty">
          <p>Ta grille est vide.</p>
          <Link href="/#drop" className="cart-cta">Voir le Drop 01 →</Link>
        </div>
      ) : (
        <div className="cart-grid">
          <ul className="cart-lines">
            {lines.map((l) => {
              const size =
                l.merchandise.title ??
                l.merchandise.product.title;
              return (
                <li key={l.id} className="line">
                  <div className="line-visual">
                    {l.merchandise.image ? (
                      <Image
                        src={l.merchandise.image.url}
                        alt={l.merchandise.image.altText ?? l.merchandise.product.title}
                        fill
                        sizes="120px"
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <div className="jersey-sm" aria-hidden />
                    )}
                  </div>

                  <div className="line-body">
                    <div className="line-top">
                      <Link href={`/products/${l.merchandise.product.handle}`} className="line-name">
                        {l.merchandise.product.title}
                      </Link>
                      <span className="line-total">
                        {money(l.cost.totalAmount.amount, l.cost.totalAmount.currencyCode)}
                      </span>
                    </div>
                    <div className="line-variant">Taille {size}</div>

                    <div className="line-controls">
                      <div className="qty" aria-label="Quantité">
                        <button
                          onClick={() => updateQuantity(l.id, l.quantity - 1)}
                          disabled={isLoading}
                          aria-label="Diminuer"
                        >
                          −
                        </button>
                        <span>{l.quantity}</span>
                        <button
                          onClick={() => updateQuantity(l.id, l.quantity + 1)}
                          disabled={isLoading}
                          aria-label="Augmenter"
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="line-remove"
                        onClick={() => remove(l.id)}
                        disabled={isLoading}
                      >
                        Retirer
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <aside className="cart-summary">
            <div className="sum-row">
              <span>Sous-total</span>
              <span>{money(cart?.cost.subtotalAmount.amount, currency)}</span>
            </div>
            <div className="sum-row muted">
              <span>Livraison</span>
              <span>Calculée au checkout</span>
            </div>
            <div className="sum-total">
              <span>Total</span>
              <span>{money(cart?.cost.totalAmount.amount, currency)}</span>
            </div>
            <button className="sum-checkout" onClick={checkout} disabled={isLoading}>
              {isLoading ? "..." : "Passer au paiement →"}
            </button>
            <p className="sum-note">
              Checkout sécurisé Shopify · Apple Pay · Google Pay · Carte
            </p>
            <p className="sum-note faint">
              Impression à la demande · expédié sous 5–8 jours · retours 14 j
            </p>
          </aside>
        </div>
      )}

      <style jsx>{`
        .cart {
          position: relative;
          z-index: 2;
          max-width: 1100px;
          margin: 0 auto;
          padding: 120px 40px 100px;
        }
        .cart-back {
          display: inline-block;
          font-size: 12px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          opacity: 0.6;
          margin-bottom: 40px;
        }
        .cart-back:hover {
          opacity: 1;
          color: var(--signal);
        }
        .cart-head {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          border-bottom: 1px solid var(--line);
          padding-bottom: 26px;
          margin-bottom: 40px;
        }
        .cart-head h1 {
          font-size: clamp(40px, 8vw, 88px);
          line-height: 0.9;
        }
        .cart-count {
          font-size: 12px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          opacity: 0.5;
        }

        .cart-empty {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 24px;
          padding: 60px 0;
          opacity: 0.85;
        }
        .cart-empty p {
          font-size: 18px;
          opacity: 0.6;
        }
        .cart-cta {
          background: var(--signal);
          color: var(--concrete-900);
          padding: 16px 30px;
          font-size: 13px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          font-weight: 800;
        }

        .cart-grid {
          display: grid;
          grid-template-columns: 1.6fr 0.9fr;
          gap: 60px;
          align-items: start;
        }
        .cart-lines {
          list-style: none;
          display: flex;
          flex-direction: column;
        }
        .line {
          display: grid;
          grid-template-columns: 96px 1fr;
          gap: 22px;
          padding: 26px 0;
          border-bottom: 1px solid var(--line);
        }
        .line:first-child {
          padding-top: 0;
        }
        .line-visual {
          position: relative;
          width: 96px;
          height: 120px;
          background: radial-gradient(circle at 50% 40%, var(--concrete-700), var(--concrete-900));
          border: 1px solid var(--line);
          overflow: hidden;
        }
        .jersey-sm {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 62%;
          aspect-ratio: 1 / 1.15;
        }
        .jersey-sm::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--concrete-700), var(--concrete-800));
          clip-path: polygon(0 18%, 22% 18%, 32% 6%, 68% 6%, 78% 18%, 100% 18%, 100% 32%, 82% 40%, 82% 100%, 18% 100%, 18% 40%, 0 32%);
          border: 1px solid rgba(228, 255, 58, 0.25);
        }
        .line-body {
          display: flex;
          flex-direction: column;
        }
        .line-top {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 16px;
        }
        .line-name {
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .line-name:hover {
          color: var(--signal);
        }
        .line-total {
          font-size: 15px;
          color: var(--signal);
          white-space: nowrap;
        }
        .line-variant {
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          opacity: 0.5;
          margin-top: 6px;
        }
        .line-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          padding-top: 20px;
        }
        .qty {
          display: inline-flex;
          align-items: center;
          border: 1px solid var(--line);
        }
        .qty button {
          width: 38px;
          height: 38px;
          background: none;
          border: none;
          color: var(--chalk);
          font-size: 18px;
          line-height: 1;
          transition: color 0.2s, background 0.2s;
        }
        .qty button:hover:not(:disabled) {
          background: var(--chalk);
          color: var(--concrete-900);
        }
        .qty button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .qty span {
          min-width: 42px;
          text-align: center;
          font-size: 14px;
          font-variant-numeric: tabular-nums;
        }
        .line-remove {
          background: none;
          border: none;
          color: var(--chalk);
          opacity: 0.5;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .line-remove:hover:not(:disabled) {
          opacity: 1;
          color: var(--signal);
        }

        .cart-summary {
          position: sticky;
          top: 110px;
          border: 1px solid var(--line);
          background: var(--concrete-800);
          padding: 30px;
        }
        .sum-row {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 10px 0;
        }
        .sum-row.muted {
          opacity: 0.5;
        }
        .sum-total {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          border-top: 1px solid var(--line);
          margin-top: 12px;
          padding-top: 20px;
          font-size: 16px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .sum-checkout {
          width: 100%;
          margin-top: 24px;
          background: var(--signal);
          color: var(--concrete-900);
          border: none;
          padding: 18px;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          transition: transform 0.3s;
        }
        .sum-checkout:hover:not(:disabled) {
          transform: translateY(-2px);
        }
        .sum-checkout:disabled {
          opacity: 0.5;
        }
        .sum-note {
          text-align: center;
          font-size: 11px;
          opacity: 0.45;
          margin-top: 14px;
          letter-spacing: 0.05em;
          line-height: 1.6;
        }
        .sum-note.faint {
          opacity: 0.3;
          margin-top: 8px;
        }

        @media (max-width: 820px) {
          .cart {
            padding: 100px 22px 70px;
          }
          .cart-grid {
            grid-template-columns: 1fr;
            gap: 34px;
          }
          .cart-summary {
            position: static;
          }
        }
      `}</style>
    </div>
  );
}
