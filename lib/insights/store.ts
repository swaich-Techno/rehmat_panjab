export const INSIGHTS_KEY = "rp.next-drop.insights.v1";
export const REWARD_LEDGER_KEY = "rp.rewards.ledger.v1";
export const LOCAL_ORDERS_KEY = "rp.orders.v1";
export const SAVED_KEY = "rp.saved.v1";
export const ACCOUNT_KEY = "rp.account.local.v1";

export type NextDropInsight = {
  family: string;
  notes: string[];
  feel: string;
  projection: string;
  occasion: string;
  format: string;
  size: string;
  priceBand: string;
  at: number;
};

export type LocalReward = {
  emailHash: string;
  token: string;
  shown: boolean;
  at: number;
};

export function rankCounts(values: string[]): { id: string; count: number }[] {
  const map = new Map<string, number>();
  for (const value of values) {
    map.set(value, (map.get(value) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([id, count]) => ({ id, count }))
    .sort((a, b) => b.count - a.count);
}
