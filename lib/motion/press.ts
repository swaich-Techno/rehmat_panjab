import { MOTION_DURATION_MS } from "@/lib/motion/tokens";

/** Bottle may lerp with the pointer. The homepage wordmark must not. */
export const BOTTLE_LERP_MAX_PX = 8;

/** Uniform press — satisfying, not a decorative squash. */
export const PRESS_SCALE = 0.96;

export const PRESS_SETTLE_MS = MOTION_DURATION_MS.pressSettle;

export function clampBottleLerp(nx: number, ny: number, max = BOTTLE_LERP_MAX_PX): { x: number; y: number } {
  return {
    x: Math.max(-max, Math.min(max, nx * max * 2)),
    y: Math.max(-max, Math.min(max, ny * max * 2)),
  };
}

export function pointerPercent(
  clientX: number,
  clientY: number,
  rect: DOMRect,
): { x: number; y: number } {
  const w = Math.max(1, rect.width);
  const h = Math.max(1, rect.height);
  return {
    x: ((clientX - rect.left) / w) * 100,
    y: ((clientY - rect.top) / h) * 100,
  };
}

export function viewportPercent(clientX: number, clientY: number): { x: number; y: number } {
  const w = typeof window === "undefined" ? 1 : Math.max(1, window.innerWidth);
  const h = typeof window === "undefined" ? 1 : Math.max(1, window.innerHeight);
  return {
    x: (clientX / w) * 100,
    y: (clientY / h) * 100,
  };
}
