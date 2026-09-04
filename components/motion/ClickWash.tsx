"use client";

import {
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLiquidTransition } from "@/components/motion/LiquidTransition";
import { transitionKind } from "@/lib/motion/transitions";
import { durationMs } from "@/lib/motion/tokens";
import { pointerPercent } from "@/lib/motion/press";
import { useMotionMode } from "@/lib/motion/useMotionMode";

type CardProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

function navigateDelay(mode: ReturnType<typeof useMotionMode>): number {
  if (mode === "REDUCED") return 0;
  return Math.round(durationMs("standard") * 0.55);
}

/**
 * Product/card click: oil wash opens from the pointer, then the route plays.
 * 400–600ms wash uses the standard token (480ms).
 */
export function ClickWashCard({ href, children, className = "" }: CardProps) {
  const { go } = useLiquidTransition();
  const pathname = usePathname() ?? "/";
  const mode = useMotionMode();
  const ref = useRef<HTMLElement>(null);
  const [washing, setWashing] = useState(false);
  const locked = useRef(false);

  function play(event: MouseEvent<HTMLElement>) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    if ((event.target as HTMLElement).closest("button, .liquid-button")) return;
    event.preventDefault();
    event.stopPropagation();
    if (locked.current) return;
    locked.current = true;
    const kind = transitionKind(pathname, href);
    const next = kind === "none" ? "water" : kind;
    if (mode === "REDUCED") {
      go(href, "none");
      return;
    }
    const node = ref.current;
    if (node) {
      const origin = pointerPercent(event.clientX, event.clientY, node.getBoundingClientRect());
      node.style.setProperty("--ox", `${origin.x}%`);
      node.style.setProperty("--oy", `${origin.y}%`);
    }
    setWashing(true);
    window.setTimeout(() => go(href, next), navigateDelay(mode));
  }

  return (
    <article
      ref={ref}
      className={`click-wash-card ${washing ? "is-washing" : ""} ${className}`}
      data-cursor="product"
      onClickCapture={play}
    >
      {children}
    </article>
  );
}

type LinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

export function ClickWashLink({ href, children, className = "" }: LinkProps) {
  const { go } = useLiquidTransition();
  const pathname = usePathname() ?? "/";
  const mode = useMotionMode();
  const ref = useRef<HTMLAnchorElement>(null);
  const [washing, setWashing] = useState(false);
  const [pressed, setPressed] = useState(false);

  function commit(clientX: number, clientY: number) {
    if (washing) return;
    const kind = transitionKind(pathname, href);
    const next = kind === "none" ? "water" : kind;
    if (mode === "REDUCED") {
      go(href, "none");
      return;
    }
    const node = ref.current;
    if (node) {
      const origin = pointerPercent(clientX, clientY, node.getBoundingClientRect());
      node.style.setProperty("--ox", `${origin.x}%`);
      node.style.setProperty("--oy", `${origin.y}%`);
      node.style.setProperty("--px", `${origin.x}%`);
      node.style.setProperty("--py", `${origin.y}%`);
    }
    setWashing(true);
    window.setTimeout(() => go(href, next), navigateDelay(mode));
  }

  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    commit(event.clientX, event.clientY);
  }

  function onKeyDown(event: KeyboardEvent<HTMLAnchorElement>) {
    if (event.key !== "Enter" && event.key !== " ") return;
    if (event.key === " ") event.preventDefault();
    setPressed(true);
    const node = ref.current;
    if (node) {
      const rect = node.getBoundingClientRect();
      commit(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }
  }

  return (
    <Link
      ref={ref}
      href={href}
      className={`click-wash-link ${className}`}
      data-cursor="link"
      data-pressed={pressed || washing}
      data-washing={washing}
      onClick={onClick}
      onPointerDown={(event) => {
        if (mode === "REDUCED") return;
        setPressed(true);
        const origin = pointerPercent(event.clientX, event.clientY, event.currentTarget.getBoundingClientRect());
        event.currentTarget.style.setProperty("--px", `${origin.x}%`);
        event.currentTarget.style.setProperty("--py", `${origin.y}%`);
      }}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      onKeyDown={onKeyDown}
      onKeyUp={() => setPressed(false)}
    >
      {children}
    </Link>
  );
}
