"use client";

import { useContext } from "react";
import { MotionModeContext } from "@/components/motion/MotionProvider";
import type { MotionMode } from "@/lib/motion/mode";

export function useMotionMode(): MotionMode {
  return useContext(MotionModeContext);
}
