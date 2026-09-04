"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HOUSE } from "@/data/fragrance-config";
import { Emblem } from "@/components/brand/Emblem";

export function SiteFooter() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="mt-20 border-t border-ink/10 bg-paper">
      <div className="site-grid py-16">
        <div className="col-span-12 md:col-span-5">
          <p className="label text-forest">The house</p>
          <p className="display mt-4 max-w-sm text-5xl text-ink">{HOUSE.wornLine}<br />{HOUSE.wornLineSecond}</p>
        </div>
        <div className="col-span-6 mt-10 md:col-span-3 md:mt-0 md:col-start-8">
          <p className="label mb-4">Visit</p>
          <ul className="space-y-2 text-sm leading-7">
            <li><Link href="/collection">Collection</Link></li>
            <li><Link href="/find-your-scent">Fragrance finder</Link></li>
            <li><Link href="/next-drop">Next Rehmat</Link></li>
            <li><Link href="/cart">Cart</Link></li>
          </ul>
        </div>
        <div className="col-span-6 mt-10 md:col-span-2 md:mt-0">
          <p className="label mb-4">House</p>
          <ul className="space-y-2 text-sm leading-7">
            <li><Link href="/account">Account</Link></li>
            <li><Link href="/auth/login">Private house</Link></li>
            <li><Link href="/checkout">Checkout</Link></li>
          </ul>
        </div>
        <div className="col-span-12 mt-16 flex items-end justify-between border-t border-ink/10 pt-6">
          <Emblem className="h-10 w-10 text-forest" />
          <p className="label text-ink/50">© {new Date().getFullYear()} {HOUSE.legalName}</p>
        </div>
      </div>
    </footer>
  );
}
