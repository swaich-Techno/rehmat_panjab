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
import { OilLayer } from "@/components/motion/OilLayer";
import { LiquidMask } from "@/components/motion/LiquidMask";
import { track } from "@/lib/analytics/index";

export function ProductView({ product }: { product: Product }) {
  const [variantId, setVariantId] = useState(product.variants[0]?.id ?? "");
  const variant = product.variants.find((item) => item.id === variantId) ?? product.variants[0];

  useEffect(() => {
    track({ name: "product_view", path: `/product/${product.slug}`, meta: { slug: product.slug } });
  }, [product.slug]);

  return (
    <div className="relative pb-28 md:pb-0">
      <div className="pointer-events-none absolute inset-0 opacity-70" aria-hidden="true">
        <OilLayer className="h-full min-h-[70vh]" />
      </div>
      <section className="site-grid relative z-[1] items-start section-pad">
        <div className="col-span-12 md:col-span-6">
          <LiquidMask kind="oil">
            <div className="relative min-h-[62vw] bg-mint/40 md:min-h-[72vh]" data-cursor="product">
              <Image
                src={product.images[0].src}
                alt={product.images[0].alt}
                fill
                priority
                className="object-contain p-10"
              />
            </div>
          </LiquidMask>
        </div>
        <div className="col-span-12 mt-8 md:col-span-5 md:col-start-8 md:mt-4">
          <p className="label text-forest">{product.number}</p>
          <h1 className="display headline-gap text-6xl md:text-8xl">{product.name}</h1>
          <p className="label mt-3 text-ink/60">Concentrated perfume oil</p>
          <p className="copy-gap max-w-md text-base leading-7 text-ink/80">{product.description}</p>
          <fieldset className="block-gap">
            <legend className="label">Size</legend>
            <div className="mt-3 flex flex-col">
              {product.variants.map((item) => (
                <label key={item.id} className="flex min-h-11 items-center justify-between border-t border-ink/10 py-3">
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
          <div className="mt-6">
            <PriceDisplay paise={variant?.price_paise ?? null} />
            {product.status !== "active" ? (
              <p className="mt-2 text-sm text-rose-metal">Not on sale yet. You may hold it as a request.</p>
            ) : null}
          </div>
          <div className="mt-6 hidden flex-col gap-3 sm:flex-row md:flex">
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
