import { describe, expect, it } from "vitest";
import { HOUSE, PRODUCTS, isDevelopmentProduct, pricesArePublished } from "@/data/fragrance-config";
import { holdLabel, requestLabel } from "@/lib/commerce/cta";
import { transitionKind } from "@/lib/motion/transitions";

describe("V3.2 conversion honesty", () => {
  it("leaves every catalogue price null", () => {
    for (const product of PRODUCTS) {
      expect(pricesArePublished(product)).toBe(false);
      for (const variant of product.variants) {
        expect(variant.price_paise).toBeNull();
      }
    }
  });

  it("uses request/hold copy while prices are unpublished", () => {
    expect(requestLabel(false)).toBe("Request");
    expect(holdLabel(false)).toBe("Hold this oil");
    expect(requestLabel(true)).toBe("Buy now");
    expect(holdLabel(true)).toBe("Add to cart");
  });

  it("marks product two through five as in development", () => {
    const named = PRODUCTS.filter((product) => !isDevelopmentProduct(product));
    expect(named.map((product) => product.slug)).toEqual(["musk-rizali"]);
    expect(PRODUCTS.filter(isDevelopmentProduct)).toHaveLength(4);
  });

  it("explains concentrated oil and sizes without fake wear counts", () => {
    expect(HOUSE.oilExplain.toLowerCase()).toContain("concentrated perfume oil");
    expect(HOUSE.sizeGuide[6].toLowerCase()).toContain("close-to-skin");
    expect(JSON.stringify(HOUSE.sizeGuide)).not.toMatch(/\d+\s*wears/i);
  });

  it("keeps page transitions mapped and never silent between rooms", () => {
    expect(transitionKind("/", "/product/musk-rizali")).toBe("glass");
    expect(transitionKind("/product/musk-rizali", "/find-your-scent")).toBe("water");
    expect(transitionKind("/auth/login", "/account")).toBe("vault");
    expect(transitionKind("/cart", "/checkout")).toBe("oil");
    expect(transitionKind("/checkout", "/order/abc")).toBe("droplet");
    expect(transitionKind("/collection", "/faq")).toBe("wipe");
    expect(transitionKind("/", "/collection")).toBe("water");
    expect(transitionKind("/our-story", "/shipping")).not.toBe("none");
  });
});
