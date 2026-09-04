"use client";

import { EmptyState } from "@/components/ui/EmptyState";
import { REWARD_LEDGER_KEY, type LocalReward } from "@/lib/insights/store";
import { EMPTY_REWARDS } from "@/lib/insights/fallbacks";
import { useLocalJson } from "@/lib/storage/local-json";

export default function AccountRewardsPage() {
  const items = useLocalJson<LocalReward[]>(REWARD_LEDGER_KEY, EMPTY_REWARDS);
  return (
    <div className="site-grid py-16">
      <div className="col-span-12">
        <EmptyState
          kicker="Discount rewards"
          title="Tokens kept locally"
          body="The plaintext code is shown once at issue. Here you only see that a signed token exists on this device."
        />
        {items.length === 0 ? (
          <p className="text-sm text-ink/60">No local reward tokens.</p>
        ) : (
          <ul className="mt-6 space-y-3 text-sm">
            {items.map((item) => (
              <li key={item.token.slice(-8)}>Issued {new Date(item.at).toLocaleDateString("en-IN")} · token held</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
