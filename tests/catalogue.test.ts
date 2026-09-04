import { describe, expect, it } from "vitest";
import { PRODUCTS, pricesArePublished, isDevelopmentProduct, SCENT_PROFILE_BASIS } from "@/data/fragrance-config";

describe("first five catalogue oils", () => {
  it("uses PDF names, slugs, and top notes with no invented prices", () => {
    const expected = [
      { slug: "musk-rizali", name: "Musk Rizali", top: ["Bergamot", "Saffron", "White Musk"] },
      { slug: "vanilla-musk", name: "Vanilla Musk", top: ["Vanilla Bean", "Almond", "White Musk"] },
      { slug: "saffron-amber-oud", name: "Saffron Amber Oud", top: ["Saffron", "Amber", "Oud"] },
      { slug: "white-oud", name: "White Oud", top: ["White Pepper", "Bergamot", "Soft Woods"] },
      { slug: "oud-rose", name: "Oud Rose", top: ["Rose Petals", "Pink Pepper", "Raspberry"] },
    ];
    expect(PRODUCTS).toHaveLength(5);
    expected.forEach((item, index) => {
      const product = PRODUCTS[index];
      expect(product.slug).toBe(item.slug);
      expect(product.name).toBe(item.name);
      expect(product.notes.top).toEqual(item.top);
      expect(product.status).toBe("coming_soon");
      expect(pricesArePublished(product)).toBe(false);
      expect(isDevelopmentProduct(product)).toBe(false);
      expect(product.variants.every((variant) => variant.price_paise === null)).toBe(true);
      expect(product.variants.every((variant) => variant.inventory === 0)).toBe(true);
      expect(product.images[0].placeholder).toBe(false);
      expect(product.images[0].src).toBe(`/images/products/${item.slug}.webp`);
      expect(product.images[0].alt.toLowerCase()).toContain("campaign still");
      expect(product.images[0].alt).toContain(item.name);
    });
  });

  it("keeps scent profiles as editorial estimates", () => {
    expect(SCENT_PROFILE_BASIS.toLowerCase()).toContain("not a laboratory");
    for (const product of PRODUCTS) {
      for (const value of Object.values(product.scent_profile)) {
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(10);
      }
    }
  });
});
