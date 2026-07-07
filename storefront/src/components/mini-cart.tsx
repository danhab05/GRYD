"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/lib/cart-context";

const money = (amount?: string, code = "EUR") =>
  amount
    ? new Intl.NumberFormat("fr-FR", { style: "currency", currency: code }).format(Number(amount))
    : "—";

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
                <p>Ta grille est vide.</p>
                <button onClick={close}>Voir le drop</button>
              </div>
            ) : (
              <>
                <ul className="mc-lines">
                  {lines.map((l) => (
                    <li key={l.id}>
                      <div>
                        <div className="mc-name">{l.merchandise.product.title}</div>
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
            .mc-scrim{position:fixed;inset:0;z-index:60;background:rgba(0,0,0,.6);backdrop-filter:blur(2px)}
            .mc-panel{
              position:fixed;top:0;right:0;bottom:0;z-index:61;width:min(420px,90vw);
              background:var(--concrete-800);border-left:1px solid var(--line);
              display:flex;flex-direction:column;padding:26px;
            }
            .mc-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:30px}
            .mc-head .display{font-size:22px}
            .mc-head button{background:none;border:none;color:var(--chalk);font-size:18px}
            .mc-empty{flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:18px;opacity:.7}
            .mc-empty button{background:var(--chalk);color:var(--concrete-900);border:none;padding:12px 22px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;font-weight:700}
            .mc-lines{flex:1;list-style:none;overflow-y:auto;display:flex;flex-direction:column;gap:2px}
            .mc-lines li{display:flex;justify-content:space-between;align-items:flex-start;padding:18px 0;border-bottom:1px solid var(--line)}
            .mc-name{font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:.06em}
            .mc-variant{font-size:12px;opacity:.5;margin-top:4px}
            .mc-remove{background:none;border:none;color:var(--chalk);opacity:.5;font-size:11px;text-transform:uppercase;letter-spacing:.1em}
            .mc-remove:hover{opacity:1;color:var(--signal)}
            .mc-foot{padding-top:22px;border-top:1px solid var(--line)}
            .mc-total{display:flex;justify-content:space-between;font-size:14px;text-transform:uppercase;letter-spacing:.08em;margin-bottom:18px}
            .mc-checkout{width:100%;background:var(--signal);color:var(--concrete-900);border:none;padding:18px;font-size:14px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;transition:transform .3s}
            .mc-checkout:hover:not(:disabled){transform:translateY(-2px)}
            .mc-checkout:disabled{opacity:.5}
            .mc-full{display:block;text-align:center;font-size:11px;letter-spacing:.14em;text-transform:uppercase;opacity:.6;margin-top:14px;text-decoration:underline;text-underline-offset:3px}
            .mc-full:hover{opacity:1;color:var(--signal)}
            .mc-note{text-align:center;font-size:11px;opacity:.4;margin-top:12px;letter-spacing:.06em}
          `}</style>
        </>
      )}
    </AnimatePresence>
  );
}
