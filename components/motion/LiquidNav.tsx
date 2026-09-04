"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef, useState, type PointerEvent } from "react";
import { MOTION_DURATION_MS, MOTION_EASE_CSS } from "@/lib/motion/tokens";
import { LIQUID_PERSONALITIES } from "@/lib/motion/personalities";
import { useMotionMode } from "@/lib/motion/useMotionMode";
import { useLiquidTransition } from "@/components/motion/LiquidTransition";
import { transitionKind } from "@/lib/motion/transitions";

export type NavItem = { href: string; label: string };

const IDLE_PATH =
  "M12 22 C18 10 28 8 40 14 C58 24 62 8 80 14 C94 19 96 32 88 40 C74 54 48 52 32 46 C18 41 8 34 12 22 Z";

function blobPath(stretch: number, compress: number, overshoot: number): string {
  const s = stretch;
  const c = compress;
  const o = overshoot;
  return `M${10 * c} ${22 * c} C${18 * s} ${10 / o} ${28 * s} ${8 * c} ${40 * o} ${14 * c} C${58 * s} ${24 / o} ${62 * s} ${8 * c} ${80 * o} ${14} C${94 * s} ${19} ${98 * o} ${32 * c} ${88 * s} ${40 * o} C${74} ${54 * s} ${48 * c} ${52 * o} ${32 * c} ${46} C${18 * c} ${41} ${6 * c} ${34 * s} ${10 * c} ${22 * c} Z`;
}

export function LiquidNav({ items, onNavigate }: { items: NavItem[]; onNavigate?: () => void }) {
  const pathname = usePathname();
  const mode = useMotionMode();
  const { go } = useLiquidTransition();
  const listRef = useRef<HTMLUListElement>(null);
  const [blob, setBlob] = useState({ x: 0, width: 0, path: IDLE_PATH, visible: false });

  function place(index: number, morph: "idle" | "stretch" | "settle") {
    const list = listRef.current;
    if (!list) return;
    const item = list.children[index] as HTMLElement | undefined;
    if (!item) return;
    const parent = list.getBoundingClientRect();
    const rect = item.getBoundingClientRect();
    const personality = LIQUID_PERSONALITIES.water;
    let path = IDLE_PATH;
    if (morph === "stretch") path = blobPath(personality.stretch, personality.compress, personality.overshoot);
    if (morph === "settle") path = blobPath(1, 1, 1);
    setBlob({
      x: rect.left - parent.left + rect.width / 2 - 48,
      width: Math.max(96, rect.width + 24),
      path,
      visible: true,
    });
  }

  function magnet(event: PointerEvent<HTMLAnchorElement>) {
    if (mode !== "FULL") return;
    const node = event.currentTarget;
    const rect = node.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    node.style.transform = `translate3d(${Math.max(-8, Math.min(8, dx * 0.22))}px, ${Math.max(-5, Math.min(5, dy * 0.22))}px, 0)`;
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    node.style.setProperty("--nav-drop-x", `${Math.max(12, Math.min(88, x))}%`);
    node.style.setProperty("--nav-fill", `${Math.max(28, Math.min(100, 40 + Math.abs(dx)))}%`);
  }

  useLayoutEffect(() => {
    const frame = requestAnimationFrame(() => {
      const index = items.findIndex((item) => pathname === item.href || pathname?.startsWith(`${item.href}/`));
      if (index >= 0) place(index, "settle");
      else setBlob((current) => ({ ...current, visible: false }));
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, items]);

  return (
    <nav className="relative" aria-label="Primary">
      <svg
        className="pointer-events-none absolute -top-3 h-12 overflow-visible"
        width={blob.width || 96}
        height="48"
        viewBox="0 0 96 56"
        style={{
          left: blob.x,
          opacity: blob.visible && mode !== "REDUCED" ? 0.55 : 0,
          transition: `left ${MOTION_DURATION_MS.fast}ms ${MOTION_EASE_CSS.liquidEase}, width ${MOTION_DURATION_MS.fast}ms ${MOTION_EASE_CSS.liquidEase}, opacity ${MOTION_DURATION_MS.micro}ms ${MOTION_EASE_CSS.weighted}`,
        }}
        aria-hidden="true"
      >
        <path
          d={blob.path}
          style={{
            fill: "color-mix(in srgb, var(--sage) 72%, var(--mint))",
            transition: `d ${MOTION_DURATION_MS.morph}ms ${MOTION_EASE_CSS.liquidEase}`,
          }}
        />
      </svg>
      <ul ref={listRef} className="relative z-[1] flex items-end gap-8">
        {items.map((item, index) => {
          const active = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                data-cursor="link"
                data-active={active}
                className={`nav-link label no-underline ${active ? "text-forest" : "text-ink/70"}`}
                onPointerEnter={() => {
                  if (mode === "REDUCED") return;
                  place(index, "stretch");
                  window.setTimeout(() => place(index, "settle"), MOTION_DURATION_MS.fast);
                }}
                onPointerMove={magnet}
                onPointerLeave={(event) => {
                  event.currentTarget.style.transform = "";
                  event.currentTarget.style.setProperty("--nav-fill", active ? "100%" : "0%");
                  event.currentTarget.style.setProperty("--nav-drop-x", "50%");
                }}
                onFocus={() => place(index, "settle")}
                onClick={(event) => {
                  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
                    onNavigate?.();
                    return;
                  }
                  event.preventDefault();
                  const kind = transitionKind(pathname ?? "/", item.href);
                  go(item.href, kind === "none" ? "water" : kind);
                  onNavigate?.();
                }}
              >
                {item.label}
                <span className="nav-drop" aria-hidden="true" />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
