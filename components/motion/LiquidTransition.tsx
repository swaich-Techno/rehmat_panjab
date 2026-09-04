"use client";

import { useRouter } from "next/navigation";
import { durationMs } from "@/lib/motion/tokens";
import { useMotionMode } from "@/lib/motion/useMotionMode";
import { scaleDuration } from "@/lib/motion/mode";
import { playVeil } from "@/components/motion/RouteTransition";
import type { TransitionKind } from "@/lib/motion/transitions";

type Kind = TransitionKind;

export function useLiquidTransition() {
  const router = useRouter();
  const mode = useMotionMode();

  function go(href: string, kind: Kind = "pour") {
    if (mode === "REDUCED" || kind === "none") {
      router.push(href);
      return;
    }

    const ms = scaleDuration(durationMs(kind === "vault" ? "vault" : kind === "pour" || kind === "oil" ? "buyNow" : "editorial"), mode);
    playVeil(kind, ms);

    const supportsView =
      typeof document !== "undefined" &&
      "startViewTransition" in document &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (supportsView && (kind === "pour" || kind === "oil" || kind === "glass")) {
      const doc = document as Document & {
        startViewTransition?: (cb: () => void) => void;
      };
      window.setTimeout(() => {
        doc.startViewTransition?.(() => {
          router.push(href);
        });
      }, Math.min(180, ms * 0.25));
      return;
    }

    window.setTimeout(() => router.push(href), Math.min(280, ms * 0.4));
  }

  return { go };
}

export function LiquidTransition() {
  return null;
}
