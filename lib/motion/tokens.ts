export const motionTokens = {
  fast: 0.18,
  normal: 0.35,
  editorial: 0.7,
  cinematic: 1.1,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  easePress: [0.3, 0, 0.2, 1] as [number, number, number, number],
};

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
