"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { durationMs } from "@/lib/motion/tokens";
import { useMotionMode } from "@/lib/motion/useMotionMode";
import { motionAllowsCinematic } from "@/lib/motion/mode";
import { transitionKind, type TransitionKind } from "@/lib/motion/transitions";

const CLASS: Record<Exclude<TransitionKind, "none">, string> = {
  pour: "liquid-pour-veil",
  wipe: "liquid-wipe-veil",
  glass: "liquid-glass-veil",
  water: "liquid-water-veil",
  merge: "liquid-merge-veil",
  vault: "liquid-vault-veil",
  oil: "liquid-pour-veil",
  droplet: "liquid-droplet-veil",
};

function playVeil(kind: TransitionKind, ms: number) {
  if (kind === "none") return;
  const veil = document.createElement("div");
  veil.className = CLASS[kind];
  document.body.appendChild(veil);
  window.setTimeout(() => veil.remove(), ms);
}

export function RouteTransition() {
  const pathname = usePathname() ?? "/";
  const mode = useMotionMode();
  const fromRef = useRef(pathname);

  useEffect(() => {
    const prev = fromRef.current;
    fromRef.current = pathname;
    if (prev === pathname) return;
    if (mode === "REDUCED" || !motionAllowsCinematic(mode)) return;
    const kind = transitionKind(prev, pathname);
    if (kind === "none") return;
    playVeil(kind, durationMs("editorial"));
  }, [pathname, mode]);

  return null;
}
