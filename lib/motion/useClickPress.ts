"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { durationMs } from "@/lib/motion/tokens";
import { pointerPercent } from "@/lib/motion/press";
import { useMotionMode } from "@/lib/motion/useMotionMode";

type Origin = { x: number; y: number; id: number };

/**
 * Shared click-value: origin fill, 0.96 press, overshoot settle.
 * Keyboard Enter/Space uses the centre so activation matches pointer.
 */
export function useClickPress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const mode = useMotionMode();
  const [pressed, setPressed] = useState(false);
  const [ripple, setRipple] = useState<Origin | null>(null);

  function writeOrigin(x: number, y: number) {
    const node = ref.current;
    if (!node) return;
    node.style.setProperty("--px", `${x}%`);
    node.style.setProperty("--py", `${y}%`);
  }

  function trackPointer(event: PointerEvent<T>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const origin = pointerPercent(event.clientX, event.clientY, rect);
    writeOrigin(origin.x, origin.y);
    return origin;
  }

  function down(x: number, y: number, withRipple = false) {
    if (mode === "REDUCED") return;
    writeOrigin(x, y);
    setPressed(true);
    if (withRipple) {
      setRipple({ x, y, id: Date.now() });
      window.setTimeout(() => setRipple(null), durationMs("ripple"));
    }
  }

  function up() {
    setPressed(false);
  }

  function fromPointer(event: PointerEvent<T>, withRipple = false) {
    const origin = trackPointer(event);
    down(origin.x, origin.y, withRipple);
    return origin;
  }

  function fromKeyboard(event: KeyboardEvent<T>) {
    if (event.key !== "Enter" && event.key !== " ") return false;
    down(50, 50, true);
    return true;
  }

  function magnet(event: PointerEvent<T>, maxX = 6, maxY = 4) {
    const node = ref.current;
    if (!node || mode !== "FULL" || pressed) return;
    const rect = node.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    node.style.setProperty("--mx", `${Math.max(-maxX, Math.min(maxX, dx * 0.16))}px`);
    node.style.setProperty("--my", `${Math.max(-maxY, Math.min(maxY, dy * 0.16))}px`);
  }

  function clearMagnet() {
    const node = ref.current;
    if (!node) return;
    node.style.setProperty("--mx", "0px");
    node.style.setProperty("--my", "0px");
  }

  return {
    ref,
    mode,
    pressed,
    ripple,
    down,
    up,
    fromPointer,
    fromKeyboard,
    trackPointer,
    magnet,
    clearMagnet,
    writeOrigin,
  };
}
