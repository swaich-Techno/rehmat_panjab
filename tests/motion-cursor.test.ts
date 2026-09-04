import { describe, expect, it } from "vitest";
import { cursorEnabled, cursorShapeFromElement, cursorShapeFromDataset } from "@/lib/motion/cursor-mode";
import { scaleDuration, motionAllowsCursor, motionAllowsCinematic } from "@/lib/motion/mode";
import { MOTION_DURATION_MS } from "@/lib/motion/tokens";
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

  it("maps product photography to bottle and inputs to text", () => {
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
