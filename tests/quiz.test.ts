import { describe, expect, it } from "vitest";
import { scoreQuiz } from "@/lib/quiz/scoring";

describe("quiz scoring", () => {
  it("returns primary and secondary matches", () => {
    const result = scoreQuiz({
      feel: "warm",
      when: "evening",
      projection: "skin",
      notes: "musk",
      personality: "quiet",
      weather: "winter",
    });
    expect(result.primary.product.slug).toBeTruthy();
    expect(result.secondary?.product.slug).toBeTruthy();
    expect(result.primary.product.slug).not.toBe(result.secondary?.product.slug);
    expect(result.primary.reasons.length).toBeGreaterThan(0);
  });

  it("leans musk rizali for musk + close to skin", () => {
    const result = scoreQuiz({
      feel: "clean",
      when: "everyday",
      projection: "skin",
      notes: "musk",
      personality: "quiet",
      weather: "all",
    });
    expect(result.primary.product.slug).toBe("musk-rizali");
  });

  it("leans saffron amber oud for saffron warmth", () => {
    const result = scoreQuiz({
      feel: "warm",
      when: "wedding",
      projection: "strong",
      notes: "saffron",
      personality: "traditional",
      weather: "winter",
    });
    expect(result.primary.product.slug).toBe("saffron-amber-oud");
  });

  it("leans oud rose for floral rose evenings", () => {
    const result = scoreQuiz({
      feel: "floral",
      when: "date",
      projection: "noticeable",
      notes: "rose",
      personality: "romantic",
      weather: "cool",
    });
    expect(result.primary.product.slug).toBe("oud-rose");
  });

  it("leans vanilla musk for vanilla sweetness", () => {
    const result = scoreQuiz({
      feel: "sweet",
      when: "evening",
      projection: "noticeable",
      notes: "vanilla",
      personality: "romantic",
      weather: "winter",
    });
    expect(result.primary.product.slug).toBe("vanilla-musk");
  });
});
