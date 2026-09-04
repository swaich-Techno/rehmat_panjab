"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Wordmark } from "@/components/brand/Wordmark";
import { useCart } from "@/components/commerce/CartProvider";
import { LiquidNav } from "@/components/motion/LiquidNav";
import { PRIMARY_NAV } from "@/lib/nav";
import { durationCss, durationMs } from "@/lib/motion/tokens";
import { useMotionMode } from "@/lib/motion/useMotionMode";

export function SiteHeader() {
  const pathname = usePathname();
  const { itemCount, openCart } = useCart();
  const [open, setOpen] = useState(false);
  const [rendered, setRendered] = useState(false);
  const mode = useMotionMode();
  const hide = pathname?.startsWith("/admin");
  if (hide) return null;

  const nav = PRIMARY_NAV.map((item) => ({ href: item.href, label: item.label }));

  function toggle() {
    if (open) {
      setOpen(false);
      window.setTimeout(() => setRendered(false), durationMs("navExpand"));
      return;
    }
    setRendered(true);
    window.requestAnimationFrame(() => setOpen(true));
  }

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
          <Link href="/account" className="label hidden no-underline text-ink/70 md:inline" data-cursor="vault">
            Account
          </Link>
          <button type="button" className="label touch-target text-ink" data-cart-target="desktop" onClick={openCart}>
            Cart {itemCount > 0 ? itemCount.toString().padStart(2, "0") : "00"}
          </button>
          <button
            type="button"
            className="label touch-target md:hidden"
            onClick={toggle}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>
      {rendered ? <MobileFilm open={open} nav={nav} onClose={toggle} reduced={mode === "REDUCED"} /> : null}
    </header>
  );
}

function MobileFilm({
  open,
  nav,
  onClose,
  reduced,
}: {
  open: boolean;
  nav: { href: string; label: string }[];
  onClose: () => void;
  reduced: boolean;
}) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setEntered(open));
    return () => cancelAnimationFrame(id);
  }, [open]);

  return (
    <div
      id="mobile-nav"
      className={`mobile-liquid-nav flex flex-col md:hidden ${entered ? "is-open" : "is-closing"}`}
      style={{
        paddingTop: "calc(var(--safe-top) + 1.5rem)",
        paddingBottom: "calc(var(--safe-bottom) + 1.5rem)",
        transition: reduced
          ? "none"
          : `clip-path ${durationCss("navExpand")} var(--ease-liquidEase), opacity ${durationCss("fast")} var(--ease-weighted)`,
      }}
    >
      <div className="flex items-center justify-between px-6">
        <Wordmark size="sm" />
        <button type="button" className="label touch-target" onClick={onClose}>
          Close
        </button>
      </div>
      <nav className="mt-10 flex flex-1 flex-col justify-center px-6" aria-label="Mobile">
        {nav.map((item, index) => (
          <Link
            key={item.href}
            href={item.href}
            className="display block border-t border-ivory/15 py-5 text-5xl no-underline"
            style={{
              transition: `opacity ${durationCss("standard")} var(--ease-editorialEase), transform ${durationCss("standard")} var(--ease-liquidEase)`,
              transitionDelay: entered ? `${80 + index * 70}ms` : "0ms",
              opacity: entered ? 1 : 0,
              transform: entered ? "none" : "translate3d(0, 12px, 0)",
            }}
            onClick={onClose}
          >
            {item.label}
          </Link>
        ))}
        <Link href="/account" className="label mt-8" data-cursor="vault" onClick={onClose}>
          Account
        </Link>
      </nav>
    </div>
  );
}
