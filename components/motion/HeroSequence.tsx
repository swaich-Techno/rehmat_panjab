"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { HOUSE, PRODUCTS, isDevelopmentProduct } from "@/data/fragrance-config";
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
import { ClickWashCard, ClickWashLink } from "@/components/motion/ClickWash";
import { motionAllowsCinematic } from "@/lib/motion/mode";
import { useMotionMode } from "@/lib/motion/useMotionMode";
import { useScrollStretch } from "@/lib/motion/useScrollStretch";
import { useOffscreenPause } from "@/lib/motion/useOffscreenPause";
import { durationCss } from "@/lib/motion/tokens";
import { BOTTLE_LERP_MAX_PX, clampBottleLerp } from "@/lib/motion/press";
import { track } from "@/lib/analytics/index";

export function HeroSequence() {
  const [ripple, setRipple] = useState(false);
  const notesRef = useRef<HTMLDivElement>(null);
  const notesOn = useOffscreenPause(notesRef);
  const mode = useMotionMode();
  useScrollStretch();

  useEffect(() => {
    track({ name: "hero_view", path: "/" });
  }, []);

  const musk = PRODUCTS[0];
  const developing = PRODUCTS.filter(isDevelopmentProduct);
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
              className="hero-wordmark display mt-2 text-[clamp(3rem,10vw,8.2rem)] leading-[0.82]"
            />
            <p className="label copy-gap max-w-sm text-ink/70">{HOMEPAGE_CMS.heroLine}</p>
            <p className="copy-gap max-w-md text-sm leading-7 text-ink/75">{HOUSE.oilExplain}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <LiquidLink href={`/product/${musk.slug}`} liquid="oil">
                {HOMEPAGE_CMS.featuredCta}
              </LiquidLink>
              <LiquidLink href="/collection" liquid="water">
                {HOMEPAGE_CMS.collectionCta}
              </LiquidLink>
            </div>
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
            <p className="copy-gap max-w-sm text-sm leading-7 text-ink/70">{HOUSE.sizeGuide[6]}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <LiquidLink href="/product/musk-rizali" liquid="oil">
                {HOMEPAGE_CMS.featuredCta}
              </LiquidLink>
            </div>
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
          <div ref={notesRef} className={`col-span-12 note-field mt-4 ${notesOn ? "is-on" : ""}`}>
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
          <ClickWashCard
            href={`/product/${musk.slug}`}
            className="col-span-12 grid items-end gap-x-[var(--space-collection-col)] gap-y-6 md:grid-cols-12"
          >
            <LiquidMask kind="sweep" className="md:col-span-5">
              <div className="image-sheen relative aspect-[3/4] bg-mint" data-cursor="product">
                <Image src={musk.images[0].src} alt={musk.images[0].alt} fill className="object-contain p-8" />
              </div>
            </LiquidMask>
            <div className="md:col-span-6 md:col-start-7 md:-ml-8">
              <p className="label">{musk.number}</p>
              <h2 className="display headline-gap text-[clamp(2.4rem,6.5vw,5.4rem)]">
                <ClickWashLink href={`/product/${musk.slug}`} className="no-underline link-lux">
                  {musk.name}
                </ClickWashLink>
              </h2>
              <p className="copy-gap max-w-md text-base leading-7">{musk.subtitle}</p>
              <div className="mt-5">
                <LiquidLink href={`/product/${musk.slug}`} liquid="oil">
                  {HOMEPAGE_CMS.featuredCta}
                </LiquidLink>
              </div>
            </div>
          </ClickWashCard>
        </div>
      </section>

      <section className="scene scene--overlap bg-ivory">
        <div className="site-grid">
          <p className="col-span-12 label text-rose-metal">In development</p>
          <h2 className="col-span-12 display headline-gap text-[clamp(2.2rem,6vw,4.6rem)] md:col-span-8">
            02–05 are still being written
          </h2>
          <p className="col-span-12 copy-gap max-w-lg text-base leading-7 md:col-span-6">
            {HOMEPAGE_CMS.comingSoonLine} Working titles only. Not unfinished shop pages.
          </p>
          <ul className="col-span-12 mt-8 grid gap-4 md:col-span-10 md:grid-cols-4">
            {developing.map((product) => (
              <li key={product.id} className="border-t border-ink/10 pt-3">
                <p className="label">{product.number}</p>
                <ClickWashLink href={`/product/${product.slug}`} className="display mt-1 block text-2xl no-underline link-lux">
                  {product.name}
                </ClickWashLink>
                <p className="mt-2 text-xs leading-6 text-ink/50">Working title</p>
              </li>
            ))}
          </ul>
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
  const stageRef = useRef<HTMLDivElement>(null);
  const glassRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const mode = useMotionMode();

  useEffect(() => {
    const glass = glassRef.current;
    const stage = stageRef.current;
    if (!glass || !stage || mode === "REDUCED") return;
    let raf = 0;
    let running = true;
    const tick = () => {
      if (!running) return;
      current.current.x += (target.current.x - current.current.x) * 0.12;
      current.current.y += (target.current.y - current.current.y) * 0.12;
      const dx = current.current.x;
      const dy = current.current.y;
      stage.style.setProperty("--lx", `${50 + dx}%`);
      stage.style.setProperty("--ly", `${22 + dy}%`);
      glass.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
    };
  }, [mode]);

  return (
    <div
      ref={stageRef}
      className="bottle-stage relative mx-auto h-[min(46vh,380px)] w-full max-w-sm"
      data-cursor="product"
      onPointerMove={(event) => {
        if (event.pointerType === "touch" || mode === "REDUCED") return;
        const rect = event.currentTarget.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        target.current = clampBottleLerp(x, y, BOTTLE_LERP_MAX_PX);
      }}
      onPointerLeave={() => {
        target.current = { x: 0, y: 0 };
      }}
    >
      <div
        className="pointer-events-none absolute inset-6"
        style={{
          background: `radial-gradient(70% 50% at var(--lx, 62%) var(--ly, 18%), rgba(251,247,238,0.55), transparent 58%)`,
          transition: `background ${durationCss("micro")} linear`,
        }}
      />
      <div ref={glassRef} className="bottle-stage__glass absolute inset-0 flex justify-center">
        <div className="relative h-full w-24">
          <Image src={src} alt={alt} fill className="object-contain" priority />
        </div>
      </div>
    </div>
  );
}
