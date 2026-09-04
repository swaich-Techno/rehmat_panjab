"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { durationMs } from "@/lib/motion/tokens";
import { useMotionMode } from "@/lib/motion/useMotionMode";
import { scaleDuration } from "@/lib/motion/mode";
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

declare global {
  interface Window {
    __rehmatVeil?: boolean;
  }
}

export function playVeil(kind: TransitionKind, ms: number) {
  if (kind === "none" || typeof document === "undefined") return;
  window.__rehmatVeil = true;
  const veil = document.createElement("div");
  veil.className = `${CLASS[kind]} is-route-veil`;
  document.body.appendChild(veil);
  window.setTimeout(() => {
    veil.remove();
    window.__rehmatVeil = false;
  }, ms);
}

export function RouteTransition() {
  const pathname = usePathname() ?? "/";
  const mode = useMotionMode();
  const fromRef = useRef(pathname);

  useEffect(() => {
    const prev = fromRef.current;
    fromRef.current = pathname;
    if (prev === pathname) return;
    if (mode === "REDUCED") return;
    if (window.__rehmatVeil) return;
    const kind = transitionKind(prev, pathname);
    if (kind === "none") return;
    playVeil(kind, scaleDuration(durationMs("editorial"), mode));
  }, [pathname, mode]);

  return null;
}
