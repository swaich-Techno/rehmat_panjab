"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { QUIZ_QUESTIONS, QUIZ_STORAGE_KEY } from "@/data/quiz-config";
import { scoreQuiz, type QuizAnswers, type QuizResult } from "@/lib/quiz/scoring";
import { LiquidButton } from "@/components/ui/LiquidButton";
import { track } from "@/lib/analytics/index";
import { useLocalJson, writeLocalJson } from "@/lib/storage/local-json";

const atmospheres: Record<string, string> = {
  morning: "atmosphere-morning",
  monsoon: "atmosphere-monsoon text-ivory",
  amber: "atmosphere-amber",
  garden: "atmosphere-garden",
  evening: "atmosphere-evening text-ivory",
};

type Session = {
  answers: QuizAnswers;
  step: number;
  resultSlug?: string;
};

const EMPTY_SESSION: Session = { answers: {}, step: 0 };

export function QuizFlow() {
  const session = useLocalJson<Session>(QUIZ_STORAGE_KEY, EMPTY_SESSION);
  const [result, setResult] = useState<QuizResult | null>(null);
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
    return (
      <section className="atmosphere-morning min-h-[80svh] py-16">
        <div className="site-grid">
          <p className="col-span-12 label">Scent match</p>
          <h1 className="col-span-12 display mt-4 text-6xl md:col-span-8 md:text-8xl">
            {primary.name}
          </h1>
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
            <div className="relative aspect-[3/4] bg-ivory/50">
              <Image src={primary.images[0].src} alt={primary.images[0].alt} fill className="object-contain p-8" />
            </div>
            <Link href={`/product/${primary.slug}`} className="label mt-4 inline-block">
              Open {primary.name}
            </Link>
            {secondary ? (
              <p className="mt-8 text-sm leading-7">
                Secondary match:{" "}
                <Link href={`/product/${secondary.slug}`}>{secondary.name}</Link>
              </p>
            ) : null}
          </div>
        </div>
      </section>
    );
  }

  const question = QUIZ_QUESTIONS[step];
  const selected = answers[question.id];

  return (
    <section className={`min-h-[84svh] py-10 md:py-16 ${atmospheres[question.atmosphere]}`}>
      <div className="site-grid">
        <p className="col-span-12 label">
          {question.number} — {question.total}
        </p>
        <h1 className="col-span-12 display mt-6 whitespace-pre-line text-5xl md:col-span-8 md:text-7xl">
          {question.prompt}
        </h1>
        <p className="col-span-12 mt-4 text-sm md:col-span-4 md:col-start-9 md:mt-10 md:text-right">
          {question.instruction}
        </p>
        <ul className="col-span-12 mt-12 md:col-span-8">
          {question.options.map((option) => (
            <li key={option.id} className="border-t border-current/20">
              <button
                type="button"
                className={`flex w-full items-baseline justify-between py-5 text-left ${selected === option.id ? "text-forest" : ""}`}
                onClick={() => patch({ answers: { ...answers, [question.id]: option.id } })}
              >
                <span className="display text-4xl md:text-5xl">{option.label}</span>
                {selected === option.id ? <span className="label">Held</span> : null}
              </button>
            </li>
          ))}
        </ul>
        <div className="col-span-12 mt-10 md:col-span-3 md:col-start-10">
          <LiquidButton
            className="w-full"
            disabled={!selected}
            onClick={() => {
              if (step < QUIZ_QUESTIONS.length - 1) {
                patch({ step: step + 1 });
                return;
              }
              const scored = scoreQuiz(answers);
              setResult(scored);
              track({ name: "quiz_completed" });
              track({ name: "quiz_result", meta: { primary: scored.primary.product.slug } });
              patch({ answers, step, resultSlug: scored.primary.product.slug });
            }}
          >
            {step < QUIZ_QUESTIONS.length - 1 ? "Continue" : "See the match"}
          </LiquidButton>
        </div>
      </div>
    </section>
  );
}
