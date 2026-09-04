"use client";

import { useEffect, useState } from "react";
import { NEXT_DROP } from "@/data/next-drop-config";
import { LiquidButton } from "@/components/ui/LiquidButton";
import { Field } from "@/components/ui/Field";
import { RewardGlass } from "@/components/quiz/RewardGlass";
import { INSIGHTS_KEY, REWARD_LEDGER_KEY, type NextDropInsight } from "@/lib/insights/store";
import { track } from "@/lib/analytics/index";
import { durationMs } from "@/lib/motion/tokens";
import { VirtualBottle } from "@/components/fragrance/VirtualBottle";
import type { CreateNoteId } from "@/data/create-fragrance-config";

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

const NOTE_MAP: Record<string, CreateNoteId> = {
  Musk: "musk",
  Oud: "oud",
  Amber: "amber",
  Rose: "rose",
  Vanilla: "vanilla",
  Saffron: "spice",
  Woods: "woods",
  Spices: "spice",
  "Fresh greens": "greens",
  Jasmine: "jasmine",
  Incense: "oud",
  Vetiver: "woods",
};

function voteNotes(answers: Answers): CreateNoteId[] {
  const fromNotes = answers.notes.map((note) => NOTE_MAP[note]).filter((id): id is CreateNoteId => Boolean(id));
  if (fromNotes.length) return fromNotes;
  const family = NOTE_MAP[answers.family];
  return family ? [family] : [];
}

type Stage = "questions" | "email" | "voted" | "reward";

export function NextDropFlow() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(empty);
  const [reward, setReward] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState<Stage>("questions");
  const [smsAvailable, setSmsAvailable] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState(false);
  const [notifySms, setNotifySms] = useState(false);
  const [notifyPhone, setNotifyPhone] = useState("");
  const [notifyNote, setNotifyNote] = useState("");
  const [glass, setGlass] = useState(false);
  const [bell, setBell] = useState(false);

  useEffect(() => {
    track({ name: "next_drop_started", path: "/next-drop" });
    void fetch("/api/capabilities")
      .then((response) => response.json())
      .then((data: { sms?: boolean }) => setSmsAvailable(Boolean(data.sms)))
      .catch(() => setSmsAvailable(false));
  }, []);

  const questions = NEXT_DROP.questions;

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
      setStage("reward");
      window.setTimeout(() => setGlass(true), durationMs("normal"));
      track({ name: "discount_issued" });
    } else {
      setMessage(data.message ?? "Your vote is in.");
      setStage("voted");
    }
    track({ name: "next_drop_completed" });
  }

  async function submitNotify() {
    setLoading(true);
    const response = await fetch("/api/notify", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email: answers.email,
        phone: notifyPhone || undefined,
        notifyEmail,
        notifySms,
        campaign: NEXT_DROP.campaignId,
      }),
    });
    const data = (await response.json()) as { ok: boolean; message: string };
    setLoading(false);
    setNotifyNote(data.message);
    setBell(true);
    track({ name: "notify_opt_in", meta: { email: notifyEmail, sms: notifySms } });
  }

  const notifyBlock = (
    <div className="col-span-12 mt-12 max-w-lg border-t border-ink/10 pt-8 md:col-span-6">
      <p className="label">Notify me when this Rehmat arrives</p>
      <p className="mt-3 text-sm leading-7 text-ink/70">Both stay off until you choose. We will not invent a send.</p>
      <div className="mt-4 flex h-12 w-12 items-center justify-center" aria-hidden="true">
        {bell ? (
          <svg viewBox="0 0 24 24" className="h-8 w-8 text-amber" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 3c-2.8 0-5 2.1-5 4.8v2.2c0 .7-.3 1.4-.8 1.9L5 13.2v1.3h14v-1.3l-1.2-1.3c-.5-.5-.8-1.2-.8-1.9V7.8C17 5.1 14.8 3 12 3Zm-2.2 13.5c.4 1.2 1.5 2 2.7 2s2.3-.8 2.7-2Z"
            />
          </svg>
        ) : (
          <span className="droplet droplet--still" />
        )}
      </div>
      <p className="label text-ink/50">{bell ? "Bell set" : "A droplet becomes a bell when you save."}</p>
      <label className="mt-6 flex min-h-11 items-center gap-3 text-sm">
        <input type="checkbox" checked={notifyEmail} onChange={(event) => setNotifyEmail(event.target.checked)} />
        Email
      </label>
      <label className="mt-3 flex min-h-11 items-center gap-3 text-sm">
        <input
          type="checkbox"
          checked={notifySms}
          disabled={!smsAvailable}
          onChange={(event) => setNotifySms(event.target.checked)}
        />
        SMS
      </label>
      {!smsAvailable ? (
        <p className="mt-2 text-sm text-rose-metal">PHONE/SMS CURRENTLY UNAVAILABLE</p>
      ) : (
        <div className="mt-4">
          <Field label="Phone for SMS" value={notifyPhone} onChange={(event) => setNotifyPhone(event.target.value)} />
        </div>
      )}
      <div className="mt-6">
        <LiquidButton loading={loading} onClick={() => void submitNotify()}>
          Save notification
        </LiquidButton>
      </div>
      {notifyNote ? <p className="mt-4 text-sm leading-7">{notifyNote}</p> : null}
    </div>
  );

  if (stage === "reward" || stage === "voted") {
    return (
      <section className="atmosphere-amber min-h-[72svh] section-pad">
        <div className="site-grid">
          <p className="col-span-12 label">Your vote is in.</p>
          <h1 className="col-span-12 display headline-gap text-5xl md:col-span-8 md:text-7xl">
            You just helped shape the next Rehmat
          </h1>
          {reward ? (
            <>
              <div className="col-span-12 mt-10 md:col-span-4">
                <RewardGlass revealed={glass} />
              </div>
              {glass ? (
                <p className="col-span-12 mt-10 display text-5xl tracking-[0.12em] md:col-span-8">{reward}</p>
              ) : null}
            </>
          ) : (
            <p className="col-span-12 mt-8 max-w-lg text-base leading-8">{message}</p>
          )}
          <p className="col-span-12 mt-6 max-w-md text-sm leading-7 text-ink/70">
            This code is shown once. The house will confirm it against a signed token — not a number you can invent. Five percent is locked.
          </p>
          {notifyBlock}
        </div>
      </section>
    );
  }

  if (step === questions.length) {
    return (
      <section className="min-h-[72svh] bg-paper section-pad">
        <div className="site-grid">
          <p className="col-span-12 label">Last thing</p>
          <h1 className="col-span-12 display mt-4 text-5xl md:col-span-7">Where should we send the thank-you?</h1>
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
    <section className="min-h-[72svh] bg-cream section-pad">
      <div className="site-grid">
        <p className="col-span-2 label text-forest">{question.number}</p>
        <p className="col-span-10 label text-right text-ink/40">{question.total}</p>
        <h1 className="col-span-12 display headline-gap whitespace-pre-line text-[clamp(2.2rem,6vw,4.2rem)] md:col-span-7">
          {question.prompt}
        </h1>
        <div className="col-span-12 mt-4 md:col-span-4 md:col-start-9 md:row-span-3">
          <VirtualBottle notes={voteNotes(answers)} />
        </div>
        <ul className="col-span-12 mt-8 columns-1 gap-0 md:col-span-8">
          {question.options.map((option) => {
            const held = Array.isArray(selected) ? selected.includes(option.id) : selected === option.id;
            return (
              <li key={option.id}>
                <button
                  type="button"
                  data-cursor="quiz"
                  data-held={held}
                  className="option-liquid flex min-h-11 w-full items-baseline justify-between py-3 text-left"
                  onClick={() => toggle(option.id)}
                >
                  <span className={`display text-2xl md:text-3xl ${held ? "text-forest" : ""}`}>{option.label}</span>
                  {held ? <span className="label">Marked</span> : null}
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
