"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Wordmark } from "@/components/brand/Wordmark";
import { useCart } from "@/components/commerce/CartProvider";

const NAV = [
  { href: "/collection", label: "Collection" },
  { href: "/find-your-scent", label: "Find your scent" },
  { href: "/next-drop", label: "Next Rehmat" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { itemCount, openCart } = useCart();
  const [open, setOpen] = useState(false);
  const hide = pathname?.startsWith("/admin");
  if (hide) return null;

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-cream/90 backdrop-blur-[2px]">
      <div className="site-grid items-center py-3 md:py-4">
        <div className="col-span-6 md:col-span-3">
          <Wordmark size="sm" />
        </div>
        <nav className="col-span-12 hidden items-end gap-8 md:col-span-6 md:flex md:justify-center">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`label no-underline ${pathname === item.href ? "text-forest" : "text-ink/70"}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="col-span-6 flex items-center justify-end gap-4 md:col-span-3">
          <Link href="/auth/login" className="label hidden no-underline text-ink/70 md:inline">
            Private house
          </Link>
          <button type="button" className="label text-ink" onClick={openCart}>
            Cart {itemCount > 0 ? itemCount.toString().padStart(2, "0") : "00"}
          </button>
          <button
            type="button"
            className="label md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
          >
            Menu
          </button>
        </div>
        {open ? (
          <div className="col-span-12 mt-3 flex flex-col gap-3 border-t border-ink/10 pt-3 md:hidden">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="display text-4xl no-underline" onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
            <Link href="/auth/login" className="label" onClick={() => setOpen(false)}>
              Private house
            </Link>
          </div>
        ) : null}
      </div>
    </header>
  );
}
