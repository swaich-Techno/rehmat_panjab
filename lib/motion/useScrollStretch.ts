"use client";

import { useEffect } from "react";
import { useMotionMode } from "@/lib/motion/useMotionMode";

/**
 * Subtle scaleY on atmosphere light when scroll is fast. Calm when slow.
 */
export function useScrollStretch() {
  const mode = useMotionMode();

  useEffect(() => {
    if (mode === "REDUCED") return;
    let lastY = window.scrollY;
    let lastT = performance.now();
    let current = 1;
    let raf = 0;
    let running = true;

    const onScroll = () => {
      const now = performance.now();
      const y = window.scrollY;
      const dt = Math.max(16, now - lastT);
      const v = Math.abs(y - lastY) / dt;
      lastY = y;
      lastT = now;
      const target = 1 + Math.min(0.055, v * 0.06);
      current += (target - current) * 0.22;
      document.documentElement.style.setProperty("--scroll-stretch", current.toFixed(3));
      const thick = Math.min(1, y / Math.max(1, window.innerHeight * 0.85));
      document.documentElement.style.setProperty("--oil-thick", thick.toFixed(3));
    };

    const settle = () => {
      if (!running) return;
      current += (1 - current) * 0.08;
      document.documentElement.style.setProperty("--scroll-stretch", current.toFixed(3));
      raf = requestAnimationFrame(settle);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    raf = requestAnimationFrame(settle);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.style.setProperty("--scroll-stretch", "1");
      document.documentElement.style.setProperty("--oil-thick", "0");
    };
  }, [mode]);
}
