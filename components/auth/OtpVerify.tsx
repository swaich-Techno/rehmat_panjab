"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { LiquidButton } from "@/components/ui/LiquidButton";
import { Droplet } from "@/components/motion/Droplet";
import { durationCss, durationMs } from "@/lib/motion/tokens";

const LENGTH = 6;
const RESEND_SECONDS = 30;

export function OtpVerify() {
  const [digits, setDigits] = useState<string[]>(Array(LENGTH).fill(""));
  const [available, setAvailable] = useState<boolean | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [verified, setVerified] = useState(false);
  const [gather, setGather] = useState(false);
  const [message, setMessage] = useState("");
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    void fetch("/api/capabilities")
      .then((response) => response.json())
      .then((data: { phoneAuth?: boolean; sms?: boolean }) => {
        setAvailable(Boolean(data.phoneAuth));
      })
      .catch(() => setAvailable(false));
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = window.setTimeout(() => setCooldown((value) => value - 1), 1000);
    return () => window.clearTimeout(id);
  }, [cooldown]);

  function setDigit(index: number, value: string) {
    const next = value.replace(/\D/g, "").slice(-1);
    setDigits((current) => {
      const copy = [...current];
      copy[index] = next;
      return copy;
    });
    if (next && index < LENGTH - 1) inputs.current[index + 1]?.focus();
  }

  function onKey(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  }

  const complete = digits.every((digit) => digit.length === 1);

  async function submit() {
    if (!available) return;
    const response = await fetch("/api/auth/otp", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ code: digits.join("") }),
    });
    const data = (await response.json()) as { ok: boolean; message: string };
    if (!data.ok) {
      setMessage(data.message);
      return;
    }
    setGather(true);
    window.setTimeout(() => setVerified(true), durationMs("editorial"));
  }

  async function resend() {
    if (cooldown > 0 || !available) return;
    const response = await fetch("/api/auth/otp", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ resend: true }),
    });
    const data = (await response.json()) as { ok: boolean; message: string };
    setMessage(data.message);
    setCooldown(RESEND_SECONDS);
  }

  if (available === false) {
    return (
      <section className="min-h-[70svh] bg-paper px-4 py-20">
        <div className="mx-auto max-w-lg">
          <p className="label text-wine">Phone</p>
          <h1 className="display mt-4 text-5xl">PHONE VERIFICATION CURRENTLY UNAVAILABLE</h1>
          <p className="mt-6 text-base leading-8 text-ink/75">
            No SMS was sent. The cells below stay as a rehearsal until a phone provider is connected.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[70svh] bg-ivory px-4 py-20">
      <div className="mx-auto max-w-lg text-center">
        <p className="label text-forest">Mobile</p>
        <h1 className="display mt-4 text-5xl">Enter the six digits</h1>
        <div
          className={`mt-10 flex justify-center gap-2 ${gather ? "translate-y-2 scale-95" : ""}`}
          style={{ transition: "transform var(--duration-editorial) var(--ease-weighted)" }}
        >
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(node) => {
                inputs.current[index] = node;
              }}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              value={digit}
              aria-label={`Digit ${index + 1}`}
              className="display h-14 w-11 border-b-2 border-ink/30 bg-transparent text-center text-4xl [text-shadow:0_6px_0_rgba(22,24,21,0.08)]"
              data-cursor="text"
              onChange={(event) => setDigit(index, event.target.value)}
              onKeyDown={(event) => onKey(index, event)}
            />
          ))}
        </div>
        {verified ? (
          <div className="relative mx-auto mt-12 flex h-36 w-36 items-center justify-center">
            <span
              className="absolute inset-6 border-2 border-amber"
              style={{ animation: `vault-open ${durationCss("vault")} var(--ease-editorialEase) both` }}
            />
            <Droplet />
            <p className="label relative z-[1] text-forest">Archive open</p>
          </div>
        ) : (
          <>
            <div className="relative mx-auto mt-10 h-24 w-20" aria-hidden="true">
              <span className="absolute inset-x-4 top-0 h-8 rounded-t-full border-2 border-ink/40" />
              <span className="absolute inset-x-2 top-6 bottom-0 border-2 border-ink/40 bg-ivory" />
              <span className="absolute left-1/2 top-12 h-3 w-3 -translate-x-1/2 rounded-full bg-ink/40" />
              {gather ? <Droplet className="absolute left-1/2 top-0" /> : null}
            </div>
            <div className="mt-8 flex flex-col items-center gap-4">
              <LiquidButton liquid="water" disabled={!complete || available === null} onClick={() => void submit()}>
                Verify
              </LiquidButton>
              <button type="button" className="label touch-target" disabled={cooldown > 0} onClick={() => void resend()}>
                {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend"}
              </button>
            </div>
          </>
        )}
        {message ? (
          <p className="mt-6 text-sm leading-7" role="status">
            {message}
          </p>
        ) : null}
      </div>
    </section>
  );
}
