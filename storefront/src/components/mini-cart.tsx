"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/lib/cart-context";

const money = (amount?: string, code = "EUR") =>
  amount
    ? new Intl.NumberFormat("fr-FR", { style: "currency", currency: code }).format(Number(amount))
    : "—";

const brandTitle = (title: string) => title.replace(/^GRYD\s*/i, "RedLine26 ");

export function MiniCart() {
  const { cart, isOpen, close, remove, checkout, isLoading } = useCart();
  const lines = cart?.lines ?? [];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="mc-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.aside
            className="mc-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 260 }}
            aria-label="Panier"
          >
            <div className="mc-head">
              <span className="display">Panier</span>
              <button onClick={close} aria-label="Fermer">✕</button>
            </div>

            {lines.length === 0 ? (
              <div className="mc-empty">
                <p>Ton panier est vide.</p>
                <Link href="/shop" onClick={close}>Voir le shop</Link>
              </div>
            ) : (
              <>
                <ul className="mc-lines">
                  {lines.map((l) => (
                    <li key={l.id}>
                      <div>
                        <div className="mc-name">{brandTitle(l.merchandise.product.title)}</div>
                        <div className="mc-variant">
                          {l.merchandise.title} · ×{l.quantity}
                        </div>
                      </div>
                      <button className="mc-remove" onClick={() => remove(l.id)} aria-label="Retirer">
                        Retirer
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="mc-foot">
                  <div className="mc-total">
                    <span>Sous-total</span>
                    <span>{money(cart?.cost.subtotalAmount.amount, cart?.cost.subtotalAmount.currencyCode)}</span>
                  </div>
                  <button className="mc-checkout" onClick={checkout} disabled={isLoading}>
                    {isLoading ? "..." : "Payer →"}
                  </button>
                  <Link href="/cart" className="mc-full" onClick={close}>
                    Voir le panier complet
                  </Link>
                  <p className="mc-note">Apple Pay · Google Pay · Carte — paiement sécurisé</p>
                </div>
              </>
            )}
          </motion.aside>

          <style jsx global>{`
            .mc-scrim{position:fixed;inset:0;z-index:60;background:rgba(11,11,13,.45);backdrop-filter:blur(2px)}
            .mc-panel{
              position:fixed;top:0;right:0;bottom:0;z-index:61;width:min(420px,92vw);
              background:#fff;border-left:1px solid var(--line);
              display:flex;flex-direction:column;padding:26px;
              box-shadow:-30px 0 90px rgba(11,11,13,.16);
            }
            .mc-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:28px}
            .mc-head .display{font-size:22px;color:var(--ink)}
            .mc-head button{background:none;border:none;color:var(--ink);font-size:18px;line-height:1}
            .mc-empty{flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:18px}
            .mc-empty p{color:var(--muted);font-size:15px}
            .mc-empty a{background:var(--ink);color:#fff;border-radius:999px;padding:13px 24px;font-size:13px;font-weight:800;letter-spacing:.02em}
            .mc-lines{flex:1;list-style:none;overflow-y:auto;display:flex;flex-direction:column;gap:2px}
            .mc-lines li{display:flex;justify-content:space-between;align-items:flex-start;padding:18px 0;border-bottom:1px solid var(--line)}
            .mc-name{font-size:14px;font-weight:800;letter-spacing:-.01em;color:var(--ink)}
            .mc-variant{font-size:13px;color:var(--muted);margin-top:4px}
            .mc-remove{background:none;border:none;color:var(--muted);font-size:12px;letter-spacing:.02em}
            .mc-remove:hover{color:var(--signal)}
            .mc-foot{padding-top:22px;border-top:1px solid var(--line)}
            .mc-total{display:flex;justify-content:space-between;font-size:15px;font-weight:800;margin-bottom:16px;color:var(--ink)}
            .mc-checkout{width:100%;background:var(--signal);color:#fff;border:none;border-radius:999px;padding:17px;font-size:14px;font-weight:800;letter-spacing:.02em;transition:transform .25s,background .25s}
            .mc-checkout:hover:not(:disabled){transform:translateY(-2px)}
            .mc-checkout:disabled{opacity:.5}
            .mc-full{display:block;text-align:center;font-size:12px;font-weight:700;color:var(--muted);margin-top:14px;text-decoration:underline;text-underline-offset:3px}
            .mc-full:hover{color:var(--signal)}
            .mc-note{text-align:center;font-size:11px;color:var(--muted);opacity:.75;margin-top:12px}
          `}</style>
        </>
      )}
    </AnimatePresence>
  );
}
