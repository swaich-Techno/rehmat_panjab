export type CreateNoteId =
  | "bergamot"
  | "greens"
  | "rose"
  | "jasmine"
  | "spice"
  | "woods"
  | "oud"
  | "amber"
  | "musk"
  | "vanilla";

export type CreateQuestion = {
  id: string;
  number: string;
  total: "09";
  prompt: string;
  instruction: string;
  atmosphere: "morning" | "monsoon" | "amber" | "garden" | "evening";
  options: { id: string; label: string; note?: CreateNoteId; skip?: boolean }[];
};

export const NOTE_LAYERS: Record<
  CreateNoteId,
  { label: string; color: string; depth: number }
> = {
  bergamot: { label: "Bergamot", color: "#C9A227", depth: 1 },
  greens: { label: "Greens", color: "#476A50", depth: 2 },
  rose: { label: "Rose", color: "#A66F5F", depth: 3 },
  jasmine: { label: "Jasmine", color: "#D7C8AB", depth: 3 },
  spice: { label: "Spice", color: "#B47A47", depth: 4 },
  woods: { label: "Woods", color: "#183A2A", depth: 5 },
  oud: { label: "Oud", color: "#5A3A1A", depth: 6 },
  amber: { label: "Amber", color: "#B47A47", depth: 7 },
  musk: { label: "Musk", color: "#9EAF9B", depth: 8 },
  vanilla: { label: "Vanilla", color: "#D7C8AB", depth: 8 },
};

export const CREATE_QUESTIONS: CreateQuestion[] = [
  {
    id: "opening",
    number: "01",
    total: "09",
    prompt: "How should it\nopen on skin?",
    instruction: "The first second.",
    atmosphere: "morning",
    options: [
      { id: "bergamot", label: "Bright citrus", note: "bergamot" },
      { id: "green", label: "Cut greens", note: "greens" },
      { id: "quiet", label: "Almost nothing", skip: true },
    ],
  },
  {
    id: "rose",
    number: "02",
    total: "09",
    prompt: "Do you keep\na rose?",
    instruction: "Dusty, not a bouquet.",
    atmosphere: "amber",
    options: [
      { id: "rose", label: "Yes — dusty rose", note: "rose" },
      { id: "no-rose", label: "No rose", skip: true },
    ],
  },
  {
    id: "floral",
    number: "03",
    total: "09",
    prompt: "Another flower,\nor none?",
    instruction: "One is enough.",
    atmosphere: "garden",
    options: [
      { id: "jasmine", label: "Jasmine", note: "jasmine" },
      { id: "no-floral", label: "No further flower", skip: true },
    ],
  },
  {
    id: "spice",
    number: "04",
    total: "09",
    prompt: "Should spice\nenter?",
    instruction: "A thread, not a kitchen.",
    atmosphere: "amber",
    options: [
      { id: "spice", label: "Warm spice", note: "spice" },
      { id: "no-spice", label: "Stay unspliced", skip: true },
    ],
  },
  {
    id: "woods",
    number: "05",
    total: "09",
    prompt: "What wood\nholds it?",
    instruction: "The dry architecture.",
    atmosphere: "garden",
    options: [
      { id: "woods", label: "Sandal and cedar", note: "woods" },
      { id: "no-woods", label: "No woods", skip: true },
    ],
  },
  {
    id: "oud",
    number: "06",
    total: "09",
    prompt: "Oud — dark amber\nor absent?",
    instruction: "It will sit at the bottom.",
    atmosphere: "evening",
    options: [
      { id: "oud", label: "Oud, held dark", note: "oud" },
      { id: "no-oud", label: "Without oud", skip: true },
    ],
  },
  {
    id: "base",
    number: "07",
    total: "09",
    prompt: "What should remain\nat the end?",
    instruction: "The last hour.",
    atmosphere: "amber",
    options: [
      { id: "amber", label: "Amber resin", note: "amber" },
      { id: "musk", label: "Skin musk", note: "musk" },
      { id: "vanilla", label: "Dry vanilla husk", note: "vanilla" },
    ],
  },
  {
    id: "distance",
    number: "08",
    total: "09",
    prompt: "How far should\nit travel?",
    instruction: "Oil is honest.",
    atmosphere: "monsoon",
    options: [
      { id: "skin", label: "Close to skin" },
      { id: "noticeable", label: "Noticeable" },
      { id: "strong", label: "A step ahead" },
    ],
  },
  {
    id: "hour",
    number: "09",
    total: "09",
    prompt: "Which hour\nwill wear it?",
    instruction: "Then we name it.",
    atmosphere: "morning",
    options: [
      { id: "morning", label: "Morning" },
      { id: "day", label: "Day" },
      { id: "evening", label: "Evening" },
      { id: "night", label: "Night" },
    ],
  },
];

export const CREATE_STORAGE_KEY = "rp.create-fragrance.v1";
export const CREATE_SESSION_KEY = "rp.create-fragrance.session.v1";

export type CreateConcept = {
  answers: Record<string, string>;
  notes: CreateNoteId[];
  name: string;
  distance: string;
  hour: string;
  savedAt: number;
};
