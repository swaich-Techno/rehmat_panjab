import { describe, expect, it } from "vitest";
import { CAMPAIGN_STILL_SIZE, PRODUCTS } from "@/data/fragrance-config";
import {
  MOTION_CAPS,
  MOTION_DURATION_MS,
  PRESS_SCALE,
  capCeremony,
  capRoutine,
} from "@/lib/motion/tokens";
import { LIQUID_PERSONALITIES } from "@/lib/motion/personalities";

describe("campaign still geometry", () => {
  it("locks the supplied poster intrinsic size for CLS-safe frames", () => {
    expect(CAMPAIGN_STILL_SIZE.width).toBe(1122);
    expect(CAMPAIGN_STILL_SIZE.height).toBe(1402);
    expect(PRODUCTS).toHaveLength(5);
    for (const product of PRODUCTS) {
      expect(product.images[0].src).toMatch(/^\/images\/products\/.+\.webp$/);
      expect(product.images[0].placeholder).toBe(false);
    }
  });
});

describe("motion audit caps", () => {
  it("keeps press at 0.96 and routine work at or under 300ms", () => {
    expect(PRESS_SCALE).toBe(0.96);
    expect(MOTION_CAPS.routineMs).toBe(300);
    expect(MOTION_DURATION_MS.fast).toBeLessThanOrEqual(MOTION_CAPS.routineMs);
    expect(MOTION_DURATION_MS.routine).toBeLessThanOrEqual(MOTION_CAPS.routineMs);
    expect(MOTION_DURATION_MS.sheet).toBeLessThanOrEqual(MOTION_CAPS.routineMs);
    expect(MOTION_DURATION_MS.navExpand).toBeLessThanOrEqual(MOTION_CAPS.routineMs);
    expect(MOTION_DURATION_MS.addAnother).toBeLessThanOrEqual(MOTION_CAPS.routineMs);
    expect(LIQUID_PERSONALITIES.oil.fillMs).toBeLessThanOrEqual(MOTION_CAPS.routineMs);
    expect(LIQUID_PERSONALITIES.water.fillMs).toBeLessThanOrEqual(MOTION_CAPS.routineMs);
    expect(capRoutine(480)).toBe(300);
  });

  it("caps ceremonies at 800ms", () => {
    expect(MOTION_CAPS.ceremonyMs).toBe(800);
    const ceremony = [
      MOTION_DURATION_MS.editorial,
      MOTION_DURATION_MS.cinematic,
      MOTION_DURATION_MS.pack,
      MOTION_DURATION_MS.vault,
      MOTION_DURATION_MS.ripple,
      MOTION_DURATION_MS.cartFly,
      MOTION_DURATION_MS.buyNow,
      MOTION_DURATION_MS.atc,
      MOTION_DURATION_MS.droplet,
    ];
    for (const ms of ceremony) {
      expect(ms).toBeLessThanOrEqual(MOTION_CAPS.ceremonyMs);
    }
    expect(capCeremony(1200)).toBe(800);
  });
});
