"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Wordmark } from "@/components/brand/Wordmark";
import { useCart } from "@/components/commerce/CartProvider";
import { LiquidNav } from "@/components/motion/LiquidNav";
import { PRIMARY_NAV } from "@/lib/nav";
import { durationCss } from "@/lib/motion/tokens";

export function SiteHeader() {
  const pathname = usePathname();
  const { itemCount, openCart } = useCart();
  const [open, setOpen] = useState(false);
  const hide = pathname?.startsWith("/admin");
  if (hide) return null;

  const nav = PRIMARY_NAV.map((item) => ({ href: item.href, label: item.label }));

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-cream" style={{ paddingTop: "var(--safe-top)" }}>
      <div className="site-grid items-center py-3 md:py-4">
        <div className="col-span-6 md:col-span-3">
          <Wordmark size="sm" />
        </div>
        <div className="col-span-12 hidden md:col-span-6 md:flex md:justify-center">
          <LiquidNav items={nav} />
        </div>
        <div className="col-span-6 flex items-center justify-end gap-4 md:col-span-3">
          <Link href="/account" className="label hidden no-underline text-ink/70 md:inline">
            Account
          </Link>
          <button type="button" className="label touch-target text-ink" data-cart-target="desktop" onClick={openCart}>
            Cart {itemCount > 0 ? itemCount.toString().padStart(2, "0") : "00"}
          </button>
          <button
            type="button"
            className="label touch-target md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>
      {open ? (
        <div
          id="mobile-nav"
          className="fixed inset-0 z-50 flex flex-col bg-forest text-ivory md:hidden"
          style={{
            paddingTop: "calc(var(--safe-top) + 1.5rem)",
            paddingBottom: "calc(var(--safe-bottom) + 1.5rem)",
            transitionDuration: durationCss("editorial"),
          }}
        >
          <div className="flex items-center justify-between px-6">
            <Wordmark size="sm" />
            <button type="button" className="label touch-target" onClick={() => setOpen(false)}>
              Close
            </button>
          </div>
          <nav className="mt-10 flex flex-1 flex-col justify-center px-6" aria-label="Mobile">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="display block border-t border-ivory/15 py-5 text-5xl no-underline"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/account" className="label mt-8" onClick={() => setOpen(false)}>
              Account
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
