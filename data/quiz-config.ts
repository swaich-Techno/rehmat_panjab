export type QuizOption = {
  id: string;
  label: string;
  hint?: string;
  weights: Record<string, number>;
  occasions?: string[];
  seasons?: string[];
};

export type QuizQuestion = {
  id: string;
  number: string;
  total: string;
  prompt: string;
  instruction: string;
  atmosphere: "morning" | "monsoon" | "amber" | "garden" | "evening";
  options: QuizOption[];
  multi?: boolean;
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "feel",
    number: "01",
    total: "06",
    prompt: "How should it feel\non you?",
    instruction: "One word is enough.",
    atmosphere: "morning",
    options: [
      { id: "fresh", label: "Fresh", weights: { fresh: 10, greens: 6, clean: 4 } },
      { id: "clean", label: "Clean", weights: { clean: 10, musk: 4, fresh: 3 } },
      { id: "warm", label: "Warm", weights: { warm: 10, amber: 6, sweet: 2 } },
      { id: "sweet", label: "Sweet", weights: { sweet: 10, vanilla: 6, amber: 3 } },
      { id: "woody", label: "Woody", weights: { woody: 10, woods: 8, oud: 3 } },
      { id: "dark", label: "Dark", weights: { dark: 10, oud: 6, spices: 3 } },
      { id: "floral", label: "Floral", weights: { floral: 10, rose: 7, greens: 2 } },
    ],
  },
  {
    id: "when",
    number: "02",
    total: "06",
    prompt: "When will you\nreach for it?",
    instruction: "The hour matters more than the occasion name.",
    atmosphere: "garden",
    options: [
      { id: "everyday", label: "Everyday", occasions: ["everyday"], weights: { clean: 3, fresh: 2, projection: -2 } },
      { id: "work", label: "Work", occasions: ["work"], weights: { clean: 4, projection: -1 } },
      { id: "evening", label: "Evening", occasions: ["evening"], weights: { dark: 3, amber: 3, projection: 2 } },
      { id: "date", label: "Date", occasions: ["date"], weights: { warm: 3, musk: 3, floral: 2 } },
      { id: "wedding", label: "Wedding", occasions: ["wedding"], weights: { rose: 3, saffron: 3, sweet: 2 } },
      { id: "special", label: "Special occasion", occasions: ["special"], weights: { amber: 3, oud: 2, projection: 2 } },
    ],
  },
  {
    id: "projection",
    number: "03",
    total: "06",
    prompt: "How far should\nit travel?",
    instruction: "Perfume oil is honest. Choose the radius.",
    atmosphere: "monsoon",
    options: [
      { id: "skin", label: "Close to skin", weights: { projection: 2, musk: 3 } },
      { id: "noticeable", label: "Noticeable", weights: { projection: 5 } },
      { id: "strong", label: "Strong", weights: { projection: 9, dark: 2 } },
    ],
  },
  {
    id: "notes",
    number: "04",
    total: "06",
    prompt: "Which notes\ndo you keep?",
    instruction: "Choose one you would miss if it were gone.",
    atmosphere: "amber",
    options: [
      { id: "musk", label: "Musk", weights: { musk: 10 } },
      { id: "oud", label: "Oud", weights: { oud: 10, dark: 4, woody: 3 } },
      { id: "amber", label: "Amber", weights: { amber: 10, warm: 4 } },
      { id: "rose", label: "Rose", weights: { rose: 10, floral: 5 } },
      { id: "vanilla", label: "Vanilla", weights: { vanilla: 10, sweet: 5 } },
      { id: "saffron", label: "Saffron", weights: { saffron: 10, spices: 5, warm: 2 } },
      { id: "woods", label: "Woods", weights: { woods: 10, woody: 8 } },
      { id: "spices", label: "Spices", weights: { spices: 10, warm: 3 } },
      { id: "greens", label: "Fresh greens", weights: { greens: 10, fresh: 6 } },
    ],
  },
  {
    id: "personality",
    number: "05",
    total: "06",
    prompt: "What should it\nsay without speaking?",
    instruction: "Not a brand. A posture.",
    atmosphere: "evening",
    options: [
      { id: "minimal", label: "Minimal", weights: { clean: 6, fresh: 3, projection: -2 } },
      { id: "romantic", label: "Romantic", weights: { floral: 5, rose: 4, musk: 3 } },
      { id: "quiet", label: "Quiet", weights: { musk: 4, clean: 3, projection: -3 } },
      { id: "powerful", label: "Powerful", weights: { oud: 5, dark: 4, projection: 4 } },
      { id: "traditional", label: "Traditional", weights: { saffron: 4, rose: 3, amber: 3 } },
      { id: "modern", label: "Modern", weights: { fresh: 4, clean: 4, greens: 2 } },
      { id: "mysterious", label: "Mysterious", weights: { dark: 6, oud: 4, musk: 2 } },
      { id: "experimental", label: "Experimental", weights: { greens: 3, spices: 3, dark: 2 } },
    ],
  },
  {
    id: "weather",
    number: "06",
    total: "06",
    prompt: "What weather\nwill it live in?",
    instruction: "Heat changes everything.",
    atmosphere: "garden",
    options: [
      { id: "hot", label: "Hot", seasons: ["hot"], weights: { fresh: 4, greens: 3, sweet: -2 } },
      { id: "warm", label: "Warm", seasons: ["warm"], weights: { floral: 2, fresh: 2 } },
      { id: "cool", label: "Cool", seasons: ["cool"], weights: { woody: 2, amber: 2 } },
      { id: "winter", label: "Winter", seasons: ["winter"], weights: { warm: 4, amber: 3, vanilla: 2 } },
      { id: "all", label: "All year", seasons: ["all"], weights: { musk: 2, clean: 2 } },
    ],
  },
];

export const QUIZ_STORAGE_KEY = "rp.quiz.session.v1";
