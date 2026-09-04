import { REWARD_LEDGER_KEY, type LocalReward } from "@/lib/insights/store";
import { writeLocalJson } from "@/lib/storage/local-json";

export const ACTIVE_REWARD_KEY = "rp.reward.active.v1";
export const REWARD_TOKEN_COOKIE = "rp_reward_token";

export type ActiveReward = {
  token: string;
  email: string;
  at: number;
};

function cookieMaxAge(): number {
  return 60 * 60 * 24 * 180;
}

export function storeActiveReward(reward: ActiveReward): void {
  if (typeof window === "undefined") return;
  writeLocalJson(ACTIVE_REWARD_KEY, reward);
  document.cookie = `${REWARD_TOKEN_COOKIE}=${encodeURIComponent(reward.token)}; Path=/; Max-Age=${cookieMaxAge()}; SameSite=Lax`;
}

export function readActiveReward(): ActiveReward | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(ACTIVE_REWARD_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as ActiveReward;
      if (parsed?.token) return parsed;
    }
  } catch {
    // ignore
  }
  try {
    const ledger = JSON.parse(window.localStorage.getItem(REWARD_LEDGER_KEY) ?? "[]") as LocalReward[];
    const latest = ledger.at(-1);
    if (latest?.token) {
      return { token: latest.token, email: "", at: latest.at };
    }
  } catch {
    // ignore
  }
  const fromCookie = readRewardCookie();
  if (fromCookie) return { token: fromCookie, email: "", at: 0 };
  return null;
}

export function readRewardCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|; )rp_reward_token=([^;]*)/);
  if (!match?.[1]) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}
