"use client";

import Image from "next/image";
import Link from "next/link";
import { formatInrFromPaise } from "@/lib/commerce/money";
import { useCart } from "@/components/commerce/CartProvider";
import { QtyStepper } from "@/components/commerce/QtyStepper";
import { durationCss } from "@/lib/motion/tokens";
import { Droplet } from "@/components/motion/Droplet";

export function CartDrawer() {
  const { open, closeCart, totals, updateLine, removeLine, dissolving } = useCart();

  return (
    <div className={open ? "pointer-events-auto" : "pointer-events-none"}>
      <button
        type="button"
        aria-label="Close cart"
        className={`fixed inset-0 z-50 bg-ink/25 ${open ? "opacity-100" : "opacity-0"}`}
        style={{ transitionDuration: durationCss("standard") }}
        onClick={closeCart}
      />
      <aside
        className={`cart-sheet fixed z-50 flex flex-col border-ink/10 bg-ivory text-ink ${
          open
            ? "translate-x-0 translate-y-0 opacity-100"
            : "max-md:translate-y-full md:translate-x-full opacity-0"
        } inset-x-0 bottom-0 max-h-[88dvh] w-full overflow-hidden border-t md:inset-y-0 md:left-auto md:right-0 md:h-full md:max-h-none md:max-w-md md:border-l md:border-t-0`}
        style={{ paddingBottom: "var(--safe-bottom)" }}
        aria-hidden={!open}
      >
        <div className="h-2 w-full bg-gradient-to-r from-mint via-sage to-amber" aria-hidden="true" />
        <div className="flex items-end justify-between border-b border-ink/10 px-5 py-4">
          <div>
            <p className="label text-forest">Your oils</p>
            <p className="display text-3xl">Cart</p>
          </div>
          <button type="button" className="label touch-target" onClick={closeCart}>
            Close
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {totals.lines.length === 0 ? (
            <EmptyShelf onClose={closeCart} />
          ) : (
            <ul className="space-y-4">
              {totals.lines.map((line) => {
                const key = `${line.productId}-${line.variantId}`;
                return (
                  <li
                    key={key}
                    className={`grid grid-cols-[64px_1fr] gap-3 ${dissolving === key ? "dissolve-out" : ""}`}
                  >
                    <div className="campaign-still campaign-still--thumb relative h-[76px] overflow-hidden bg-charcoal" data-cursor="product">
                      <Image src={line.image} alt={line.name} fill sizes="64px" className="campaign-still__img" />
                    </div>
                    <div>
                      <p className="label text-ink/50">{line.number}</p>
                      <p className="display text-xl">{line.name}</p>
                      <p className="text-sm text-ink/70">{line.sizeLabel}</p>
                      <p className="text-sm">
                        {line.unit_paise === null ? "LAUNCHING SOON" : formatInrFromPaise(line.unit_paise)}
                      </p>
                      {line.reason === "launching_soon" ? (
                        <p className="text-xs text-rose-metal">Held as a request. Price not set.</p>
                      ) : null}
                      <div className="mt-2 flex items-center gap-3">
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
        <div className="border-t border-ink/10 px-5 py-4">
          <div className="flex items-end justify-between">
            <p className="label">Subtotal</p>
            <p className="display text-3xl">
              {totals.all_unpriced || totals.lines.length === 0
                ? "To confirm"
                : formatInrFromPaise(totals.priced_subtotal_paise)}
            </p>
          </div>
          <div className="mt-4 flex flex-col gap-3">
            <Link href="/cart" onClick={closeCart} className="label text-center" data-cursor="link">
              Review cart
            </Link>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="liquid-button block w-full text-center no-underline"
              data-cursor="buy"
            >
              Continue
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}

function EmptyShelf({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col gap-4 py-6">
      <div className="relative mx-auto h-28 w-16 border border-ink/15 bg-ivory/40">
        <span className="absolute inset-x-4 top-0 h-4 bg-forest/30" />
        <Droplet className="absolute left-1/2 top-10" />
      </div>
      <p className="display text-center text-3xl">Your shelf is waiting</p>
      <p className="mx-auto max-w-xs text-center text-sm leading-7 text-ink/70">
        The catalogue is still arriving. Add an oil from the collection if you want the house to hold a request.
      </p>
      <Link href="/collection" onClick={onClose} className="liquid-button mx-auto text-center no-underline" data-liquid="water">
        View collection
      </Link>
    </div>
  );
}
