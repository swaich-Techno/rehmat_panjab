"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Product } from "@/data/fragrance-config";
import { isDevelopmentProduct } from "@/data/fragrance-config";
import { AddToCartButton } from "@/components/commerce/AddToCartButton";
import { BuyNowButton } from "@/components/commerce/BuyNowButton";
import { PriceDisplay } from "@/components/commerce/PriceDisplay";
import { MobileCommerceBar } from "@/components/commerce/MobileCommerceBar";
import { NotifyMe } from "@/components/commerce/NotifyMe";
import { Composition } from "@/components/product/Composition";
import { ScentCharacter } from "@/components/product/ScentCharacter";
import { OilExplainer } from "@/components/product/OilExplainer";
import { SizePills } from "@/components/product/SizePills";
import { OilLayer } from "@/components/motion/OilLayer";
import { LiquidMask } from "@/components/motion/LiquidMask";
import { track } from "@/lib/analytics/index";
import { variantIsPriced } from "@/lib/commerce/cta";

export function ProductView({ product }: { product: Product }) {
  const [variantId, setVariantId] = useState(product.variants[0]?.id ?? "");
  const variant = product.variants.find((item) => item.id === variantId) ?? product.variants[0];
  const development = isDevelopmentProduct(product);
  const priced = variantIsPriced(variant?.price_paise);

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
            <div className="image-sheen relative min-h-[62vw] bg-mint/40 md:min-h-[72vh]" data-cursor="product">
              <Image
                src={product.images[0].src}
                alt={product.images[0].alt}
                fill
                priority
                className="object-contain p-10"
              />
              {development ? (
                <p className="dev-mark absolute left-4 top-4">In development</p>
              ) : null}
            </div>
          </LiquidMask>
        </div>
        <div className="col-span-12 mt-8 md:col-span-5 md:col-start-8 md:mt-4">
          <p className="label text-forest">{product.number}</p>
          {development ? <p className="label mt-2 text-rose-metal">Working title · in development</p> : null}
          <h1 className="display headline-gap text-6xl md:text-8xl">{product.name}</h1>
          <OilExplainer className="mt-4" />
          <p className="copy-gap max-w-md text-base leading-7 text-ink/80">{product.description}</p>
          {development ? (
            <p className="mt-4 text-sm leading-7 text-ink/70">
              This number is reserved. The juice and the name are still being written. You can look — you cannot buy
              a finished oil that does not exist yet.
            </p>
          ) : null}
          <fieldset className="block-gap">
            <legend className="label">Size</legend>
            <div className="mt-3">
              <SizePills variants={product.variants} value={variantId} onChange={setVariantId} />
            </div>
          </fieldset>
          <div className="mt-6">
            <PriceDisplay paise={variant?.price_paise ?? null} />
            {product.status !== "active" ? (
              <p className="mt-2 text-sm text-rose-metal">Not on sale yet. You may hold it as a request.</p>
            ) : null}
          </div>
          {!development ? (
            <div className="mt-6 hidden flex-col gap-3 sm:flex-row md:flex">
              <AddToCartButton
                productId={product.id}
                variantId={variant.id}
                imageSrc={product.images[0].src}
                priced={priced}
              />
              <BuyNowButton productId={product.id} variantId={variant.id} priced={priced} />
            </div>
          ) : null}
          {product.status !== "active" ? <NotifyMe campaign={`product-${product.slug}`} /> : null}
        </div>
      </section>
      <Composition product={product} />
      <ScentCharacter product={product} />
      {!development ? (
        <MobileCommerceBar
          productId={product.id}
          variantId={variant.id}
          imageSrc={product.images[0].src}
          priced={priced}
        />
      ) : (
        <MobileCommerceBar />
      )}
    </div>
  );
}
