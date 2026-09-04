export type InventoryResult =
  | { ok: true; next: number }
  | { ok: false; next: number; reason: "negative" | "invalid" };

export function applyInventoryDelta(current: number, delta: number): InventoryResult {
  if (!Number.isInteger(current) || current < 0 || !Number.isInteger(delta)) {
    return { ok: false, next: current, reason: "invalid" };
  }
  const next = current + delta;
  if (next < 0) {
    return { ok: false, next: current, reason: "negative" };
  }
  return { ok: true, next };
}

export function canFulfill(inventory: number, quantity: number): boolean {
  return Number.isInteger(inventory) && Number.isInteger(quantity) && quantity > 0 && inventory >= quantity;
}

export function clampQuantity(quantity: number, max: number): number {
  if (!Number.isInteger(quantity) || quantity < 1) return 1;
  if (!Number.isInteger(max) || max < 1) return 1;
  return Math.min(quantity, max);
}
