"use client";

import { useEffect, useRef, useState } from "react";
import { useOffscreenPause } from "@/lib/motion/useOffscreenPause";
import { useMotionMode } from "@/lib/motion/useMotionMode";
import { durationMs } from "@/lib/motion/tokens";

type Props = {
  className?: string;
  intensity?: number;
};

/**
 * CSS + SVG refraction. One-shot reveal, then settles — never an idle wobble on type.
 * Pauses offscreen and in reduced mode. Applied to the atmosphere sheet only.
 */
export function RefractionLayer({ className = "", intensity = 1 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const active = useOffscreenPause(ref);
  const mode = useMotionMode();
  const [timedOut, setTimedOut] = useState(false);
  const settled = mode === "REDUCED" || timedOut;
  const run = active && mode !== "REDUCED" && !settled;

  useEffect(() => {
    if (mode === "REDUCED") return;
    const id = window.setTimeout(() => setTimedOut(true), durationMs("cinematic"));
    return () => window.clearTimeout(id);
  }, [mode]);

  return (
    <div
      ref={ref}
      className={`refraction-layer ${className}`}
      data-active={run}
      data-settled={settled}
      aria-hidden="true"
    >
      <svg className="absolute h-0 w-0" aria-hidden="true">
        <filter id="rp-refract" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency={mode === "FULL" ? 0.012 * intensity : 0.008}
            numOctaves="2"
            seed="2"
            result="noise"
          >
            {run ? (
              <animate
                attributeName="baseFrequency"
                dur={mode === "FULL" ? "1.05s" : "1.4s"}
                values="0.01;0.018;0.01"
                repeatCount="1"
                fill="freeze"
              />
            ) : null}
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={settled ? 0 : 8 * intensity} />
        </filter>
      </svg>
      <div className="refraction-layer__sheet" />
    </div>
  );
}
