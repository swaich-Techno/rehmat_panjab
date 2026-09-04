"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { LiquidButton } from "@/components/ui/LiquidButton";
import { Emblem } from "@/components/brand/Emblem";
import { durationCss, durationMs } from "@/lib/motion/tokens";
import { useMotionMode } from "@/lib/motion/useMotionMode";

type Props = {
  title: string;
  children: ReactNode;
  onSubmit: () => Promise<{ ok: boolean; message: string }>;
  submitLabel: string;
};

type VaultState = "idle" | "turning" | "pins" | "open" | "failed";

export function VaultDoor({ title, children, onSubmit, submitLabel }: Props) {
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [vault, setVault] = useState<VaultState>("idle");
  const mode = useMotionMode();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setInfo("");
    setVault("idle");
    const result = await onSubmit();
    setLoading(false);
    if (result.ok) {
      if (mode === "REDUCED") {
        setVault("open");
        setInfo(result.message);
        return;
      }
      setVault("turning");
      window.setTimeout(() => setVault("pins"), durationMs("fast") + 200);
      window.setTimeout(() => setVault("open"), durationMs("vault"));
      window.setTimeout(() => setInfo(result.message), durationMs("vault"));
      return;
    }
    setVault("failed");
    setError(result.message);
  }

  return (
    <section className="min-h-[72svh] bg-[#1a241c] px-4 section-pad text-ivory">
      <div className="mx-auto grid min-h-[70vh] max-w-5xl grid-cols-1 overflow-hidden border border-[#8a6a55]/50 md:grid-cols-[1.1fr_0.9fr]">
        <div className="relative flex flex-col justify-between bg-gradient-to-br from-[#183a2a] via-[#2a2622] to-[#633736] p-8 md:p-12">
          <p className="label text-sand">Private fragrance archive</p>
          <div className="my-12 flex flex-1 items-center justify-center">
            <div
              className={`relative flex h-56 w-56 items-center justify-center rounded-sm border-4 ${
                vault === "failed" ? "border-wine" : "border-[#a66f5f]"
              }`}
              data-cursor="vault"
              style={{
                boxShadow:
                  vault === "open"
                    ? "inset 0 0 40px rgba(180,122,71,0.55), 0 0 30px rgba(180,122,71,0.25)"
                    : "inset 0 0 18px rgba(0,0,0,0.45)",
                transition: `box-shadow ${durationCss("vault")} var(--ease-editorialEase)`,
              }}
            >
              <span
                className="absolute h-2 w-16 bg-[#d7c8ab]"
                style={{
                  transform:
                    vault === "turning" || vault === "pins" || vault === "open"
                      ? "rotate(72deg)"
                      : "rotate(0deg)",
                  transition: `transform ${durationCss("editorial")} var(--ease-snapEase)`,
                }}
              />
              <span
                className={`absolute top-6 h-2 w-2 rounded-full ${vault === "pins" || vault === "open" ? "bg-amber" : "bg-sand/40"}`}
              />
              <span
                className={`absolute top-10 h-2 w-2 rounded-full ${vault === "open" ? "bg-amber" : "bg-sand/40"}`}
              />
              <div
                className="absolute inset-4 border border-[#a66f5f]/40 bg-[#183a2a]"
                style={{
                  clipPath: vault === "open" ? "inset(0 0 0 92%)" : "inset(0 0 0 0)",
                  transition: `clip-path ${durationCss("vault")} var(--ease-weighted)`,
                }}
              />
              <Emblem className="relative z-[1] h-14 w-14 text-sand" />
            </div>
          </div>
          <p className="max-w-sm text-sm leading-7 text-ivory/70">
            A mechanical safe for orders, saved oils, and the notes you keep. Warm metal. Not a dashboard. A private fragrance archive.
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
            <LiquidButton type="submit" className="w-full" loading={loading} cursor="vault">
              {submitLabel}
            </LiquidButton>
          </div>
        </form>
      </div>
    </section>
  );
}
