"use client";

import { useState } from "react";
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
    <div className="pb">
      <div className="pb-price">{money(price.amount, price.currencyCode)}</div>

      <div className="pb-label">Taille</div>
      <div className="pb-sizes">
        {product.variants.map((v) => (
          <button
            key={v.id}
            className={`pb-size ${variantId === v.id ? "is-active" : ""}`}
            disabled={!v.availableForSale}
            onClick={() => setVariantId(v.id)}
          >
            {v.selectedOptions.find((o) => o.name === "Taille")?.value ?? v.title}
          </button>
        ))}
      </div>

      <button className="pb-add" onClick={handleAdd} disabled={!variantId || isLoading}>
        {added ? "Ajouté ✓" : isLoading ? "..." : "Ajouter au panier"}
      </button>

      <style>{`
        .pb-price{font-size:26px;color:var(--ink);margin-bottom:28px;font-weight:900;letter-spacing:-.01em}
        .pb-label{font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:var(--muted);font-weight:700;margin-bottom:14px}
        .pb-sizes{display:flex;gap:10px;margin-bottom:30px;flex-wrap:wrap}
        .pb-size{min-width:56px;height:52px;padding:0 14px;background:#fff;border:1px solid var(--line);border-radius:10px;color:var(--ink);font-size:14px;font-weight:700;text-transform:uppercase;transition:border-color .2s,background .2s,color .2s}
        .pb-size:hover:not(:disabled){border-color:var(--ink)}
        .pb-size.is-active{background:var(--ink);color:#fff;border-color:var(--ink)}
        .pb-size:disabled{opacity:.35;text-decoration:line-through;cursor:not-allowed}
        .pb-add{width:100%;background:var(--ink);color:#fff;border:none;border-radius:999px;padding:18px;font-size:14px;font-weight:800;letter-spacing:.02em;transition:transform .25s,background .25s}
        .pb-add:hover:not(:disabled){background:var(--signal);transform:translateY(-2px)}
        .pb-add:active:not(:disabled){transform:translateY(0) scale(.99)}
        .pb-add:disabled{opacity:.5;cursor:not-allowed}
      `}</style>
    </div>
  );
}
