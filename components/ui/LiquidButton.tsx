"use client";

import { useRef, useState, type ButtonHTMLAttributes, type PointerEvent } from "react";
import { Ripple } from "@/components/motion/Ripple";
import { LIQUID_PERSONALITIES, type LiquidPersonality } from "@/lib/motion/personalities";
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
  const fillMs = LIQUID_PERSONALITIES[liquid].fillMs;

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
    if (!node || mode !== "FULL" || success || loading) return;
    const rect = node.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    const mx = Math.max(-8, Math.min(8, dx * 0.18));
    const my = Math.max(-6, Math.min(6, dy * 0.18));
    node.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
  }

  function handleMove(event: PointerEvent<HTMLButtonElement>) {
    if (event.pointerType === "touch") return;
    setFill(event);
    magnet(event);
    onPointerMove?.(event);
  }

  function handleDown(event: PointerEvent<HTMLButtonElement>) {
    setFill(event);
    const node = ref.current;
    if (node && mode !== "REDUCED") {
      node.style.transform = "scale(0.96, 0.9)";
    }
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
      onPointerUp={() => {
        const node = ref.current;
        if (node && !success) node.style.transform = "";
      }}
      onClick={onClick}
      style={{
        transition: `transform ${durationCss("micro")} var(--ease-snapEase)`,
        ["--fill-ms" as string]: `${fillMs}ms`,
      }}
    >
      {ripple ? <Ripple x={ripple.x} y={ripple.y} personality={liquid} origin="pointer" /> : null}
      <span className="relative z-[1]">{label}</span>
    </button>
  );
}
