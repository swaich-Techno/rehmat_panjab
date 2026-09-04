"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { calculateCart, type CartLineInput, type CartTotals } from "@/lib/cart/calculations";
import { CART_STORAGE_KEY, emptyCart, setLineQuantity, upsertLine, type StoredCart } from "@/lib/cart/storage";
import { CartDrawer } from "@/components/commerce/CartDrawer";
import { track } from "@/lib/analytics/index";
import { useLocalJson, writeLocalJson } from "@/lib/storage/local-json";

const EMPTY = emptyCart();

type FlyState = {
  src: string;
  from: DOMRect;
} | null;

type CartContextValue = {
  cart: StoredCart;
  totals: CartTotals;
  itemCount: number;
  open: boolean;
  openCart: () => void;
  closeCart: () => void;
  addLine: (line: CartLineInput, meta?: { src?: string; from?: DOMRect }) => void;
  updateLine: (line: CartLineInput) => void;
  removeLine: (productId: string, variantId: string) => void;
  fly: FlyState;
  liveMessage: string;
};

const CartContext = createContext<CartContextValue | null>(null);

function persist(cart: StoredCart) {
  writeLocalJson(CART_STORAGE_KEY, { ...cart, updatedAt: Date.now() });
}

export function CartProvider({ children }: { children: ReactNode }) {
  const cart = useLocalJson<StoredCart>(CART_STORAGE_KEY, EMPTY);
  const [open, setOpen] = useState(false);
  const [fly, setFly] = useState<FlyState>(null);
  const [liveMessage, setLiveMessage] = useState("");

  const totals = useMemo(() => calculateCart(cart.lines ?? []), [cart.lines]);
  const itemCount = totals.item_count;

  const addLine = useCallback((line: CartLineInput, meta?: { src?: string; from?: DOMRect }) => {
    persist(upsertLine(cart, line));
    setLiveMessage("Added to cart");
    track({ name: "add_to_cart", meta: { productId: line.productId } });
    if (meta?.from && meta.src && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setFly({ src: meta.src, from: meta.from });
      window.setTimeout(() => setFly(null), 800);
    }
    window.setTimeout(() => setOpen(true), 420);
  }, [cart]);

  const updateLine = useCallback((line: CartLineInput) => {
    persist(setLineQuantity(cart, line));
    setLiveMessage("Cart updated");
  }, [cart]);

  const removeLine = useCallback((productId: string, variantId: string) => {
    persist(setLineQuantity(cart, { productId, variantId, quantity: 0 }));
    setLiveMessage("Removed from cart");
  }, [cart]);

  const value = useMemo(
    () => ({
      cart,
      totals,
      itemCount,
      open,
      openCart: () => setOpen(true),
      closeCart: () => setOpen(false),
      addLine,
      updateLine,
      removeLine,
      fly,
      liveMessage,
    }),
    [addLine, cart, fly, itemCount, liveMessage, open, removeLine, totals, updateLine],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartDrawer />
      <p className="sr-only" aria-live="polite">
        {liveMessage}
      </p>
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
