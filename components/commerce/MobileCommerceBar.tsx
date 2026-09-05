"use client";

import { usePathname } from "next/navigation";
import { useCart } from "@/components/commerce/CartProvider";
import { AddToCartButton } from "@/components/commerce/AddToCartButton";
import { BuyNowButton } from "@/components/commerce/BuyNowButton";
import { LiquidLink } from "@/components/ui/LiquidLink";

export function MobileCommerceBar({
  productId,
  variantId,
  imageSrc,
  priced = false,
}: {
  productId?: string;
  variantId?: string;
  imageSrc?: string;
  priced?: boolean;
}) {
  const pathname = usePathname();
  const { itemCount, openCart, totals } = useCart();
  const onProduct = Boolean(productId && variantId);
  const onCart = pathname === "/cart";
  const onCheckout = pathname === "/checkout";
  if (!onProduct && !onCart && !onCheckout) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-cream px-4 pt-3 md:hidden"
      style={{ paddingBottom: "calc(var(--safe-bottom) + 0.75rem)" }}
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="label touch-target relative"
          data-cart-target="mobile"
          onClick={openCart}
        >
          Cart {itemCount.toString().padStart(2, "0")}
        </button>
        {onProduct && productId && variantId ? (
          <div className="flex flex-1 gap-2">
            <AddToCartButton productId={productId} variantId={variantId} imageSrc={imageSrc ?? ""} compact priced={priced} />
            <BuyNowButton productId={productId} variantId={variantId} compact priced={priced} />
          </div>
        ) : null}
        {onCart ? (
          totals.lines.length === 0 ? (
            <LiquidLink href="/collection" liquid="water" className="flex-1">
              View collection
            </LiquidLink>
          ) : (
            <LiquidLink href="/checkout" className="flex-1">
              Continue
            </LiquidLink>
          )
        ) : null}
        {onCheckout ? <p className="label flex-1 text-ink/60">Request only. No charge.</p> : null}
      </div>
    </div>
  );
}
