import Link from "next/link";
import type { ReactNode } from "react";

export function LiquidLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} className={`liquid-button inline-flex items-center justify-center no-underline ${className}`}>
      {children}
    </Link>
  );
}
