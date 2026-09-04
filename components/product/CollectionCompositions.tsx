import Image from "next/image";
import Link from "next/link";
import { PRODUCTS } from "@/data/fragrance-config";
import { PriceDisplay } from "@/components/commerce/PriceDisplay";
import { LiquidMask } from "@/components/motion/LiquidMask";

export function CollectionCompositions({ featuredOnly = false }: { featuredOnly?: boolean }) {
  const items = featuredOnly ? PRODUCTS.filter((product) => product.featured) : PRODUCTS;
  const masks = ["sweep", "glass", "oil", "liquid"] as const;
  return (
    <div className="collection-stack section-pad">
      {items.map((product, index) => (
        <article key={product.id} className="site-grid">
          <div className={`col-span-12 md:col-span-5 ${index % 2 ? "md:col-start-8" : ""}`}>
            <LiquidMask kind={masks[index % masks.length]}>
              <div className="relative aspect-[4/5] bg-mint" data-cursor="product">
                <Image src={product.images[0].src} alt={product.images[0].alt} fill className="object-contain p-8" />
              </div>
            </LiquidMask>
          </div>
          <div
            className={`col-span-12 mt-4 md:col-span-6 ${index % 2 ? "md:col-start-1 md:row-start-1 md:mt-16" : "md:col-start-6 md:-ml-10 md:mt-20"}`}
          >
            <p className="label text-forest">{product.number}</p>
            <h2 className="display headline-gap text-5xl md:text-7xl">
              <Link href={`/product/${product.slug}`} className="no-underline" data-cursor="link">
                {product.name}
              </Link>
            </h2>
            <p className="copy-gap max-w-md text-base leading-7 text-ink/75">{product.subtitle}</p>
            <div className="mt-4">
              <PriceDisplay paise={product.variants[0]?.price_paise ?? null} />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
