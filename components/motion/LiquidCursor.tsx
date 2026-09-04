"use client";

import { useEffect, useRef } from "react";
import { useMotionMode } from "@/lib/motion/useMotionMode";
import { motionAllowsCursor } from "@/lib/motion/mode";

/**
 * Visible 20×20 sage/green blob. Native cursor stays until this layer
 * has actually painted. No oil-droplet morph — visibility over concept.
 */
export function LiquidCursor() {
  const mode = useMotionMode();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || !motionAllowsCursor(mode)) {
      document.documentElement.dataset.rehmatCursor = "off";
      return;
    }

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    let raf = 0;
    let running = true;
    let painted = false;
    let hover = 1;

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      tx = event.clientX;
      ty = event.clientY;
      const el = document.elementFromPoint(event.clientX, event.clientY);
      const interactive = Boolean(el?.closest("a, button, [data-cursor]:not([data-cursor='text'])"));
      hover = interactive ? 1.28 : 1;
    };

    const loop = () => {
      if (!running) return;
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      node.style.transform = `translate3d(${x - 10}px, ${y - 10}px, 0) scale(${hover})`;
      if (!painted) {
        painted = true;
        node.classList.add("is-on");
        document.documentElement.dataset.rehmatCursor = "on";
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.dataset.rehmatCursor = "off";
    };
  }, [mode]);

  if (!motionAllowsCursor(mode)) return null;

  return <div ref={ref} className="liquid-cursor" aria-hidden="true" />;
}

/** @deprecated Alias of LiquidCursor. The oil-droplet cursor was invisible on cream. */
export function RehmatCursor() {
  return <LiquidCursor />;
}
