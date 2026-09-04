"use client";

import { useState } from "react";
import { Emblem } from "@/components/brand/Emblem";
import { LiquidLink } from "@/components/ui/LiquidLink";
import { Droplet } from "@/components/motion/Droplet";
import { Ripple } from "@/components/motion/Ripple";
import { durationCss } from "@/lib/motion/tokens";

export function ConfirmationCeremony({
  requestId,
}: {
  requestId: string;
}) {
  const [mark, setMark] = useState(false);

  return (
    <section className="relative min-h-[86svh] overflow-hidden bg-ivory py-20">
      <div className="mx-auto flex max-w-2xl flex-col items-center px-6 text-center">
        <div className="relative mt-6 flex h-48 w-48 items-center justify-center">
          <Droplet onSettled={() => setMark(true)} />
          {mark ? <Ripple personality="water" className="absolute left-1/2 top-1/2" /> : null}
          <span
            className="absolute inset-12 flex items-center justify-center"
            style={{
              animation: mark ? `confirmation-mark ${durationCss("editorial")} var(--ease-weighted) both` : undefined,
              opacity: mark ? 1 : 0,
            }}
          >
            <Emblem className="h-16 w-16 text-forest" />
          </span>
        </div>
        <p className="label mt-10 text-forest">Request received</p>
        <h1 className="display mt-4 text-5xl md:text-7xl">Your Rehmat is on its way to being confirmed</h1>
        <p className="mt-6 max-w-md text-base leading-8 text-ink/75">
          This is not a paid order. The house has the request. Someone will confirm availability and price before anything is charged.
        </p>
        <p className="display mt-8 text-3xl tracking-[0.14em]">#{requestId}</p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <LiquidLink href="/collection">Continue exploring</LiquidLink>
        </div>
      </div>
    </section>
  );
}
