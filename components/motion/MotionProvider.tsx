"use client";

import { createContext, useEffect, useState, type ReactNode } from "react";
import { detectMotionMode, type MotionMode } from "@/lib/motion/mode";

export const MotionModeContext = createContext<MotionMode>("STANDARD");

export function MotionProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<MotionMode>("STANDARD");

  useEffect(() => {
    const apply = () => {
      const next = detectMotionMode();
      setMode(next);
      document.documentElement.dataset.motion = next.toLowerCase();
    };
    apply();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = window.matchMedia("(pointer: fine)");
    const hover = window.matchMedia("(hover: hover)");
    const width = window.matchMedia("(min-width: 768px)");
    reduce.addEventListener("change", apply);
    pointer.addEventListener("change", apply);
    hover.addEventListener("change", apply);
    width.addEventListener("change", apply);
    return () => {
      reduce.removeEventListener("change", apply);
      pointer.removeEventListener("change", apply);
      hover.removeEventListener("change", apply);
      width.removeEventListener("change", apply);
    };
  }, []);

  return <MotionModeContext.Provider value={mode}>{children}</MotionModeContext.Provider>;
}
