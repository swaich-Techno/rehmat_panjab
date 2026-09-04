import { describe, expect, it } from "vitest";
import { applyDiscount, discountPaise, formatInrFromPaise, multiplyPaise, sumPaise } from "@/lib/commerce/money";

describe("money paise", () => {
  it("multiplies unit price without floats", () => {
    expect(multiplyPaise(249900, 2)).toBe(499800);
  });

  it("sums integers only", () => {
    expect(sumPaise([100, 250, 3])).toBe(353);
  });

  it("applies whole-percent discounts with floor", () => {
    expect(discountPaise(1000, 5)).toBe(50);
    expect(applyDiscount(999, 5)).toEqual({ discount: 49, total: 950 });
  });

  it("formats null as launching soon", () => {
    expect(formatInrFromPaise(null)).toBe("LAUNCHING SOON");
  });

  it("rejects non-integer paise", () => {
    expect(() => multiplyPaise(10.5, 1)).toThrow();
  });
});
