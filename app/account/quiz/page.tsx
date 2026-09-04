"use client";

import Link from "next/link";
import { QUIZ_STORAGE_KEY } from "@/data/quiz-config";
import { EmptyState } from "@/components/ui/EmptyState";
import { useLocalJson } from "@/lib/storage/local-json";

const EMPTY_QUIZ = { resultSlug: null as string | null };

export default function AccountQuizPage() {
  const session = useLocalJson<{ resultSlug?: string | null }>(QUIZ_STORAGE_KEY, EMPTY_QUIZ);
  const slug = session.resultSlug ?? null;
  return (
    <div className="site-grid py-16">
      <div className="col-span-12">
        <EmptyState
          kicker="Quiz results"
          title="Last scent match on this device"
          body="Anonymous finder results stay in the browser. They are not uploaded."
        />
        {slug ? (
          <p>
            Primary match: <Link href={`/product/${slug}`}>{slug}</Link>
          </p>
        ) : (
          <p className="text-sm text-ink/60">No local result. <Link href="/find-your-scent">Find your scent</Link>.</p>
        )}
      </div>
    </div>
  );
}
