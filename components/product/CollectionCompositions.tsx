import Link from "next/link";
import { HOUSE, PRODUCTS, isDevelopmentProduct } from "@/data/fragrance-config";
import { PriceDisplay } from "@/components/commerce/PriceDisplay";
import { LiquidMask } from "@/components/motion/LiquidMask";
import { ClickWashCard } from "@/components/motion/ClickWash";
import { OilExplainer } from "@/components/product/OilExplainer";
import { CampaignStill } from "@/components/product/CampaignStill";

export function CollectionCompositions({ featuredOnly = false }: { featuredOnly?: boolean }) {
  const items = featuredOnly ? PRODUCTS.filter((product) => product.featured) : PRODUCTS;
  const masks = ["sweep", "glass", "oil", "liquid"] as const;
  return (
    <div className="collection-stack section-pad">
      <div className="site-grid">
        <OilExplainer className="col-span-12 md:col-span-6" />
      </div>
      {items.map((product, index) => {
        const development = isDevelopmentProduct(product);
        const imageLeft = index % 2 === 0;
        return (
          <ClickWashCard
            key={product.id}
            href={`/product/${product.slug}`}
            className={`site-grid items-start ${development ? "dev-oil" : ""}`}
          >
            <div
              className={`product-visual col-span-12 min-w-0 md:col-span-5 ${imageLeft ? "" : "md:col-start-8"}`}
            >
              <LiquidMask kind={masks[index % masks.length]}>
                <CampaignStill
                  src={product.images[0].src}
                  alt={product.images[0].alt}
                  sizes="(max-width: 768px) calc(100vw - 2rem), 40vw"
                />
                {development ? <p className="dev-mark absolute left-4 top-4">In development</p> : null}
              </LiquidMask>
            </div>
            <div
              className={`product-copy relative z-[2] col-span-12 mt-4 min-w-0 md:col-span-6 md:mt-0 ${
                imageLeft ? "md:col-start-7" : "md:col-start-1 md:row-start-1"
              }`}
            >
              <p className="label text-forest">{product.number}</p>
              {development ? <p className="label mt-2 text-rose-metal">Working title</p> : null}
              <h2 className="display headline-gap text-5xl md:text-7xl">
                <Link href={`/product/${product.slug}`} className="no-underline link-lux" data-cursor="link">
                  {product.name}
                </Link>
              </h2>
              <p className="copy-gap max-w-md text-base leading-7 text-ink/75">{product.subtitle}</p>
              {development ? (
                <p className="mt-3 max-w-md text-sm leading-7 text-ink/60">
                  Reserved in the catalogue. Not a finished oil for sale.
                </p>
              ) : (
                <>
                  <p className="mt-3 max-w-md text-sm leading-7 text-ink/70">
                    {product.notes.top.join(" · ")}
                  </p>
                  <p className="mt-2 max-w-md text-sm leading-7 text-ink/55">{HOUSE.sizeGuide[6]}</p>
                </>
              )}
              <div className="mt-4">
                <PriceDisplay paise={product.variants[0]?.price_paise ?? null} />
              </div>
            </div>
          </ClickWashCard>
        );
      })}
    </div>
  );
}
