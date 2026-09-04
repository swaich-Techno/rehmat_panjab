import { createHmac, timingSafeEqual } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import type { CartTotals } from "@/lib/cart/calculations";

export const REQUEST_COOKIE = "rp_request_token";
const FILE = "/tmp/rehmat-panjab/checkout-requests.json";

export type StoredCheckoutRequest = {
  id: string;
  createdAt: number;
  name: string;
  email: string;
  phone: string;
  note?: string;
  channel: "whatsapp" | "manual";
  totals: CartTotals;
};

const memory = new Map<string, StoredCheckoutRequest>();

function requestSecret(): string {
  const fromEnv = process.env.REWARD_SIGNING_SECRET || process.env.AUTH_SECRET;
  if (fromEnv) return fromEnv;
  if (process.env.NODE_ENV === "production") {
    throw new Error("REWARD_SIGNING_SECRET (or AUTH_SECRET) is required to persist checkout requests in production.");
  }
  return "rehmat-local-only-request-secret";
}

function signBody(body: string): string {
  return createHmac("sha256", requestSecret()).update(body).digest("base64url");
}

export function signRequestToken(id: string): string {
  const body = Buffer.from(JSON.stringify({ id, t: Date.now() })).toString("base64url");
  return `${body}.${signBody(body)}`;
}

export function verifyRequestToken(token: string | undefined, id: string): boolean {
  if (!token) return false;
  try {
    requestSecret();
  } catch {
    return false;
  }
  const [body, signature] = token.split(".");
  if (!body || !signature) return false;
  const expected = signBody(body);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  try {
    const parsed = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as { id?: string; t?: number };
    if (parsed.id !== id) return false;
    if (typeof parsed.t === "number" && Date.now() - parsed.t > 1000 * 60 * 60 * 24 * 30) return false;
    return true;
  } catch {
    return false;
  }
}

function hydrateFromDisk() {
  if (memory.size > 0) return;
  try {
    if (!existsSync(FILE)) return;
    const parsed = JSON.parse(readFileSync(FILE, "utf8")) as StoredCheckoutRequest[];
    if (!Array.isArray(parsed)) return;
    for (const item of parsed) {
      if (item?.id) memory.set(item.id, item);
    }
  } catch {
    // /tmp may be unavailable on some hosts — memory still works for this instance.
  }
}

function persistDisk() {
  try {
    mkdirSync(dirname(FILE), { recursive: true });
    writeFileSync(FILE, JSON.stringify([...memory.values()]), "utf8");
  } catch {
    // Serverless filesystems may be read-only outside /tmp.
  }
}

export function saveCheckoutRequest(record: StoredCheckoutRequest): { token: string } {
  hydrateFromDisk();
  memory.set(record.id, record);
  persistDisk();
  return { token: signRequestToken(record.id) };
}

export function getCheckoutRequest(id: string): StoredCheckoutRequest | null {
  hydrateFromDisk();
  return memory.get(id) ?? null;
}

export function canViewRequest(id: string, token: string | undefined): boolean {
  if (getCheckoutRequest(id)) return true;
  return verifyRequestToken(token, id);
}
