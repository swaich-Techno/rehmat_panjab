"use client";

import { useEffect, useState } from "react";
import { durationMs } from "@/lib/motion/tokens";
import { useMotionMode } from "@/lib/motion/useMotionMode";

type Ripple = { id: number; x: number; y: number };

export function TapRipple() {
  const mode = useMotionMode();
  const [ripples, setRipples] = useState<Ripple[]>([]);

  useEffect(() => {
    if (mode === "FULL") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onDown = (event: PointerEvent) => {
      if (event.pointerType !== "touch") return;
      const id = event.timeStamp;
      setRipples((current) => [...current.slice(-4), { id, x: event.clientX, y: event.clientY }]);
      window.setTimeout(() => {
        setRipples((current) => current.filter((item) => item.id !== id));
      }, durationMs("ripple"));
    };

    window.addEventListener("pointerdown", onDown, { passive: true });
    return () => window.removeEventListener("pointerdown", onDown);
  }, [mode]);

  if (mode === "FULL") return null;

  return (
    <>
      {ripples.map((ripple) => (
        <span key={ripple.id} className="tap-ripple" style={{ left: ripple.x, top: ripple.y }} aria-hidden="true" />
      ))}
    </>
  );
}
