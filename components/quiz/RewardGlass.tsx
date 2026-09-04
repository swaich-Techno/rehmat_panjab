"use client";

import { durationCss } from "@/lib/motion/tokens";
import { useMotionMode } from "@/lib/motion/useMotionMode";

const REWARD_PERCENT = 5;

export function RewardGlass({ revealed }: { revealed: boolean }) {
  const mode = useMotionMode();
  const height = revealed ? `${REWARD_PERCENT}%` : "0%";

  return (
    <div className="relative mx-auto h-48 w-24" aria-hidden="true">
      <div className="absolute inset-0 border border-ink/30 bg-ivory/50">
        <span
          className="absolute inset-x-0 bottom-0 bg-green/70"
          style={{
            height: mode === "REDUCED" && revealed ? height : height,
            transition: `height ${durationCss("cinematic")} var(--ease-liquid)`,
          }}
        />
      </div>
      <p className="label absolute -bottom-8 left-0 right-0 text-center">{REWARD_PERCENT}%</p>
    </div>
  );
}
