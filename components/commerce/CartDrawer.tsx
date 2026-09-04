"use client";

import Image from "next/image";
import Link from "next/link";
import { formatInrFromPaise } from "@/lib/commerce/money";
import { useCart } from "@/components/commerce/CartProvider";

export function CartDrawer() {
  const { open, closeCart, totals, updateLine, removeLine, fly } = useCart();

  return (
    <div className={open ? "pointer-events-auto" : "pointer-events-none"}>
      <button
        type="button"
        aria-label="Close cart"
        className={`fixed inset-0 z-50 bg-ink/25 transition-opacity duration-[350ms] ${open ? "opacity-100" : "opacity-0"}`}
        onClick={closeCart}
      />
      <aside
        className={`fixed top-0 right-0 z-50 flex h-full w-full max-w-md flex-col border-l border-ink/10 bg-ivory text-ink transition-transform duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${open ? "translate-x-0" : "translate-x-full"}`}
        aria-hidden={!open}
      >
        <div className="flex items-end justify-between border-b border-ink/10 px-6 py-5">
          <div>
            <p className="label text-forest">Your oils</p>
            <p className="display text-4xl">Cart</p>
          </div>
          <button type="button" className="label" onClick={closeCart}>
            Close
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {totals.lines.length === 0 ? (
            <p className="max-w-xs text-sm leading-7 text-ink/70">
              Nothing here yet. The collection is still arriving. You can hold an oil as a request.
            </p>
          ) : (
            <ul className="space-y-6">
              {totals.lines.map((line) => (
                <li key={`${line.productId}-${line.variantId}`} className="grid grid-cols-[72px_1fr] gap-4">
                  <div className="relative h-[90px] bg-mist">
                    <Image src={line.image} alt="" fill className="object-cover" />
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
                      <label className="label text-ink/50">
                        Qty
                        <input
                          className="ml-2 w-14 border border-ink/20 bg-transparent px-2 py-1"
                          type="number"
                          min={1}
                          max={12}
                          value={line.quantity}
                          onChange={(event) =>
                            updateLine({
                              productId: line.productId,
                              variantId: line.variantId,
                              quantity: Number(event.target.value),
                            })
                          }
                        />
                      </label>
                      <button
                        type="button"
                        className="label text-wine"
                        onClick={() => removeLine(line.productId, line.variantId)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
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
      {fly ? (
        <span
          className="pointer-events-none fixed z-[60] h-10 w-7 bg-amber/80"
          style={{
            left: fly.from.left,
            top: fly.from.top,
            animation: "rp-fly 700ms cubic-bezier(0.22,1,0.36,1) forwards",
          }}
        />
      ) : null}
      <style>{`
        @keyframes rp-fly {
          to { transform: translate(calc(100vw - 80px - ${fly?.from.left ?? 0}px), calc(20px - ${fly?.from.top ?? 0}px)) scale(0.4); opacity: 0.2; }
        }
      `}</style>
    </div>
  );
}
