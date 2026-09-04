import { HOUSE } from "@/data/fragrance-config";

export function OilExplainer({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <p className="label text-forest">Concentrated perfume oil</p>
      <p className="copy-gap max-w-md text-sm leading-7 text-ink/75">{HOUSE.oilExplain}</p>
    </div>
  );
}

export function SizeGuide({ ml }: { ml: number }) {
  const line = HOUSE.sizeGuide[ml];
  if (!line) return null;
  return <p className="mt-1 max-w-sm text-sm leading-6 text-ink/60">{line}</p>;
}
