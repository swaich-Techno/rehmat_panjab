"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { capCeremony, durationMs } from "@/lib/motion/tokens";
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

let veilNode: HTMLDivElement | null = null;
let veilTimer = 0;

export function playVeil(kind: TransitionKind, ms: number) {
  if (kind === "none" || typeof document === "undefined") return;
  if (veilNode) {
    veilNode.remove();
    veilNode = null;
  }
  if (veilTimer) {
    window.clearTimeout(veilTimer);
    veilTimer = 0;
  }
  window.__rehmatVeil = true;
  const veil = document.createElement("div");
  veil.className = `${CLASS[kind]} is-route-veil`;
  document.body.appendChild(veil);
  veilNode = veil;
  veilTimer = window.setTimeout(() => {
    veil.remove();
    if (veilNode === veil) veilNode = null;
    window.__rehmatVeil = false;
    veilTimer = 0;
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
    playVeil(kind, capCeremony(scaleDuration(durationMs("editorial"), mode)));
  }, [pathname, mode]);

  return null;
}
