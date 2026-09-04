import { MOTION_DURATION_MS } from "@/lib/motion/tokens";

export type LiquidPersonality = "water" | "oil";

export const LIQUID_PERSONALITIES: Record<
  LiquidPersonality,
  {
    viscosity: number;
    fillMs: number;
    rippleMs: number;
    stretch: number;
    compress: number;
    overshoot: number;
    fill: string;
    fillDeep: string;
  }
> = {
  water: {
    viscosity: 0.32,
    fillMs: MOTION_DURATION_MS.fast,
    rippleMs: MOTION_DURATION_MS.editorial,
    stretch: 1.14,
    compress: 0.86,
    overshoot: 1.08,
    fill: "rgba(221, 232, 221, 0.92)",
    fillDeep: "rgba(71, 106, 80, 0.88)",
  },
  oil: {
    viscosity: 0.74,
    fillMs: MOTION_DURATION_MS.editorial,
    rippleMs: MOTION_DURATION_MS.cinematic,
    stretch: 1.06,
    compress: 0.94,
    overshoot: 1.03,
    fill: "rgba(180, 122, 71, 0.92)",
    fillDeep: "rgba(99, 55, 54, 0.78)",
  },
};

export function personalityOf(kind: LiquidPersonality | undefined): (typeof LIQUID_PERSONALITIES)["oil"] {
  return LIQUID_PERSONALITIES[kind ?? "oil"];
}
