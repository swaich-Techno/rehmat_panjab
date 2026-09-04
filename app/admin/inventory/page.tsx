import { PRODUCTS } from "@/data/fragrance-config";

export default function AdminInventoryPage() {
  return (
    <div>
      <p className="label text-forest">Inventory</p>
      <h1 className="display mt-3 text-5xl">Units in config</h1>
      <p className="mt-4 max-w-lg text-sm leading-7 text-ink/70">
        Inventory cannot go negative in the commerce library. Customer pages do not show stock counts.
      </p>
      <ul className="mt-10 space-y-3 text-sm">
        {PRODUCTS.flatMap((product) =>
          product.variants.map((variant) => (
            <li key={variant.id} className="flex justify-between border-t border-ink/10 py-3">
              <span>
                {product.number} {product.name} · {variant.label}
              </span>
              <span>{variant.inventory}</span>
            </li>
          )),
        )}
      </ul>
    </div>
  );
}
