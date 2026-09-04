import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { calculateCart } from "@/lib/cart/calculations";
import { createRequestId } from "@/lib/commerce/orders";
import { buildWhatsAppMessage, whatsappHref } from "@/lib/commerce/whatsapp";
import { checkoutRequestSchema } from "@/lib/validation/schemas";
import { REWARD_PERCENT, validateReward } from "@/lib/rewards/index";
import { REQUEST_COOKIE, saveCheckoutRequest } from "@/lib/commerce/request-store";

// Rate-limit-ready: bind this route to IP + email before a store exists.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = checkoutRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: "Check the name, email, phone, and oils." }, { status: 400 });
  }

  let discount = 0;
  if (parsed.data.rewardToken) {
    const reward = validateReward({
      token: parsed.data.rewardToken,
      email: parsed.data.email,
    });
    if (reward.ok) discount = REWARD_PERCENT;
  }

  const totals = calculateCart(parsed.data.lines, discount);
  if (totals.lines.length === 0) {
    return NextResponse.json({ ok: false, message: "The request list is empty." }, { status: 400 });
  }

  const requestId = createRequestId();
  let token: string;
  try {
    ({ token } = saveCheckoutRequest({
      id: requestId,
      createdAt: Date.now(),
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      note: parsed.data.note,
      channel: parsed.data.channel,
      totals,
    }));
  } catch {
    return NextResponse.json(
      { ok: false, message: "The house cannot seal a request until signing is configured." },
      { status: 503 },
    );
  }

  const jar = await cookies();
  jar.set(REQUEST_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  const message = buildWhatsAppMessage({
    requestId,
    name: parsed.data.name,
    email: parsed.data.email,
    totals,
  });

  return NextResponse.json({
    ok: true,
    requestId,
    kind: "request",
    totals,
    whatsapp: parsed.data.channel === "whatsapp" ? whatsappHref(message) : null,
  });
}
