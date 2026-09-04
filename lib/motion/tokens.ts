/**
 * Motion SSoT. Durations live here and are emitted as CSS custom properties.
 * Components must not invent raw duration literals — import tokens or use var(--duration-*).
 */

export const MOTION_DURATION_MS = {
  instant: 80,
  fast: 180,
  normal: 350,
  sheet: 320,
  editorial: 700,
  cartFly: 780,
  buyNow: 720,
  cinematic: 1100,
  pack: 1200,
  vault: 900,
  droplet: 640,
  ripple: 820,
} as const;

export type MotionDurationName = keyof typeof MOTION_DURATION_MS;

export const MOTION_EASE = {
  weighted: [0.22, 1, 0.36, 1] as [number, number, number, number],
  press: [0.3, 0, 0.2, 1] as [number, number, number, number],
  liquid: [0.16, 1, 0.3, 1] as [number, number, number, number],
  overshoot: [0.34, 1.4, 0.64, 1] as [number, number, number, number],
};

export const MOTION_EASE_CSS = {
  weighted: "cubic-bezier(0.22, 1, 0.36, 1)",
  press: "cubic-bezier(0.3, 0, 0.2, 1)",
  liquid: "cubic-bezier(0.16, 1, 0.3, 1)",
  overshoot: "cubic-bezier(0.34, 1.4, 0.64, 1)",
} as const;

/** Seconds — for the `motion` library. */
export const motionTokens = {
  fast: MOTION_DURATION_MS.fast / 1000,
  normal: MOTION_DURATION_MS.normal / 1000,
  sheet: MOTION_DURATION_MS.sheet / 1000,
  editorial: MOTION_DURATION_MS.editorial / 1000,
  cartFly: MOTION_DURATION_MS.cartFly / 1000,
  buyNow: MOTION_DURATION_MS.buyNow / 1000,
  cinematic: MOTION_DURATION_MS.cinematic / 1000,
  pack: MOTION_DURATION_MS.pack / 1000,
  vault: MOTION_DURATION_MS.vault / 1000,
  droplet: MOTION_DURATION_MS.droplet / 1000,
  ripple: MOTION_DURATION_MS.ripple / 1000,
  ease: MOTION_EASE.weighted,
  easePress: MOTION_EASE.press,
  easeLiquid: MOTION_EASE.liquid,
  easeOvershoot: MOTION_EASE.overshoot,
};

export function durationMs(name: MotionDurationName): number {
  return MOTION_DURATION_MS[name];
}

export function durationCss(name: MotionDurationName): string {
  return `var(--duration-${name})`;
}

export function motionCssVars(): string {
  const durations = Object.entries(MOTION_DURATION_MS)
    .map(([name, ms]) => `--duration-${name}: ${ms}ms`)
    .join("; ");
  const eases = Object.entries(MOTION_EASE_CSS)
    .map(([name, value]) => `--ease-${name}: ${value}`)
    .join("; ");
  return `${durations}; ${eases}; --ease-weighted: ${MOTION_EASE_CSS.weighted}; --ease-press: ${MOTION_EASE_CSS.press};`;
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
