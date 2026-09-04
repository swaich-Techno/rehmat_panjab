import { describe, expect, it } from "vitest";
import { cursorEnabled, cursorShapeFromElement, cursorShapeFromDataset, nativeCursorHidden } from "@/lib/motion/cursor-mode";
import { scaleDuration, motionAllowsCursor, motionAllowsCinematic } from "@/lib/motion/mode";
import { MOTION_DURATION_MS } from "@/lib/motion/tokens";
import { LIQUID_PERSONALITIES } from "@/lib/motion/personalities";
import { transitionKind } from "@/lib/motion/transitions";

describe("cursor enablement", () => {
  it("disables on coarse pointer", () => {
    expect(
      cursorEnabled({
        motionMode: "FULL",
        pointerCoarse: true,
        hoverHover: true,
        lastInput: "mouse",
        prefersReduced: false,
      }),
    ).toBe(false);
  });

  it("disables on keyboard-only and touch", () => {
    const base = {
      motionMode: "FULL" as const,
      pointerCoarse: false,
      hoverHover: true,
      prefersReduced: false,
    };
    expect(cursorEnabled({ ...base, lastInput: "keyboard" })).toBe(false);
    expect(cursorEnabled({ ...base, lastInput: "touch" })).toBe(false);
  });

  it("enables only on FULL fine hover mouse", () => {
    expect(
      cursorEnabled({
        motionMode: "FULL",
        pointerCoarse: false,
        hoverHover: true,
        lastInput: "mouse",
        prefersReduced: false,
      }),
    ).toBe(true);
    expect(
      cursorEnabled({
        motionMode: "STANDARD",
        pointerCoarse: false,
        hoverHover: true,
        lastInput: "mouse",
        prefersReduced: false,
      }),
    ).toBe(false);
  });

  it("hides native cursor only after the custom blob is painted", () => {
    expect(nativeCursorHidden({ enabled: true, customPainted: false })).toBe(false);
    expect(nativeCursorHidden({ enabled: true, customPainted: true })).toBe(true);
    expect(nativeCursorHidden({ enabled: false, customPainted: true })).toBe(false);
  });

  it("never enables custom cursor on reduced motion", () => {
    expect(
      cursorEnabled({
        motionMode: "FULL",
        pointerCoarse: false,
        hoverHover: true,
        lastInput: "mouse",
        prefersReduced: true,
      }),
    ).toBe(false);
  });

  it("still maps dataset shapes for optional product hover, without requiring morph", () => {
    expect(cursorShapeFromDataset("product")).toBe("bottle");
    expect(cursorShapeFromElement("INPUT", false)).toBe("text");
    expect(cursorShapeFromElement("A", false)).toBe("link");
  });
});

describe("motion tokens and gating", () => {
  it("keeps durations inside the published bands", () => {
    expect(MOTION_DURATION_MS.micro).toBeGreaterThanOrEqual(150);
    expect(MOTION_DURATION_MS.micro).toBeLessThanOrEqual(220);
    expect(MOTION_DURATION_MS.fast).toBeGreaterThanOrEqual(250);
    expect(MOTION_DURATION_MS.fast).toBeLessThanOrEqual(350);
    expect(MOTION_DURATION_MS.standard).toBeGreaterThanOrEqual(400);
    expect(MOTION_DURATION_MS.standard).toBeLessThanOrEqual(550);
    expect(MOTION_DURATION_MS.editorial).toBeGreaterThanOrEqual(650);
    expect(MOTION_DURATION_MS.editorial).toBeLessThanOrEqual(850);
    expect(MOTION_DURATION_MS.cinematic).toBeGreaterThanOrEqual(900);
    expect(MOTION_DURATION_MS.cinematic).toBeLessThanOrEqual(1200);
    expect(LIQUID_PERSONALITIES.oil.fillMs).toBeGreaterThanOrEqual(300);
    expect(LIQUID_PERSONALITIES.oil.fillMs).toBeLessThanOrEqual(600);
    expect(LIQUID_PERSONALITIES.water.fillMs).toBeGreaterThanOrEqual(250);
    expect(LIQUID_PERSONALITIES.water.fillMs).toBeLessThanOrEqual(600);
  });

  it("wires scaleDuration and cinematic gating", () => {
    expect(scaleDuration(1000, "REDUCED")).toBe(80);
    expect(scaleDuration(1000, "STANDARD")).toBe(860);
    expect(scaleDuration(1000, "FULL")).toBe(1000);
    expect(motionAllowsCursor("FULL")).toBe(true);
    expect(motionAllowsCursor("STANDARD")).toBe(false);
    expect(motionAllowsCinematic("FULL")).toBe(true);
    expect(motionAllowsCinematic("STANDARD")).toBe(false);
  });

  it("maps page transitions", () => {
    expect(transitionKind("/", "/product/musk-rizali")).toBe("glass");
    expect(transitionKind("/product/musk-rizali", "/find-your-scent")).toBe("water");
    expect(transitionKind("/auth/login", "/account")).toBe("vault");
    expect(transitionKind("/cart", "/checkout")).toBe("oil");
    expect(transitionKind("/checkout", "/order/abc")).toBe("droplet");
  });
});
