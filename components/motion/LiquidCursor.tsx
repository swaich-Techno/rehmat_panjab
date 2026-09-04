"use client";

import { useEffect, useRef } from "react";
import { useMotionMode } from "@/lib/motion/useMotionMode";
import { motionAllowsCursor } from "@/lib/motion/mode";

export function LiquidCursor() {
  const mode = useMotionMode();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || !motionAllowsCursor(mode)) return;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    let raf = 0;
    let running = true;

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      tx = event.clientX;
      ty = event.clientY;
    };

    const loop = () => {
      if (!running) return;
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      node.style.transform = `translate3d(${x - 10}px, ${y - 10}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [mode]);

  if (!motionAllowsCursor(mode)) return null;

  return <div ref={ref} className="liquid-cursor" aria-hidden="true" />;
}
