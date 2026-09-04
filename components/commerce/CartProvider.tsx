"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { calculateCart, type CartLineInput, type CartTotals } from "@/lib/cart/calculations";
import { CART_STORAGE_KEY, emptyCart, setLineQuantity, upsertLine, type StoredCart } from "@/lib/cart/storage";
import { CartDrawer } from "@/components/commerce/CartDrawer";
import { track } from "@/lib/analytics/index";
import { useLocalJson, writeLocalJson } from "@/lib/storage/local-json";
import { durationMs } from "@/lib/motion/tokens";

const EMPTY = emptyCart();

type FlyState = {
  src: string;
  from: DOMRect;
  to: DOMRect;
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
  dissolving: string | null;
  fly: FlyState;
  liveMessage: string;
};

const CartContext = createContext<CartContextValue | null>(null);

function persist(cart: StoredCart) {
  writeLocalJson(CART_STORAGE_KEY, { ...cart, updatedAt: Date.now() });
}

function cartTargetRect(): DOMRect | null {
  if (typeof window === "undefined") return null;
  const mobile = window.matchMedia("(max-width: 767px)").matches;
  const selector = mobile ? '[data-cart-target="mobile"]' : '[data-cart-target="desktop"]';
  const node = document.querySelector(selector) ?? document.querySelector("[data-cart-target]");
  return node?.getBoundingClientRect() ?? null;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const cart = useLocalJson<StoredCart>(CART_STORAGE_KEY, EMPTY);
  const [open, setOpen] = useState(false);
  const [fly, setFly] = useState<FlyState>(null);
  const [liveMessage, setLiveMessage] = useState("");
  const [dissolving, setDissolving] = useState<string | null>(null);

  const totals = useMemo(() => calculateCart(cart.lines ?? []), [cart.lines]);
  const itemCount = totals.item_count;

  const addLine = useCallback(
    (line: CartLineInput, meta?: { src?: string; from?: DOMRect }) => {
      persist(upsertLine(cart, line));
      setLiveMessage("Added to cart");
      track({ name: "add_to_cart", meta: { productId: line.productId } });
      const reduce =
        typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const to = cartTargetRect();
      if (meta?.from && meta.src && to && !reduce) {
        setFly({ src: meta.src, from: meta.from, to });
        window.setTimeout(() => setFly(null), durationMs("cartFly"));
      }
    },
    [cart],
  );

  const updateLine = useCallback(
    (line: CartLineInput) => {
      persist(setLineQuantity(cart, line));
      setLiveMessage("Cart updated");
    },
    [cart],
  );

  const removeLine = useCallback(
    (productId: string, variantId: string) => {
      const key = `${productId}-${variantId}`;
      setDissolving(key);
      const reduce =
        typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.setTimeout(
        () => {
          persist(setLineQuantity(cart, { productId, variantId, quantity: 0 }));
          setDissolving(null);
          setLiveMessage("Removed from cart");
        },
        reduce ? 80 : durationMs("editorial"),
      );
    },
    [cart],
  );

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
      dissolving,
      fly,
      liveMessage,
    }),
    [addLine, cart, dissolving, fly, itemCount, liveMessage, open, removeLine, totals, updateLine],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartDrawer />
      {fly ? (
        <>
          <span
            className="cart-fly-trail"
            style={{
              left: fly.from.left + fly.from.width / 2,
              top: fly.from.top,
              ["--dx" as string]: `${fly.to.left - fly.from.left}px`,
              ["--dy" as string]: `${fly.to.top - fly.from.top}px`,
            }}
          />
          {/* Flying overlay must be free-positioned; next/image layout fights the CSS fly. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={fly.src}
            alt=""
            className="cart-fly"
            style={{
              left: fly.from.left,
              top: fly.from.top,
              ["--dx" as string]: `${fly.to.left - fly.from.left}px`,
              ["--dy" as string]: `${fly.to.top - fly.from.top}px`,
            }}
          />
        </>
      ) : null}
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
