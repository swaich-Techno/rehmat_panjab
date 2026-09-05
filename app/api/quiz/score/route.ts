import { NextResponse } from "next/server";
import { scoreQuiz } from "@/lib/quiz/scoring";
import { quizAnswersSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = quizAnswersSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: "Finish every question." }, { status: 400 });
  }
  const result = scoreQuiz(parsed.data);
  return NextResponse.json({
    ok: true,
    primary: {
      slug: result.primary.product.slug,
      name: result.primary.product.name,
      reasons: result.primary.reasons,
      score: result.primary.score,
    },
    secondary: result.secondary
      ? {
          slug: result.secondary.product.slug,
          name: result.secondary.product.name,
          reasons: result.secondary.reasons,
          score: result.secondary.score,
        }
      : null,
  });
}
