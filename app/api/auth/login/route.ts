import { NextResponse } from "next/server";
import { authCredentialsSchema } from "@/lib/validation/schemas";
import { AUTH_DISCONNECTED_COPY, isSupabaseConfigured } from "@/lib/supabase-stub/index";

export async function POST(request: Request) {
  // Rate-limit-ready: bind to IP once an edge store exists.
  const body = await request.json().catch(() => null);
  const parsed = authCredentialsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: "Email or password is not valid yet." }, { status: 400 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      ok: false,
      message: `${AUTH_DISCONNECTED_COPY.title} ${AUTH_DISCONNECTED_COPY.body}`,
    });
  }
  return NextResponse.json({
    ok: false,
    message: "The archive client is configured but the sign-in handler is not wired in this build.",
  });
}
