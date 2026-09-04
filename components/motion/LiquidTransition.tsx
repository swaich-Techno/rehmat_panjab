"use client";

import { useRouter } from "next/navigation";
import { durationMs } from "@/lib/motion/tokens";
import { useMotionMode } from "@/lib/motion/useMotionMode";
import { motionAllowsCinematic } from "@/lib/motion/mode";

type Kind = "pour" | "wipe" | "none" | "glass" | "water" | "merge" | "vault" | "oil" | "droplet";

const CLASS: Record<Exclude<Kind, "none">, string> = {
  pour: "liquid-pour-veil",
  oil: "liquid-pour-veil",
  wipe: "liquid-wipe-veil",
  glass: "liquid-glass-veil",
  water: "liquid-water-veil",
  merge: "liquid-merge-veil",
  vault: "liquid-vault-veil",
  droplet: "liquid-droplet-veil",
};

export function useLiquidTransition() {
  const router = useRouter();
  const mode = useMotionMode();

  function go(href: string, kind: Kind = "pour") {
    if (mode === "REDUCED" || kind === "none" || (!motionAllowsCinematic(mode) && kind !== "pour")) {
      router.push(href);
      return;
    }

    const supportsView =
      typeof document !== "undefined" &&
      "startViewTransition" in document &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (supportsView && (kind === "pour" || kind === "oil")) {
      const doc = document as Document & {
        startViewTransition?: (cb: () => void) => void;
      };
      doc.startViewTransition?.(() => {
        router.push(href);
      });
      return;
    }

    const veil = document.createElement("div");
    veil.className = CLASS[kind === "none" ? "pour" : kind];
    document.body.appendChild(veil);
    window.setTimeout(() => {
      router.push(href);
      window.setTimeout(() => veil.remove(), durationMs("buyNow"));
    }, durationMs("standard"));
  }

  return { go };
}

export function LiquidTransition() {
  return null;
}
