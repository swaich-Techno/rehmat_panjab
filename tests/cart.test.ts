import { describe, expect, it } from "vitest";
import { calculateCart, validateLine } from "@/lib/cart/calculations";
import { PRODUCTS } from "@/data/fragrance-config";

describe("cart calculations", () => {
  it("treats null prices as launching soon and excludes them from totals", () => {
    const product = PRODUCTS[0];
    const totals = calculateCart([
      { productId: product.id, variantId: product.variants[0].id, quantity: 2 },
    ]);
    expect(totals.lines[0].reason).toBe("launching_soon");
    expect(totals.priced_subtotal_paise).toBe(0);
    expect(totals.all_unpriced).toBe(true);
    expect(totals.item_count).toBe(2);
  });

  it("never trusts a client discount other than 5", () => {
    const totals = calculateCart([], 50);
    expect(totals.discount_percent).toBe(0);
  });

  it("rejects unknown products", () => {
    const line = validateLine({ productId: "nope", variantId: "x", quantity: 1 });
    expect(line.available).toBe(false);
    expect(line.reason).toBe("unknown");
  });

  it("rejects invalid quantities", () => {
    const product = PRODUCTS[0];
    const line = validateLine({ productId: product.id, variantId: product.variants[0].id, quantity: 0 });
    expect(line.reason).toBe("invalid_qty");
  });
});
