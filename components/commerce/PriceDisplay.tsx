import { formatInrFromPaise } from "@/lib/commerce/money";

export function PriceDisplay({
  paise,
  className = "display text-4xl",
}: {
  paise: number | null;
  className?: string;
}) {
  const value = formatInrFromPaise(paise);
  return <p className={className}>{value}</p>;
}
