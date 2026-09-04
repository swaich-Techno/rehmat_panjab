"use client";

import type { MouseEvent, ReactNode } from "react";
import Link from "next/link";
import type { LiquidPersonality } from "@/lib/motion/personalities";
import { useLiquidTransition } from "@/components/motion/LiquidTransition";
import { transitionKind } from "@/lib/motion/transitions";
import { usePathname } from "next/navigation";

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

  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    const kind = transitionKind(pathname, href);
    go(href, kind === "none" ? (liquid === "water" ? "water" : "oil") : kind);
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`liquid-button inline-flex items-center justify-center no-underline ${className}`}
      data-liquid={liquid}
      data-cursor="link"
    >
      {children}
    </Link>
  );
}
