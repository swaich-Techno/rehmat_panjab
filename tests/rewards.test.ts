import { describe, expect, it } from "vitest";
import {
  REWARD_PERCENT,
  alreadyIssued,
  generateRewardCode,
  hashEmail,
  issueReward,
  validateReward,
} from "@/lib/rewards/index";

describe("5% reward validation", () => {
  it("issues a non-sequential RP code and locks percent at 5", () => {
    const a = generateRewardCode();
    const b = generateRewardCode();
    expect(a.startsWith("RP-")).toBe(true);
    expect(a).not.toBe(b);
    const issued = issueReward("guest@example.com");
    expect(issued.percent).toBe(5);
    expect(issued.percent).toBe(REWARD_PERCENT);
  });

  it("rejects any requested percent other than 5", () => {
    const issued = issueReward("one@example.com");
    const result = validateReward({
      token: issued.token,
      email: "one@example.com",
      requestedPercent: 50,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe("percent_locked");
  });

  it("validates email and code against the signed token", () => {
    const issued = issueReward("two@example.com");
    expect(validateReward({ token: issued.token, email: "two@example.com", code: issued.code }).ok).toBe(true);
    expect(validateReward({ token: issued.token, email: "other@example.com" }).ok).toBe(false);
  });

  it("allows only one reward per email in the ledger", () => {
    const email = "repeat@example.com";
    const hashes = [hashEmail(email)];
    expect(alreadyIssued(hashes, email)).toBe(true);
    expect(alreadyIssued(hashes, "fresh@example.com")).toBe(false);
  });
});
