import { NextResponse } from "next/server";
import { registerSchema } from "@/lib/validation/schemas";
import { AUTH_DISCONNECTED_COPY, isSupabaseConfigured } from "@/lib/supabase-stub/index";

export async function POST(request: Request) {
  // Rate-limit-ready: bind to IP once an edge store exists.
  const body = await request.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: "Name, email, or password needs another look." }, { status: 400 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      ok: false,
      message: `${AUTH_DISCONNECTED_COPY.title} ${AUTH_DISCONNECTED_COPY.body}`,
    });
  }
  return NextResponse.json({
    ok: false,
    message: "Registration is not wired until the archive is connected.",
  });
}
