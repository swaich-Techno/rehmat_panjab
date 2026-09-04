"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * Pause RAF / CSS animation work when the node is offscreen or the tab is hidden.
 */
export function useOffscreenPause<T extends Element>(
  ref: RefObject<T | null>,
): boolean {
  const [active, setActive] = useState(false);
  const visibleRef = useRef(false);
  const pageRef = useRef(true);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const sync = () => {
      setActive(visibleRef.current && pageRef.current);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting && entry.intersectionRatio > 0.02;
        sync();
      },
      { threshold: [0, 0.02, 0.1] },
    );
    io.observe(node);

    const onVis = () => {
      pageRef.current = document.visibilityState === "visible";
      sync();
    };
    document.addEventListener("visibilitychange", onVis);
    onVis();

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [ref]);

  return active;
}
