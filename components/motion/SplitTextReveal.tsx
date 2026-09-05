"use client";

import { useMotionMode } from "@/lib/motion/useMotionMode";
import { durationMs } from "@/lib/motion/tokens";
import type { ElementType } from "react";

type Props = {
  text: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
};

export function SplitTextReveal({ text, as = "h1", className = "" }: Props) {
  const mode = useMotionMode();
  const Tag = as as ElementType;
  const words = text.split(/\s+/).filter(Boolean);

  if (mode === "REDUCED") {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag className={className} aria-label={text}>
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          className="split-text__word"
          style={{ animationDelay: `${index * durationMs("instant")}ms` }}
          aria-hidden="true"
        >
          {word}
        </span>
      ))}
    </Tag>
  );
}
