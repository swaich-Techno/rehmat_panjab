import type { Product } from "@/data/fragrance-config";

export function Composition({ product }: { product: Product }) {
  const rows = [
    { id: "top", label: "Top", notes: product.notes.top },
    { id: "heart", label: "Heart", notes: product.notes.heart },
    { id: "base", label: "Base", notes: product.notes.base },
  ];
  return (
    <section className="site-grid py-20">
      <p className="col-span-12 label text-forest">The composition</p>
      <div className="col-span-12 mt-10 space-y-10 md:col-span-10">
        {rows.map((row) => (
          <div key={row.id} className="grid grid-cols-12 items-baseline gap-4 border-t border-ink/10 pt-6">
            <p className="col-span-12 label md:col-span-2">{row.label}</p>
            <p className="col-span-12 display text-4xl md:col-span-10 md:text-6xl">
              {row.notes.join("  ·  ")}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
