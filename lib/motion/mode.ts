import { prefersReducedMotion } from "@/lib/motion/tokens";

export type MotionMode = "FULL" | "STANDARD" | "REDUCED";

export function detectMotionMode(): MotionMode {
  if (typeof window === "undefined") return "STANDARD";
  if (prefersReducedMotion()) return "REDUCED";
  const fine = window.matchMedia("(pointer: fine)").matches;
  const hover = window.matchMedia("(hover: hover)").matches;
  const wide = window.matchMedia("(min-width: 768px)").matches;
  if (fine && hover && wide) return "FULL";
  return "STANDARD";
}

export function motionAllowsCursor(mode: MotionMode): boolean {
  return mode === "FULL";
}

export function motionAllowsCinematic(mode: MotionMode): boolean {
  return mode === "FULL";
}

export function scaleDuration(ms: number, mode: MotionMode): number {
  if (mode === "REDUCED") return Math.min(80, ms);
  if (mode === "STANDARD") return Math.round(ms * 0.86);
  return ms;
}
