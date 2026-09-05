"use client";

import { useEffect, useRef } from "react";
import { durationMs } from "@/lib/motion/tokens";
import { useMotionMode } from "@/lib/motion/useMotionMode";

type Props = {
  className?: string;
  delayMs?: number;
  onSettled?: () => void;
};

export function Droplet({ className = "", delayMs = 0, onSettled }: Props) {
  const mode = useMotionMode();
  const settled = useRef(false);

  useEffect(() => {
    if (mode === "REDUCED") {
      onSettled?.();
      return;
    }
    const id = window.setTimeout(() => {
      if (!settled.current) {
        settled.current = true;
        onSettled?.();
      }
    }, delayMs + durationMs("droplet"));
    return () => window.clearTimeout(id);
  }, [delayMs, mode, onSettled]);

  if (mode === "REDUCED") {
    return <span className={`droplet droplet--still ${className}`} aria-hidden="true" />;
  }

  return (
    <span
      className={`droplet ${className}`}
      aria-hidden="true"
      style={{ animationDelay: `${delayMs}ms` }}
    />
  );
}
