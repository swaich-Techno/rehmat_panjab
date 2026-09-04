"use client";

import { useRef, type PointerEvent } from "react";
import { durationMs } from "@/lib/motion/tokens";
import { useMotionMode } from "@/lib/motion/useMotionMode";

type Origin = { x: number; y: number };

type Props = {
  label: string;
  selected: boolean;
  onSelect: (origin: Origin) => void;
  displayClassName?: string;
  selectedWord?: string;
};

/**
 * Click/tap selects immediately. Hold also selects (desktop users expected to click —
 * the hold ring is extra, never the only path). Visible affordance on every option.
 */
export function OptionSelect({
  label,
  selected,
  onSelect,
  displayClassName = "text-4xl md:text-5xl",
  selectedWord = "Held",
}: Props) {
  const hold = useRef<number>(0);
  const origin = useRef<Origin>({ x: 50, y: 42 });
  const selectedByHold = useRef(false);
  const mode = useMotionMode();

  function capture(event: PointerEvent<HTMLButtonElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    origin.current = {
      x: ((event.clientX - rect.left) / Math.max(1, window.innerWidth)) * 100 + (rect.left / window.innerWidth) * 100,
      y: ((event.clientY - rect.top) / Math.max(1, window.innerHeight)) * 100 + (rect.top / window.innerHeight) * 100,
    };
  }

  return (
    <button
      type="button"
      data-cursor="quiz"
      data-held={selected}
      className={`option-liquid flex min-h-11 w-full items-baseline justify-between py-4 text-left ${selected ? "text-forest" : ""}`}
      onPointerDown={(event) => {
        capture(event);
        selectedByHold.current = false;
        if (mode === "REDUCED") return;
        window.clearTimeout(hold.current);
        hold.current = window.setTimeout(() => {
          selectedByHold.current = true;
          onSelect(origin.current);
        }, durationMs("standard"));
      }}
      onPointerUp={() => window.clearTimeout(hold.current)}
      onPointerLeave={() => window.clearTimeout(hold.current)}
      onClick={() => {
        if (selectedByHold.current) return;
        onSelect(origin.current);
      }}
    >
      <span className={`display ${displayClassName}`}>{label}</span>
      <span className="label option-affordance">{selected ? selectedWord : "Click or hold"}</span>
    </button>
  );
}
