import { describe, expect, it } from "vitest";
import { applyInventoryDelta, canFulfill } from "@/lib/commerce/inventory";

describe("inventory", () => {
  it("cannot go negative", () => {
    expect(applyInventoryDelta(2, -3)).toEqual({ ok: false, next: 2, reason: "negative" });
    expect(applyInventoryDelta(2, -2)).toEqual({ ok: true, next: 0 });
  });

  it("rejects non-integer stock math", () => {
    expect(applyInventoryDelta(1.5, -1).ok).toBe(false);
  });

  it("will not fulfill more than on hand", () => {
    expect(canFulfill(0, 1)).toBe(false);
    expect(canFulfill(3, 2)).toBe(true);
  });
});
