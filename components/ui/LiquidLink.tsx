"use client";

import type { KeyboardEvent, MouseEvent, PointerEvent, ReactNode } from "react";
import Link from "next/link";
import type { LiquidPersonality } from "@/lib/motion/personalities";
import { useLiquidTransition } from "@/components/motion/LiquidTransition";
import { transitionKind } from "@/lib/motion/transitions";
import { usePathname } from "next/navigation";
import { LIQUID_PERSONALITIES } from "@/lib/motion/personalities";
import { durationCss } from "@/lib/motion/tokens";
import { useClickPress } from "@/lib/motion/useClickPress";
import { Ripple } from "@/components/motion/Ripple";

export function LiquidLink({
  href,
  children,
  className = "",
  liquid = "oil",
}: {
  href: string;
  children: ReactNode;
  className?: string;
  liquid?: LiquidPersonality;
}) {
  const { go } = useLiquidTransition();
  const pathname = usePathname() ?? "/";
  const press = useClickPress<HTMLAnchorElement>();
  const fillMs = LIQUID_PERSONALITIES[liquid].fillMs;

  function navigate() {
    const kind = transitionKind(pathname, href);
    go(href, kind === "none" ? (liquid === "water" ? "water" : "oil") : kind);
  }

  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    navigate();
  }

  function onPointerDown(event: PointerEvent<HTMLAnchorElement>) {
    press.fromPointer(event, true);
  }

  function onPointerMove(event: PointerEvent<HTMLAnchorElement>) {
    if (event.pointerType === "touch") return;
    press.trackPointer(event);
    if (!press.pressed) press.magnet(event);
  }

  function onKeyDown(event: KeyboardEvent<HTMLAnchorElement>) {
    if (!press.fromKeyboard(event)) return;
    if (event.key === " ") event.preventDefault();
  }

  return (
    <Link
      ref={press.ref}
      href={href}
      onClick={onClick}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={() => press.up()}
      onPointerLeave={() => {
        press.up();
        press.clearMagnet();
      }}
      onKeyDown={onKeyDown}
      onKeyUp={(event) => {
        if (event.key === "Enter" || event.key === " ") press.up();
      }}
      className={`liquid-button inline-flex items-center justify-center no-underline ${className}`}
      data-liquid={liquid}
      data-cursor="link"
      data-pressed={press.pressed}
      style={{
        ["--fill-ms" as string]: `${fillMs}ms`,
        transition: `transform ${durationCss("pressSettle")} var(--ease-overshoot)`,
      }}
    >
      {press.ripple ? <Ripple x={press.ripple.x} y={press.ripple.y} personality={liquid} origin="pointer" /> : null}
      <span className="relative z-[1]">{children}</span>
    </Link>
  );
}
