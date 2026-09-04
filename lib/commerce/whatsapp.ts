import type { CartTotals } from "@/lib/cart/calculations";
import { formatInrFromPaise } from "@/lib/commerce/money";

export function whatsappNumber(): string | null {
  const raw = process.env.WHATSAPP_ORDER_NUMBER?.replace(/\D/g, "") ?? "";
  return raw.length >= 10 ? raw : null;
}

export function buildWhatsAppMessage(input: {
  requestId: string;
  name: string;
  email: string;
  totals: CartTotals;
}): string {
  const lines = input.totals.lines
    .map((line) => {
      const price = line.line_paise === null ? "price to be confirmed" : formatInrFromPaise(line.line_paise);
      return `• ${line.number} ${line.name} — ${line.sizeLabel} × ${line.quantity} (${price})`;
    })
    .join("\n");
  const money =
    input.totals.all_unpriced
      ? "Total: to be confirmed — oils are launching soon."
      : `Subtotal ${formatInrFromPaise(input.totals.priced_subtotal_paise)} · Request total ${formatInrFromPaise(input.totals.total_paise)}`;

  return [
    `REHMAT PANJAB — manual order request ${input.requestId}`,
    `This is a request, not a paid order.`,
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    lines,
    money,
  ].join("\n");
}

export function whatsappHref(message: string): string | null {
  const number = whatsappNumber();
  if (!number) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
