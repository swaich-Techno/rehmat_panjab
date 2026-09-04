"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LiquidButton } from "@/components/ui/LiquidButton";
import { useCart } from "@/components/commerce/CartProvider";
import { track } from "@/lib/analytics/index";

export function BuyNowButton({
  productId,
  variantId,
}: {
  productId: string;
  variantId: string;
}) {
  const { addLine } = useCart();
  const router = useRouter();
  const [wiping, setWiping] = useState(false);

  return (
    <>
      <LiquidButton
        onClick={() => {
          addLine({ productId, variantId, quantity: 1 });
          track({ name: "buy_now", meta: { productId } });
          if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            router.push("/checkout");
            return;
          }
          setWiping(true);
          window.setTimeout(() => router.push("/checkout"), 700);
        }}
      >
        Buy now
      </LiquidButton>
      {wiping ? (
        <div className="pointer-events-none fixed inset-0 z-[70] oil-fill animate-[wipe_700ms_cubic-bezier(0.22,1,0.36,1)_forwards]" />
      ) : null}
      <style>{`
        @keyframes wipe {
          from { clip-path: inset(100% 0 0 0); }
          to { clip-path: inset(0 0 0 0); }
        }
      `}</style>
    </>
  );
}
