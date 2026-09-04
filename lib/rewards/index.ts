import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { HOUSE } from "@/data/fragrance-config";

export const REWARD_PERCENT = 5;
export const REWARD_PREFIX = "RP-";

export type RewardPayload = {
  email: string;
  codeHash: string;
  percent: typeof REWARD_PERCENT;
  issuedAt: number;
  campaign: string;
};

export type IssuedReward = {
  code: string;
  token: string;
  percent: typeof REWARD_PERCENT;
  emailHash: string;
};

function signingSecret(): string {
  return (
    process.env.REWARD_SIGNING_SECRET ||
    process.env.AUTH_SECRET ||
    "rehmat-local-only-reward-secret"
  );
}

export function isLocalRewardFallback(): boolean {
  return !process.env.REWARD_SIGNING_SECRET && !process.env.AUTH_SECRET;
}

export function hashEmail(email: string): string {
  return createHash("sha256").update(email.trim().toLowerCase()).digest("hex");
}

export function hashCode(code: string): string {
  return createHash("sha256").update(code.trim().toUpperCase()).digest("hex");
}

export function generateRewardCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(8);
  let body = "";
  for (let i = 0; i < 8; i += 1) {
    body += alphabet[bytes[i] % alphabet.length];
  }
  return `${REWARD_PREFIX}${body}`;
}

function sign(body: string): string {
  return createHmac("sha256", signingSecret()).update(body).digest("base64url");
}

export function issueReward(email: string, campaign = "next-rehmat-001"): IssuedReward {
  if (!HOUSE.rewardsEnabled) {
    throw new Error("Rewards are disabled");
  }
  const code = generateRewardCode();
  const payload: RewardPayload = {
    email: email.trim().toLowerCase(),
    codeHash: hashCode(code),
    percent: REWARD_PERCENT,
    issuedAt: Date.now(),
    campaign,
  };
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const token = `${body}.${sign(body)}`;
  return {
    code,
    token,
    percent: REWARD_PERCENT,
    emailHash: hashEmail(email),
  };
}

export function readRewardToken(token: string): RewardPayload | null {
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;
  const expected = sign(body);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const parsed = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as RewardPayload;
    if (parsed.percent !== REWARD_PERCENT) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function validateReward(input: {
  token: string;
  email: string;
  code?: string;
  requestedPercent?: number;
}): { ok: true; percent: typeof REWARD_PERCENT } | { ok: false; reason: string } {
  if (input.requestedPercent !== undefined && input.requestedPercent !== REWARD_PERCENT) {
    return { ok: false, reason: "percent_locked" };
  }
  const payload = readRewardToken(input.token);
  if (!payload) return { ok: false, reason: "invalid_token" };
  if (payload.email !== input.email.trim().toLowerCase()) return { ok: false, reason: "email_mismatch" };
  if (input.code && hashCode(input.code) !== payload.codeHash) return { ok: false, reason: "code_mismatch" };
  return { ok: true, percent: REWARD_PERCENT };
}

export function alreadyIssued(existingEmailHashes: string[], email: string): boolean {
  const target = hashEmail(email);
  return existingEmailHashes.includes(target);
}
