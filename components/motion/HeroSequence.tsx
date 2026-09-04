"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HOUSE, PRODUCTS } from "@/data/fragrance-config";
import { HOMEPAGE_CMS } from "@/data/homepage-cms";
import { RefractionLayer } from "@/components/motion/RefractionLayer";
import { Droplet } from "@/components/motion/Droplet";
import { Ripple } from "@/components/motion/Ripple";
import { LiquidReveal } from "@/components/motion/LiquidReveal";
import { LiquidLink } from "@/components/ui/LiquidLink";
import { track } from "@/lib/analytics/index";

const NOTES = ["MUSK", "OUD", "ROSE", "AMBER", "WOODS", "SAFFRON", "VANILLA"];

export function HeroSequence() {
  const [ripple, setRipple] = useState(false);

  useEffect(() => {
    track({ name: "hero_view", path: "/" });
  }, []);

  const musk = PRODUCTS[0];
  const two = PRODUCTS[1];

  return (
    <div className="home-scenes">
      <section className="scene atmosphere-morning text-forest">
        <RefractionLayer intensity={1} />
        <div className="site-grid relative z-[1] min-h-[100dvh] items-end pb-16 pt-24">
          <p className="col-span-12 label md:col-span-4">{HOMEPAGE_CMS.heroKicker}</p>
          <div className="col-span-12 md:col-span-10">
            <h1 className="display mt-3 text-[clamp(3.2rem,11vw,9rem)] leading-[0.82] [filter:url(#rp-refract)]">
              Rehmat
              <span className="mt-2 block translate-x-[min(8vw,3rem)] text-ink">Panjab</span>
            </h1>
            <p className="label mt-8 max-w-sm text-ink/70">{HOMEPAGE_CMS.heroLine}</p>
          </div>
        </div>
      </section>

      <section className="scene bg-mint">
        <div className="relative flex min-h-[100dvh] flex-col items-center justify-center">
          <Droplet onSettled={() => setRipple(true)} />
          {ripple ? <Ripple personality="water" className="relative" /> : null}
          <p className="label mt-16 text-forest">A drop, then the oil</p>
        </div>
      </section>

      <section className="scene bg-cream">
        <div className="site-grid min-h-[100dvh] items-center py-16">
          <p className="col-span-12 label text-forest">The first glass</p>
          <div className="col-span-12 md:col-span-5">
            <p className="label text-wine">01</p>
            <h2 className="display mt-2 text-[clamp(2.8rem,8vw,6.5rem)]">Musk Rizali</h2>
            <p className="mt-6 max-w-sm text-base leading-8">{HOUSE.oilLine}</p>
            <Link href="/product/musk-rizali" className="label mt-8 inline-block min-h-11">
              Open the oil
            </Link>
          </div>
          <div className="col-span-12 mt-12 md:col-span-6 md:col-start-7 md:mt-0">
            <BottleStage src="/images/placeholders/bottle-01.svg" alt="Placeholder Musk Rizali bottle" />
          </div>
        </div>
      </section>

      <section className="scene bg-paper">
        <div className="site-grid py-24">
          <p className="col-span-12 label text-forest">Notes</p>
          <div className="col-span-12 mt-8">
            {NOTES.map((note, index) => (
              <p
                key={note}
                className="display text-[clamp(2.6rem,9vw,7.2rem)] leading-[0.86] text-ink"
                style={{
                  marginLeft: `${(index % 3) * 4}%`,
                  opacity: 0.55 + (index % 4) * 0.1,
                  transform: `translateZ(0) translateY(${(index % 2) * 6}px)`,
                }}
              >
                {note}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="scene bg-cream">
        <div className="site-grid min-h-[100dvh] items-center py-16">
          <p className="col-span-12 label text-forest">Collection</p>
          <article className="col-span-12 mt-8 grid gap-8 md:grid-cols-12 md:items-end">
            <div className="relative aspect-[3/4] bg-mint md:col-span-5">
              <Image src={musk.images[0].src} alt={musk.images[0].alt} fill className="object-contain p-10" />
            </div>
            <div className="md:col-span-6 md:col-start-7">
              <p className="label">{musk.number}</p>
              <h2 className="display mt-2 text-[clamp(2.6rem,7vw,6rem)]">
                <Link href={`/product/${musk.slug}`} className="no-underline">
                  {musk.name}
                </Link>
              </h2>
              <p className="mt-4 max-w-md text-base leading-8">{musk.subtitle}</p>
            </div>
          </article>
        </div>
      </section>

      <section className="scene bg-ivory">
        <div className="site-grid min-h-[100dvh] items-center py-16">
          <article className="col-span-12 grid gap-8 md:grid-cols-12 md:items-end">
            <div className="md:col-span-6 md:col-start-1 md:row-start-1">
              <p className="label">{two.number}</p>
              <h2 className="display mt-2 text-[clamp(2.6rem,7vw,6rem)]">
                <Link href={`/product/${two.slug}`} className="no-underline">
                  {two.name}
                </Link>
              </h2>
              <p className="mt-4 max-w-md text-base leading-8">{two.subtitle}</p>
              <p className="label mt-6 text-ink/50">{HOMEPAGE_CMS.comingSoonLine}</p>
            </div>
            <div className="relative aspect-[3/4] bg-sand/40 md:col-span-5 md:col-start-8">
              <Image src={two.images[0].src} alt={two.images[0].alt} fill className="object-contain p-10" />
            </div>
          </article>
        </div>
      </section>

      <section className="scene atmosphere-morning">
        <LiquidReveal className="site-grid min-h-[100dvh] items-end py-16" as="div">
          <p className="col-span-12 label">Find your scent</p>
          <h2 className="col-span-12 display mt-4 text-[clamp(2.4rem,8vw,6.5rem)] md:col-span-9">
            {HOMEPAGE_CMS.finderCta}
          </h2>
          <div className="col-span-12 mt-10 md:col-span-4">
            <p className="mb-6 max-w-sm text-base leading-8">
              Six questions. A primary match and a second neighbour. We call it a scent match — not intelligence.
            </p>
            <LiquidLink href="/find-your-scent" liquid="water">
              Start
            </LiquidLink>
          </div>
        </LiquidReveal>
      </section>

      <section className="scene atmosphere-garden text-ivory">
        <div className="site-grid min-h-[100dvh] items-end py-16">
          <p className="col-span-12 label">Liquid ingredients</p>
          <h2 className="col-span-12 display mt-4 text-[clamp(2.4rem,8vw,6.5rem)] md:col-span-8">
            {HOMEPAGE_CMS.createCta}
          </h2>
          <div className="col-span-12 mt-10 md:col-span-5">
            <p className="mb-6 max-w-sm text-base leading-8">
              A preference vessel — not a factory. Notes layer as colour. You leave with a portrait, not a formula pretending to be chemistry.
            </p>
            <LiquidLink href="/create-your-fragrance" liquid="water">
              Begin
            </LiquidLink>
          </div>
        </div>
      </section>

      <section className="scene atmosphere-evening text-ivory">
        <div className="site-grid min-h-[100dvh] items-end py-16">
          <p className="col-span-12 label text-sand">Next Rehmat</p>
          <h2 className="col-span-12 display mt-4 text-[clamp(2.4rem,8vw,6.5rem)] md:col-span-9">
            {HOMEPAGE_CMS.nextDropCta}
          </h2>
          <div className="col-span-12 mt-10 md:col-span-5">
            <p className="mb-6 max-w-sm text-base leading-8 text-ivory/80">{HOUSE.nextDropLine}</p>
            <LiquidLink href="/next-drop" liquid="oil">
              Vote
            </LiquidLink>
          </div>
        </div>
      </section>
    </div>
  );
}

function BottleStage({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [placeholderTilt] = useState(true);

  return (
    <div
      ref={ref}
      className="relative mx-auto h-[420px] w-full max-w-md"
      onPointerMove={(event) => {
        const node = event.currentTarget;
        const rect = node.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        node.style.setProperty("--lx", `${x * 100}%`);
        node.style.setProperty("--ly", `${y * 100}%`);
        if (placeholderTilt) return;
        node.style.setProperty("--tilt", `${(x - 0.5) * 6}deg`);
      }}
    >
      <div
        className="pointer-events-none absolute inset-8 bg-ivory/40"
        style={{
          background: `radial-gradient(80% 60% at var(--lx, 70%) var(--ly, 18%), rgba(251,247,238,0.7), transparent 55%)`,
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative h-80 w-28">
          <Image src={src} alt={alt} fill className="object-contain" />
        </div>
      </div>
    </div>
  );
}
