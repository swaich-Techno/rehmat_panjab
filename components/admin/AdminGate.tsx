"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Field } from "@/components/ui/Field";
import { LiquidButton } from "@/components/ui/LiquidButton";

export function AdminGate({
  configured,
  authenticated,
  children,
}: {
  configured: boolean;
  authenticated: boolean;
  children: ReactNode;
}) {
  const router = useRouter();
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!configured) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24">
        <p className="label text-wine">Locked</p>
        <h1 className="display mt-4 text-5xl">The preview key is not set.</h1>
        <p className="mt-6 text-base leading-8 text-ink/75">
          Set <code>ADMIN_PREVIEW_KEY</code> in the environment (at least eight characters), restart the server, then return here. Catalogue data stays closed until that key exists.
        </p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="mx-auto max-w-md px-6 py-24">
        <p className="label">Admin preview</p>
        <h1 className="display mt-3 text-5xl">Enter the preview key</h1>
        <form
          className="mt-8 space-y-6"
          onSubmit={async (event) => {
            event.preventDefault();
            setLoading(true);
            const response = await fetch("/api/admin/login", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ key }),
            });
            setLoading(false);
            if (!response.ok) {
              setError("The key does not open this door.");
              return;
            }
            router.refresh();
          }}
        >
          <Field label="Preview key" type="password" value={key} onChange={(event) => setKey(event.target.value)} />
          {error ? <p className="text-sm text-wine">{error}</p> : null}
          <LiquidButton type="submit" loading={loading} className="w-full">
            Enter the house
          </LiquidButton>
        </form>
      </div>
    );
  }

  return <>{children}</>;
}
