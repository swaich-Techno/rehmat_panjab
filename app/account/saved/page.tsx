"use client";

import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";
import { SAVED_KEY } from "@/lib/insights/store";
import { EMPTY_SLUGS } from "@/lib/insights/fallbacks";
import { useLocalJson } from "@/lib/storage/local-json";

export default function SavedPage() {
  const slugs = useLocalJson<string[]>(SAVED_KEY, EMPTY_SLUGS);
  return (
    <div className="site-grid py-16">
      <div className="col-span-12">
        <EmptyState
          kicker="Saved fragrances"
          title="What this browser kept"
          body="Saving is local until accounts exist. Nothing here is a wishlist on a server."
        />
        {slugs.length === 0 ? <p className="text-sm text-ink/60">None saved on this device.</p> : (
          <ul>
            {slugs.map((slug) => (
              <li key={slug}><Link href={`/product/${slug}`}>{slug}</Link></li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
