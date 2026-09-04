"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/commerce/CartProvider";
import { LiquidLink } from "@/components/ui/LiquidLink";
import { formatInrFromPaise } from "@/lib/commerce/money";

export default function CartPage() {
  const { totals, updateLine, removeLine } = useCart();

  return (
    <div className="site-grid py-16">
      <div className="col-span-12 md:col-span-7">
        <p className="label text-forest">Held oils</p>
        <h1 className="display mt-3 text-6xl md:text-8xl">Cart</h1>
        {totals.lines.length === 0 ? (
          <p className="mt-8 max-w-md text-base leading-8 text-ink/70">
            Empty. The catalogue is still arriving. Add an oil from the collection if you want the house to hold a request.
          </p>
        ) : (
          <ul className="mt-12 space-y-8">
            {totals.lines.map((line) => (
              <li key={`${line.productId}-${line.variantId}`} className="grid grid-cols-[88px_1fr] gap-5 border-t border-ink/10 pt-6">
                <div className="relative h-28 bg-mist">
                  <Image src={line.image} alt="" fill className="object-contain p-2" />
                </div>
                <div>
                  <p className="label">{line.number}</p>
                  <Link href={`/product/${line.slug}`} className="display text-4xl no-underline">
                    {line.name}
                  </Link>
                  <p className="mt-2 text-sm">{line.sizeLabel}</p>
                  <p className="mt-1">{line.unit_paise === null ? "LAUNCHING SOON" : formatInrFromPaise(line.unit_paise)}</p>
                  {line.reason ? (
                    <p className="mt-1 text-xs text-rose-metal">
                      {line.reason === "launching_soon" ? "Unavailable to purchase yet." : line.reason.replace("_", " ")}
                    </p>
                  ) : null}
                  <div className="mt-3 flex gap-4">
                    <input
                      type="number"
                      min={1}
                      max={12}
                      value={line.quantity}
                      className="w-16 border border-ink/20 bg-transparent px-2 py-1"
                      onChange={(event) =>
                        updateLine({
                          productId: line.productId,
                          variantId: line.variantId,
                          quantity: Number(event.target.value),
                        })
                      }
                    />
                    <button type="button" className="label text-wine" onClick={() => removeLine(line.productId, line.variantId)}>
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <aside className="col-span-12 mt-16 border border-ink/10 bg-paper p-8 md:col-span-4 md:col-start-9 md:mt-24">
        <p className="label">Subtotal</p>
        <p className="display mt-3 text-5xl">
          {totals.all_unpriced || totals.lines.length === 0
            ? "To confirm"
            : formatInrFromPaise(totals.priced_subtotal_paise)}
        </p>
        <p className="mt-4 text-sm leading-7 text-ink/70">
          Totals are recomputed on the server before any request leaves the house. Client numbers are only a sketch.
        </p>
        {totals.lines.length === 0 ? (
          <p className="label mt-8 text-ink/40">Continue</p>
        ) : (
          <LiquidLink href="/checkout" className="mt-8 w-full">
            Continue
          </LiquidLink>
        )}
      </aside>
    </div>
  );
}
