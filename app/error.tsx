"use client";

import { LiquidButton } from "@/components/ui/LiquidButton";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="site-grid py-28">
      <div className="col-span-12 md:col-span-7">
        <p className="label text-wine">Something slipped</p>
        <h1 className="display mt-4 text-6xl">The page could not finish.</h1>
        <p className="mt-6 max-w-md text-base leading-8 text-ink/70">
          If the catalogue or a service is unavailable, nothing here will invent a successful result. Try again, or come back to the collection.
        </p>
        <div className="mt-8">
          <LiquidButton onClick={reset}>Try again</LiquidButton>
        </div>
      </div>
    </div>
  );
}
