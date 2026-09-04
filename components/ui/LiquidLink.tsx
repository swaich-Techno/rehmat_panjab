import Link from "next/link";
import type { ReactNode } from "react";
import type { LiquidPersonality } from "@/lib/motion/personalities";

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
  return (
    <Link
      href={href}
      className={`liquid-button inline-flex items-center justify-center no-underline ${className}`}
      data-liquid={liquid}
      data-cursor="link"
    >
      {children}
    </Link>
  );
}
