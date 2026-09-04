"use client";

import { useRef } from "react";
import { useOffscreenPause } from "@/lib/motion/useOffscreenPause";
import { useMotionMode } from "@/lib/motion/useMotionMode";

type Props = {
  className?: string;
  intensity?: number;
};

/**
 * CSS + SVG refraction. No WebGL. Pauses offscreen and in reduced mode.
 */
export function RefractionLayer({ className = "", intensity = 1 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const active = useOffscreenPause(ref);
  const mode = useMotionMode();
  const run = active && mode !== "REDUCED";

  return (
    <div ref={ref} className={`refraction-layer ${className}`} data-active={run} aria-hidden="true">
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
                dur={mode === "FULL" ? "9s" : "14s"}
                values="0.01;0.016;0.01"
                repeatCount="indefinite"
              />
            ) : null}
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={8 * intensity} />
        </filter>
      </svg>
      <div className="refraction-layer__sheet" />
    </div>
  );
}
