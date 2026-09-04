"use client";

import { useState } from "react";
import { HOMEPAGE_CMS, type HomepageCms } from "@/data/homepage-cms";
import { Field } from "@/components/ui/Field";
import { LiquidButton } from "@/components/ui/LiquidButton";

export function HomepageCmsForm() {
  const [form, setForm] = useState<HomepageCms>(HOMEPAGE_CMS);
  const [message, setMessage] = useState("");

  function download() {
    const blob = new Blob([JSON.stringify(form, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "homepage-cms.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function persist() {
    const response = await fetch("/api/admin/homepage", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = (await response.json()) as { ok: boolean; message: string };
    setMessage(data.message);
  }

  return (
    <div className="max-w-xl space-y-5">
      <p className="text-sm text-rose-metal">
        Persistence is preview-only. Production copy lives in <code>data/homepage-cms.ts</code> until a database exists.
      </p>
      {(Object.keys(form) as (keyof HomepageCms)[]).map((key) => (
        <Field
          key={key}
          label={key}
          value={form[key]}
          onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
        />
      ))}
      <div className="flex flex-col gap-3 sm:flex-row">
        <LiquidButton onClick={() => void persist()}>Try server save</LiquidButton>
        <button type="button" className="label touch-target" onClick={download}>
          Download config
        </button>
      </div>
      {message ? <p className="text-sm leading-7">{message}</p> : null}
    </div>
  );
}
