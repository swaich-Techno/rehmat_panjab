"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useMotionMode } from "@/lib/motion/useMotionMode";
import { durationCss } from "@/lib/motion/tokens";
import { motionAllowsCinematic } from "@/lib/motion/mode";

type Kind = "liquid" | "glass" | "oil" | "sweep";

export function LiquidMask({
  children,
  kind = "liquid",
  className = "",
}: {
  children: ReactNode;
  kind?: Kind;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const mode = useMotionMode();
  const cinematic = motionAllowsCinematic(mode);
  const resolved = kind === "sweep" && !cinematic ? "liquid" : kind;
  const visible = mode === "REDUCED" || shown;

  useEffect(() => {
    const node = ref.current;
    if (!node || mode === "REDUCED") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setShown(true);
      },
      { threshold: 0.16 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [mode]);

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden liquid-mask liquid-mask--${resolved} ${visible ? "is-shown" : ""} ${className}`}
      style={{ transitionDuration: durationCss("editorial") }}
    >
      {children}
    </div>
  );
}
