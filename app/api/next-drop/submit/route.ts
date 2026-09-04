import { NextResponse } from "next/server";
import { HOUSE } from "@/data/fragrance-config";
import { nextDropSchema } from "@/lib/validation/schemas";
import { alreadyIssued, hashEmail, issueReward } from "@/lib/rewards/index";
import { cookies } from "next/headers";

const EMAIL_COOKIE = "rp_reward_emails";

function readHashes(raw: string | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = nextDropSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: "The vote is incomplete or a field is unknown." }, { status: 400 });
  }
  if (!parsed.data.notes.every((note) => HOUSE.notePool.includes(note))) {
    return NextResponse.json({ ok: false, message: "A note is not in this campaign." }, { status: 400 });
  }
  if (!HOUSE.priceBandsPaise.some((band) => band.id === parsed.data.priceBand)) {
    return NextResponse.json({ ok: false, message: "Unknown price band." }, { status: 400 });
  }

  const jar = await cookies();
  const hashes = readHashes(jar.get(EMAIL_COOKIE)?.value);
  const emailHash = hashEmail(parsed.data.email);

  if (!HOUSE.rewardsEnabled) {
    return NextResponse.json({ ok: true, message: "Your vote is in." });
  }

  if (alreadyIssued(hashes, parsed.data.email)) {
    return NextResponse.json({
      ok: true,
      message: "Already thanked for this email during the campaign. Your vote is still in.",
    });
  }

  const issued = issueReward(parsed.data.email);
  const nextHashes = [...hashes, emailHash];
  jar.set(EMAIL_COOKIE, JSON.stringify(nextHashes), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 180,
  });

  return NextResponse.json({
    ok: true,
    code: issued.code,
    token: issued.token,
    emailHash: issued.emailHash,
    percent: issued.percent,
    message: "Your vote is in.",
  });
}
