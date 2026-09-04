"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { HOUSE } from "@/data/fragrance-config";
import { OilLayer } from "@/components/motion/OilLayer";
import { track } from "@/lib/analytics/index";

const NOTES = ["MUSK", "OUD", "AMBER", "ROSE", "WOODS", "SAFFRON", "VANILLA"];

export function HeroSequence() {
  useEffect(() => {
    track({ name: "hero_view", path: "/" });
  }, []);

  return (
    <div>
      <section className="relative min-h-[100svh] overflow-hidden atmosphere-monsoon text-ivory">
        <div className="haze absolute -left-20 top-10 h-72 w-72" />
        <div className="haze absolute right-0 bottom-10 h-80 w-80 opacity-70" />
        <div className="veil absolute inset-0" />
        <div className="site-grid relative min-h-[100svh] items-end pb-16 pt-24">
          <p className="col-span-12 label md:col-span-4">Scene 01 — arrival</p>
          <div className="col-span-12 md:col-span-8 md:col-start-1">
            <p className="label text-sand">Perfume oil</p>
            <h1 className="display mt-3 text-[18vw] leading-[0.8] md:text-[9.5rem]">
              Rehmat
              <span className="block translate-x-[8vw] md:translate-x-24">Panjab</span>
            </h1>
          </div>
          <div className="col-span-8 mt-10 md:col-span-3 md:col-start-10 md:mt-0">
            <div className="relative mx-auto h-72 w-28 md:h-96 md:w-32">
              <Image
                src="/images/placeholders/bottle-01.svg"
                alt="Placeholder bottle silhouette for Musk Rizali"
                fill
                priority
                className="object-contain"
              />
            </div>
            <p className="mt-6 max-w-[14rem] text-sm leading-6 text-ivory/80">
              A veil, then the glass. No announcement. Just the oil waiting on skin.
            </p>
          </div>
        </div>
      </section>

      <section className="relative min-h-[80svh] overflow-hidden bg-charcoal">
        <OilLayer className="absolute inset-0" />
        <div className="site-grid relative py-28 text-ivory">
          <p className="col-span-12 label text-sand md:col-span-3">Scene 02 — liquid</p>
          <div className="col-span-12 md:col-span-7 md:col-start-5">
            <h2 className="display text-6xl md:text-8xl">
              Oil,
              <br />
              not water.
            </h2>
            <p className="mt-8 max-w-md text-base leading-8 text-ivory/75">
              It moves slower than a splash. Scroll and the layer thickens — perfume oil catching light, not a fountain.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-cream py-24 md:py-36">
        <div className="site-grid">
          <p className="col-span-12 label text-forest">Scene 03 — notes</p>
          <div className="col-span-12 mt-8 space-y-2 md:space-y-0">
            {NOTES.map((note, index) => (
              <p
                key={note}
                className="display text-[14vw] leading-[0.82] text-ink md:text-[7.6rem]"
                style={{ marginLeft: `${(index % 4) * 6}%` }}
              >
                {note}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="atmosphere-amber py-24 md:py-32">
        <div className="site-grid items-center">
          <p className="col-span-12 label">Scene 04 — the first oil</p>
          <div className="col-span-12 mt-8 md:col-span-5">
            <p className="label text-wine">01</p>
            <h2 className="display mt-2 text-6xl md:text-8xl">Musk Rizali</h2>
            <p className="mt-6 max-w-sm text-base leading-8">{HOUSE.oilLine}</p>
            <Link href="/product/musk-rizali" className="label mt-8 inline-block">
              Open the oil
            </Link>
          </div>
          <div className="col-span-12 mt-12 md:col-span-6 md:col-start-7 md:mt-0">
            <BottleStage />
          </div>
        </div>
      </section>

      <section className="bg-ink py-32 text-cream">
        <div className="site-grid">
          <p className="col-span-12 label text-sand">Scene 05</p>
          <h2 className="col-span-12 display mt-6 text-[12vw] leading-[0.85] md:col-span-10 md:text-[8rem]">
            {HOUSE.wornLine}
            <span className="mt-4 block text-sand">{HOUSE.wornLineSecond}</span>
          </h2>
        </div>
      </section>
    </div>
  );
}

function BottleStage() {
  return (
    <div
      className="relative mx-auto h-[420px] w-full max-w-md"
      onPointerMove={(event) => {
        const node = event.currentTarget;
        const rect = node.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        node.style.setProperty("--tilt", `${x * 10}deg`);
      }}
    >
      <div className="absolute inset-8 bg-ivory/40" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="relative h-80 w-28 transition-transform duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ transform: "rotateY(var(--tilt, 0deg))" }}
        >
          <Image src="/images/placeholders/bottle-01.svg" alt="Placeholder Musk Rizali bottle" fill className="object-contain" />
        </div>
      </div>
    </div>
  );
}
