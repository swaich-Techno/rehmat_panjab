"use client";

import { useMemo, useState } from "react";
import {
  CREATE_QUESTIONS,
  CREATE_STORAGE_KEY,
  type CreateConcept,
} from "@/data/create-fragrance-config";
import { conceptSummary, notesFromAnswers } from "@/lib/fragrance/create-concept";
import { LiquidButton } from "@/components/ui/LiquidButton";
import { Field } from "@/components/ui/Field";
import { ShareCard } from "@/components/quiz/ShareCard";
import { LiquidReveal } from "@/components/motion/LiquidReveal";
import { writeLocalJson } from "@/lib/storage/local-json";
import { VirtualBottle } from "@/components/fragrance/VirtualBottle";
import Link from "next/link";

const atmospheres: Record<string, string> = {
  morning: "atmosphere-morning",
  monsoon: "atmosphere-monsoon text-ivory",
  amber: "atmosphere-amber",
  garden: "atmosphere-garden",
  evening: "atmosphere-evening text-ivory",
};

export function CreateFragranceFlow() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [concept, setConcept] = useState<CreateConcept | null>(null);
  const [archiveMessage, setArchiveMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const notes = useMemo(() => notesFromAnswers(answers), [answers]);
  const question = CREATE_QUESTIONS[step];
  const selected = question ? answers[question.id] : "";
  const wash = question ? atmospheres[question.atmosphere] : "atmosphere-morning";
  const ivory = wash.includes("text-ivory");

  function finish() {
    const next: CreateConcept = {
      answers,
      notes,
      name: name.trim(),
      distance: answers.distance ?? "",
      hour: answers.hour ?? "",
      savedAt: Date.now(),
    };
    writeLocalJson(CREATE_STORAGE_KEY, next);
    setConcept(next);
  }

  async function archiveLater() {
    if (!concept) return;
    setLoading(true);
    const response = await fetch("/api/create-fragrance", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        answers: concept.answers,
        notes: concept.notes,
        name: concept.name,
        email: email || undefined,
        phone: phone || undefined,
      }),
    });
    const data = (await response.json()) as { ok: boolean; message: string };
    setLoading(false);
    setArchiveMessage(data.message);
  }

  if (concept) {
    const title = concept.name || "Your Rehmat";
    return (
      <section className="atmosphere-morning min-h-[72svh] section-pad">
        <div className="site-grid">
          <p className="col-span-12 label">Your Rehmat</p>
          <h1 className="col-span-12 display headline-gap text-[clamp(2.8rem,8vw,6.5rem)] md:col-span-8">{title}</h1>
          <p className="col-span-12 copy-gap max-w-lg text-base leading-7 md:col-span-6">
            A preference portrait. Not a formula. No percentages. The vessel is virtual until the house is connected.
          </p>
          <div className="col-span-12 mt-8 md:col-span-5">
            <VirtualBottle notes={concept.notes} orbit />
          </div>
          <div className="col-span-12 mt-8 md:col-span-6 md:col-start-7">
            <p className="label text-forest">Notes held</p>
            <p className="display mt-3 text-4xl">{conceptSummary(concept.notes)}</p>
            <p className="mt-4 text-sm leading-7 text-ink/70">
              Distance: {concept.distance || "—"} · Hour: {concept.hour || "—"}
            </p>
            <div className="mt-8 max-w-md space-y-5">
              <Field label="Name this oil (optional)" value={name} onChange={(event) => setName(event.target.value)} />
              <Field
                label="Email to save later (optional)"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <Field
                label="Phone to save later (optional)"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
              <div className="flex flex-col gap-3 sm:flex-row">
                <LiquidButton liquid="water" loading={loading} onClick={() => void archiveLater()}>
                  Save
                </LiquidButton>
                <Link href="/next-drop" className="liquid-button text-center no-underline" data-cursor="link" data-liquid="oil">
                  Join next drop
                </Link>
              </div>
              {archiveMessage ? <p className="text-sm leading-7 text-forest">{archiveMessage}</p> : null}
            </div>
            <ShareCard
              kicker="Share the portrait"
              title={title}
              lines={[conceptSummary(concept.notes), `Hour: ${concept.hour}`, "Preference only — not a recipe."]}
              shareText={`REHMAT PANJAB — ${title}: ${conceptSummary(concept.notes)}. A preference, not a formula.`}
            />
          </div>
        </div>
      </section>
    );
  }

  if (step === CREATE_QUESTIONS.length) {
    return (
      <section className="min-h-[72svh] bg-paper section-pad">
        <div className="site-grid">
          <p className="col-span-12 label">Name</p>
          <h1 className="col-span-12 display headline-gap text-5xl md:col-span-7">What should we call this Rehmat?</h1>
          <div className="col-span-12 mt-8 max-w-md md:col-span-5">
            <Field label="Optional name" value={name} onChange={(event) => setName(event.target.value)} />
            <div className="mt-8">
              <LiquidButton liquid="oil" onClick={finish}>
                See your Rehmat
              </LiquidButton>
            </div>
          </div>
          <div className="col-span-12 mt-8 md:col-span-5 md:col-start-8">
            <VirtualBottle notes={notes} />
          </div>
        </div>
      </section>
    );
  }

  if (!question) return null;

  return (
    <section className={`quiz-stage min-h-[72svh] section-pad ${ivory ? "text-ivory" : "text-ink"}`}>
      <div className={`quiz-stage__wash ${wash}`} aria-hidden="true" />
      <LiquidReveal className="site-grid quiz-stage__content" as="div" key={question.id}>
        <div className="col-span-12 md:col-span-7">
          <p className="label">
            {question.number} — {question.total}
          </p>
          <h1 className="display headline-gap whitespace-pre-line text-[clamp(2.4rem,7vw,4.6rem)]">{question.prompt}</h1>
          <p className="copy-gap text-sm">{question.instruction}</p>
          <ul className="mt-8">
            {question.options.map((option) => (
              <li key={option.id}>
                <button
                  type="button"
                  data-cursor="quiz"
                  data-held={selected === option.id}
                  className={`option-liquid flex min-h-11 w-full items-baseline justify-between py-4 text-left ${selected === option.id ? "text-forest" : ""}`}
                  onClick={() => setAnswers((current) => ({ ...current, [question.id]: option.id }))}
                >
                  <span className="display text-4xl">{option.label}</span>
                  {selected === option.id ? <span className="label">Held</span> : null}
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-8 max-w-xs">
            <LiquidButton liquid="water" className="w-full" disabled={!selected} onClick={() => setStep((value) => value + 1)}>
              Continue
            </LiquidButton>
          </div>
        </div>
        <div className="col-span-12 mt-8 md:col-span-4 md:col-start-9">
          <VirtualBottle notes={notes} />
        </div>
      </LiquidReveal>
    </section>
  );
}
