"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useMotionMode } from "@/lib/motion/useMotionMode";
import { durationCss } from "@/lib/motion/tokens";

type Props = {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article";
};

export function LiquidReveal({ children, className = "", as = "div" }: Props) {
  const Tag = as;
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);
  const mode = useMotionMode();
  const visible = mode === "REDUCED" || shown;

  useEffect(() => {
    const node = ref.current;
    if (!node || mode === "REDUCED") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setShown(true);
      },
      { threshold: 0.18 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [mode]);

  return (
    <Tag
      ref={(node) => {
        ref.current = node;
      }}
      className={`liquid-reveal ${visible ? "is-shown" : ""} ${className}`}
      style={{ transitionDuration: durationCss("editorial") }}
    >
      {children}
    </Tag>
  );
}
