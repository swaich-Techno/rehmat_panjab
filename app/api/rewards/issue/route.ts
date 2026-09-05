import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { ok: false, message: "Rewards are issued only after a completed next-drop vote." },
    { status: 405 },
  );
}
