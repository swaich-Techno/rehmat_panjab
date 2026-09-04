/** All money is INR paise (integers). Never use floats for totals. */

export const PAISA_PER_RUPEE = 100;

export function assertPaise(value: number, label = "amount"): number {
  if (!Number.isInteger(value)) {
    throw new Error(`${label} must be an integer number of paise`);
  }
  return value;
}

export function rupeesToPaise(rupees: number): number {
  if (!Number.isInteger(rupees)) {
    throw new Error("Rupee input must be a whole rupee for this helper; use paise for fractions");
  }
  return rupees * PAISA_PER_RUPEE;
}

export function formatInrFromPaise(paise: number | null | undefined): string {
  if (paise === null || paise === undefined) return "LAUNCHING SOON";
  assertPaise(paise, "paise");
  const negative = paise < 0;
  const abs = Math.abs(paise);
  const rupees = Math.floor(abs / PAISA_PER_RUPEE);
  const remainder = abs % PAISA_PER_RUPEE;
  const formatted = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: remainder === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(rupees + remainder / PAISA_PER_RUPEE);
  return negative ? `-${formatted.replace("-", "")}` : formatted;
}

export function multiplyPaise(paise: number, quantity: number): number {
  assertPaise(paise, "unit price");
  if (!Number.isInteger(quantity) || quantity < 0) {
    throw new Error("quantity must be a non-negative integer");
  }
  return paise * quantity;
}

export function sumPaise(amounts: number[]): number {
  return amounts.reduce((total, amount) => {
    assertPaise(amount);
    return total + amount;
  }, 0);
}

export function discountPaise(subtotalPaise: number, percent: number): number {
  assertPaise(subtotalPaise, "subtotal");
  if (!Number.isInteger(percent) || percent < 0 || percent > 100) {
    throw new Error("discount percent must be an integer 0–100");
  }
  return Math.floor((subtotalPaise * percent) / 100);
}

export function applyDiscount(subtotalPaise: number, percent: number): {
  discount: number;
  total: number;
} {
  const discount = discountPaise(subtotalPaise, percent);
  return { discount, total: subtotalPaise - discount };
}
