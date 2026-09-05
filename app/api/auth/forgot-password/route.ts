import { NextResponse } from "next/server";
import { forgotSchema } from "@/lib/validation/schemas";
import { AUTH_DISCONNECTED_COPY, isSupabaseConfigured } from "@/lib/supabase-stub/index";

export async function POST(request: Request) {
  // Rate-limit-ready: bind to IP once an edge store exists. Never pretend a mail was sent.
  const body = await request.json().catch(() => null);
  const parsed = forgotSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: "Enter a real email address." }, { status: 400 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      ok: false,
      message: `${AUTH_DISCONNECTED_COPY.title} A reset cannot be sent until the archive is connected.`,
    });
  }
  return NextResponse.json({
    ok: false,
    message: "Password reset is not wired in this build.",
  });
}
