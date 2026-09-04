"use client";

import Link from "next/link";
import { Emblem } from "@/components/brand/Emblem";
import { LiquidLink } from "@/components/ui/LiquidLink";

export function ConfirmationCeremony({
  requestId,
}: {
  requestId: string;
}) {
  return (
    <section className="relative min-h-[86svh] overflow-hidden bg-ivory py-20">
      <div className="pointer-events-none absolute left-1/2 top-16 h-3 w-3 -translate-x-1/2 rounded-full bg-amber animation-[drop_900ms_cubic-bezier(0.22,1,0.36,1)_both]" />
      <div className="mx-auto flex max-w-2xl flex-col items-center px-6 text-center">
        <div className="relative mt-10 flex h-40 w-40 items-center justify-center">
          <span className="absolute inset-0 rounded-full border border-sand/70" />
          <span className="absolute inset-4 rounded-full border border-amber/40" />
          <Emblem className="h-16 w-16 text-forest" />
        </div>
        <p className="label mt-10 text-forest">Request received</p>
        <h1 className="display mt-4 text-5xl md:text-7xl">Your Rehmat is on its way to being confirmed</h1>
        <p className="mt-6 max-w-md text-base leading-8 text-ink/75">
          This is not a paid order. The house has the request. Someone will confirm availability and price before anything is charged.
        </p>
        <p className="display mt-8 text-3xl tracking-[0.14em]">#{requestId}</p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <LiquidLink href={`/order/${requestId}`}>View request</LiquidLink>
          <Link href="/collection" className="label self-center">
            Continue exploring
          </Link>
        </div>
      </div>
    </section>
  );
}
