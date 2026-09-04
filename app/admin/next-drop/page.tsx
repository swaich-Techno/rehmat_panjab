"use client";

import { INSIGHTS_KEY, rankCounts, type NextDropInsight } from "@/lib/insights/store";
import { EMPTY_INSIGHTS } from "@/lib/insights/fallbacks";
import { useLocalJson } from "@/lib/storage/local-json";

export default function AdminNextDropPage() {
  const rows = useLocalJson<NextDropInsight[]>(INSIGHTS_KEY, EMPTY_INSIGHTS);

  const families = rankCounts(rows.map((row) => row.family));
  const notes = rankCounts(rows.flatMap((row) => row.notes));
  const feels = rankCounts(rows.map((row) => row.feel));
  const projections = rankCounts(rows.map((row) => row.projection));
  const occasions = rankCounts(rows.map((row) => row.occasion));
  const formats = rankCounts(rows.map((row) => row.format));
  const sizes = rankCounts(rows.map((row) => row.size));
  const bands = rankCounts(rows.map((row) => row.priceBand));

  return (
    <div>
      <p className="label text-forest">Next drop insights</p>
      <h1 className="display mt-3 text-5xl">This browser only</h1>
      <p className="mt-4 max-w-lg text-sm leading-7 text-ink/70">
        Submission count {rows.length}. Production persistence needs a database — this list is device-local preview.
      </p>
      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <Rank title="Family" rows={families} />
        <Rank title="Notes" rows={notes} />
        <Rank title="Character" rows={feels} />
        <Rank title="Projection" rows={projections} />
        <Rank title="Occasion" rows={occasions} />
        <Rank title="Format" rows={formats} />
        <Rank title="Size" rows={sizes} />
        <Rank title="Price band" rows={bands} />
      </div>
    </div>
  );
}

function Rank({ title, rows }: { title: string; rows: { id: string; count: number }[] }) {
  return (
    <section>
      <p className="label">{title}</p>
      <ol className="mt-3 space-y-2 text-sm">
        {rows.length === 0 ? <li className="text-ink/50">No votes on this device.</li> : null}
        {rows.map((row) => (
          <li key={row.id} className="flex justify-between border-t border-ink/10 py-2">
            <span>{row.id}</span>
            <span>{row.count}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
