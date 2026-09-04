import { PRODUCTS, type Product, type ScentProfile } from "@/data/fragrance-config";
import { QUIZ_QUESTIONS, type QuizOption } from "@/data/quiz-config";

export type QuizAnswers = Record<string, string>;

export type MatchReason = {
  title: string;
  body: string;
};

export type ScentMatch = {
  product: Product;
  score: number;
  reasons: MatchReason[];
};

export type QuizResult = {
  primary: ScentMatch;
  secondary: ScentMatch | null;
  vector: Record<string, number>;
};

const PROFILE_KEYS = [
  "fresh",
  "clean",
  "warm",
  "sweet",
  "woody",
  "dark",
  "floral",
  "musk",
  "oud",
  "amber",
  "rose",
  "vanilla",
  "saffron",
  "woods",
  "spices",
  "greens",
  "longevity",
  "projection",
] as const satisfies readonly (keyof ScentProfile)[];

const NOTE_LABELS: Record<string, string> = {
  musk: "musk",
  oud: "oud",
  amber: "amber",
  rose: "rose",
  vanilla: "vanilla",
  saffron: "saffron",
  woods: "woods",
  spices: "spice",
  greens: "green",
  fresh: "fresh air",
  clean: "clean skin",
  warm: "warmth",
  sweet: "sweetness",
  woody: "wood",
  dark: "shadow",
  floral: "flower",
};

export function buildPreferenceVector(answers: QuizAnswers): Record<string, number> {
  const vector: Record<string, number> = {};
  for (const key of PROFILE_KEYS) vector[key] = 0;

  for (const question of QUIZ_QUESTIONS) {
    const selected = answers[question.id];
    const option: QuizOption | undefined = question.options.find((item) => item.id === selected);
    if (!option) continue;
    for (const [key, value] of Object.entries(option.weights)) {
      vector[key] = (vector[key] ?? 0) + value;
    }
  }
  return vector;
}

function cosine(a: Record<string, number>, b: ScentProfile): number {
  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (const key of PROFILE_KEYS) {
    const av = a[key] ?? 0;
    const bv = b[key];
    dot += av * bv;
    magA += av * av;
    magB += bv * bv;
  }
  if (magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

function occasionBonus(answers: QuizAnswers, product: Product): number {
  const when = QUIZ_QUESTIONS.find((q) => q.id === "when");
  const option = when?.options.find((item) => item.id === answers.when);
  if (!option?.occasions?.length) return 0;
  return option.occasions.some((occ) => product.occasion.includes(occ)) ? 0.08 : 0;
}

function seasonBonus(answers: QuizAnswers, product: Product): number {
  const weather = QUIZ_QUESTIONS.find((q) => q.id === "weather");
  const option = weather?.options.find((item) => item.id === answers.weather);
  if (!option?.seasons?.length) return 0;
  return option.seasons.some((season) => product.season.includes(season) || product.season.includes("all"))
    ? 0.06
    : 0;
}

function reasonsFor(answers: QuizAnswers, product: Product): MatchReason[] {
  const reasons: MatchReason[] = [];
  const feel = answers.feel;
  if (feel && (product.scent_profile[feel as keyof ScentProfile] ?? 0) >= 6) {
    reasons.push({
      title: "The feeling",
      body: `${product.name} already leans ${NOTE_LABELS[feel] ?? feel}. That is the first agreement.`,
    });
  }
  const note = answers.notes;
  if (note && (product.scent_profile[note as keyof ScentProfile] ?? 0) >= 6) {
    reasons.push({
      title: "The note you keep",
      body: `Your ${NOTE_LABELS[note] ?? note} sits in the heart of this oil — not as a decoration.`,
    });
  }
  if (answers.projection === "skin" && product.scent_profile.projection <= 5) {
    reasons.push({
      title: "The distance",
      body: "It stays close. People will ask what you are wearing only when they are near.",
    });
  }
  if (answers.projection === "strong" && product.scent_profile.projection >= 6) {
    reasons.push({
      title: "The distance",
      body: "It arrives a step before you do. Still an oil — just a louder one.",
    });
  }
  const when = answers.when;
  if (when && product.occasion.includes(when)) {
    reasons.push({
      title: "The hour",
      body: `Built for the same hours you named.`,
    });
  }
  if (reasons.length === 0) {
    reasons.push({
      title: "Why this oil",
      body: `${product.name} is the nearest neighbour in the current house. The catalogue is still being written.`,
    });
  }
  return reasons.slice(0, 3);
}

export function scoreQuiz(answers: QuizAnswers, catalog: Product[] = PRODUCTS): QuizResult {
  const vector = buildPreferenceVector(answers);
  const ranked = catalog
    .filter((product) => product.status !== "archived" && product.status !== "draft")
    .map((product) => {
      const base = cosine(vector, product.scent_profile);
      const score = base + occasionBonus(answers, product) + seasonBonus(answers, product);
      return {
        product,
        score,
        reasons: reasonsFor(answers, product),
      };
    })
    .sort((a, b) => b.score - a.score);

  if (ranked.length === 0) {
    throw new Error("No fragrances available to match");
  }

  return {
    primary: ranked[0],
    secondary: ranked[1] ?? null,
    vector,
  };
}
