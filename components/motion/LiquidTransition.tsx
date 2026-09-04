"use client";

import { useRouter } from "next/navigation";
import { durationMs } from "@/lib/motion/tokens";
import { useMotionMode } from "@/lib/motion/useMotionMode";

type Kind = "pour" | "wipe" | "none";

export function useLiquidTransition() {
  const router = useRouter();
  const mode = useMotionMode();

  function go(href: string, kind: Kind = "pour") {
    if (mode === "REDUCED" || kind === "none") {
      router.push(href);
      return;
    }

    const supportsView =
      typeof document !== "undefined" &&
      "startViewTransition" in document &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (supportsView && kind === "pour") {
      const doc = document as Document & {
        startViewTransition?: (cb: () => void) => void;
      };
      doc.startViewTransition?.(() => {
        router.push(href);
      });
      return;
    }

    const veil = document.createElement("div");
    veil.className = kind === "pour" ? "liquid-pour-veil" : "liquid-wipe-veil";
    document.body.appendChild(veil);
    window.setTimeout(() => {
      router.push(href);
      window.setTimeout(() => veil.remove(), durationMs("buyNow"));
    }, durationMs("normal"));
  }

  return { go };
}

export function LiquidTransition() {
  return null;
}
