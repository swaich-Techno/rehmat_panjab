"use client";

import { useEffect, useState } from "react";
import { NEXT_DROP } from "@/data/next-drop-config";
import { HOUSE } from "@/data/fragrance-config";
import { LiquidButton } from "@/components/ui/LiquidButton";
import { Field } from "@/components/ui/Field";
import { INSIGHTS_KEY, REWARD_LEDGER_KEY, type NextDropInsight } from "@/lib/insights/store";
import { track } from "@/lib/analytics/index";

type Answers = {
  family: string;
  notes: string[];
  feel: string;
  projection: string;
  occasion: string;
  format: string;
  size: string;
  priceBand: string;
  email: string;
};

const empty: Answers = {
  family: "",
  notes: [],
  feel: "",
  projection: "",
  occasion: "",
  format: "",
  size: "",
  priceBand: "",
  email: "",
};

export function NextDropFlow() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(empty);
  const [reward, setReward] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    track({ name: "next_drop_started", path: "/next-drop" });
  }, []);

  const questions = NEXT_DROP.questions;
  const finished = reward !== null || message.startsWith("Already");

  async function submit() {
    setLoading(true);
    const response = await fetch("/api/next-drop/submit", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(answers),
    });
    const data = (await response.json()) as {
      ok: boolean;
      code?: string;
      token?: string;
      emailHash?: string;
      message?: string;
    };
    setLoading(false);
    if (!data.ok) {
      setMessage(data.message ?? "The vote could not be stored.");
      return;
    }
    const insight: NextDropInsight = {
      family: answers.family,
      notes: answers.notes,
      feel: answers.feel,
      projection: answers.projection,
      occasion: answers.occasion,
      format: answers.format,
      size: answers.size,
      priceBand: answers.priceBand,
      at: Date.now(),
    };
    const existing = JSON.parse(window.localStorage.getItem(INSIGHTS_KEY) ?? "[]") as NextDropInsight[];
    window.localStorage.setItem(INSIGHTS_KEY, JSON.stringify([...existing, insight]));
    if (data.token && data.emailHash) {
      const ledger = JSON.parse(window.localStorage.getItem(REWARD_LEDGER_KEY) ?? "[]") as unknown[];
      window.localStorage.setItem(
        REWARD_LEDGER_KEY,
        JSON.stringify([...ledger, { emailHash: data.emailHash, token: data.token, shown: true, at: Date.now() }]),
      );
    }
    if (data.code) {
      setReward(data.code);
      track({ name: "discount_issued" });
    } else {
      setMessage(data.message ?? "Your vote is in.");
    }
    track({ name: "next_drop_completed" });
  }

  if (finished) {
    return (
      <section className="atmosphere-amber min-h-[80svh] py-20">
        <div className="site-grid">
          <p className="col-span-12 label">Your vote is in.</p>
          <h1 className="col-span-12 display mt-4 text-6xl md:col-span-8 md:text-8xl">
            {HOUSE.rewardsEnabled ? "5% thank-you reward" : "Thank you"}
          </h1>
          {reward ? (
            <p className="col-span-12 mt-10 display text-5xl tracking-[0.12em] md:col-span-8">{reward}</p>
          ) : (
            <p className="col-span-12 mt-8 max-w-lg text-base leading-8">{message}</p>
          )}
          <p className="col-span-12 mt-6 max-w-md text-sm leading-7 text-ink/70">
            This code is shown once. The house will confirm it against a signed token — not a number you can invent.
          </p>
        </div>
      </section>
    );
  }

  if (step === questions.length) {
    return (
      <section className="min-h-[80svh] bg-paper py-16">
        <div className="site-grid">
          <p className="col-span-12 label">Last thing</p>
          <h1 className="col-span-12 display mt-4 text-5xl md:col-span-7">
            Where should we send the thank-you?
          </h1>
          <div className="col-span-12 mt-10 max-w-md md:col-span-5">
            <Field
              label="Email"
              type="email"
              required
              value={answers.email}
              onChange={(event) => setAnswers((current) => ({ ...current, email: event.target.value }))}
            />
            {message ? <p className="mt-4 text-sm text-wine">{message}</p> : null}
            <div className="mt-8">
              <LiquidButton loading={loading} disabled={!answers.email} onClick={() => void submit()}>
                Confirm
              </LiquidButton>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const question = questions[step];
  const selected = answers[question.id as keyof Answers];

  function toggle(id: string) {
    if ("multi" in question && question.multi) {
      setAnswers((current) => {
        const notes = current.notes.includes(id)
          ? current.notes.filter((note) => note !== id)
          : current.notes.length >= 3
            ? current.notes
            : [...current.notes, id];
        return { ...current, notes };
      });
      return;
    }
    setAnswers((current) => ({ ...current, [question.id]: id }));
  }

  const canContinue = Array.isArray(selected) ? selected.length > 0 : Boolean(selected);

  return (
    <section className="atmosphere-garden min-h-[84svh] py-12">
      <div className="site-grid">
        <p className="col-span-12 label">
          {question.number} — {question.total}
        </p>
        <h1 className="col-span-12 display mt-6 whitespace-pre-line text-5xl md:col-span-8 md:text-7xl">
          {question.prompt}
        </h1>
        <ul className="col-span-12 mt-12 md:col-span-8">
          {question.options.map((option) => {
            const held = Array.isArray(selected) ? selected.includes(option.id) : selected === option.id;
            return (
              <li key={option.id} className="border-t border-ink/15">
                <button type="button" className="flex w-full items-baseline justify-between py-5 text-left" onClick={() => toggle(option.id)}>
                  <span className={`display text-4xl ${held ? "text-forest" : ""}`}>{option.label}</span>
                  {held ? <span className="label">Held</span> : null}
                </button>
              </li>
            );
          })}
        </ul>
        <div className="col-span-12 mt-10 md:col-span-3 md:col-start-10">
          <LiquidButton className="w-full" disabled={!canContinue} onClick={() => setStep((value) => value + 1)}>
            Continue
          </LiquidButton>
        </div>
      </div>
    </section>
  );
}
