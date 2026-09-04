import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "rp_admin_preview";

export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PREVIEW_KEY && process.env.ADMIN_PREVIEW_KEY.length >= 8);
}

function secret(): string {
  return process.env.ADMIN_PREVIEW_KEY ?? "";
}

export function signAdminSession(): string {
  const body = Buffer.from(JSON.stringify({ role: "preview", t: Date.now() })).toString("base64url");
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
  return a.length === b.length && timingSafeEqual(a, b);
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
