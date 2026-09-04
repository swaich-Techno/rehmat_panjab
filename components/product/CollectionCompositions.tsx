import Image from "next/image";
import Link from "next/link";
import { PRODUCTS } from "@/data/fragrance-config";
import { PriceDisplay } from "@/components/commerce/PriceDisplay";

export function CollectionCompositions({ featuredOnly = false }: { featuredOnly?: boolean }) {
  const items = featuredOnly ? PRODUCTS.filter((product) => product.featured) : PRODUCTS;
  return (
    <div className="space-y-20">
      {items.map((product, index) => (
        <article key={product.id} className="site-grid items-end">
          <div className={`col-span-12 md:col-span-5 ${index % 2 ? "md:col-start-8" : ""}`}>
            <div className="relative aspect-[4/5] bg-mint">
              <Image src={product.images[0].src} alt={product.images[0].alt} fill className="object-contain p-10" />
            </div>
          </div>
          <div className={`col-span-12 mt-6 md:col-span-6 ${index % 2 ? "md:col-start-1 md:row-start-1" : "md:col-start-7"}`}>
            <p className="label text-forest">{product.number}</p>
            <h2 className="display mt-2 text-5xl md:text-7xl">
              <Link href={`/product/${product.slug}`} className="no-underline">
                {product.name}
              </Link>
            </h2>
            <p className="mt-4 max-w-md text-base leading-8 text-ink/75">{product.subtitle}</p>
            <div className="mt-6">
              <PriceDisplay paise={product.variants[0]?.price_paise ?? null} />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
