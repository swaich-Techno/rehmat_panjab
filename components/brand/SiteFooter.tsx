"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HOUSE } from "@/data/fragrance-config";
import { Emblem } from "@/components/brand/Emblem";
import { PRIMARY_NAV } from "@/lib/nav";
import { LiquidReveal } from "@/components/motion/LiquidReveal";

export function SiteFooter() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="border-t border-ink/10 bg-paper">
      <div className="site-grid section-pad-tight">
        <div className="col-span-12 md:col-span-5">
          <p className="label text-forest">The house</p>
          <p className="display headline-gap max-w-sm text-4xl text-ink md:text-5xl">
            {HOUSE.wornLine}
            <br />
            {HOUSE.wornLineSecond}
          </p>
        </div>
        <div className="col-span-6 mt-8 md:col-span-3 md:col-start-8 md:mt-0">
          <p className="label mb-3">Visit</p>
          <ul className="space-y-2 text-sm leading-7">
            {PRIMARY_NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} data-cursor="link">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/cart" data-cursor="link">
                Cart
              </Link>
            </li>
          </ul>
        </div>
        <div className="col-span-6 mt-8 md:col-span-2 md:mt-0">
          <p className="label mb-3">House</p>
          <ul className="space-y-2 text-sm leading-7">
            <li>
              <Link href="/account" data-cursor="vault">
                Account
              </Link>
            </li>
            <li>
              <Link href="/auth/login" data-cursor="vault">
                Private archive
              </Link>
            </li>
            <li>
              <Link href="/checkout" data-cursor="link">
                Checkout
              </Link>
            </li>
          </ul>
        </div>
        <LiquidReveal className="col-span-12 mt-10 overflow-hidden" as="div">
          <p className="footer-wordmark">REHMAT</p>
          <p className="footer-wordmark footer-reflect" aria-hidden="true">
            REHMAT
          </p>
        </LiquidReveal>
        <div className="col-span-12 mt-6 flex items-end justify-between border-t border-ink/10 pt-4">
          <Emblem className="h-10 w-10 text-forest" />
          <p className="label text-ink/50">
            © {new Date().getFullYear()} {HOUSE.legalName}
          </p>
        </div>
      </div>
    </footer>
  );
}
