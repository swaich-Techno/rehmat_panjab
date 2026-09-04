"use client";

import { useState } from "react";
import { Ripple } from "@/components/motion/Ripple";
import { durationMs } from "@/lib/motion/tokens";

export function QtyStepper({
  value,
  min = 1,
  max = 12,
  onChange,
  label = "Quantity",
}: {
  value: number;
  min?: number;
  max?: number;
  onChange: (next: number) => void;
  label?: string;
}) {
  const [ripple, setRipple] = useState(false);

  return (
    <div className="relative inline-flex items-center gap-2" aria-label={label}>
      <button
        type="button"
        className="touch-target label border border-ink/20 px-3"
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        −
      </button>
      <span className="display min-w-8 text-center text-2xl">{value}</span>
      <button
        type="button"
        className="relative touch-target label overflow-hidden border border-ink/20 px-3"
        onClick={() => {
          onChange(Math.min(max, value + 1));
          setRipple(true);
          window.setTimeout(() => setRipple(false), durationMs("ripple"));
        }}
      >
        {ripple ? <Ripple personality="oil" origin="center" /> : null}
        +
      </button>
    </div>
  );
}
