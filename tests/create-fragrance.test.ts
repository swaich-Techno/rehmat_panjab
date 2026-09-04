import { describe, expect, it } from "vitest";
import { assertNoFormulaPercent, notesFromAnswers } from "@/lib/fragrance/create-concept";
import { createFragranceSchema, launchNotifySchema } from "@/lib/validation/schemas";

describe("create-fragrance validation", () => {
  it("rejects invented formula percentages", () => {
    expect(assertNoFormulaPercent({ notes: { rose: 40, oud: 60 } })).toBe(false);
    expect(assertNoFormulaPercent({ formulaPercent: 12 })).toBe(false);
    expect(assertNoFormulaPercent({ notes: ["rose", "oud"], answers: { rose: "rose" } })).toBe(true);
  });

  it("accepts a preference portrait without percents", () => {
    const parsed = createFragranceSchema.safeParse({
      answers: { rose: "rose", oud: "oud" },
      notes: ["rose", "oud"],
      name: "Courtyard",
    });
    expect(parsed.success).toBe(true);
  });

  it("maps selected options to note ids without inventing weights", () => {
    const notes = notesFromAnswers({
      opening: "bergamot",
      rose: "rose",
      floral: "no-floral",
      spice: "no-spice",
      woods: "woods",
      oud: "oud",
      base: "musk",
      distance: "skin",
      hour: "evening",
    });
    expect(notes).toEqual(["bergamot", "rose", "woods", "oud", "musk"]);
  });
});

describe("notification opt-in", () => {
  it("defaults email and SMS opt-in to false", () => {
    const parsed = launchNotifySchema.safeParse({ campaign: "next-rehmat-001" });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.notifyEmail).toBe(false);
      expect(parsed.data.notifySms).toBe(false);
    }
  });

  it("does not treat missing flags as consent", () => {
    const parsed = launchNotifySchema.safeParse({
      email: "guest@example.com",
      campaign: "next-rehmat-001",
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.notifyEmail).toBe(false);
      expect(parsed.data.notifySms).toBe(false);
    }
  });
});
