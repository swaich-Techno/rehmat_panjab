"use client";

import { useState } from "react";
import { LiquidButton } from "@/components/ui/LiquidButton";
import { Field, AreaField } from "@/components/ui/Field";
import { HOUSE } from "@/data/fragrance-config";

const STEPS = ["Basic", "Fragrance", "Media", "Variants", "Inventory", "Preview", "Publish"] as const;

type Draft = {
  name: string;
  slug: string;
  subtitle: string;
  description: string;
  number: string;
  top: string;
  heart: string;
  base: string;
  mediaNote: string;
  size: string;
  inventory: string;
  status: string;
};

const empty: Draft = {
  name: "",
  slug: "",
  subtitle: "",
  description: "",
  number: "06",
  top: "",
  heart: "",
  base: "",
  mediaNote: "",
  size: HOUSE.sizesMl[0] ? String(HOUSE.sizesMl[0]) : "12",
  inventory: "0",
  status: "draft",
};

export function ProductWizard() {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>(empty);
  const [fileName, setFileName] = useState("");

  function patch(next: Partial<Draft>) {
    setDraft((current) => ({ ...current, ...next }));
  }

  function download() {
    const payload = {
      previewOnly: true,
      warning: "PREVIEW ONLY — this does not change the production catalogue.",
      draft,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rehmat-product-preview.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <p className="label text-forest">Super-admin wizard</p>
      <h1 className="display mt-3 text-5xl">{STEPS[step]}</h1>
      <p className="mt-3 text-sm text-rose-metal">PREVIEW ONLY. Runtime edits do not change production until a database exists.</p>
      <ol className="mt-8 flex flex-wrap gap-3">
        {STEPS.map((label, index) => (
          <li key={label}>
            <button
              type="button"
              className={`label min-h-11 ${index === step ? "text-forest" : "text-ink/40"}`}
              onClick={() => setStep(index)}
            >
              {String(index + 1).padStart(2, "0")} {label}
            </button>
          </li>
        ))}
      </ol>

      <div className="mt-10 max-w-xl space-y-5">
        {step === 0 ? (
          <>
            <Field label="Name" value={draft.name} onChange={(event) => patch({ name: event.target.value })} />
            <Field label="Slug" value={draft.slug} onChange={(event) => patch({ slug: event.target.value })} />
            <Field label="Number" value={draft.number} onChange={(event) => patch({ number: event.target.value })} />
            <Field label="Subtitle" value={draft.subtitle} onChange={(event) => patch({ subtitle: event.target.value })} />
            <AreaField label="Description" value={draft.description} onChange={(event) => patch({ description: event.target.value })} />
          </>
        ) : null}
        {step === 1 ? (
          <>
            <Field label="Top notes" value={draft.top} onChange={(event) => patch({ top: event.target.value })} />
            <Field label="Heart notes" value={draft.heart} onChange={(event) => patch({ heart: event.target.value })} />
            <Field label="Base notes" value={draft.base} onChange={(event) => patch({ base: event.target.value })} />
          </>
        ) : null}
        {step === 2 ? (
          <>
            <label className="block">
              <span className="label text-ink/60">Photograph</span>
              <input
                type="file"
                accept="image/*"
                className="mt-2 block min-h-11 w-full text-sm"
                onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "")}
              />
            </label>
            <p className="text-sm text-rose-metal">
              {fileName
                ? `Local preview only: ${fileName}. Not saved to cloud. Supabase Storage is not connected.`
                : "Uploads stay on this device as a placeholder. They are not saved to cloud."}
            </p>
            <AreaField
              label="Media note"
              value={draft.mediaNote}
              onChange={(event) => patch({ mediaNote: event.target.value })}
            />
          </>
        ) : null}
        {step === 3 ? (
          <Field label="Size ml" value={draft.size} onChange={(event) => patch({ size: event.target.value })} />
        ) : null}
        {step === 4 ? (
          <Field
            label="Inventory (integer, not negative)"
            type="number"
            min={0}
            value={draft.inventory}
            onChange={(event) => patch({ inventory: event.target.value })}
          />
        ) : null}
        {step === 5 ? (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="border border-ink/10 bg-ivory p-4">
              <p className="label">Desktop</p>
              <div className="mt-3 aspect-[16/10] bg-mint p-6">
                <p className="display text-4xl">{draft.name || "Untitled oil"}</p>
                <p className="mt-2 text-sm">{draft.subtitle}</p>
              </div>
            </div>
            <div className="mx-auto w-48 border border-ink/10 bg-ivory p-3">
              <p className="label">Mobile</p>
              <div className="mt-3 aspect-[9/16] bg-cream p-4">
                <p className="display text-2xl">{draft.name || "Untitled"}</p>
                <p className="mt-2 text-xs">{draft.number}</p>
              </div>
            </div>
          </div>
        ) : null}
        {step === 6 ? (
          <>
            <Field label="Status" value={draft.status} onChange={(event) => patch({ status: event.target.value })} />
            <p className="text-sm leading-7 text-ink/70">
              Publish here downloads a preview JSON. To change the live catalogue, edit <code>data/fragrance-config.ts</code> and deploy.
            </p>
            <LiquidButton onClick={download}>Download preview JSON</LiquidButton>
          </>
        ) : null}
      </div>

      <div className="mt-10 flex gap-4">
        <button type="button" className="label touch-target" disabled={step === 0} onClick={() => setStep((value) => value - 1)}>
          Back
        </button>
        <button
          type="button"
          className="label touch-target"
          disabled={step === STEPS.length - 1}
          onClick={() => setStep((value) => value + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
