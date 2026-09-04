"use client";

import { REWARD_LEDGER_KEY, type LocalReward } from "@/lib/insights/store";
import { EMPTY_REWARDS } from "@/lib/insights/fallbacks";
import { useLocalJson } from "@/lib/storage/local-json";

export default function AdminRewardsPage() {
  const rows = useLocalJson<LocalReward[]>(REWARD_LEDGER_KEY, EMPTY_REWARDS);
  return (
    <div>
      <p className="label text-forest">Discount rewards</p>
      <h1 className="display mt-3 text-5xl">Local session ledger</h1>
      <p className="mt-4 max-w-lg text-sm leading-7 text-ink/70">
        Percent is always 5 on the server. Codes are not listed in plaintext here.
      </p>
      <p className="mt-8 display text-5xl">{rows.length.toString().padStart(2, "0")}</p>
      <p className="label mt-2">Tokens on this device</p>
    </div>
  );
}
