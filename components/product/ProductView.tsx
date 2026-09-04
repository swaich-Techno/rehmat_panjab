"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Product } from "@/data/fragrance-config";
import { AddToCartButton } from "@/components/commerce/AddToCartButton";
import { BuyNowButton } from "@/components/commerce/BuyNowButton";
import { PriceDisplay } from "@/components/commerce/PriceDisplay";
import { MobileCommerceBar } from "@/components/commerce/MobileCommerceBar";
import { Composition } from "@/components/product/Composition";
import { ScentCharacter } from "@/components/product/ScentCharacter";
import { track } from "@/lib/analytics/index";

export function ProductView({ product }: { product: Product }) {
  const [variantId, setVariantId] = useState(product.variants[0]?.id ?? "");
  const variant = product.variants.find((item) => item.id === variantId) ?? product.variants[0];

  useEffect(() => {
    track({ name: "product_view", path: `/product/${product.slug}`, meta: { slug: product.slug } });
  }, [product.slug]);

  return (
    <div>
      <section className="site-grid items-start py-8 md:py-16">
        <div className="col-span-12 md:col-span-6">
          <div className="relative min-h-[70vw] bg-mint md:min-h-[80vh]">
            <Image
              src={product.images[0].src}
              alt={product.images[0].alt}
              fill
              priority
              className="object-contain p-12"
            />
          </div>
        </div>
        <div className="col-span-12 mt-10 md:col-span-5 md:col-start-8 md:mt-8">
          <p className="label text-forest">{product.number}</p>
          <h1 className="display mt-3 text-6xl md:text-8xl">{product.name}</h1>
          <p className="label mt-4 text-ink/60">Concentrated perfume oil</p>
          <p className="mt-6 max-w-md text-base leading-8 text-ink/80">{product.description}</p>
          <fieldset className="mt-10">
            <legend className="label">Size</legend>
            <div className="mt-3 flex flex-col">
              {product.variants.map((item) => (
                <label key={item.id} className="flex items-center justify-between border-t border-ink/10 py-3">
                  <span className="display text-3xl">{item.label}</span>
                  <input
                    type="radio"
                    name="size"
                    checked={variantId === item.id}
                    onChange={() => setVariantId(item.id)}
                  />
                </label>
              ))}
            </div>
          </fieldset>
          <div className="mt-8">
            <PriceDisplay paise={variant?.price_paise ?? null} />
            {product.status !== "active" ? (
              <p className="mt-2 text-sm text-rose-metal">Not on sale yet. You may hold it as a request.</p>
            ) : null}
          </div>
          <div className="mt-8 hidden flex-col gap-3 sm:flex-row md:flex">
            <AddToCartButton
              productId={product.id}
              variantId={variant.id}
              imageSrc={product.images[0].src}
            />
            <BuyNowButton productId={product.id} variantId={variant.id} />
          </div>
        </div>
      </section>
      <Composition product={product} />
      <ScentCharacter product={product} />
      <MobileCommerceBar
        productId={product.id}
        variantId={variant.id}
        imageSrc={product.images[0].src}
      />
    </div>
  );
}
