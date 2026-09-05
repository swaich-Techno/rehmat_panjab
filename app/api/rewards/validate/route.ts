import { NextResponse } from "next/server";
import { rewardValidateSchema } from "@/lib/validation/schemas";
import { validateReward } from "@/lib/rewards/index";

export async function POST(request: Request) {
  // Rate-limit-ready: validate tokens server-side only; lock percent at 5.
  const body = await request.json().catch(() => null);
  const parsed = rewardValidateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: "Invalid reward payload." }, { status: 400 });
  }
  const result = validateReward(parsed.data);
  if (!result.ok) {
    return NextResponse.json({ ok: false, reason: result.reason }, { status: 400 });
  }
  return NextResponse.json({ ok: true, percent: result.percent });
}
