"use client";

import { useMotionMode } from "@/lib/motion/useMotionMode";
import type { LiquidPersonality } from "@/lib/motion/personalities";

type Props = {
  x?: number;
  y?: number;
  personality?: LiquidPersonality;
  className?: string;
  origin?: "center" | "pointer";
};

/**
 * Asymmetric ripple — not concentric orbs. Offset ellipses, one trailing edge.
 */
export function Ripple({
  x = 50,
  y = 50,
  personality = "water",
  className = "",
  origin = "center",
}: Props) {
  const mode = useMotionMode();
  if (mode === "REDUCED") return null;

  return (
    <span
      className={`ripple ripple--${personality} ${className}`}
      style={{
        left: origin === "pointer" ? `${x}%` : "50%",
        top: origin === "pointer" ? `${y}%` : "50%",
      }}
      aria-hidden="true"
    />
  );
}
