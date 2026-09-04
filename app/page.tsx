import { HOUSE } from "@/data/fragrance-config";
import { HeroSequence } from "@/components/motion/HeroSequence";
import { CollectionCompositions } from "@/components/product/CollectionCompositions";
import { LiquidLink } from "@/components/ui/LiquidLink";

export default function HomePage() {
  return (
    <div>
      <HeroSequence />
      <section className="bg-cream py-24">
        <div className="site-grid mb-16">
          <p className="col-span-12 label text-forest">Scene 06 — collection</p>
          <h2 className="col-span-12 display mt-4 text-5xl md:col-span-8 md:text-7xl">
            Five oils.
            <span className="mt-2 block text-forest">Four still choosing their names.</span>
          </h2>
        </div>
        <CollectionCompositions />
      </section>
      <section className="atmosphere-morning py-24">
        <div className="site-grid items-end">
          <div className="col-span-12 md:col-span-6">
            <p className="label">Scene 07 — finder</p>
            <h2 className="display mt-4 text-6xl md:text-8xl">{HOUSE.finderLine}</h2>
          </div>
          <div className="col-span-12 mt-8 md:col-span-4 md:col-start-9">
            <p className="mb-6 text-base leading-8">
              Six questions. A primary match and a second neighbour. We call it a scent match — not intelligence.
            </p>
            <LiquidLink href="/find-your-scent">Find your scent</LiquidLink>
          </div>
        </div>
      </section>
      <section className="bg-paper py-24">
        <div className="site-grid">
          <p className="col-span-12 label text-forest">Scene 08 — origin</p>
          <h2 className="col-span-12 display mt-4 text-5xl md:col-span-7 md:text-7xl">
            Soil, grass, paper, glass, metal, cloth, morning.
          </h2>
          <ul className="col-span-12 mt-16 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              ["Soil", "origin-soil.svg"],
              ["Grass", "origin-grass.svg"],
              ["Paper", "origin-paper.svg"],
              ["Glass", "origin-glass.svg"],
              ["Metal", "origin-metal.svg"],
              ["Textile", "origin-textile.svg"],
              ["Morning", "origin-morning.svg"],
              ["Oil", "oil-veil.svg"],
            ].map(([label, file]) => (
              <li key={label} className="min-h-40 bg-mist p-4">
                <div
                  className="h-28 w-full bg-center bg-no-repeat bg-contain"
                  style={{ backgroundImage: `url(/images/placeholders/${file})` }}
                />
                <p className="label mt-3">{label}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
