"use client";

import { useState } from "react";
import { Field } from "@/components/ui/Field";
import { LiquidButton } from "@/components/ui/LiquidButton";
import { track } from "@/lib/analytics/index";

export function NotifyMe({ campaign }: { campaign: string }) {
  const [email, setEmail] = useState("");
  const [notifyEmail, setNotifyEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");

  return (
    <form
      className="mt-8 max-w-md border-t border-ink/10 pt-6"
      onSubmit={(event) => {
        event.preventDefault();
        void (async () => {
          setLoading(true);
          const response = await fetch("/api/notify", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              email: email || undefined,
              notifyEmail,
              notifySms: false,
              campaign,
            }),
          });
          const data = (await response.json()) as { ok: boolean; message: string; archived?: string };
          setLoading(false);
          setNote(
            data.message ||
              (data.archived === "local"
                ? "Held on this device until the house is connected. Nothing was emailed."
                : "The house could not store a notification."),
          );
          track({ name: "notify_opt_in", meta: { email: notifyEmail } });
        })();
      }}
    >
      <p className="label text-forest">Notify me</p>
      <p className="mt-2 text-sm leading-7 text-ink/70">
        Email stays unchecked. If you opt in, we still may only hold it locally until the archive is connected — we
        will not pretend a message went out.
      </p>
      <div className="mt-4">
        <Field
          label="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      <label className="mt-4 flex min-h-11 items-center gap-3 text-sm">
        <input
          type="checkbox"
          checked={notifyEmail}
          onChange={(event) => setNotifyEmail(event.target.checked)}
        />
        Email me when this oil is ready to request
      </label>
      <div className="mt-5">
        <LiquidButton type="submit" liquid="water" loading={loading} disabled={!email || !notifyEmail}>
          Save notification
        </LiquidButton>
      </div>
      {note ? (
        <p className="mt-3 text-sm leading-7 text-forest" role="status">
          {note}
        </p>
      ) : null}
    </form>
  );
}
