/**
 * Motion SSoT. Durations live here and are emitted as CSS custom properties.
 * Components must not invent raw duration literals — import tokens or use var(--duration-*).
 *
 * Bands (ms):
 *   micro 150–220 · fast 250–350 · standard 400–550 · editorial 650–850 · cinematic 900–1200
 */

export const MOTION_DURATION_MS = {
  instant: 80,
  micro: 180,
  fast: 280,
  /** Click overshoot settle — 280–400ms band, not a second system. */
  pressSettle: 340,
  standard: 480,
  /** @deprecated alias of standard — kept so existing CSS/hooks keep compiling */
  normal: 480,
  sheet: 320,
  editorial: 750,
  cartFly: 780,
  buyNow: 720,
  cinematic: 1050,
  pack: 1100,
  vault: 980,
  droplet: 640,
  ripple: 820,
  morph: 260,
  navExpand: 550,
  atc: 750,
  addAnother: 1500,
} as const;

export type MotionDurationName = keyof typeof MOTION_DURATION_MS;

export const MOTION_EASE = {
  weighted: [0.22, 1, 0.36, 1] as [number, number, number, number],
  press: [0.3, 0, 0.2, 1] as [number, number, number, number],
  liquid: [0.16, 1, 0.3, 1] as [number, number, number, number],
  overshoot: [0.34, 1.12, 0.64, 1] as [number, number, number, number],
  liquidEase: [0.16, 1, 0.3, 1] as [number, number, number, number],
  glassEase: [0.22, 0.61, 0.36, 1] as [number, number, number, number],
  snapEase: [0.32, 0.72, 0.28, 1] as [number, number, number, number],
  editorialEase: [0.22, 1, 0.36, 1] as [number, number, number, number],
};

export const MOTION_EASE_CSS = {
  weighted: "cubic-bezier(0.22, 1, 0.36, 1)",
  press: "cubic-bezier(0.3, 0, 0.2, 1)",
  liquid: "cubic-bezier(0.16, 1, 0.3, 1)",
  overshoot: "cubic-bezier(0.34, 1.12, 0.64, 1)",
  liquidEase: "cubic-bezier(0.16, 1, 0.3, 1)",
  glassEase: "cubic-bezier(0.22, 0.61, 0.36, 1)",
  snapEase: "cubic-bezier(0.32, 0.72, 0.28, 1)",
  editorialEase: "cubic-bezier(0.22, 1, 0.36, 1)",
} as const;

/** Seconds — for the `motion` library. */
export const motionTokens = {
  micro: MOTION_DURATION_MS.micro / 1000,
  fast: MOTION_DURATION_MS.fast / 1000,
  pressSettle: MOTION_DURATION_MS.pressSettle / 1000,
  standard: MOTION_DURATION_MS.standard / 1000,
  normal: MOTION_DURATION_MS.standard / 1000,
  sheet: MOTION_DURATION_MS.sheet / 1000,
  editorial: MOTION_DURATION_MS.editorial / 1000,
  cartFly: MOTION_DURATION_MS.cartFly / 1000,
  buyNow: MOTION_DURATION_MS.buyNow / 1000,
  cinematic: MOTION_DURATION_MS.cinematic / 1000,
  pack: MOTION_DURATION_MS.pack / 1000,
  vault: MOTION_DURATION_MS.vault / 1000,
  droplet: MOTION_DURATION_MS.droplet / 1000,
  ripple: MOTION_DURATION_MS.ripple / 1000,
  morph: MOTION_DURATION_MS.morph / 1000,
  navExpand: MOTION_DURATION_MS.navExpand / 1000,
  atc: MOTION_DURATION_MS.atc / 1000,
  ease: MOTION_EASE.editorialEase,
  easePress: MOTION_EASE.press,
  easeLiquid: MOTION_EASE.liquidEase,
  easeGlass: MOTION_EASE.glassEase,
  easeSnap: MOTION_EASE.snapEase,
  easeEditorial: MOTION_EASE.editorialEase,
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
  return `${durations}; ${eases}`;
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
