"use client";

import { EmptyState } from "@/components/ui/EmptyState";
import { INSIGHTS_KEY, type NextDropInsight } from "@/lib/insights/store";
import { EMPTY_INSIGHTS } from "@/lib/insights/fallbacks";
import { useLocalJson } from "@/lib/storage/local-json";

export default function AccountVotesPage() {
  const votes = useLocalJson<NextDropInsight[]>(INSIGHTS_KEY, EMPTY_INSIGHTS);
  return (
    <div className="site-grid py-16">
      <div className="col-span-12">
        <EmptyState
          kicker="Launch votes"
          title="Your next-drop notes"
          body="Votes on this device only. Production persistence needs a database."
        />
        {votes.length === 0 ? <p className="text-sm text-ink/60">No local votes.</p> : (
          <ul className="mt-6 space-y-4">
            {votes.map((vote) => (
              <li key={vote.at} className="border-t border-ink/10 pt-3 text-sm leading-7">
                {vote.family} · {vote.notes.join(", ")} · {vote.feel}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
