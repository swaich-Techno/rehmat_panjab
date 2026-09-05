"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { useOffscreenPause } from "@/lib/motion/useOffscreenPause";
import { useMotionMode } from "@/lib/motion/useMotionMode";
import type { LiquidPersonality } from "@/lib/motion/personalities";

type Props = {
  personality?: LiquidPersonality;
  className?: string;
  children?: ReactNode;
  style?: CSSProperties;
};

export function LiquidSurface({ personality = "water", className = "", children, style }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const active = useOffscreenPause(ref);
  const mode = useMotionMode();

  return (
    <div
      ref={ref}
      className={`liquid-surface ${className}`}
      data-liquid={personality}
      data-active={active && mode !== "REDUCED"}
      style={style}
    >
      {children}
    </div>
  );
}
