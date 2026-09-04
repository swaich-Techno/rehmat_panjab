"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/commerce/CartProvider";
import { LiquidLink } from "@/components/ui/LiquidLink";
import { QtyStepper } from "@/components/commerce/QtyStepper";
import { MobileCommerceBar } from "@/components/commerce/MobileCommerceBar";
import { formatInrFromPaise } from "@/lib/commerce/money";

export default function CartPage() {
  const { totals, updateLine, removeLine, dissolving } = useCart();

  return (
    <div className="site-grid section-pad pb-28 md:pb-16">
      <div className="col-span-12 md:col-span-7">
        <p className="label text-forest">Held oils</p>
        <h1 className="display mt-3 text-6xl md:text-8xl">Cart</h1>
        {totals.lines.length === 0 ? (
          <div className="mt-8">
            <div className="relative h-32 w-20 border border-ink/15 bg-ivory/40">
              <span className="absolute inset-x-5 top-0 h-4 bg-forest/30" />
            </div>
            <p className="display mt-4 text-4xl">Your shelf is waiting</p>
            <p className="mt-3 max-w-md text-base leading-7 text-ink/70">
              The catalogue is still arriving. Add an oil from the collection if you want the house to hold a request.
            </p>
            <LiquidLink href="/collection" liquid="water" className="mt-6">
              View collection
            </LiquidLink>
          </div>
        ) : (
          <ul className="mt-8 space-y-5">
            {totals.lines.map((line) => {
              const key = `${line.productId}-${line.variantId}`;
              return (
                <li
                  key={key}
                  className={`grid grid-cols-[88px_1fr] gap-5 border-t border-ink/10 pt-6 ${dissolving === key ? "dissolve-out" : ""}`}
                >
                  <div className="relative h-28 overflow-hidden bg-charcoal">
                    <Image src={line.image} alt={line.name} fill sizes="88px" className="object-cover" />
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
                    <div className="mt-3 flex items-center gap-4">
                      <QtyStepper
                        value={line.quantity}
                        onChange={(quantity) =>
                          updateLine({
                            productId: line.productId,
                            variantId: line.variantId,
                            quantity,
                          })
                        }
                      />
                      <button
                        type="button"
                        className="label touch-target text-wine"
                        onClick={() => removeLine(line.productId, line.variantId)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <aside className="col-span-12 mt-10 border border-ink/10 bg-paper p-6 md:col-span-4 md:col-start-9 md:mt-16">
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
      <MobileCommerceBar />
    </div>
  );
}
