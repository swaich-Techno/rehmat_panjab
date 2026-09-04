"use client";

import { useState } from "react";
import { LiquidButton } from "@/components/ui/LiquidButton";
import { useCart } from "@/components/commerce/CartProvider";
import { useLiquidTransition } from "@/components/motion/LiquidTransition";
import { track } from "@/lib/analytics/index";
import { durationMs } from "@/lib/motion/tokens";
import { useMotionMode } from "@/lib/motion/useMotionMode";

export function BuyNowButton({
  productId,
  variantId,
  compact = false,
}: {
  productId: string;
  variantId: string;
  compact?: boolean;
}) {
  const { addLine } = useCart();
  const { go } = useLiquidTransition();
  const mode = useMotionMode();
  const [wiping, setWiping] = useState(false);

  return (
    <>
      <LiquidButton
        liquid="oil"
        className={compact ? "w-full px-3" : ""}
        onClick={() => {
          addLine({ productId, variantId, quantity: 1 });
          track({ name: "buy_now", meta: { productId } });
          if (mode === "REDUCED") {
            go("/checkout", "none");
            return;
          }
          setWiping(true);
          window.setTimeout(() => go("/checkout", "pour"), durationMs("buyNow"));
        }}
      >
        Buy now
      </LiquidButton>
      {wiping ? <div className="liquid-pour-veil" /> : null}
    </>
  );
}
