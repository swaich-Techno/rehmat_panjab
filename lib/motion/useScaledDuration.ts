"use client";

import { scaleDuration } from "@/lib/motion/mode";
import { durationMs, type MotionDurationName } from "@/lib/motion/tokens";
import { useMotionMode } from "@/lib/motion/useMotionMode";

export function useScaledDuration(name: MotionDurationName): number {
  const mode = useMotionMode();
  return scaleDuration(durationMs(name), mode);
}
