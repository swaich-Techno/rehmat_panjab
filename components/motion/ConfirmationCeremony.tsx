"use client";

import { useState } from "react";
import { Emblem } from "@/components/brand/Emblem";
import { LiquidLink } from "@/components/ui/LiquidLink";
import { Droplet } from "@/components/motion/Droplet";
import { Ripple } from "@/components/motion/Ripple";
import { durationCss, durationMs } from "@/lib/motion/tokens";
import { useMotionMode } from "@/lib/motion/useMotionMode";

export function ConfirmationCeremony({
  requestId,
}: {
  requestId: string;
}) {
  const [mark, setMark] = useState(false);
  const [parcel, setParcel] = useState(false);
  const mode = useMotionMode();

  return (
    <section className="relative min-h-[72svh] overflow-hidden bg-ivory section-pad">
      <div className="mx-auto flex max-w-2xl flex-col px-6">
        <div className="relative mt-4 flex h-48 w-48">
          <Droplet
            onSettled={() => {
              setMark(true);
              window.setTimeout(() => setParcel(true), mode === "REDUCED" ? 80 : durationMs("editorial"));
            }}
          />
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
          {parcel ? (
            <span
              className="absolute inset-x-8 bottom-0 h-16 border border-ink/30 bg-paper"
              style={{ animation: `confirmation-mark ${durationCss("standard")} var(--ease-editorialEase) both` }}
              aria-hidden="true"
            />
          ) : null}
        </div>
        <p className="label mt-8 text-forest">Request received</p>
        <h1 className="display headline-gap text-5xl md:text-7xl">Your Rehmat is on its way to being confirmed</h1>
        <p className="copy-gap max-w-md text-base leading-7 text-ink/75">
          This is not a paid order. The house has the request. Someone will confirm availability and price before anything is charged.
        </p>
        <p className="display mt-6 text-3xl tracking-[0.14em]">#{requestId}</p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <LiquidLink href="/collection">Continue exploring</LiquidLink>
        </div>
      </div>
    </section>
  );
}
