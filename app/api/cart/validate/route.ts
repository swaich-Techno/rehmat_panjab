import { NextResponse } from "next/server";
import { calculateCart } from "@/lib/cart/calculations";
import { cartValidateSchema } from "@/lib/validation/schemas";
import { REWARD_PERCENT, validateReward } from "@/lib/rewards/index";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = cartValidateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: "Invalid cart payload." }, { status: 400 });
  }

  let discount = 0;
  if (parsed.data.requestedDiscountPercent && parsed.data.requestedDiscountPercent !== REWARD_PERCENT) {
    return NextResponse.json(
      { ok: false, message: "Discount percent is not accepted from the client." },
      { status: 400 },
    );
  }
  if (parsed.data.rewardToken && parsed.data.rewardEmail) {
    const reward = validateReward({
      token: parsed.data.rewardToken,
      email: parsed.data.rewardEmail,
      requestedPercent: parsed.data.requestedDiscountPercent,
    });
    if (reward.ok) discount = REWARD_PERCENT;
  }

  const totals = calculateCart(parsed.data.lines, discount);
  return NextResponse.json({ ok: true, totals });
}
