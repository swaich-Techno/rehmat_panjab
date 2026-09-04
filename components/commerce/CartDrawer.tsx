"use client";

import Image from "next/image";
import Link from "next/link";
import { formatInrFromPaise } from "@/lib/commerce/money";
import { useCart } from "@/components/commerce/CartProvider";
import { QtyStepper } from "@/components/commerce/QtyStepper";
import { durationCss } from "@/lib/motion/tokens";

export function CartDrawer() {
  const { open, closeCart, totals, updateLine, removeLine, dissolving } = useCart();

  return (
    <div className={open ? "pointer-events-auto" : "pointer-events-none"}>
      <button
        type="button"
        aria-label="Close cart"
        className={`fixed inset-0 z-50 bg-ink/25 ${open ? "opacity-100" : "opacity-0"}`}
        style={{ transitionDuration: durationCss("normal") }}
        onClick={closeCart}
      />
      <aside
        className={`cart-sheet fixed z-50 flex flex-col border-ink/10 bg-ivory text-ink ${
          open
            ? "translate-x-0 translate-y-0 opacity-100"
            : "max-md:translate-y-full md:translate-x-full opacity-0"
        } inset-x-0 bottom-0 max-h-[88dvh] w-full overflow-hidden rounded-t-sm border-t md:inset-y-0 md:left-auto md:right-0 md:h-full md:max-h-none md:max-w-md md:rounded-none md:border-l md:border-t-0`}
        style={{ paddingBottom: "var(--safe-bottom)" }}
        aria-hidden={!open}
      >
        <div
          className="liquid-reveal is-shown h-2 w-full bg-gradient-to-r from-mint via-sage to-amber"
          aria-hidden="true"
        />
        <div className="flex items-end justify-between border-b border-ink/10 px-6 py-5">
          <div>
            <p className="label text-forest">Your oils</p>
            <p className="display text-4xl">Cart</p>
          </div>
          <button type="button" className="label touch-target" onClick={closeCart}>
            Close
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {totals.lines.length === 0 ? (
            <p className="max-w-xs text-sm leading-7 text-ink/70">Your shelf is waiting.</p>
          ) : (
            <ul className="space-y-6">
              {totals.lines.map((line) => {
                const key = `${line.productId}-${line.variantId}`;
                return (
                  <li
                    key={key}
                    className={`grid grid-cols-[72px_1fr] gap-4 ${dissolving === key ? "dissolve-out" : ""}`}
                  >
                    <div className="relative h-[90px] bg-mint">
                      <Image src={line.image} alt="" fill className="object-contain p-1" />
                    </div>
                    <div>
                      <p className="label text-ink/50">{line.number}</p>
                      <p className="display text-2xl">{line.name}</p>
                      <p className="mt-1 text-sm text-ink/70">{line.sizeLabel}</p>
                      <p className="mt-1 text-sm">
                        {line.unit_paise === null ? "LAUNCHING SOON" : formatInrFromPaise(line.unit_paise)}
                      </p>
                      {line.reason === "launching_soon" ? (
                        <p className="mt-1 text-xs text-rose-metal">Held as a request. Price not set.</p>
                      ) : null}
                      <div className="mt-3 flex items-center gap-3">
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
        <div className="border-t border-ink/10 px-6 py-5">
          <div className="flex items-end justify-between">
            <p className="label">Subtotal</p>
            <p className="display text-3xl">
              {totals.all_unpriced || totals.lines.length === 0
                ? "To confirm"
                : formatInrFromPaise(totals.priced_subtotal_paise)}
            </p>
          </div>
          <div className="mt-5 flex flex-col gap-3">
            <Link href="/cart" onClick={closeCart} className="label text-center">
              Review cart
            </Link>
            <Link href="/checkout" onClick={closeCart} className="liquid-button block w-full text-center no-underline">
              Continue
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}
