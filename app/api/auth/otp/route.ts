import { NextResponse } from "next/server";
import { z } from "zod";
import { publicCapabilities } from "@/lib/config/capabilities";

const otpSchema = z.object({
  code: z.string().regex(/^\d{6}$/).optional(),
  resend: z.boolean().optional(),
});

// Rate-limit-ready: never send SMS without a configured provider.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = otpSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: "Enter six digits." }, { status: 400 });
  }
  const caps = publicCapabilities();
  if (!caps.phoneAuth) {
    return NextResponse.json({
      ok: false,
      message: "PHONE VERIFICATION CURRENTLY UNAVAILABLE. No SMS was sent.",
    });
  }
  return NextResponse.json({
    ok: false,
    message: "Phone verification is configured but not wired in this build. No SMS was sent.",
  });
}
