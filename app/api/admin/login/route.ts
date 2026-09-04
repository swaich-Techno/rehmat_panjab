import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminLoginSchema } from "@/lib/validation/schemas";
import { ADMIN_COOKIE, isAdminConfigured, keysMatch, signAdminSession } from "@/lib/admin/auth";

export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { ok: false, message: "ADMIN_PREVIEW_KEY is not set. The preview stays locked." },
      { status: 503 },
    );
  }
  const body = await request.json().catch(() => null);
  const parsed = adminLoginSchema.safeParse(body);
  if (!parsed.success || !keysMatch(parsed.data.key)) {
    return NextResponse.json({ ok: false, message: "The key does not open this door." }, { status: 401 });
  }
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, signAdminSession(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return NextResponse.json({ ok: true });
}
