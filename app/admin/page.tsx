import { PRODUCTS } from "@/data/fragrance-config";

export default function AdminOverviewPage() {
  const coming = PRODUCTS.filter((product) => product.status === "coming_soon").length;
  return (
    <div>
      <p className="label text-forest">Overview</p>
      <h1 className="display mt-3 text-5xl">House snapshot</h1>
      <dl className="mt-10 grid max-w-xl grid-cols-2 gap-8">
        <div>
          <dt className="label">Oils in config</dt>
          <dd className="display mt-2 text-5xl">{PRODUCTS.length.toString().padStart(2, "0")}</dd>
        </div>
        <div>
          <dt className="label">Launching soon</dt>
          <dd className="display mt-2 text-5xl">{coming.toString().padStart(2, "0")}</dd>
        </div>
        <div>
          <dt className="label">Priced variants</dt>
          <dd className="display mt-2 text-5xl">
            {PRODUCTS.flatMap((product) => product.variants)
              .filter((variant) => variant.price_paise !== null)
              .length.toString()
              .padStart(2, "0")}
          </dd>
        </div>
      </dl>
    </div>
  );
}
