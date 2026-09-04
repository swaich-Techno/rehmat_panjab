"use client";

import { useRef, useState } from "react";
import { LiquidButton } from "@/components/ui/LiquidButton";
import { useCart } from "@/components/commerce/CartProvider";
import { durationMs } from "@/lib/motion/tokens";

export function AddToCartButton({
  productId,
  variantId,
  imageSrc,
  label = "Add to cart",
  compact = false,
}: {
  productId: string;
  variantId: string;
  imageSrc: string;
  label?: string;
  compact?: boolean;
}) {
  const { addLine } = useCart();
  const ref = useRef<HTMLDivElement>(null);
  const [success, setSuccess] = useState(false);

  return (
    <div
      ref={ref}
      className={success ? "translate-y-[-10px]" : ""}
      style={{ transition: `transform var(--duration-fast) var(--ease-weighted)` }}
    >
      <LiquidButton
        success={success}
        className={compact ? "w-full px-3" : ""}
        onClick={() => {
          const from = ref.current?.getBoundingClientRect();
          addLine({ productId, variantId, quantity: 1 }, { src: imageSrc, from });
          setSuccess(true);
          window.setTimeout(() => setSuccess(false), durationMs("cartFly"));
        }}
      >
        {success ? "Added" : label}
      </LiquidButton>
    </div>
  );
}
