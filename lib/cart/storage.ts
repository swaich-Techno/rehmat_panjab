import type { CartLineInput } from "@/lib/cart/calculations";

export const CART_STORAGE_KEY = "rp.cart.v1";

export type StoredCart = {
  version: 1;
  lines: CartLineInput[];
  updatedAt: number;
};

export function emptyCart(): StoredCart {
  return { version: 1, lines: [], updatedAt: Date.now() };
}

export function readCart(): StoredCart {
  if (typeof window === "undefined") return emptyCart();
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return emptyCart();
    const parsed = JSON.parse(raw) as StoredCart;
    if (parsed.version !== 1 || !Array.isArray(parsed.lines)) return emptyCart();
    return parsed;
  } catch {
    return emptyCart();
  }
}

export function writeCart(cart: StoredCart): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ ...cart, updatedAt: Date.now() }));
}

export function upsertLine(cart: StoredCart, line: CartLineInput): StoredCart {
  const existing = cart.lines.find(
    (item) => item.productId === line.productId && item.variantId === line.variantId,
  );
  if (!existing) {
    return { ...cart, lines: [...cart.lines, line], updatedAt: Date.now() };
  }
  return {
    ...cart,
    updatedAt: Date.now(),
    lines: cart.lines.map((item) =>
      item.productId === line.productId && item.variantId === line.variantId
        ? { ...item, quantity: Math.min(12, item.quantity + line.quantity) }
        : item,
    ),
  };
}

export function setLineQuantity(cart: StoredCart, line: CartLineInput): StoredCart {
  if (line.quantity < 1) {
    return {
      ...cart,
      updatedAt: Date.now(),
      lines: cart.lines.filter(
        (item) => !(item.productId === line.productId && item.variantId === line.variantId),
      ),
    };
  }
  return {
    ...cart,
    updatedAt: Date.now(),
    lines: cart.lines.map((item) =>
      item.productId === line.productId && item.variantId === line.variantId
        ? { ...item, quantity: Math.min(12, line.quantity) }
        : item,
    ),
  };
}
