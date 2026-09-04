"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { LiquidButton } from "@/components/ui/LiquidButton";
import { Emblem } from "@/components/brand/Emblem";

type Props = {
  title: string;
  children: ReactNode;
  onSubmit: () => Promise<{ ok: boolean; message: string }>;
  submitLabel: string;
};

export function VaultDoor({ title, children, onSubmit, submitLabel }: Props) {
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setInfo("");
    setFailed(false);
    const result = await onSubmit();
    setLoading(false);
    if (result.ok) {
      setInfo(result.message);
      return;
    }
    setFailed(true);
    setError(result.message);
  }

  return (
    <section className="atmosphere-evening min-h-[86svh] px-4 py-16 text-ivory">
      <div className="mx-auto grid min-h-[70vh] max-w-5xl grid-cols-1 overflow-hidden border border-sand/30 md:grid-cols-[1.1fr_0.9fr]">
        <div className={`relative flex flex-col justify-between p-8 md:p-12 ${failed ? "opacity-90" : ""}`}>
          <p className="label text-sand">Rehmat Panjab / Private house</p>
          <div className="my-12 flex flex-1 items-center justify-center">
            <div
              className={`relative flex h-40 w-40 items-center justify-center rounded-full border border-sand/50 ${failed ? "scale-95" : ""}`}
              style={{ transition: "transform 700ms cubic-bezier(0.22,1,0.36,1)" }}
            >
              <span className="absolute inset-4 rounded-full border border-sand/20" />
              <Emblem className="h-16 w-16 text-sand" />
            </div>
          </div>
          <p className="max-w-sm text-sm leading-7 text-ivory/70">
            A vault for orders, saved oils, and the notes you keep. Not a dashboard. A door.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="bg-ivory p-8 text-ink md:p-12">
          <h1 className="display text-5xl">{title}</h1>
          <div className="mt-8 space-y-5">{children}</div>
          {error ? (
            <p className="mt-4 border-l-2 border-wine pl-3 text-sm text-wine" role="alert">
              {error}
            </p>
          ) : null}
          {info ? <p className="mt-4 text-sm leading-7 text-forest">{info}</p> : null}
          <div className="mt-8">
            <LiquidButton type="submit" className="w-full" loading={loading}>
              {submitLabel}
            </LiquidButton>
          </div>
        </form>
      </div>
    </section>
  );
}
