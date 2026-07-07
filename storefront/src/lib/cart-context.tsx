"use client";

/**
 * Contexte panier global.
 * -----------------------
 * Le panier vit côté client (React state). Quand l'utilisateur valide,
 * on le renvoie sur `cart.checkoutUrl` : c'est le checkout Shopify hébergé,
 * sécurisé PCI-DSS, avec Apple Pay / Google Pay / Stripe en un tap.
 *
 * On persiste juste l'ID du panier en mémoire de session pour éviter d'en
 * recréer un à chaque navigation (pas de localStorage dans ce contexte —
 * on garde l'id en React state + cookie côté serveur si besoin plus tard).
 */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  addToCart as apiAddToCart,
  createCart,
  removeFromCart as apiRemoveFromCart,
  updateCartLine as apiUpdateCartLine,
  type Cart,
} from "@/lib/shopify";

type CartContextValue = {
  cart: Cart | null;
  isOpen: boolean;
  isLoading: boolean;
  open: () => void;
  close: () => void;
  add: (variantId: string, quantity?: number) => Promise<void>;
  remove: (lineId: string) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  checkout: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const ensureCart = useCallback(async (): Promise<Cart> => {
    if (cart) return cart;
    const fresh = await createCart();
    setCart(fresh);
    return fresh;
  }, [cart]);

  const add = useCallback(
    async (variantId: string, quantity = 1) => {
      setIsLoading(true);
      try {
        const current = await ensureCart();
        const updated = await apiAddToCart(current.id, variantId, quantity);
        setCart(updated);
        setIsOpen(true);
      } finally {
        setIsLoading(false);
      }
    },
    [ensureCart]
  );

  const remove = useCallback(
    async (lineId: string) => {
      if (!cart) return;
      setIsLoading(true);
      try {
        const updated = await apiRemoveFromCart(cart.id, lineId);
        setCart(updated);
      } finally {
        setIsLoading(false);
      }
    },
    [cart]
  );

  const updateQuantity = useCallback(
    async (lineId: string, quantity: number) => {
      if (!cart) return;
      // Garde-fou : en dessous de 1 on retire la ligne franchement.
      if (quantity < 1) return remove(lineId);
      setIsLoading(true);
      try {
        const updated = await apiUpdateCartLine(cart.id, lineId, quantity);
        setCart(updated);
      } finally {
        setIsLoading(false);
      }
    },
    [cart, remove]
  );

  const checkout = useCallback(() => {
    if (cart?.checkoutUrl) window.location.href = cart.checkoutUrl;
  }, [cart]);

  const value = useMemo(
    () => ({
      cart,
      isOpen,
      isLoading,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      add,
      remove,
      updateQuantity,
      checkout,
    }),
    [cart, isOpen, isLoading, add, remove, updateQuantity, checkout]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart doit être utilisé dans un <CartProvider>");
  return ctx;
}
