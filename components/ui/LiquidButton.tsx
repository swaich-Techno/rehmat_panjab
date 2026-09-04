"use client";

import { useRef, useState, type ButtonHTMLAttributes, type PointerEvent } from "react";
import { Ripple } from "@/components/motion/Ripple";
import type { LiquidPersonality } from "@/lib/motion/personalities";
import { durationCss, durationMs } from "@/lib/motion/tokens";
import { useMotionMode } from "@/lib/motion/useMotionMode";

export type OrderPhase = "idle" | "preparing" | "ready";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  success?: boolean;
  loading?: boolean;
  liquid?: LiquidPersonality;
  orderFlow?: boolean;
  phase?: OrderPhase;
  cursor?: "add" | "buy" | "vault" | "link";
};

const ORDER_LABEL: Record<OrderPhase, string> = {
  idle: "Order now",
  preparing: "Preparing",
  ready: "Order ready",
};

export function LiquidButton({
  children,
  className = "",
  success = false,
  loading = false,
  disabled,
  liquid = "oil",
  orderFlow = false,
  phase = "idle",
  cursor,
  onPointerMove,
  onPointerDown,
  onPointerLeave,
  onClick,
  ...props
}: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const mode = useMotionMode();
  const [ripple, setRipple] = useState<{ x: number; y: number; id: number } | null>(null);

  function setFill(event: PointerEvent<HTMLButtonElement>) {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    node.style.setProperty("--px", `${x}%`);
    node.style.setProperty("--py", `${y}%`);
  }

  function magnet(event: PointerEvent<HTMLButtonElement>) {
    const node = ref.current;
    if (!node || mode !== "FULL") return;
    const rect = node.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    const dist = Math.hypot(dx, dy) || 1;
    const pull = Math.min(8, 4 + dist * 0.02);
    node.style.transform = `translate3d(${(dx / dist) * pull}px, ${(dy / dist) * pull}px, 0)`;
  }

  function handleMove(event: PointerEvent<HTMLButtonElement>) {
    if (event.pointerType === "touch") return;
    setFill(event);
    magnet(event);
    onPointerMove?.(event);
  }

  function handleDown(event: PointerEvent<HTMLButtonElement>) {
    setFill(event);
    if (event.pointerType === "touch") {
      const rect = event.currentTarget.getBoundingClientRect();
      setRipple({
        x: ((event.clientX - rect.left) / rect.width) * 100,
        y: ((event.clientY - rect.top) / rect.height) * 100,
        id: Date.now(),
      });
      window.setTimeout(() => setRipple(null), durationMs("ripple"));
    }
    onPointerDown?.(event);
  }

  function handleLeave(event: PointerEvent<HTMLButtonElement>) {
    const node = ref.current;
    if (node) node.style.transform = "";
    onPointerLeave?.(event);
  }

  const label = orderFlow ? ORDER_LABEL[phase] : loading ? "Please wait" : children;
  const cursorAttr = cursor ?? (liquid === "oil" ? "buy" : undefined);

  return (
    <button
      {...props}
      ref={ref}
      type={props.type ?? "button"}
      className={`liquid-button ${className}`}
      data-liquid={liquid}
      data-success={success || phase === "ready"}
      data-loading={loading || phase === "preparing"}
      data-phase={orderFlow ? phase : undefined}
      data-cursor={cursorAttr}
      disabled={disabled || loading}
      onPointerMove={handleMove}
      onPointerDown={handleDown}
      onPointerLeave={handleLeave}
      onClick={onClick}
      style={{ transition: `transform ${durationCss("micro")} var(--ease-snapEase)` }}
    >
      {ripple ? <Ripple x={ripple.x} y={ripple.y} personality={liquid} origin="pointer" /> : null}
      <span className="relative z-[1]">{label}</span>
    </button>
  );
}
