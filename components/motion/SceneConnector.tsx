"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionMode } from "@/lib/motion/useMotionMode";

/** One droplet that falls at a scene hinge — connects, does not add height. */
export function SceneConnector({ delay = 0 }: { delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [falling, setFalling] = useState(false);
  const mode = useMotionMode();

  useEffect(() => {
    const node = ref.current;
    if (!node || mode === "REDUCED") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          window.setTimeout(() => setFalling(true), delay);
        }
      },
      { threshold: 0.01, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [delay, mode]);

  if (mode === "REDUCED") return null;

  return (
    <div ref={ref} className={`scene-connector ${falling ? "is-falling" : ""}`} aria-hidden="true">
      <span className="scene-connector__drop" />
      <span className="scene-connector__ripple" />
    </div>
  );
}
