"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { QUIZ_QUESTIONS, QUIZ_STORAGE_KEY } from "@/data/quiz-config";
import { scoreQuiz, type QuizAnswers, type QuizResult } from "@/lib/quiz/scoring";
import { LiquidButton } from "@/components/ui/LiquidButton";
import { ShareCard } from "@/components/quiz/ShareCard";
import { OptionSelect } from "@/components/quiz/OptionSelect";
import { MoodWash } from "@/components/motion/MoodWash";
import { track } from "@/lib/analytics/index";
import { useLocalJson, writeLocalJson } from "@/lib/storage/local-json";
import { LiquidReveal } from "@/components/motion/LiquidReveal";
import { durationMs } from "@/lib/motion/tokens";
import { CampaignStill } from "@/components/product/CampaignStill";

const atmospheres: Record<string, string> = {
  morning: "atmosphere-morning",
  monsoon: "atmosphere-monsoon text-ivory",
  amber: "atmosphere-amber",
  garden: "atmosphere-garden",
  evening: "atmosphere-evening text-ivory",
};

const FRESH = new Set(["fresh", "clean", "everyday", "greens", "bergamot"]);
const DARK = new Set(["dark", "woody", "oud", "evening", "strong", "woods"]);
const ROMANTIC = new Set(["floral", "rose", "date", "sweet", "wedding"]);

function moodClass(optionId: string | undefined, fallback: string): string {
  if (!optionId) return atmospheres[fallback] ?? "atmosphere-morning";
  if (FRESH.has(optionId)) return "quiz-fresh";
  if (DARK.has(optionId)) return "quiz-dark text-ivory";
  if (ROMANTIC.has(optionId)) return "quiz-romantic";
  return atmospheres[fallback] ?? "atmosphere-morning";
}

type Session = {
  answers: QuizAnswers;
  step: number;
  resultSlug?: string;
};

const EMPTY_SESSION: Session = { answers: {}, step: 0 };

export function QuizFlow() {
  const session = useLocalJson<Session>(QUIZ_STORAGE_KEY, EMPTY_SESSION);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [origin, setOrigin] = useState({ x: 48, y: 42, tick: 0 });
  const [prevMood, setPrevMood] = useState("atmosphere-morning");
  const answers = session.answers ?? {};
  const step = session.step ?? 0;

  useEffect(() => {
    track({ name: "quiz_started", path: "/find-your-scent" });
  }, []);

  function patch(next: Partial<Session>) {
    writeLocalJson(QUIZ_STORAGE_KEY, { ...session, ...next });
  }

  if (result) {
    const primary = result.primary.product;
    const secondary = result.secondary?.product;
    const shareText = `REHMAT PANJAB scent match: ${primary.name}${secondary ? ` (neighbour: ${secondary.name})` : ""}. Made to be worn, not announced.`;
    return (
      <section className="atmosphere-morning min-h-[72svh] section-pad">
        <div className="site-grid">
          <p className="col-span-12 label">Scent match</p>
          <h1 className="col-span-12 display mt-4 text-6xl md:col-span-8 md:text-8xl">{primary.name}</h1>
          <p className="col-span-12 mt-4 max-w-lg text-base leading-8 md:col-span-6">
            Primary match. Not an algorithm announcing itself — a comparison against the oils we actually have.
          </p>
          <div className="col-span-12 mt-10 grid gap-10 md:col-span-7">
            {result.primary.reasons.map((reason) => (
              <div key={reason.title}>
                <p className="label text-forest">{reason.title}</p>
                <p className="mt-2 text-lg leading-8">{reason.body}</p>
              </div>
            ))}
          </div>
          <div className="col-span-12 mt-8 md:col-span-4 md:col-start-9">
            <CampaignStill
              src={primary.images[0].src}
              alt={primary.images[0].alt}
              sizes="(max-width: 768px) calc(100vw - 2rem), 33vw"
            />
            <Link href={`/product/${primary.slug}`} className="label mt-4 inline-block min-h-11 link-lux">
              Open {primary.name}
            </Link>
            {secondary ? (
              <p className="mt-8 text-sm leading-7">
                Secondary match: <Link href={`/product/${secondary.slug}`}>{secondary.name}</Link>
              </p>
            ) : null}
            <ShareCard
              kicker="Share the match"
              title={primary.name}
              imageSrc={primary.images[0]?.src}
              lines={[
                `Primary: ${primary.name}`,
                secondary ? `Neighbour: ${secondary.name}` : "No second neighbour yet.",
                "No personal details on this card.",
              ]}
              shareText={shareText}
            />
          </div>
        </div>
      </section>
    );
  }

  const question = QUIZ_QUESTIONS[step];
  const selected = answers[question.id];
  const mood = moodClass(selected, question.atmosphere);
  const ivory = mood.includes("text-ivory");

  function choose(optionId: string, x = 50, y = 40) {
    setPrevMood(mood);
    setOrigin({ x, y, tick: origin.tick + 1 });
    patch({ answers: { ...answers, [question.id]: optionId } });
  }

  return (
    <section className={`quiz-stage min-h-[72svh] section-pad ${ivory ? "text-ivory" : "text-ink"}`}>
      <MoodWash current={mood} previous={prevMood} x={origin.x} y={origin.y} tick={origin.tick} />
      <LiquidReveal className="site-grid quiz-stage__content" as="div" key={question.id}>
        <p className="col-span-12 label">
          {question.number} — {question.total}
        </p>
        <h1 className="col-span-12 display mt-6 whitespace-pre-line text-[clamp(2.4rem,8vw,4.8rem)] md:col-span-8">
          {question.prompt}
        </h1>
        <p className="col-span-12 mt-4 text-sm md:col-span-3 md:col-start-10 md:mt-10 md:text-right">
          Click or hold one word. Progress stays on this device.
        </p>
        <ul className="col-span-12 mt-8 md:col-span-9">
          {question.options.map((option) => (
            <li key={option.id}>
              <OptionSelect
                label={option.label}
                selected={selected === option.id}
                onSelect={(point) => choose(option.id, point.x, point.y)}
              />
            </li>
          ))}
        </ul>
        <div className="col-span-12 mt-10 md:col-span-3 md:col-start-10">
          <LiquidButton
            liquid="water"
            className="w-full"
            disabled={!selected}
            onClick={() => {
              if (step < QUIZ_QUESTIONS.length - 1) {
                patch({ step: step + 1 });
                return;
              }
              const scored = scoreQuiz(answers);
              setResult(scored);
              if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                const veil = document.createElement("div");
                veil.className = "liquid-merge-veil";
                document.body.appendChild(veil);
                window.setTimeout(() => veil.remove(), durationMs("editorial"));
              }
              track({ name: "quiz_completed" });
              track({ name: "quiz_result", meta: { primary: scored.primary.product.slug } });
              patch({ answers, step, resultSlug: scored.primary.product.slug });
            }}
          >
            {step < QUIZ_QUESTIONS.length - 1 ? "Continue" : "See the match"}
          </LiquidButton>
        </div>
      </LiquidReveal>
    </section>
  );
}
