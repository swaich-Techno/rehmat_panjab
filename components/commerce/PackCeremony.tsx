"use client";

import { durationCss } from "@/lib/motion/tokens";

export type PackPhase = "idle" | "bottle" | "carton" | "parcel";

export function PackCeremony({ phase }: { phase: PackPhase }) {
  if (phase === "idle") return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-[70] flex items-center justify-center bg-cream/70" aria-hidden="true">
      <div className="relative h-40 w-28">
        <span
          className={`absolute inset-x-8 top-4 h-24 bg-forest/80 ${phase === "bottle" ? "opacity-100" : "opacity-0"}`}
          style={{
            clipPath: "polygon(30% 0, 70% 0, 78% 18%, 78% 100%, 22% 100%, 22% 18%)",
            transition: `opacity ${durationCss("fast")}`,
          }}
        />
        <span
          className={`absolute inset-x-4 top-10 h-20 bg-sand ${phase === "carton" ? "opacity-100" : "opacity-0"}`}
          style={{ transition: `opacity ${durationCss("fast")}` }}
        />
        <span
          className={`absolute inset-x-2 top-8 h-24 border border-ink/30 bg-paper ${phase === "parcel" ? "opacity-100" : "opacity-0"}`}
          style={{ transition: `opacity ${durationCss("fast")}` }}
        />
      </div>
      <p className="sr-only">Preparing the request parcel</p>
    </div>
  );
}
