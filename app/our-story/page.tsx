import type { Metadata } from "next";
import Image from "next/image";
import { HOUSE } from "@/data/fragrance-config";
import { LiquidReveal } from "@/components/motion/LiquidReveal";

export const metadata: Metadata = {
  title: "Our story",
  description: "Soil, grass, paper, glass, metal, cloth, morning. The origin of Rehmat Panjab.",
  alternates: { canonical: "/our-story" },
};

const MATERIALS = [
  { label: "Soil", file: "origin-soil.svg", line: "The courtyard after heat." },
  { label: "Grass", file: "origin-grass.svg", line: "A cut stem, still wet." },
  { label: "Paper", file: "origin-paper.svg", line: "Notes before names." },
  { label: "Glass", file: "origin-glass.svg", line: "The vessel that waits." },
  { label: "Metal", file: "origin-metal.svg", line: "Warm from a pocket." },
  { label: "Cloth", file: "origin-textile.svg", line: "Oil that stays in weave." },
  { label: "Morning", file: "origin-morning.svg", line: "Side-light, not spotlight." },
];

export default function OurStoryPage() {
  return (
    <div>
      <section className="atmosphere-morning py-20 md:py-28">
        <div className="site-grid">
          <p className="col-span-12 label text-forest">Origin</p>
          <h1 className="col-span-12 display mt-4 text-[clamp(2.8rem,8vw,7rem)] md:col-span-9">
            Soil, grass, paper,
            <span className="mt-2 block">glass, metal, cloth,</span>
            <span className="mt-2 block text-forest">morning.</span>
          </h1>
          <p className="col-span-12 mt-8 max-w-md text-base leading-8 md:col-span-5">
            {HOUSE.wornLine} {HOUSE.wornLineSecond} The house is written from materials, not monuments.
          </p>
        </div>
      </section>

      <section className="bg-paper py-20">
        <LiquidReveal className="site-grid" as="div">
          <div className="col-span-12 md:col-span-7">
            <div className="relative min-h-[70vw] bg-cream md:min-h-[72vh]">
              <Image
                src="/images/placeholders/origin-paper.svg"
                alt="Placeholder origin still — paper and morning light, not a photograph"
                fill
                className="object-contain p-12"
              />
            </div>
          </div>
          <ol className="col-span-12 mt-12 space-y-10 md:col-span-4 md:col-start-9 md:mt-0">
            {MATERIALS.map((item, index) => (
              <li key={item.label} className="border-t border-ink/10 pt-4">
                <p className="label text-forest">{String(index + 1).padStart(2, "0")}</p>
                <p className="display mt-2 text-4xl">{item.label}</p>
                <p className="mt-2 text-sm leading-7 text-ink/70">{item.line}</p>
              </li>
            ))}
          </ol>
        </LiquidReveal>
      </section>
    </div>
  );
}
