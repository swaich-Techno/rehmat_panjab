import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "rp_admin_preview";
export const ADMIN_MAX_AGE_MS = 1000 * 60 * 60 * 12;

export type StaffRole = "super_admin" | "admin" | "customer";

export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PREVIEW_KEY && process.env.ADMIN_PREVIEW_KEY.length >= 8);
}

function secret(): string {
  return process.env.ADMIN_PREVIEW_KEY ?? "";
}

export function signAdminSession(): string {
  const body = Buffer.from(JSON.stringify({ role: "admin", t: Date.now() })).toString("base64url");
  const sig = createHmac("sha256", secret()).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function verifyAdminSession(token: string | undefined): boolean {
  if (!isAdminConfigured() || !token) return false;
  const [body, signature] = token.split(".");
  if (!body || !signature) return false;
  const expected = createHmac("sha256", secret()).update(body).digest("base64url");
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  try {
    const parsed = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as { t?: number; role?: string };
    if (typeof parsed.t !== "number") return false;
    if (Date.now() - parsed.t > ADMIN_MAX_AGE_MS) return false;
    return parsed.role === "admin" || parsed.role === "super_admin" || parsed.role === "preview";
  } catch {
    return false;
  }
}

export function keysMatch(input: string): boolean {
  if (!isAdminConfigured()) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(secret());
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function getAdminState(): Promise<{
  configured: boolean;
  authenticated: boolean;
}> {
  const configured = isAdminConfigured();
  if (!configured) return { configured: false, authenticated: false };
  const jar = await cookies();
  return {
    configured: true,
    authenticated: verifyAdminSession(jar.get(ADMIN_COOKIE)?.value),
  };
}
