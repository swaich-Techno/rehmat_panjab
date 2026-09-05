import { describe, expect, it } from "vitest";
import { BOTTLE_LERP_MAX_PX, PRESS_SCALE, PRESS_SETTLE_MS, clampBottleLerp, pointerPercent } from "@/lib/motion/press";
import { MOTION_DURATION_MS } from "@/lib/motion/tokens";

describe("V3.3 click value and wordmark lock", () => {
  it("caps bottle pointer lerp at 8px and never exceeds the lock", () => {
    expect(BOTTLE_LERP_MAX_PX).toBe(8);
    const mild = clampBottleLerp(0.2, -0.2);
    expect(Math.abs(mild.x)).toBeLessThanOrEqual(8);
    expect(Math.abs(mild.y)).toBeLessThanOrEqual(8);
    const extreme = clampBottleLerp(4, -4);
    expect(extreme.x).toBe(8);
    expect(extreme.y).toBe(-8);
    expect(clampBottleLerp(0, 0)).toEqual({ x: 0, y: 0 });
  });

  it("keeps press scale and settle inside the published click-value band", () => {
    expect(PRESS_SCALE).toBe(0.96);
    expect(PRESS_SETTLE_MS).toBe(MOTION_DURATION_MS.pressSettle);
    expect(MOTION_DURATION_MS.pressSettle).toBeGreaterThanOrEqual(280);
    expect(MOTION_DURATION_MS.pressSettle).toBeLessThanOrEqual(400);
    expect(MOTION_DURATION_MS.standard).toBeGreaterThanOrEqual(400);
    expect(MOTION_DURATION_MS.standard).toBeLessThanOrEqual(600);
  });

  it("computes click origin as percent of the target box", () => {
    const rect = { left: 100, top: 50, width: 200, height: 100 } as DOMRect;
    expect(pointerPercent(100, 50, rect)).toEqual({ x: 0, y: 0 });
    expect(pointerPercent(200, 100, rect)).toEqual({ x: 50, y: 50 });
    expect(pointerPercent(300, 150, rect)).toEqual({ x: 100, y: 100 });
  });
});
