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
import { SplitTextReveal } from "@/components/motion/SplitTextReveal";
import { LiquidMask } from "@/components/motion/LiquidMask";
import { SceneConnector } from "@/components/motion/SceneConnector";
import { OilLayer } from "@/components/motion/OilLayer";
import { motionAllowsCinematic } from "@/lib/motion/mode";
import { useMotionMode } from "@/lib/motion/useMotionMode";
import { useScrollStretch } from "@/lib/motion/useScrollStretch";
import { durationCss } from "@/lib/motion/tokens";
import { track } from "@/lib/analytics/index";

export function HeroSequence() {
  const [ripple, setRipple] = useState(false);
  const mode = useMotionMode();
  useScrollStretch();

  useEffect(() => {
    track({ name: "hero_view", path: "/" });
  }, []);

  const musk = PRODUCTS[0];
  const two = PRODUCTS[1];
  const cinematic = motionAllowsCinematic(mode);

  return (
    <div className="home-scenes">
      <section className="scene scene--hero atmosphere-morning text-forest">
        <RefractionLayer intensity={cinematic ? 1.35 : 0.75} />
        <div className="hero-oil-thicken" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 opacity-50" aria-hidden="true">
          <OilLayer />
        </div>
        <div className="site-grid relative z-[1] flex-1 pt-8">
          <p className="col-span-12 label md:col-span-3">{HOMEPAGE_CMS.heroKicker}</p>
          <div className="col-span-12 md:col-span-8 md:col-start-1">
            <SplitTextReveal
              text="Rehmat Panjab"
              className="display mt-2 text-[clamp(3rem,10vw,8.2rem)] leading-[0.82] [filter:url(#rp-refract)]"
            />
            <p className="label copy-gap max-w-sm text-ink/70">{HOMEPAGE_CMS.heroLine}</p>
          </div>
          <div className="col-span-12 mt-4 md:col-span-5 md:col-start-8 md:row-start-1 md:mt-6">
            <BottleStage src="/images/placeholders/bottle-01.svg" alt="Placeholder house bottle in morning light" />
          </div>
          <div className="col-span-12 scroll-cue mt-2 md:col-span-4">
            <Droplet onSettled={() => setRipple(true)} />
            {ripple ? <Ripple personality="water" className="relative" /> : null}
            <p className="label text-forest">A drop, then the oil</p>
          </div>
        </div>
        <div className="hero-peek relative z-[1]" aria-hidden="true" />
      </section>

      <SceneConnector />

      <section className="scene scene--overlap bg-cream">
        <div className="site-grid">
          <p className="col-span-12 label text-forest">The first glass</p>
          <div className="col-span-12 md:col-span-5">
            <p className="label headline-gap text-wine">01</p>
            <h2 className="display headline-gap text-[clamp(2.6rem,7vw,5.8rem)]">Musk Rizali</h2>
            <p className="copy-gap max-w-sm text-base leading-7">{HOUSE.oilLine}</p>
            <Link href="/product/musk-rizali" className="label link-lux block-gap inline-block min-h-11" data-cursor="link">
              Open the oil
            </Link>
          </div>
          <div className="col-span-12 mt-8 md:col-span-6 md:col-start-7 md:mt-0">
            <LiquidMask kind="glass">
              <div className="image-sheen relative min-h-[52vw] bg-mint md:min-h-[58vh]" data-cursor="product">
                <Image
                  src="/images/placeholders/bottle-01.svg"
                  alt="Placeholder Musk Rizali bottle"
                  fill
                  className="object-contain p-8"
                />
              </div>
            </LiquidMask>
          </div>
        </div>
      </section>

      <SceneConnector delay={80} />

      <section className="scene scene--overlap bg-paper">
        <div className="site-grid">
          <p className="col-span-12 label text-forest">Notes as atmosphere</p>
          <div className="col-span-12 note-field mt-4">
            <span className="note-field__word note-musk text-[clamp(4rem,16vw,11rem)]" style={{ left: "2%", top: "8%" }}>
              MUSK
            </span>
            <span
              className="note-field__word note-oud text-[clamp(3.4rem,13vw,9rem)] text-ivory"
              style={{ right: "4%", top: "28%" }}
            >
              OUD
            </span>
            <span className="note-field__word note-rose text-[clamp(3rem,11vw,7.5rem)]" style={{ left: "18%", top: "58%" }}>
              ROSE
            </span>
          </div>
        </div>
      </section>

      <SceneConnector delay={120} />

      <section className="scene scene--overlap bg-cream">
        <div className="site-grid collection-stack">
          <p className="col-span-12 label text-forest">Collection</p>
          <article className="col-span-12 grid items-end gap-x-[var(--space-collection-col)] gap-y-6 md:grid-cols-12">
            <LiquidMask kind="sweep" className="md:col-span-5">
              <div className="image-sheen relative aspect-[3/4] bg-mint" data-cursor="product">
                <Image src={musk.images[0].src} alt={musk.images[0].alt} fill className="object-contain p-8" />
              </div>
            </LiquidMask>
            <div className="md:col-span-6 md:col-start-7 md:-ml-8">
              <p className="label">{musk.number}</p>
              <h2 className="display headline-gap text-[clamp(2.4rem,6.5vw,5.4rem)]">
                <Link href={`/product/${musk.slug}`} className="no-underline" data-cursor="link">
                  {musk.name}
                </Link>
              </h2>
              <p className="copy-gap max-w-md text-base leading-7">{musk.subtitle}</p>
            </div>
          </article>
        </div>
      </section>

      <section className="scene scene--overlap bg-ivory">
        <div className="site-grid collection-stack">
          <article className="col-span-12 grid items-end gap-x-[var(--space-collection-col)] gap-y-6 md:grid-cols-12">
            <div className="md:col-span-6 md:col-start-1">
              <p className="label">{two.number}</p>
              <h2 className="display headline-gap text-[clamp(2.4rem,6.5vw,5.4rem)]">
                <Link href={`/product/${two.slug}`} className="no-underline" data-cursor="link">
                  {two.name}
                </Link>
              </h2>
              <p className="copy-gap max-w-md text-base leading-7">{two.subtitle}</p>
              <p className="label mt-4 text-ink/50">{HOMEPAGE_CMS.comingSoonLine}</p>
            </div>
            <LiquidMask kind="oil" className="md:col-span-5 md:col-start-8 md:-mt-10">
              <div className="image-sheen relative aspect-[3/4] bg-sand/40" data-cursor="product">
                <Image src={two.images[0].src} alt={two.images[0].alt} fill className="object-contain p-8" />
              </div>
            </LiquidMask>
          </article>
        </div>
      </section>

      <SceneConnector delay={160} />

      <section className="scene scene--overlap atmosphere-morning">
        <LiquidReveal className="site-grid relative z-[1]" as="div">
          <p className="col-span-12 label">Find your scent</p>
          <h2 className="col-span-12 display headline-gap text-[clamp(2.2rem,7vw,5.6rem)] md:col-span-9">
            {HOMEPAGE_CMS.finderCta}
          </h2>
          <div className="col-span-12 block-gap md:col-span-4">
            <p className="mb-5 max-w-sm text-base leading-7">
              Six questions. A primary match and a second neighbour. We call it a scent match — not intelligence.
            </p>
            <LiquidLink href="/find-your-scent" liquid="water">
              Start
            </LiquidLink>
          </div>
        </LiquidReveal>
      </section>

      <section className="scene scene--overlap atmosphere-garden text-ivory">
        <div className="site-grid relative z-[1]">
          <p className="col-span-12 label">Liquid ingredients</p>
          <h2 className="col-span-12 display headline-gap text-[clamp(2.2rem,7vw,5.6rem)] md:col-span-8">
            {HOMEPAGE_CMS.createCta}
          </h2>
          <div className="col-span-12 block-gap md:col-span-5">
            <p className="mb-5 max-w-sm text-base leading-7">
              A preference vessel — not a factory. Notes layer as colour. You leave with a portrait, not a formula pretending to be chemistry.
            </p>
            <LiquidLink href="/create-your-fragrance" liquid="water">
              Begin
            </LiquidLink>
          </div>
        </div>
      </section>

      <section className="scene scene--overlap atmosphere-evening text-ivory">
        <div className="site-grid relative z-[1]">
          <p className="col-span-12 label text-sand">Next Rehmat</p>
          <h2 className="col-span-12 display headline-gap text-[clamp(2.2rem,7vw,5.6rem)] md:col-span-9">
            {HOMEPAGE_CMS.nextDropCta}
          </h2>
          <div className="col-span-12 block-gap md:col-span-5">
            <p className="mb-5 max-w-sm text-base leading-7 text-ivory/80">{HOUSE.nextDropLine}</p>
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

  return (
    <div
      ref={ref}
      className="bottle-stage relative mx-auto h-[min(46vh,380px)] w-full max-w-sm"
      data-cursor="product"
      onPointerMove={(event) => {
        const node = event.currentTarget;
        const rect = node.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        const dx = Math.max(-22, Math.min(22, x * 28));
        const dy = Math.max(-16, Math.min(16, y * 20));
        node.style.setProperty("--lx", `${50 + dx}%`);
        node.style.setProperty("--ly", `${22 + dy}%`);
        node.style.setProperty("--shift", `${dx}px`);
        node.style.setProperty("--lift", `${dy}px`);
      }}
    >
      <div
        className="pointer-events-none absolute inset-6"
        style={{
          background: `radial-gradient(70% 50% at var(--lx, 62%) var(--ly, 18%), rgba(251,247,238,0.55), transparent 58%)`,
          transition: `background ${durationCss("micro")} linear`,
        }}
      />
      <div className="absolute inset-0 flex justify-center">
        <div className="relative h-full w-24">
          <Image src={src} alt={alt} fill className="object-contain" priority />
        </div>
      </div>
    </div>
  );
}
