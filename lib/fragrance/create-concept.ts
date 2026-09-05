import { CREATE_QUESTIONS, NOTE_LAYERS, type CreateNoteId } from "@/data/create-fragrance-config";

export function notesFromAnswers(answers: Record<string, string>): CreateNoteId[] {
  const notes: CreateNoteId[] = [];
  for (const question of CREATE_QUESTIONS) {
    const selected = answers[question.id];
    const option = question.options.find((item) => item.id === selected);
    if (option?.note && !notes.includes(option.note)) notes.push(option.note);
  }
  return notes;
}

export function conceptSummary(notes: CreateNoteId[]): string {
  if (notes.length === 0) return "A quiet oil, still choosing its notes.";
  return notes.map((id) => NOTE_LAYERS[id].label).join(" · ");
}

/**
 * Preference portrait only. Never a manufacturing formula.
 * No percentages are invented.
 */
export function assertNoFormulaPercent(input: unknown): boolean {
  if (!input || typeof input !== "object") return true;
  const record = input as Record<string, unknown>;
  if ("formulaPercent" in record || "formula_percent" in record) return false;
  if (record.notes && typeof record.notes === "object" && !Array.isArray(record.notes)) {
    const values = Object.values(record.notes as Record<string, unknown>);
    if (values.some((value) => typeof value === "number")) return false;
  }
  return true;
}
