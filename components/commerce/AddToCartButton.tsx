"use client";

import { useRef, useState } from "react";
import { LiquidButton } from "@/components/ui/LiquidButton";
import { useCart } from "@/components/commerce/CartProvider";
import { Ripple } from "@/components/motion/Ripple";
import { durationMs } from "@/lib/motion/tokens";
import { useMotionMode } from "@/lib/motion/useMotionMode";
import { scaleDuration } from "@/lib/motion/mode";

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
  const mode = useMotionMode();
  const [phase, setPhase] = useState<"idle" | "added" | "another">("idle");
  const [ripple, setRipple] = useState(false);

  const caption = phase === "added" ? "Added" : phase === "another" ? "Add another" : label;

  return (
    <div
      ref={ref}
      className="relative"
      style={{
        transform: phase === "added" ? "translate3d(0, -10px, 0)" : undefined,
        transition: `transform var(--duration-atc) var(--ease-liquidEase)`,
      }}
    >
      {ripple ? <Ripple personality="oil" className="absolute left-1/2 top-1/2" /> : null}
      <LiquidButton
        success={phase === "added"}
        liquid="oil"
        cursor="add"
        className={compact ? "w-full px-3" : ""}
        onClick={() => {
          const from = ref.current?.getBoundingClientRect();
          addLine({ productId, variantId, quantity: 1 }, { src: imageSrc, from });
          setPhase("added");
          setRipple(true);
          const hold = scaleDuration(durationMs("atc"), mode);
          const another = scaleDuration(durationMs("addAnother"), mode);
          window.setTimeout(() => setRipple(false), hold);
          window.setTimeout(() => setPhase("another"), another);
        }}
      >
        {caption}
      </LiquidButton>
    </div>
  );
}
