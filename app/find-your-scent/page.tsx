import type { Metadata } from "next";
import { QuizFlow } from "@/components/quiz/QuizFlow";

export const metadata: Metadata = {
  title: "Find your scent",
  description: "A six-question fragrance finder. Primary and secondary scent match — not AI.",
  alternates: { canonical: "/find-your-scent" },
};

export default function FindYourScentPage() {
  return <QuizFlow />;
}
