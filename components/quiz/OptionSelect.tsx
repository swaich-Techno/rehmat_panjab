"use client";

import { useRef, useState, type PointerEvent } from "react";
import { durationMs } from "@/lib/motion/tokens";
import { pointerPercent, viewportPercent } from "@/lib/motion/press";
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
 * Click/tap selects immediately. The word expands from that click; atmosphere
 * washes from the same origin. Hold is extra, never the only path.
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
  const [burst, setBurst] = useState(false);
  const mode = useMotionMode();

  function capture(event: PointerEvent<HTMLButtonElement>) {
    const local = pointerPercent(event.clientX, event.clientY, event.currentTarget.getBoundingClientRect());
    const view = viewportPercent(event.clientX, event.clientY);
    origin.current = view;
    event.currentTarget.style.setProperty("--ox", `${local.x}%`);
    event.currentTarget.style.setProperty("--oy", `${local.y}%`);
  }

  function fire() {
    if (mode !== "REDUCED") {
      setBurst(true);
      window.setTimeout(() => setBurst(false), durationMs("pressSettle"));
    }
    onSelect(origin.current);
  }

  return (
    <button
      type="button"
      data-cursor="quiz"
      data-held={selected}
      data-burst={burst}
      className={`option-liquid flex min-h-11 w-full items-baseline justify-between py-4 text-left ${selected ? "text-forest" : ""}`}
      onPointerDown={(event) => {
        capture(event);
        selectedByHold.current = false;
        if (mode === "REDUCED") return;
        window.clearTimeout(hold.current);
        hold.current = window.setTimeout(() => {
          selectedByHold.current = true;
          fire();
        }, durationMs("standard"));
      }}
      onPointerUp={() => window.clearTimeout(hold.current)}
      onPointerLeave={() => window.clearTimeout(hold.current)}
      onKeyDown={(event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.currentTarget.style.setProperty("--ox", "12%");
        event.currentTarget.style.setProperty("--oy", "50%");
        origin.current = { x: 28, y: 48 };
      }}
      onClick={() => {
        if (selectedByHold.current) return;
        fire();
      }}
    >
      <span className={`display option-word ${displayClassName}`}>{label}</span>
      <span className="label option-affordance">{selected ? selectedWord : "Click or hold"}</span>
    </button>
  );
}
