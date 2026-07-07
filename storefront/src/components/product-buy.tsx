"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/lib/shopify";

const money = (a: string, c = "EUR") =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: c }).format(Number(a));

export function ProductBuy({ product }: { product: Product }) {
  const { add, isLoading, open } = useCart();
  const [variantId, setVariantId] = useState<string | null>(
    product.variants.find((v) => v.availableForSale)?.id ?? null
  );
  const [added, setAdded] = useState(false);

  const price = product.priceRange.minVariantPrice;

  async function handleAdd() {
    if (!variantId) return;
    // En démo (id factices), on ouvre juste le panier ; en réel, l'id est un vrai variant GID.
    const isRealVariant = variantId.startsWith("gid://");
    if (isRealVariant) {
      await add(variantId);
    } else {
      open();
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  return (
    <div className="buy">
      <div className="buy-price">{money(price.amount, price.currencyCode)}</div>

      <div className="buy-label">Taille</div>
      <div className="buy-sizes">
        {product.variants.map((v) => (
          <button
            key={v.id}
            className={`size ${variantId === v.id ? "active" : ""}`}
            disabled={!v.availableForSale}
            onClick={() => setVariantId(v.id)}
          >
            {v.selectedOptions.find((o) => o.name === "Taille")?.value ?? v.title}
          </button>
        ))}
      </div>

      <motion.button
        className="buy-add"
        onClick={handleAdd}
        disabled={!variantId || isLoading}
        whileTap={{ scale: 0.97 }}
      >
        {added ? "Ajouté ✓" : isLoading ? "..." : "Ajouter à la grille"}
      </motion.button>

      <style jsx>{`
        .buy-price{font-size:26px;color:var(--signal);margin-bottom:30px;font-weight:700}
        .buy-label{font-size:12px;letter-spacing:.18em;text-transform:uppercase;opacity:.5;margin-bottom:14px}
        .buy-sizes{display:flex;gap:10px;margin-bottom:34px;flex-wrap:wrap}
        .size{width:56px;height:56px;background:transparent;border:1px solid var(--line);color:var(--chalk);font-size:14px;letter-spacing:.05em;text-transform:uppercase;transition:all .25s}
        .size:hover:not(:disabled){border-color:var(--chalk)}
        .size.active{background:var(--chalk);color:var(--concrete-900);border-color:var(--chalk);font-weight:700}
        .size:disabled{opacity:.25;text-decoration:line-through;cursor:not-allowed}
        .buy-add{width:100%;background:var(--signal);color:var(--concrete-900);border:none;padding:20px;font-size:14px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;transition:transform .3s}
        .buy-add:hover:not(:disabled){transform:translateY(-2px)}
        .buy-add:disabled{opacity:.5;cursor:not-allowed}
      `}</style>
    </div>
  );
}
