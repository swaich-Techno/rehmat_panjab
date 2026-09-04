import type { Product } from "@/data/fragrance-config";

function pad(value: number): string {
  return value.toString().padStart(2, "0");
}

export function ScentCharacter({ product }: { product: Product }) {
  const rows = [
    { label: "Longevity", value: product.scent_profile.longevity },
    { label: "Projection", value: product.scent_profile.projection },
    { label: "Warmth", value: product.scent_profile.warm },
    { label: "Wood", value: product.scent_profile.woody },
  ];
  return (
    <section className="border-y border-ink/10 bg-paper py-16">
      <div className="site-grid">
        <p className="col-span-12 label text-forest">Scent character</p>
        <ul className="col-span-12 mt-10 md:col-span-10">
          {rows.map((row) => (
            <li key={row.label} className="flex items-baseline justify-between gap-6 border-b border-ink/10 py-5">
              <span className="display text-4xl md:text-5xl">{row.label}</span>
              <span className="display text-4xl text-amber">{pad(row.value)}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
