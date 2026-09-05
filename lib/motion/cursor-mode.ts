import type { MotionMode } from "@/lib/motion/mode";

export type CursorInputKind = "mouse" | "pen" | "touch" | "keyboard";

export type CursorShape =
  | "droplet"
  | "oval"
  | "bottle"
  | "add"
  | "buy"
  | "quiz"
  | "link"
  | "drag"
  | "text"
  | "vault"
  | "hidden";

export type CursorEnableInput = {
  motionMode: MotionMode;
  pointerCoarse: boolean;
  hoverHover: boolean;
  lastInput: CursorInputKind;
  prefersReduced: boolean;
};

/**
 * Custom cursor is FULL-desktop only. Never required for function.
 * Disabled on reduced motion, coarse pointer, keyboard-only, and touch.
 */
export function cursorEnabled(input: CursorEnableInput): boolean {
  if (input.prefersReduced) return false;
  if (input.motionMode !== "FULL") return false;
  if (input.pointerCoarse) return false;
  if (!input.hoverHover) return false;
  if (input.lastInput === "touch" || input.lastInput === "keyboard") return false;
  return true;
}

/**
 * Native cursor is hidden only after the custom blob has painted.
 * Never hide the pointer for STANDARD / touch / reduced, or before first RAF.
 */
export function nativeCursorHidden(input: { enabled: boolean; customPainted: boolean }): boolean {
  return input.enabled && input.customPainted;
}

const SHAPE_BY_ATTR: Record<string, CursorShape> = {
  droplet: "droplet",
  product: "bottle",
  add: "add",
  buy: "buy",
  quiz: "quiz",
  link: "link",
  drag: "drag",
  text: "text",
  vault: "vault",
  hidden: "hidden",
};

export function cursorShapeFromDataset(value: string | undefined): CursorShape | null {
  if (!value) return null;
  return SHAPE_BY_ATTR[value] ?? null;
}

const TEXT_TAGS = new Set(["INPUT", "TEXTAREA", "SELECT"]);

export function cursorShapeFromElement(tagName: string, isEditable: boolean, dataset?: string): CursorShape {
  const fromData = cursorShapeFromDataset(dataset);
  if (fromData) return fromData;
  if (isEditable || TEXT_TAGS.has(tagName)) return "text";
  if (tagName === "A") return "link";
  if (tagName === "BUTTON") return "droplet";
  return "droplet";
}

export const CURSOR_MORPH_MS = { min: 180, max: 350 } as const;
