"use client";

import { useRef, useState } from "react";
import { LiquidButton } from "@/components/ui/LiquidButton";
import { useCart } from "@/components/commerce/CartProvider";

export function AddToCartButton({
  productId,
  variantId,
  imageSrc,
  label = "Add to cart",
}: {
  productId: string;
  variantId: string;
  imageSrc: string;
  label?: string;
}) {
  const { addLine } = useCart();
  const ref = useRef<HTMLDivElement>(null);
  const [success, setSuccess] = useState(false);

  return (
    <div ref={ref}>
      <LiquidButton
        success={success}
        onClick={() => {
          const from = ref.current?.getBoundingClientRect();
          addLine({ productId, variantId, quantity: 1 }, { src: imageSrc, from });
          setSuccess(true);
          window.setTimeout(() => setSuccess(false), 900);
        }}
      >
        {success ? "Added ✓" : label}
      </LiquidButton>
    </div>
  );
}
