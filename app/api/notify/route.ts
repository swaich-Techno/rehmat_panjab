import { NextResponse } from "next/server";
import { launchNotifySchema } from "@/lib/validation/schemas";
import { isSmsConfigured } from "@/lib/config/capabilities";
import { isSupabaseConfigured } from "@/lib/supabase-stub/index";

// Rate-limit-ready: opt-in must default false; never send SMS without a provider.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = launchNotifySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: "Notification details need another look." }, { status: 400 });
  }

  const notifyEmail = parsed.data.notifyEmail === true;
  const notifySms = parsed.data.notifySms === true;

  if (!notifyEmail && !notifySms) {
    return NextResponse.json({ ok: true, message: "No notification was requested." });
  }

  if (notifySms && !isSmsConfigured()) {
    return NextResponse.json({
      ok: false,
      message: "PHONE/SMS CURRENTLY UNAVAILABLE. Email can still be held locally until the house is connected.",
    });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      {
        ok: true,
        archived: "local",
        notifyEmail,
        notifySms: false,
        message: "Archived locally until the house is connected. No message was sent.",
      },
      { status: 202 },
    );
  }

  return NextResponse.json({
    ok: false,
    message: "Launch notifications are not wired until the archive is connected.",
  });
}
