"use client";

import type { ButtonHTMLAttributes, KeyboardEvent, PointerEvent } from "react";
import { Ripple } from "@/components/motion/Ripple";
import { LIQUID_PERSONALITIES, type LiquidPersonality } from "@/lib/motion/personalities";
import { durationCss } from "@/lib/motion/tokens";
import { useClickPress } from "@/lib/motion/useClickPress";

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
  idle: "Request",
  preparing: "Preparing",
  ready: "Request sent",
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
  onPointerUp,
  onKeyDown,
  onKeyUp,
  onClick,
  ...props
}: Props) {
  const { ref, pressed, ripple, fromPointer, trackPointer, magnet, clearMagnet, up, fromKeyboard } =
    useClickPress<HTMLButtonElement>();
  const fillMs = LIQUID_PERSONALITIES[liquid].fillMs;
  const busy = success || loading || phase === "preparing" || phase === "ready";

  function handleMove(event: PointerEvent<HTMLButtonElement>) {
    if (event.pointerType === "touch") return;
    trackPointer(event);
    if (!busy && !pressed) magnet(event);
    onPointerMove?.(event);
  }

  function handleDown(event: PointerEvent<HTMLButtonElement>) {
    fromPointer(event, true);
    onPointerDown?.(event);
  }

  function handleUp(event: PointerEvent<HTMLButtonElement>) {
    up();
    onPointerUp?.(event);
  }

  function handleLeave(event: PointerEvent<HTMLButtonElement>) {
    up();
    clearMagnet();
    onPointerLeave?.(event);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    fromKeyboard(event);
    onKeyDown?.(event);
  }

  function handleKeyUp(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Enter" || event.key === " ") up();
    onKeyUp?.(event);
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
      data-pressed={pressed}
      data-phase={orderFlow ? phase : undefined}
      data-cursor={cursorAttr}
      disabled={disabled || loading}
      onPointerMove={handleMove}
      onPointerDown={handleDown}
      onPointerUp={handleUp}
      onPointerLeave={handleLeave}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onClick={onClick}
      style={{
        ["--fill-ms" as string]: `${fillMs}ms`,
        transition: `transform ${durationCss("pressSettle")} var(--ease-overshoot)`,
      }}
    >
      {ripple ? <Ripple x={ripple.x} y={ripple.y} personality={liquid} origin="pointer" /> : null}
      <span className="relative z-[1]">{label}</span>
    </button>
  );
}
